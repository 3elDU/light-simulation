use nalgebra::{Matrix4, Rotation3, Scale3, Translation3, Vector3, Vector4};

use super::ray::Ray;

#[derive(Clone, Copy, Debug, Default)]
pub struct Transform {
    pub translation: Vector3<f64>,
    pub scale: Vector3<f64>,
    pub rotation: Vector3<f64>,

    // Combined translation+scaling+rotation matrix
    pub transform: Matrix4<f64>,
    pub transform_inverse: Matrix4<f64>,
}

impl Transform {
    fn new(translation: Vector3<f64>, scale: Vector3<f64>, rotation: Vector3<f64>) -> Self {
        let mut translation = Transform {
            translation,
            scale,
            rotation,
            transform: Matrix4::zeros(),
            transform_inverse: Matrix4::zeros(),
        };
        translation.compute_matrix();

        translation
    }

    // Re-compute the combined transform and inverse transform matrices
    fn compute_matrix(&mut self) {
        self.transform = Translation3::from(self.translation).to_homogeneous()
            * Scale3::from(self.scale).to_homogeneous()
            * Rotation3::from_euler_angles(self.rotation.x, self.rotation.y, self.rotation.z)
                .to_homogeneous();
        self.transform_inverse = self.transform.try_inverse().unwrap();
    }

    /// Apply the transform to a ray, and return a new transformed ray
    #[allow(dead_code)]
    pub fn apply_ray(&self, ray: &Ray) -> Ray {
        let origin = self.apply(ray.origin);

        let mut looking_at = ray.origin + ray.direction;
        looking_at = self.apply(looking_at);

        Ray {
            origin,
            direction: (looking_at - origin).normalize(),
        }
    }
    /// Apply the inverse transform to a ray, and return a new transformed ray
    #[allow(dead_code)]
    pub fn apply_ray_inverse(&self, ray: &Ray) -> Ray {
        let origin = self.apply_inverse(ray.origin);

        let mut looking_at = ray.origin + ray.direction;
        looking_at = self.apply_inverse(looking_at);

        Ray {
            origin,
            direction: (looking_at - origin).normalize(),
        }
    }

    /// Apply the transform to a vector
    #[allow(dead_code)]
    pub fn apply(&self, vector: Vector3<f64>) -> Vector3<f64> {
        // Convert the vector to a four-element vector
        let vec4 = Vector4::new(vector.x, vector.y, vector.z, 1.0);
        let transformed_vector = self.transform * vec4;
        // Convert the vector back to 3-dimensional
        Vector3::new(
            transformed_vector.x,
            transformed_vector.y,
            transformed_vector.z,
        )
    }
    /// Apply the inverse transform to a vector
    #[allow(dead_code)]
    pub fn apply_inverse(&self, vector: Vector3<f64>) -> Vector3<f64> {
        // Convert the vector to a four-element vector
        let vec4 = Vector4::new(vector.x, vector.y, vector.z, 1.0);
        let transformed_vector = self.transform_inverse * vec4;
        // Convert the vector back to 3-dimensional
        Vector3::new(
            transformed_vector.x,
            transformed_vector.y,
            transformed_vector.z,
        )
    }
}

#[derive(Clone, Copy, Debug, Default)]
pub struct TransformBuilder {
    translation: Vector3<f64>,
    scale: Vector3<f64>,
    rotation: Vector3<f64>,
}

impl TransformBuilder {
    pub fn new() -> Self {
        TransformBuilder {
            translation: Vector3::new(0., 0., 0.),
            scale: Vector3::new(1., 1., 1.),
            rotation: Vector3::new(0., 0., 0.),
        }
    }
    pub fn build(&self) -> Transform {
        Transform::new(self.translation, self.scale, self.rotation)
    }

    #[allow(dead_code)]
    pub fn rotate(mut self, rotation: Vector3<f64>) -> TransformBuilder {
        self.rotation = rotation;
        self
    }
    #[allow(dead_code)]
    pub fn rotate_x(mut self, theta: f64) -> TransformBuilder {
        self.rotation.x += theta;
        self
    }
    #[allow(dead_code)]
    pub fn rotate_y(mut self, theta: f64) -> TransformBuilder {
        self.rotation.y += theta;
        self
    }
    #[allow(dead_code)]
    pub fn rotate_z(mut self, theta: f64) -> TransformBuilder {
        self.rotation.z += theta;
        self
    }

    #[allow(dead_code)]
    pub fn translate(mut self, translation: Vector3<f64>) -> TransformBuilder {
        self.translation = translation;
        self
    }
    #[allow(dead_code)]
    pub fn translate_x(mut self, delta: f64) -> TransformBuilder {
        self.translation.x += delta;
        self
    }
    #[allow(dead_code)]
    pub fn translate_y(mut self, delta: f64) -> TransformBuilder {
        self.translation.y += delta;
        self
    }
    #[allow(dead_code)]
    pub fn translate_z(mut self, delta: f64) -> TransformBuilder {
        self.translation.z += delta;
        self
    }

    #[allow(dead_code)]
    pub fn scale(mut self, scale: Vector3<f64>) -> TransformBuilder {
        self.scale = scale;
        self
    }
    #[allow(dead_code)]
    pub fn scale_uniform(mut self, scale: f64) -> TransformBuilder {
        self.scale *= scale;
        self
    }
    #[allow(dead_code)]
    pub fn scale_x(mut self, scale: f64) -> TransformBuilder {
        self.scale.x += scale;
        self
    }
    #[allow(dead_code)]
    pub fn scale_y(mut self, scale: f64) -> TransformBuilder {
        self.scale.y += scale;
        self
    }
    #[allow(dead_code)]
    pub fn scale_z(mut self, scale: f64) -> TransformBuilder {
        self.scale.z += scale;
        self
    }
}

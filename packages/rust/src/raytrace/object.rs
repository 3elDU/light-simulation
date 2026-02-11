use nalgebra::Vector3;

use super::{Lambertian, Material, Ray, Shape, Sphere, Transform};

pub struct Object {
    pub color: Vector3<f64>,
    pub emission_color: Vector3<f64>,
    pub emission_strength: f64,
    pub transform: Transform,
    pub material: Box<dyn Material>,
    pub shape: Box<dyn Shape>,
}

impl Default for Object {
    fn default() -> Self {
        Object {
            color: Vector3::new(1., 1., 1.),
            emission_color: Vector3::new(0., 0., 0.),
            emission_strength: 0.,
            material: Box::new(Lambertian::new()),
            shape: Box::new(Sphere::new()),
            transform: Transform::default(),
        }
    }
}

impl Object {
    pub fn new(
        shape: Box<dyn Shape>,
        color: Vector3<f64>,
        material: Box<dyn Material>,
        transform: Transform,
    ) -> Self {
        Self {
            shape,
            material,
            color,
            transform,
            ..Default::default()
        }
    }
    pub fn new_emissive(
        shape: Box<dyn Shape>,
        emission_color: Vector3<f64>,
        emission_strength: f64,
        material: Box<dyn Material>,
        transform: Transform,
    ) -> Self {
        Self {
            shape,
            material,
            transform,
            emission_color,
            emission_strength,
            ..Default::default()
        }
    }

    pub fn hit(&self, ray: &Ray) -> Option<Vector3<f64>> {
        // Offset the ray origin, so that the object would be at (0, 0, 0)
        // For example, when the ray origin is (0, 0, 0), and the object is at (0, 0, 10),
        // the offsetted ray origin would become (0, 0, -10)
        let ray = self.transform.apply_ray_inverse(ray);

        let intersection = self.shape.intersect(&ray)?;

        // Translate coordinates back to global coordinate space
        Some(self.transform.apply(intersection))
    }
}

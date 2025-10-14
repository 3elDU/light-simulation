use nalgebra::Vector3;

use super::{Camera, Config, Object, Ray, Render};

/// Scene is the core structure of the simulation, combining a [Camera], an
/// output [Render], an a list of [Object]s to produce a full scene
///
/// API Consumers should only care about the [Render] object, which allows
/// access to the rendered image and further processing.
pub struct Scene {
    /// Stores the rendered image
    pub render: Render,
    /// An array with all objects in the scene
    pub objects: Vec<Object>,
    camera: Camera,
}

impl Scene {
    pub fn new(config: Config, camera: Camera) -> Self {
        Self {
            camera,
            render: Render::new(config),
            objects: Vec::new(),
        }
    }

    fn collide_ray(&self, ray: &Ray) -> Option<(Vector3<f64>, &Object)> {
        let mut min_dist = f64::INFINITY;
        let mut intersected_object = None;
        let mut point = None;

        for object in &self.objects {
            let intersection = object.hit(ray);

            if let Some(intersection) = intersection {
                let dist = (intersection - ray.origin).magnitude();
                // Do not count the intersection, if the distance to an object is smaller than 1/1000th
                // This fixes the "shadow acne" problem
                if dist > 0.001 && dist < min_dist {
                    min_dist = dist;
                    intersected_object = Some(object);
                    point = Some(intersection);
                }
            }
        }

        Some((point?, intersected_object?))
    }

    fn trace_ray(&self, ray: &mut Ray) -> Vector3<f64> {
        let mut ray_color = Vector3::new(1.0, 1.0, 1.0);
        let mut incoming_light = Vector3::new(0.0, 0.0, 0.0);

        for _ in 0..self.render.config.max_bounce_count {
            let intersection = self.collide_ray(ray);
            if let Some((point, object)) = intersection {
                object
                    .material
                    .scatter(ray, point, object.shape.normal(point));

                let emitted_light = object.emission_color * object.emission_strength;

                incoming_light += emitted_light.component_mul(&ray_color);
                ray_color.component_mul_assign(&object.color);
            } else {
                break;
            }
        }

        incoming_light
    }

    fn project_pixel(&self, x: usize, y: usize) -> Ray {
        self.camera.generate_ray(
            // Convert our pixel coordinates, which go from 0 to N
            // to screen coordinates, which go from -1 to +1
            1.0 - (x as f64 / self.render.config.width as f64) * 2.0,
            1.0 - (y as f64 / self.render.config.height as f64) * 2.0,
        )
    }

    /// Progress a sample of one frame
    pub fn sample(&mut self) {
        for x in 0..self.render.config.width {
            for y in 0..self.render.config.height {
                let mut accumulated_color = Vector3::zeros();
                for _ in 0..self.render.config.samples_per_pixel {
                    let mut ray = self.project_pixel(x, y);
                    accumulated_color += self.trace_ray(&mut ray);
                }

                self.render.add_exposure(x, y, accumulated_color);
            }
        }

        self.render.inc_sample_count();
    }
}

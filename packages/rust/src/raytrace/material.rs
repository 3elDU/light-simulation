use nalgebra::Vector3;
use rand::prelude::*;

use super::ray::Ray;

pub trait Material {
    fn scatter(&self, ray: &mut Ray, point: Vector3<f64>, normal: Vector3<f64>);
}

pub struct Lambertian;

impl Default for Lambertian {
    fn default() -> Self {
        Self::new()
    }
}

impl Lambertian {
    pub fn new() -> Self {
        Self {}
    }
}

impl Material for Lambertian {
    fn scatter(&self, ray: &mut Ray, point: Vector3<f64>, normal: Vector3<f64>) {
        ray.origin = point;

        let mut rng = rand::rng();

        let mut reflection = Vector3::new(
            rng.sample::<f64, _>(rand_distr::StandardNormal),
            rng.sample::<f64, _>(rand_distr::StandardNormal),
            rng.sample::<f64, _>(rand_distr::StandardNormal),
        )
        .normalize();
        // Invert the ray, if it lays on the wrong hemisphere
        if reflection.dot(&normal) < 0.0 {
            reflection = -reflection;
        }

        // Apply cosine weighted distribution
        ray.direction = (normal + reflection).normalize();
    }
}

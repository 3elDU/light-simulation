use rand::prelude::*;
use nalgebra::Vector3;

use super::shape::Shape;

#[derive(Copy, Clone)]
pub struct Ray {
  pub origin: Vector3<f64>,
  pub direction: Vector3<f64>
}

impl Ray {
  // Reflect from an object, given an intersection point and the object instance
  pub fn reflect(&mut self, point: Vector3<f64>, object: &dyn Shape) {
    self.origin = point;
    let normal = object.normal(point);

    let mut reflection = Vector3::new(
      thread_rng().sample::<f64, _>(rand_distr::StandardNormal),
      thread_rng().sample::<f64, _>(rand_distr::StandardNormal),
      thread_rng().sample::<f64, _>(rand_distr::StandardNormal)
    ).normalize();
    // Invert the ray, if it lays on the wrong hemisphere
    if reflection.dot(&normal) < 0.0 {
      reflection = -reflection;
    }

    // Apply cosine weighted distribution
    self.direction = (normal + reflection).normalize();
  }
}

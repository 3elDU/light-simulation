use rand::prelude::*;
use nalgebra::Vector3;

use super::shape::Shape;

pub struct Ray {
  pub origin: Vector3<f32>,
  pub direction: Vector3<f32>
}

impl Ray {
  // Reflect from an object, given an intersection point and the object instance
  pub fn reflect(&mut self, point: Vector3<f32>, object: &Box<dyn Shape>) {
    self.origin = point;
    let normal = object.normal(point);

    let mut reflection = Vector3::new(
      thread_rng().sample::<f32, _>(rand_distr::StandardNormal),
      thread_rng().sample::<f32, _>(rand_distr::StandardNormal),
      thread_rng().sample::<f32, _>(rand_distr::StandardNormal)
    ).normalize();
    if reflection.dot(&normal) < 0.0 {
      reflection = -reflection;
    }

    // Apply cosine weighted distribution
    self.direction = (normal + reflection).normalize();
  }
}

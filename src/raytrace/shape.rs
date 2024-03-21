use nalgebra::Vector3;

use super::{ray::Ray, transform::Transform};

#[derive(Debug, Default, Clone, Copy)]
pub struct Material {
  pub color: Vector3<f64>,
  pub emission_color: Vector3<f64>,
  pub emission_strength: f64,
}

// Base trait for all shapes
pub trait Shape {
  // Returns the intersection point
  fn intersect(&self, ray: &Ray) -> Option<Vector3<f64>>;
  fn color(&self) -> Vector3<f64>;
  fn material(&self) -> Material;
  // Get a normal vector for a point on an object
  fn normal(&self, point: Vector3<f64>) -> Vector3<f64>;
}

#[derive(Debug)]
pub struct Sphere {
  pub transform: Transform,
  pub material: Material,
}

impl Sphere {
  pub fn new(color: Vector3<f64>, transform: Transform) -> Self {
    Self {
      transform,
      material: Material { color, ..Default::default() },
    }
  }
  pub fn new_emissive(emission_color: Vector3<f64>, emission_strength: f64, transform: Transform) -> Self {
    Self {
      transform,
      material: Material { emission_color, emission_strength, ..Default::default() },
    }
  }
}

impl Shape for Sphere {
  fn color(&self) -> Vector3<f64> {
    self.material.color
  }
  fn material(&self) -> Material {
    self.material
  }
  fn normal(&self, point: Vector3<f64>) -> Vector3<f64> {
    (point).normalize()
  }

  // Based on  the sphere equation - x^2 + y^2 + z^2 = r^2.
  // Substitude xyz for point of the sphere, which can be written as
  // (Ox + tDx)^2 + (Oy+tDy)^2 + (Oz+tDz)^2 = r^2, where
  // O - ray origin, D - ray direction, t - distance to the intersection.
  // The equation reduces to a quadratic form, and we solve for t
  fn intersect(&self, ray: &Ray) -> Option<Vector3<f64>> {
    // Offset the ray origin, so that the sphere would be at (0, 0, 0)
    // For example, when the ray origin is (0, 0, 0), and the sphere is at (0, 0, 10),
    // the offsetted ray origin would become (0, 0, -10)
    let ray = self.transform.apply_ray_inverse(ray);

    // Calculate coefficients of the quadratic equation
    let a = ray.direction.dot(&ray.direction);
    let b = 2.0 * ray.origin.dot(&ray.direction);
    let c = ray.origin.dot(&ray.origin) - 1.;

    let discriminant = (b*b) - 4.0 * a * c;

    // When D < 0, the ray did not intersect the sphere 
    if discriminant < 0.0 {
      return None;
    }

    let t1 = (-b - discriminant.sqrt()) / 2.0 * a;
    let t2 = (-b + discriminant.sqrt()) / 2.0 * a;
    let dst = t1.min(t2);

    // If either t is negative, that means that at least
    // part of the object is behind the camera, so we ignore it
    if dst < 0. {
      return None;
    }

    Some(self.transform.apply(
      ray.origin + ray.direction * dst
    ))
  }
}
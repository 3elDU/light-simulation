use nalgebra::Vector3;

use super::ray::Ray;

#[derive(Debug, Default, Clone, Copy)]
pub struct Material {
  pub color: Vector3<f32>,
  pub emission_color: Vector3<f32>,
  pub emission_strength: f32,
}

// Base trait for all shapes
pub trait Shape {
  // Returns the intersection point
  fn intersect(&self, ray: &Ray) -> Option<Vector3<f32>>;
  fn color(&self) -> Vector3<f32>;
  fn material(&self) -> Material;
  // Get a normal vector for a point on an object
  fn normal(&self, point: Vector3<f32>) -> Vector3<f32>;
}

#[derive(Debug)]
pub struct Sphere {
  pub material: Material,
  pub center: Vector3<f32>,
  pub radius: f32
}

impl Sphere {
  pub fn new(center: Vector3<f32>, radius: f32, color: Vector3<f32>) -> Self {
    Self {
      material: Material { color, ..Default::default() },
      center, radius,
    }
  }
  pub fn new_emissive(center: Vector3<f32>, radius: f32, emission_strength: f32, emission_color: Vector3<f32>) -> Self {
    Self {
      material: Material { emission_color, emission_strength, ..Default::default() },
      center, radius
    }
  }
}

impl Shape for Sphere {
  fn color(&self) -> Vector3<f32> {
    self.material.color
  }
  fn material(&self) -> Material {
    self.material
  }
  fn normal(&self, point: Vector3<f32>) -> Vector3<f32> {
    (point - self.center).normalize()
  }

  // Based on  the sphere equation - x^2 + y^2 + z^2 = r^2.
  // Substitude xyz for point of the sphere, which can be written as
  // (Ox + tDx)^2 + (Oy+tDy)^2 + (Oz+tDz)^2 = r^2, where
  // O - ray origin, D - ray direction, t - distance to the intersection.
  // The equation reduces to a quadratic form, and we solve for t
  fn intersect(&self, ray: &Ray) -> Option<Vector3<f32>> {
    // Offset the ray origin, so that the sphere would be at (0, 0, 0)
    // For example, when the ray origin is (0, 0, 0), and the sphere is at (0, 0, 10),
    // the offsetted ray origin would become (0, 0, -10)
    let offset_ray_origin = ray.origin - self.center;

    // Calculate coefficients of the quadratic equation
    let a = ray.direction.dot(&ray.direction);
    let b = 2.0 * offset_ray_origin.dot(&ray.direction);
    let c = offset_ray_origin.dot(&offset_ray_origin) - (self.radius * self.radius);

    let discriminant = (b*b) - 4.0 * a * c;

    // When D < 0, the ray did not intersect the sphere 
    if discriminant < 0.0 {
      return None;
    }

    let dst = (-b - discriminant.sqrt()) / 2.0 * a;

    // If either t is negative, that means that at least
    // part of the object is behind the camera, so we ignore it
    if dst < 0. {
      return None;
    }

    Some(ray.origin + ray.direction * dst)
  }
}
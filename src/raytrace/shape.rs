use nalgebra::Vector3;

use super::Ray;

// Base trait for all shapes
pub trait Shape {
    // Returns the intersection point
    fn intersect(&self, ray: &Ray) -> Option<Vector3<f64>>;
    // Get a normal vector for a point on an object
    fn normal(&self, point: Vector3<f64>) -> Vector3<f64>;
}

#[derive(Debug)]
pub struct Sphere;

impl Default for Sphere {
    fn default() -> Self {
        Self::new()
    }
}

impl Sphere {
    pub fn new() -> Self {
        Self {}
    }
}

impl Shape for Sphere {
    fn normal(&self, point: Vector3<f64>) -> Vector3<f64> {
        (point).normalize()
    }

    // Based on  the sphere equation - x^2 + y^2 + z^2 = r^2.
    // Substitude xyz for point of the sphere, which can be written as
    // (Ox + tDx)^2 + (Oy+tDy)^2 + (Oz+tDz)^2 = r^2, where
    // O - ray origin, D - ray direction, t - distance to the intersection.
    // The equation reduces to a quadratic form, and we solve for t
    fn intersect(&self, ray: &Ray) -> Option<Vector3<f64>> {
        // Calculate coefficients of the quadratic equation
        let a = ray.direction.dot(&ray.direction);
        let b = 2.0 * ray.origin.dot(&ray.direction);
        let c = ray.origin.dot(&ray.origin) - 1.;

        let discriminant = (b * b) - 4.0 * a * c;

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

        Some(ray.origin + ray.direction * dst)
    }
}

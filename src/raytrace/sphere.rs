use nalgebra::Point3;

pub struct Sphere {
  pub center: Point3<f32>,
  pub radius: f32
}

impl Sphere {
  pub fn new(center: Point3<f32>, radius: f32) -> Sphere {
    Sphere { center, radius }
  }
}
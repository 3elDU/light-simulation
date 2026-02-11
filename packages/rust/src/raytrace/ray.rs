use nalgebra::Vector3;

#[derive(Copy, Clone)]
pub struct Ray {
    pub origin: Vector3<f64>,
    pub direction: Vector3<f64>,
}

use nalgebra::Vector3;

// Clamp all vector values between two values
pub fn clamp_vector(vector: Vector3<f64>, min: f64, max: f64) -> Vector3<f64> {
  let mut vector = vector;
  vector.x = nalgebra::clamp(vector.x, min, max);
  vector.y = nalgebra::clamp(vector.y, min, max);
  vector.z = nalgebra::clamp(vector.z, min, max);
  vector
}

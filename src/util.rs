use nalgebra::Vector3;

// Clamp all vector values between two values
pub fn clamp_vector(vector: Vector3<f32>, min: f32, max: f32) -> Vector3<f32> {
  let mut vector = vector.clone();
  vector.x = nalgebra::clamp(vector.x, min, max);
  vector.y = nalgebra::clamp(vector.y, min, max);
  vector.z = nalgebra::clamp(vector.z, min, max);
  vector
}

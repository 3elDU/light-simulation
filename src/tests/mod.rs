#[cfg(test)]
mod tests {
  use nalgebra::Vector3;

use crate::raytrace::{camera::Camera, shape::{Shape, Sphere}};

  #[test]
  // Create different camera setups, and ensure that all vector values are coorect
  fn camera_perspective() {
    let camera = Camera::new(
      Vector3::new(0., 0., 0.),
      Vector3::new(10., 0., 0.)
    );

    // Horizontal plane (1 unit in front of the camera, pointing to left)
    assert_eq!(camera.u(), Vector3::new(0., 0., 1.));
    // Vertical projection plane (1 unit in front of the camera, pointing up)
    assert_eq!(camera.v(), Vector3::new(0., 9. / 16., 0.));
  }

  #[test]
  // Test various aspects of the ray
  // - intersection with an object
  // - proper origin
  // - proper direction
  // - proper intersection point with the sphere
  // - reflections must not point inside the sphere
  fn ray_physics() {
    let camera = Camera::new(
      Vector3::new(0., 0., 0.),
      Vector3::new(10., 0., 0.)
    );
    let sphere: Box<dyn Shape> = Box::new(Sphere::new(
      Vector3::new(10., 0., 0.), 1.,
      Vector3::new(1., 1., 1.)
    ));

    // Cast a ray from the center of the screen.
    // It should hit the sphere right in the center.
    let mut ray = camera.generate_ray(0., 0.);
    
    // Ray must originate from the camera position
    assert_eq!(ray.origin, Vector3::new(0., 0., 0.));
    // Since ray originates perfectly from the center of the screen,
    // it must have a direction vector of (1., 0., 0.) (the camera is looking towards X+)
    assert_eq!(ray.direction, Vector3::new(1., 0., 0.));

    let intersection = sphere.intersect(&ray)
      .expect("The ray must intersect the sphere");

    // Test that the distance to the sphere equals to 9 (center of the sphere minus radius)
    assert_eq!(intersection, Vector3::new(9., 0., 0.));

    // 10 thousand reflections should be enough
    for _ in 0..10_000 {
      ray.reflect(intersection, &sphere);
      
      assert!(ray.direction.dot(&sphere.normal(intersection)) >= 0.0);
    }
  }
}
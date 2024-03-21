use nalgebra::{Vector2, Vector3};
use rand::prelude::*;

use super::ray::Ray;

#[derive(Debug)]
pub struct Camera {
  // Resolution of the camera in pixels
  resolution: Vector2<usize>,
  position: Vector3<f64>,
  look_at: Vector3<f64>,
  up: Vector3<f64>,

  alignment: Vector3<f64>,
  projection_screen_u: Vector3<f64>,
  projection_screen_v: Vector3<f64>,
  projection_screen_center: Vector3<f64>,
  // Size of one horizontal / vertical pixel in world units
  delta_u: f64,
  delta_v: f64,

  // Length from the camera position to the projection screen
  length: f64,

  // Horizontal size of the projection screen
  horizontal_size: f64,
  aspect_ratio: f64
}

impl Default for Camera {
  fn default() -> Self {
    let mut camera = Camera {
      resolution: Vector2::new(16, 9),
      position: Vector3::new(0., 0., 0.,),
      look_at: Vector3::new(0., 0., 10.),
      up: Vector3::new(0., 1., 0.),

      length: 1.,
      horizontal_size: 1.,
      aspect_ratio: 16. / 9.,

      alignment: Vector3::default(),
      projection_screen_u: Vector3::default(),
      projection_screen_v: Vector3::default(),
      projection_screen_center: Vector3::default(),
      delta_u: 0., delta_v: 0.
    };
    camera.update_geometry();

    camera
  }
}

impl Camera {
  pub fn new(resolution: Vector2<usize>, position: Vector3<f64>, look_at: Vector3<f64>) -> Camera {
    let mut camera = Camera {
      resolution,
      aspect_ratio: resolution.x as f64 / resolution.y as f64,
      position,
      look_at,
      ..Default::default()
    };
    camera.update_geometry();

    camera
  }

  pub fn move_to(&mut self, position: Vector3<f64>) {
    self.position = position;
    self.update_geometry();
  }
  pub fn set_look_at(&mut self, look_at: Vector3<f64>) {
    self.look_at = look_at;
    self.update_geometry();
  }

  pub fn update_geometry(&mut self) {
    // Compute the vector from the camera to look_at position
    self.alignment = (self.look_at - self.position).normalize();

    // Compute U and V vectors
    self.projection_screen_u = (self.alignment.cross(&self.up)).normalize();
    self.projection_screen_v = (self.projection_screen_u.cross(&self.alignment)).normalize();
    // Compute position of center point of the screen
    self.projection_screen_center = self.position + (self.length * self.alignment);

    // Modify U and V vectors to match the aspect ratio of the screen
    self.projection_screen_u *= self.horizontal_size;
    self.projection_screen_v *= self.horizontal_size / self.aspect_ratio;

    self.delta_u = self.horizontal_size / self.resolution.x as f64;
    self.delta_v = (self.horizontal_size / self.aspect_ratio) / self.resolution.y as f64;
    dbg!(&self.delta_u, &self.delta_v);
  }

  pub fn generate_ray(&self, proj_screen_x: f64, proj_screen_y: f64) -> Ray {
    // Translate the ray origin by a tiny bit
    // to simulate how real world cameras work, and to introduce anti-aliasing
    let proj_screen_x = proj_screen_x + thread_rng().gen_range(-self.delta_u*2.0..=self.delta_u*2.0);
    let proj_screen_y = proj_screen_y + thread_rng().gen_range(-self.delta_v*2.0..=self.delta_v*2.0);

    // Compute the location of the screen point in world coordinates
    let screen_world_coordinate = self.projection_screen_center
      + (self.projection_screen_u * proj_screen_x)
      + (self.projection_screen_v * proj_screen_y);
    
    Ray {
      origin: self.position,
      direction: (screen_world_coordinate - self.position).normalize()
    }
  }

  pub fn position(&self) -> Vector3<f64> {
    self.position
  }
  pub fn lookat_position(&self) -> Vector3<f64> {
    self.look_at
  
  }
  pub fn up_vector(&self) -> Vector3<f64> {
    self.up
  }
  
  pub fn length(&self) -> f64 {
    self.length
  }
  
  pub fn horizontal_size(&self) -> f64 {
    self.horizontal_size
  }
  pub fn aspect_ratio(&self) -> f64 {
    self.aspect_ratio
  }

  pub fn u(&self) -> Vector3<f64> {
    self.projection_screen_u
  }
  pub fn v(&self) -> Vector3<f64> {
    self.projection_screen_v
  }

  pub fn screen_center(&self) -> Vector3<f64> {
    self.projection_screen_center
  }
}

use nalgebra::Vector3;

use super::ray::Ray;

#[derive(Debug)]
pub struct Camera {
  position: Vector3<f32>,
  look_at: Vector3<f32>,
  up: Vector3<f32>,

  alignment: Vector3<f32>,
  projection_screen_u: Vector3<f32>,
  projection_screen_v: Vector3<f32>,
  projection_screen_center: Vector3<f32>,

  // Length from the camera position to the projection screen
  length: f32,

  // Horizontal size of the projection screen
  horizontal_size: f32,
  aspect_ratio: f32
}

impl Default for Camera {
  fn default() -> Self {
    let mut camera = Camera {
      position: Vector3::new(0., 0., 0.,),
      look_at: Vector3::new(0., 0., 10.),
      up: Vector3::new(0., 1., 0.),

      length: 1.,
      horizontal_size: 1.,
      aspect_ratio: 16. / 9.,

      alignment: Vector3::default(),
      projection_screen_u: Vector3::default(),
      projection_screen_v: Vector3::default(),
      projection_screen_center: Vector3::default()
    };
    camera.update_geometry();

    camera
  }
}

impl Camera {
  pub fn new(position: Vector3<f32>, look_at: Vector3<f32>) -> Camera {
    let mut camera = Camera {
      position,
      look_at,
      ..Default::default()
    };
    camera.update_geometry();

    camera
  }

  pub fn move_to(&mut self, position: Vector3<f32>) {
    self.position = position;
    self.update_geometry();
  }
  pub fn set_look_at(&mut self, look_at: Vector3<f32>) {
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
  }

  pub fn generate_ray(&self, proj_screen_x: f32, proj_screen_y: f32) -> Ray {
    // Compute the location of the screen point in world coordinates
    let screen_world_coordinate = self.projection_screen_center
      + (self.projection_screen_u * proj_screen_x)
      + (self.projection_screen_v * proj_screen_y);
    
    Ray {
      origin: self.position,
      direction: screen_world_coordinate - self.position
    }
  }

  pub fn position(&self) -> Vector3<f32> {
    self.position
  }
  pub fn lookat_position(&self) -> Vector3<f32> {
    self.look_at
  
  }
  pub fn up_vector(&self) -> Vector3<f32> {
    self.up
  }
  
  pub fn length(&self) -> f32 {
    self.length
  }
  
  pub fn horizontal_size(&self) -> f32 {
    self.horizontal_size
  }
  pub fn aspect_ratio(&self) -> f32 {
    self.aspect_ratio
  }

  pub fn u(&self) -> Vector3<f32> {
    self.projection_screen_u
  }
  pub fn v(&self) -> Vector3<f32> {
    self.projection_screen_v
  }

  pub fn screen_center(&self) -> Vector3<f32> {
    self.projection_screen_center
  }
}

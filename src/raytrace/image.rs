use macroquad::{color::Color, texture::Texture2D};
use nalgebra::Vector3;

pub struct Image {
  width: usize,
  height: usize,
  accumulated_exposure: Vec<Vector3<f64>>,
}

impl Image {
  pub fn new(width: usize, height: usize) -> Self {
    let mut pixels = Vec::with_capacity(width * height);

    // Fill the vector with pixels
    for _ in 0..width*height {
      pixels.push(Vector3::new(0., 0., 0.));
    }

    Image {
      width, height,
      accumulated_exposure: pixels
    }
  }

  pub fn set_pixel(&mut self, x: usize, y: usize, color: Vector3<f64>) {
    self.accumulated_exposure[y * self.width + x] = color;
  }
  pub fn inc_pixel(&mut self, x: usize, y: usize, color: Vector3<f64>) {
    self.accumulated_exposure[y * self.width + x] += color
  }
  pub fn get_pixel(&self, x: usize, y: usize) -> Vector3<f64> {
    self.accumulated_exposure[y * self.width + x]
  }

  // Generate a Texture2D object from an image.
  // A number of samples is required, because each pixel accumulates
  // all the exposure received over the span of rendering.
  // To get the number between 0 and 1, we divide each color property by
  // the number of samples, receiving the averaged color value.
  pub fn generate_texture(&self, samples_rendered: usize) -> Texture2D {
    let mut image = macroquad::texture::Image::gen_image_color(
      self.width as u16, self.height as u16, macroquad::color::BLACK
    );

    for x in 0..self.width {
      for y in 0..self.height {
        let color = self.get_pixel(x, y);

        let averaged_color = Color::new(
          color.x as f32 / samples_rendered as f32,
          color.y as f32 / samples_rendered as f32,
          color.z as f32 / samples_rendered as f32,
          1.0
        );

        image.set_pixel(x as u32, y as u32, averaged_color);
      }
    }

    Texture2D::from_image(&image)
  }
}
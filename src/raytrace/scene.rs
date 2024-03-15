use nalgebra::Vector3;

use crate::config::*;

use super::image::Image;
use super::{camera::Camera, ray::Ray, shape::Shape};

pub struct Scene {
  width: usize,
  height: usize,

  pub image: Image,
  pub samples: usize,

  pub objects: Vec<Box<dyn Shape>>,

  pub camera: Camera,
  pub rays: Vec<Ray>
}

impl Scene {
  pub fn new(width: usize, height: usize, camera: Camera) -> Scene {
    Scene {
      width, height, camera, samples: 0,
      image: Image::new(width, height),
      objects: Vec::new(),
      rays: Vec::new(),
    }
  }

  pub fn collide_ray(&self, ray: &Ray) -> Option<(Vector3<f32>, &Box<dyn Shape>)> {
    let mut min_dist = f32::INFINITY;
    let mut intersected_object: Option<&Box<dyn Shape>> = None;
    let mut point: Option<Vector3<f32>> = None;

    for object in &self.objects {
      let intersection = object.intersect(&ray);

      if let Some(intersection) = intersection {
        let dist = (intersection - ray.origin).magnitude();
        if dist < min_dist {
          min_dist = dist;
          intersected_object = Some(object);
          point = Some(intersection);
        }
      }
    }

    Some((point?, intersected_object?))
  }

  pub fn trace_ray(&self, ray: &mut Ray) -> Vector3<f32> {
    let mut ray_color = Vector3::new(1.0, 1.0, 1.0);
    let mut incoming_light = Vector3::new(0.0, 0.0, 0.0);

    for bounce in 0..MAX_BOUNCE_COUNT {
      let intersection = self.collide_ray(ray);
      if let Some((point, object)) = intersection {
        ray.reflect(point, object);

        let material = object.material();
        let emitted_light = material.emission_color * material.emission_strength;

        incoming_light += emitted_light.component_mul(&ray_color);
        ray_color.component_mul_assign(&material.color);

        // Stop, if ray hits a light source
        if object.material().emission_strength > 0. {
          break;
        }
      } else {
        // let emission_color = Vector3::new(1., 1., 1.).lerp(&Vector3::new(0.5, 0.7, 1.0), ray.direction.y) / bounce as f32 * 0.5;
        // incoming_light += emission_color.component_mul(&ray_color);
        break;
      }
    }

    incoming_light
  }

  // X and Y are pixel coordinates
  pub fn project_pixel(&self, x: usize, y: usize) -> Ray {
    self.camera.generate_ray(
      // Convert our pixel coordinates, which go from 0 to N
      // to screen coordinates, which go from -1 to +1
      1.0 - (x as f32 / SCREEN_WIDTH as f32) * 2.0,
      1.0 - (y as f32 / SCREEN_HEIGHT as f32) * 2.0
    )
  }

  pub fn sample(&mut self) {
    for x in 0..SCREEN_WIDTH {
      for y in 0..SCREEN_HEIGHT {
        let mut accumulated_color = Vector3::zeros();
        for _ in 0..SAMPLES_PER_PIXEL {
          let mut ray = self.project_pixel(x, y);
          accumulated_color += self.trace_ray(&mut ray);
        }

        self.image.inc_pixel(x, y, accumulated_color);
      }
    }

    self.samples += SAMPLES_PER_PIXEL;
  }

  pub fn width(&self) -> usize {
    self.width
  }
  pub fn height(&self) -> usize {
    self.height
  }
}

use std::time::Instant;

use macroquad::prelude::*;
use light_simulation::{config::*, raytrace::{camera::Camera, scene::Scene, shape::Sphere}};
use nalgebra::Vector3;

fn window_conf() -> Conf {
  Conf {
    window_title: "Raytracer".to_owned(),
    window_width: ( SCREEN_WIDTH as f32 * PIXEL_SIZE ) as i32,
    window_height: ( SCREEN_HEIGHT as f32 * PIXEL_SIZE ) as i32,
    platform: miniquad::conf::Platform {
      linux_backend: miniquad::conf::LinuxBackend::WaylandWithX11Fallback,
      ..Default::default()
    },
    ..Default::default()
  }
}

#[macroquad::main(window_conf)]
async fn main() {
  let mut scene = Scene::new(
    SCREEN_WIDTH, SCREEN_HEIGHT,
    Camera::new(
      Vector3::new(4.,3.5, 4.),
      Vector3::new(0., 1., 0.)
    )
  );

  scene.objects.push(Box::new(Sphere::new(
    Vector3::new(0., -100000., 0.), 100000.,
    Vector3::new(1., 1., 1.)
  )));

  scene.objects.push(Box::new(Sphere::new(
    Vector3::new(0., 1., 0.), 1.,
    Vector3::new(1., 0.2, 0.2),
  )));
  scene.objects.push(Box::new(Sphere::new(
    Vector3::new(-2.3, 1., 0.), 1.,
    Vector3::new(0.2, 1., 1.),
  )));
  scene.objects.push(Box::new(Sphere::new(
    Vector3::new(2.3, 1., 0.), 1.,
    Vector3::new(0.2, 0.2, 1.),
  )));

  scene.objects.push(Box::new(Sphere::new_emissive(
    Vector3::new(0., 1., 4.), 1.,
    2.,
    Vector3::new(1., 1., 1.),
  )));
  scene.objects.push(Box::new(Sphere::new_emissive(
    Vector3::new(0., 5., 0.), 1.,
    1.,
    Vector3::new(1., 1., 1.),
  )));
  
  let now = Instant::now();
  scene.render();
  let elapsed = now.elapsed();
  println!("Render took {}ms", elapsed.as_millis());

  let texture = Texture2D::from_image(&scene.image);
  
  loop {
    clear_background(BLACK);

    if is_mouse_button_pressed(MouseButton::Left) {
      let (x, y) = mouse_position();
      let ray = scene.project_pixel(x as usize, y as usize);

      let mut intersections: Vec<(Vector3<f32>, f32)> = Vec::new();

      for object in &scene.objects {
        let intersection = object.intersect(&ray);
        if let Some(intersection) = intersection {
          intersections.push((
            intersection, 
            (intersection - ray.origin).magnitude()
          ));
        }
      }

      for (i, (intersection, distance)) in intersections.iter().enumerate() {
        println!("Intersection {}; Points: [{:.2} \t {:.2} \t {:.2}]", i, 
          intersection.x, intersection.y, intersection.z
        );
        println!("Intersection {}; Distance - {}", i, distance);
      }
      print!("\n");
    }

    draw_texture_ex(&texture, 0.0, 0.0, WHITE, DrawTextureParams {
      dest_size: Some(Vec2::new(
        SCREEN_WIDTH as f32 * PIXEL_SIZE as f32,
        SCREEN_HEIGHT as f32 * PIXEL_SIZE as f32
      )),
      ..Default::default()
    });

    next_frame().await
  }
}

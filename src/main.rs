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
      Vector3::new(0., 10., 10.),
      Vector3::new(0., 1., 0.)
    )
  );

  scene.objects.push(Box::new(Sphere::new(
    Vector3::new(0., -100000., 0.), 100000.,
    Vector3::new(1., 1., 1.)
  )));

  scene.objects.push(Box::new(Sphere::new_emissive(
    Vector3::new(-5., 1., 0.), 1.,
    4.,
    Vector3::new(1., 0., 0.),
  )));
  scene.objects.push(Box::new(Sphere::new_emissive(
    Vector3::new(5., 1., 0.), 1.,
    4.,
    Vector3::new(0., 1., 0.),
  )));
  scene.objects.push(Box::new(Sphere::new_emissive(
    Vector3::new(0., 1., 0.), 1.,
    4.,
    Vector3::new(0., 0., 1.)
  )));
  
  let now = Instant::now();
  scene.sample();
  let elapsed = now.elapsed();
  println!("Render took {}ms", elapsed.as_millis());

  let mut texture = scene.image.generate_texture(scene.samples);
  
  loop {
    clear_background(BLACK);

    if is_mouse_button_pressed(MouseButton::Left) {
      let (x, y) = mouse_position();
      let mut ray = scene.project_pixel(x as usize, y as usize);

      let mut intersections: Vec<(Vector3<f32>, f32)> = Vec::new();
      let mut bounces = 0;

      for object in &scene.objects {
        let intersection = object.intersect(&ray);
        if let Some(intersection) = intersection {
          intersections.push((
            intersection, 
            (intersection - ray.origin).magnitude()
          ));
        }
      }

      // Count the number of bounces
      let mut last_intersection = scene.collide_ray(&ray);
      loop {
        if let Some((point, object)) = last_intersection {
          bounces += 1;
          ray.reflect(point, object);
          last_intersection = scene.collide_ray(&ray);
        } else {
          break;
        }
      }

      for (i, (intersection, distance)) in intersections.iter().enumerate() {
        println!("Intersection {}; Points: [{:.2} \t {:.2} \t {:.2}]", i, 
          intersection.x, intersection.y, intersection.z
        );
        println!("Intersection {}; Distance - {}", i, distance);
      }
      println!("Ray bounced off {} times", bounces);
      print!("\n");
    }

    draw_texture_ex(texture, 0.0, 0.0, WHITE, DrawTextureParams {
      dest_size: Some(Vec2::new(
        SCREEN_WIDTH as f32 * PIXEL_SIZE as f32,
        SCREEN_HEIGHT as f32 * PIXEL_SIZE as f32
      )),
      ..Default::default()
    });

    egui_macroquad::ui(|egui_ctx| {
      egui::Window::new("Rendering")
        .show(egui_ctx, |ui| {
          if ui.button("Render").clicked() {
            scene.sample();
            texture = scene.image.generate_texture(scene.samples);
          }
          ui.label(format!("Samples: {}", scene.samples));
        });
    });
    egui_macroquad::draw();

    // scene.render();
    // texture = Texture2D::from_image(&scene.image);

    next_frame().await
  }
}

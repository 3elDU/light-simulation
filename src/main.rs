use std::time::Instant;

use light_simulation::{
    config::*,
    raytrace::{camera::Camera, scene::Scene, shape::Sphere, transform::TransformBuilder},
};
use macroquad::prelude::*;
use nalgebra::{Rotation3, Vector2, Vector3};

fn window_conf() -> Conf {
    Conf {
        window_title: "Raytracer".to_owned(),
        window_width: (SCREEN_WIDTH as f64 * PIXEL_SIZE) as i32,
        window_height: (SCREEN_HEIGHT as f64 * PIXEL_SIZE) as i32,
        platform: miniquad::conf::Platform {
            linux_backend: miniquad::conf::LinuxBackend::WaylandWithX11Fallback,
            ..Default::default()
        },
        ..Default::default()
    }
}

#[macroquad::main(window_conf)]
#[allow(unreachable_code)]
async fn main() {
    let mut scene = Scene::new(
        SCREEN_WIDTH,
        SCREEN_HEIGHT,
        Camera::new(
            Vector2::new(SCREEN_WIDTH, SCREEN_HEIGHT),
            Vector3::new(20., 0., -8.), 
            Vector3::new(0., 0., 0.)
        ),
    );

    // Sun
    let camera_direction = (scene.camera.lookat_position() - scene.camera.position()).normalize();
    scene.add(Box::new(Sphere::new_emissive(
        Vector3::new(1., 1., 1.),
        1.,
        TransformBuilder::new()
            .scale_uniform(500.)
            .translate(
                // Rotate the sun 45 degrees clockwise around Y axis
                Rotation3::from_axis_angle(&Vector3::y_axis(), std::f64::consts::PI / 4.)
                    // Move the sun 1000 units in the opposite direction from what the camera is looking at
                    .transform_vector(&(-camera_direction * 1000.)),
            )
            .build(),
    )));

    // Main sphere
    scene.add(Box::new(Sphere::new(
        Vector3::new(1., 1., 1.),
        TransformBuilder::new()
            .scale_x(8.)
            .scale_y(8.)
            .scale_z(8.)
            .build(),
    )));

    // Green emissive sphere
    scene.add(Box::new(Sphere::new_emissive(
        Vector3::new(0., 1., 0.),
        2.,
        TransformBuilder::new()
            .translate_y(10.)
            .translate_x(5.)
            .scale_uniform(2.)
            .scale_z(2.)
            .build(),
    )));
    // Red emissive sphere
    scene.add(Box::new(Sphere::new_emissive(
        Vector3::new(1., 0., 0.),
        2.,
        TransformBuilder::new()
            .translate_x(12.)
            .scale_y(1.5)
            .build(),
    )));
    scene.add(Box::new(Sphere::new_emissive(
        Vector3::new(1., 1., 0.),
        2.,
        TransformBuilder::new()
            .translate_z(1050.)
            .scale_uniform(800.)
            .build(),
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

            let mut intersections: Vec<(Vector3<f64>, f64)> = Vec::new();
            let mut bounces = 0;

            for object in &scene.objects {
                let intersection = object.intersect(&ray);
                if let Some(intersection) = intersection {
                    intersections.push((intersection, (intersection - ray.origin).magnitude()));
                }
            }

            // Count the number of bounces
            let mut last_intersection = scene.collide_ray(&ray);
            while let Some((point, object)) = last_intersection {
                bounces += 1;
                ray.reflect(point, object);
                last_intersection = scene.collide_ray(&ray);
            }

            for (i, (intersection, distance)) in intersections.iter().enumerate() {
                println!(
                    "Intersection {}; Points: [{:.2} \t {:.2} \t {:.2}]",
                    i, intersection.x, intersection.y, intersection.z
                );
                println!("Intersection {}; Distance - {}", i, distance);
            }
            println!("Ray bounced off {} times", bounces);
            println!();
        }

        draw_texture_ex(
            texture,
            0.0,
            0.0,
            WHITE,
            DrawTextureParams {
                dest_size: Some(Vec2::new(
                    SCREEN_WIDTH as f32 * PIXEL_SIZE as f32,
                    SCREEN_HEIGHT as f32 * PIXEL_SIZE as f32,
                )),
                ..Default::default()
            },
        );

        egui_macroquad::ui(|egui_ctx| {
            egui::Window::new("Rendering").show(egui_ctx, |ui| {
                if ui.button("Render").clicked() {
                    scene.sample();
                    texture = scene.image.generate_texture(scene.samples);
                }
                ui.label(format!("Samples: {}", scene.samples));
            });
        });
        egui_macroquad::draw();

        next_frame().await
    }
}

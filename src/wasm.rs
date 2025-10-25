use nalgebra::{Rotation3, Vector2, Vector3};
use wasm_bindgen::prelude::*;

use crate::raytrace::{
    Camera, Config, Lambertian, Object, Scene as InternalScene, Sphere, TransformBuilder,
};

/// Facade that abstracts the internal scene structure away for JavaScript code
#[wasm_bindgen]
struct Scene {
    config: Config,
    scene: InternalScene,
}

impl From<&Scene> for Vec<u8> {
    fn from(facade: &Scene) -> Self {
        let cfg = &facade.config;

        let mut v = Vec::with_capacity(cfg.width * cfg.height * 4);

        for y in 0..cfg.height {
            for x in 0..cfg.width {
                let mat = facade.scene.render.get_pixel_corrected(x, y);

                v.push((mat.x as f64 * 255.) as u8);
                v.push((mat.y as f64 * 255.) as u8);
                v.push((mat.z as f64 * 255.) as u8);
                v.push(255); // alpha
            }
        }

        v
    }
}

#[wasm_bindgen]
impl Scene {
    #[wasm_bindgen(constructor)]
    pub fn new(config: Config) -> Scene {
        let cam = Camera::new(
            Vector2::new(config.width, config.height),
            Vector3::new(20., 0., -8.),
            Vector3::new(0., 0., 0.),
        );

        let mut scene = InternalScene::new(config.clone(), cam.clone());

        // Sun
        let camera_direction = (cam.lookat_position() - cam.position()).normalize();
        scene.objects.push(Object::new_emissive(
            Box::new(Sphere::new()),
            Vector3::new(1., 1., 1.),
            0.5,
            Box::new(Lambertian::new()),
            TransformBuilder::new()
                .scale_uniform(500.)
                .translate(
                    // Rotate the sun 45 degrees clockwise around Y axis
                    Rotation3::from_axis_angle(&Vector3::y_axis(), std::f64::consts::PI / 4.)
                        // Move the sun 1000 units in the opposite direction from what the camera is looking at
                        .transform_vector(&(-camera_direction * 1000.)),
                )
                .build(),
        ));

        // Main sphere
        scene.objects.push(Object::new(
            Box::new(Sphere::new()),
            Vector3::new(1., 1., 1.),
            Box::new(Lambertian::new()),
            TransformBuilder::new()
                .scale_x(8.)
                .scale_y(8.)
                .scale_z(8.)
                .build(),
        ));

        // Green emissive sphere
        scene.objects.push(Object::new_emissive(
            Box::new(Sphere::new()),
            Vector3::new(0., 1., 0.),
            2.,
            Box::new(Lambertian::new()),
            TransformBuilder::new()
                .translate_y(10.)
                .translate_x(5.)
                .scale_uniform(2.)
                .scale_z(2.)
                .build(),
        ));
        // Red emissive sphere
        scene.objects.push(Object::new_emissive(
            Box::new(Sphere::new()),
            Vector3::new(1., 0., 0.),
            2.,
            Box::new(Lambertian::new()),
            TransformBuilder::new()
                .translate_x(12.)
                .scale_y(1.5)
                .build(),
        ));
        scene.objects.push(Object::new_emissive(
            Box::new(Sphere::new()),
            Vector3::new(1., 1., 0.),
            2.,
            Box::new(Lambertian::new()),
            TransformBuilder::new()
                .translate_z(1050.)
                .scale_uniform(800.)
                .build(),
        ));

        return Scene { config, scene };
    }

    pub fn sample(&mut self) {
        self.scene.sample();
    }

    pub fn get_image(&self) -> Vec<u8> {
        return self.into();
    }
}

use nalgebra::{Vector2, Vector3};
use wasm_bindgen::prelude::*;

use crate::raytrace::{
    Camera, Config, Lambertian, Object, Scene as InternalScene, Sphere, TransformBuilder,
};

/// Facade that abstracts away the object creation
#[wasm_bindgen]
struct SceneObject {
    x: f64,
    y: f64,
    z: f64,
    r: u8,
    g: u8,
    b: u8,
    radius: f64,
    emission: f64,
}

#[wasm_bindgen]
impl SceneObject {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f64, y: f64, z: f64, r: u8, g: u8, b: u8, radius: f64, emission: f64) -> Self {
        Self {
            x,
            y,
            z,
            r,
            g,
            b,
            radius,
            emission,
        }
    }
}

impl From<SceneObject> for Object {
    fn from(obj: SceneObject) -> Self {
        let color = Vector3::new(
            obj.r as f64 / 255.,
            obj.g as f64 / 255.,
            obj.b as f64 / 255.,
        );
        let transform = TransformBuilder::new()
            .translate(Vector3::new(obj.x, obj.y, obj.z))
            .scale_uniform(obj.radius)
            .build();

        return if obj.emission == 0. {
            Object::new(
                Box::new(Sphere::new()),
                color,
                Box::new(Lambertian::new()),
                transform,
            )
        } else {
            Object::new_emissive(
                Box::new(Sphere::new()),
                color,
                obj.emission,
                Box::new(Lambertian::new()),
                transform,
            )
        };
    }
}

#[wasm_bindgen]
struct Position {
    x: f64,
    y: f64,
    z: f64,
}

#[wasm_bindgen]
impl Position {
    #[wasm_bindgen(constructor)]
    pub fn new(x: f64, y: f64, z: f64) -> Self {
        Self { x, y, z }
    }
}

impl From<Position> for Vector3<f64> {
    fn from(value: Position) -> Self {
        Vector3::new(value.x, value.y, value.z)
    }
}

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
    pub fn new(
        camera_pos: Position,
        looking_at: Position,
        config: Config,
        objects: Vec<SceneObject>,
    ) -> Scene {
        let cam = Camera::new(
            Vector2::new(config.width, config.height),
            camera_pos.into(),
            looking_at.into(),
        );

        let mut scene = InternalScene::new(config.clone(), cam.clone());

        for obj in objects {
            scene.objects.push(obj.into());
        }

        return Scene { config, scene };
    }

    pub fn sample(&mut self) {
        self.scene.sample();
    }

    pub fn get_image(&self) -> Vec<u8> {
        return self.into();
    }
}

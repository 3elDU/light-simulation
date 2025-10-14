use nalgebra::{Vector2, Vector3};
use wasm_bindgen::prelude::*;

use crate::raytrace::{
    Camera, Config, Lambertian, Object, Render, Scene, Sphere, TransformBuilder,
};

impl From<Render> for Vec<u8> {
    fn from(render: Render) -> Self {
        let cfg = &render.config;

        let mut v = Vec::with_capacity(cfg.width * cfg.height * 4);

        for y in 0..cfg.height {
            for x in 0..cfg.width {
                let mat = render.get_pixel_corrected(x, y);

                v.push((mat.x * 255.) as u8);
                v.push((mat.y * 255.) as u8);
                v.push((mat.z * 255.) as u8);
                v.push(255); // alpha
            }
        }

        v
    }
}

#[wasm_bindgen]
pub fn render(cfg: Config) -> Vec<u8> {
    let cam = Camera::new(
        Vector2::new(cfg.width, cfg.height),
        Vector3::new(0., 0., 0.),
        Vector3::new(0., 0., 1.),
    );

    let mut scene = Scene::new(cfg.clone(), cam);

    // Red sphere
    scene.objects.push(Object::new(
        Box::new(Sphere::new()),
        Vector3::new(1.0, 0.0, 0.0),
        Box::new(Lambertian::new()),
        TransformBuilder::new()
            .translate_z(5.0)
            .scale_uniform(1.0)
            .build(),
    ));

    // Light source
    scene.objects.push(Object::new_emissive(
        Box::new(Sphere::new()),
        Vector3::new(1., 1., 1.),
        3.,
        Box::new(Lambertian::new()),
        TransformBuilder::new()
            .translate_z(-120.)
            .scale_uniform(100.)
            .build(),
    ));

    for _ in 0..cfg.samples_per_pixel {
        scene.sample();
    }

    return scene.render.into();
}

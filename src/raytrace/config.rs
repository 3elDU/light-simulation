use wasm_bindgen::prelude::wasm_bindgen;

/// [Config] stores some common graphical parameters used in the simulation
#[derive(Clone, Debug)]
#[wasm_bindgen]
pub struct Config {
    /// Width of the projection screen
    pub width: usize,
    /// Height of the projection screen
    pub height: usize,
    /// Maximum amount of bounces each ray can perform
    pub max_bounce_count: usize,
    /// How many samples (iterations) to compute for each pixel on the screen
    pub samples_per_pixel: usize,
}

#[wasm_bindgen]
impl Config {
    #[wasm_bindgen(constructor)]
    pub fn new(
        width: usize,
        height: usize,
        max_bounce_count: usize,
        samples_per_pixel: usize,
    ) -> Self {
        Self {
            width,
            height,
            max_bounce_count,
            samples_per_pixel,
        }
    }
}

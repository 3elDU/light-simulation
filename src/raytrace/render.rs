use nalgebra::Vector3;

use super::Config;

/// Render resembles a virtual screen onto which the scene can be rendered
/// It serves as an intermediate type, having useful methods used by the [Scene],
/// but supposed to be converted into an actually useful medium after the render.
pub struct Render {
    pub config: Config,
    accumulated_exposure: Vec<Vector3<f64>>,
    // Track the count of iterations to properly calculate exposure
    samples: usize,
}

impl Render {
    pub fn new(config: Config) -> Self {
        let mut pixels = Vec::with_capacity(config.width * config.height);

        // Fill the vector with pixels
        for _ in 0..config.width * config.height {
            pixels.push(Vector3::new(0., 0., 0.));
        }

        Render {
            config,
            accumulated_exposure: pixels,
            samples: 0,
        }
    }

    /// Add exposure to pixel at the specified coordinates
    pub fn add_exposure(&mut self, x: usize, y: usize, color: Vector3<f64>) {
        self.accumulated_exposure[y * self.config.width + x] += color
    }
    /// Get the raw value of a pixel at the specified coordinates
    pub fn get_pixel(&self, x: usize, y: usize) -> Vector3<f64> {
        self.accumulated_exposure[y * self.config.width + x]
    }

    /// Increment the sample count by one.
    ///
    /// This function is meant to be called after one full iteration is finished
    pub fn inc_sample_count(&mut self) {
        self.samples += 1;
    }

    /// Get value of pixel at specified coordinates, with adjusted exporuse
    /// and corrected gamma
    pub fn get_pixel_corrected(&self, x: usize, y: usize) -> Vector3<f64> {
        let color = self.get_pixel(x, y);

        // Compute the averaged color value by dividing the accumulated exposure
        // by the total number of samples, giving a value from 0 to 1
        let mut r = color.x / self.samples as f64;
        let mut g = color.y / self.samples as f64;
        let mut b = color.z / self.samples as f64;

        // Apply gamma correction
        r = r.powf(1.0 / 2.2);
        g = g.powf(1.0 / 2.2);
        b = b.powf(1.0 / 2.2);

        Vector3::new(r, g, b)
    }
}

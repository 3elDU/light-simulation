import { Config, Scene } from "../wasm/light_simulation";

postMessage({
  type: "loaded",
});

addEventListener("message", async (event) => {
  const config = new Config(
    event.data.width,
    event.data.height,
    event.data.maxBounceCount,
    event.data.samplesPerPixel
  );

  const scene = new Scene(config);

  for (let i = 0; i < event.data.samplesPerPixel; i++) {
    scene.sample();

    const image = new ImageData(
      new Uint8ClampedArray(scene.get_image()),
      event.data.width,
      event.data.height
    );

    postMessage(
      {
        sample: i + 1,
        image,
      },
      [image.data.buffer]
    );
  }

  scene.free();
});

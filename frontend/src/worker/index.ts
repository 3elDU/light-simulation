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
  const start = performance.now();
  let image: ImageData;

  for (let i = 0; i < event.data.samplesPerPixel; i++) {
    scene.sample();

    image = new ImageData(
      new Uint8ClampedArray(scene.get_image()),
      event.data.width,
      event.data.height
    );

    if (i != event.data.samplesPerPixel - 1) {
      postMessage(
        {
          type: "frame",
          sample: i + 1,
          image,
        },
        [image.data.buffer]
      );
    }
  }

  const totalRenderTime = (performance.now() - start) / 1000;
  const samplesPerSecond = event.data.samplesPerPixel / totalRenderTime;
  const megapixelsPerSecond =
    (samplesPerSecond * event.data.width * event.data.height) / 1_000_000;
  const stats = {
    // Round numbers to two digits after comma
    totalRenderTime: Math.round(totalRenderTime * 100) / 100,
    samplesPerSecond: Math.round(samplesPerSecond * 100) / 100,
    megapixelsPerSecond: Math.round(megapixelsPerSecond * 100) / 100,
  };

  postMessage({
    type: "lastframe",
    image,
    stats,
  });

  scene.free();
});

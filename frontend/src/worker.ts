import { Config, render } from "./wasm/light_simulation";

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

  const image = new ImageData(
    new Uint8ClampedArray(render(config)),
    event.data.width,
    event.data.height
  );

  postMessage(image, {
    transfer: [image.data.buffer],
  });
});

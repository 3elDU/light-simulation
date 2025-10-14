import instantiate, { Config, render } from "../assets/light_simulation";

await instantiate();
console.log("worker: wasm instantiated!");

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

import instantiate, { Config, render } from "../assets/light_simulation";

await instantiate();
console.log("worker: wasm instantiated!");

addEventListener("message", (event) => {
  const config = new Config(
    event.data.width,
    event.data.height,
    event.data.maxBounceCount,
    event.data.samplesPerPixel
  );

  const rendered = new Uint8ClampedArray(render(config));

  console.log(rendered, event.data.width, event.data.height);
  const image = new ImageData(rendered, event.data.width, event.data.height);

  postMessage(image, {
    transfer: [image.data.buffer],
  });
  postMessage(rendered);
});

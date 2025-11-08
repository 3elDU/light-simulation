import { MessageFromWorker, MessageToWorker } from "../models/ipc";
import { Config, Scene } from "../wasm/light_simulation";

// Type checked event dispatching
const emit = (event: MessageFromWorker, transferable: Transferable[] = []) => {
  console.debug("[worker] - message to main thread", event);
  postMessage(event, transferable);
};

emit({
  type: "loaded",
});

addEventListener("message", async (event: MessageEvent<MessageToWorker>) => {
  console.debug("[worker] - message from main thread", event.data);

  const cfg = event.data.settings;

  const config = new Config(
    cfg.width,
    cfg.height,
    cfg.maxBounceCount,
    cfg.samplesPerPixel
  );

  const scene = new Scene(config);
  const start = performance.now();
  let image: ImageData;

  for (let i = 0; i < cfg.samplesPerPixel; i++) {
    scene.sample();

    image = new ImageData(
      new Uint8ClampedArray(scene.get_image()),
      cfg.width,
      cfg.height
    );

    if (i != cfg.samplesPerPixel - 1) {
      emit(
        {
          type: "frame",
          progress: (i + 1) / cfg.samplesPerPixel,
          image,
        },
        [image.data.buffer]
      );
    }
  }

  const totalRenderTime = (performance.now() - start) / 1000;
  const samplesPerSecond = cfg.samplesPerPixel / totalRenderTime;
  const megapixelsPerSecond =
    (samplesPerSecond * cfg.width * cfg.height) / 1_000_000;
  const stats = {
    // Round numbers to two digits after comma
    totalRenderTime: Math.round(totalRenderTime * 100) / 100,
    samplesPerSecond: Math.round(samplesPerSecond * 100) / 100,
    megapixelsPerSecond: Math.round(megapixelsPerSecond * 100) / 100,
  };

  emit({
    type: "lastframe",
    image,
    stats,
  });

  scene.free();
});

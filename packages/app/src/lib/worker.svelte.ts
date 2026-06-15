import type { MessageFromWorker, MessageToWorker } from "@models/ipc";
import { render } from "./state.svelte";

let worker: Worker | undefined;

/**
 * (Re)load the worker
 */
export function load() {
  try {
    render.state = { state: "loading" };

    // terminate an existing worker, if it exists
    worker?.terminate();

    // Initialize WebAssembly worker
    worker = new Worker(new URL("../../../worker/src/index", import.meta.url), {
      name: "Wasm Worker",
      type: "module",
    });

    // Listen for events from worker
    worker.addEventListener("message", onMessage);
  } catch (e) {
    throw e;
  }
}

/**
 * Starts the rendering
 */
export async function startRender(preview = false) {
  render.fresh = false;

  let settings = $state.snapshot(render.settings);
  let objects = $state.snapshot(render.objects);

  if (preview) {
    settings = {
      ...settings,
      maxBounceCount: 16,
      samplesPerPixel: 1,
      width: Math.min(settings.width / 4, 160),
      height: Math.min(settings.height / 4, 90),
    };
  }

  worker?.postMessage({
    type: "renderRequest",
    objects: objects,
    settings: settings,
  } satisfies MessageToWorker);
  render.state = {
    state: "rendering",
    progress: 0,
  };
}

function onMessage(event: MessageEvent) {
  const data = event.data as MessageFromWorker;

  switch (data.type) {
    case "loaded":
      render.state = {
        state: "ready",
      };
      break;
    case "frame":
      render.state = {
        state: "rendering",
        progress: data.progress,
        image: data.image,
      };
      break;
    case "lastframe":
      render.state = {
        state: "finished",
        stats: data.stats,
        image: data.image,
      };
      break;
    case "error":
      render.state = {
        state: "error",
        error: data.error,
      };
      break;
  }
}

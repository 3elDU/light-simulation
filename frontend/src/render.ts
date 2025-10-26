import { TypedEventTarget } from "typescript-event-target";
import { RenderStats } from "./ui/model";

export interface RenderSettings {
  width: number;
  height: number;
  maxBounceCount: number;
  samplesPerPixel: number;
}

export type FrameEvent = CustomEvent<{
  image: ImageData;
  sample: number;
}>;

export type LastFrameEvent = CustomEvent<{
  image: ImageData;
  stats: RenderStats;
}>;

interface RenderEventMap {
  frame: FrameEvent;
  lastframe: LastFrameEvent;
  load: CustomEvent<{}>;
}

/** Abstracts communication with the worker that runs WebAssembly code */
export default class RenderController extends TypedEventTarget<RenderEventMap> {
  #worker?: Worker;

  constructor() {
    super();
  }

  /** [re]load the worker */
  async reset() {
    try {
      // terminate an existing worker, if it exists
      if (this.#worker) {
        this.#worker.terminate();
      }

      // Initialize WebAssembly worker
      this.#worker = new Worker(new URL("./worker/index.ts", import.meta.url), {
        name: "Wasm Worker",
        type: "module",
      });

      // Listen for events from worker
      this.#worker.addEventListener("message", this.#onMessage.bind(this));
    } catch (e) {
      throw e;
    }
  }

  #onMessage(event: MessageEvent) {
    if (event.data.type === "loaded") {
      this.dispatchTypedEvent("load", new CustomEvent("load"));
    } else if (event.data.type === "frame") {
      this.dispatchTypedEvent(
        "frame",
        new CustomEvent("frame", {
          detail: event.data,
        })
      );
    } else if (event.data.type === "lastframe") {
      this.dispatchTypedEvent(
        "lastframe",
        new CustomEvent("lastframe", {
          detail: event.data,
        })
      );
    }
  }

  async startRender(opts: RenderSettings) {
    this.#worker.postMessage(opts);
  }

  /** Starts rendering. Rendered frames are sent in 'frame' events */
  async render(opts: RenderSettings) {
    this.#worker.postMessage(opts);
  }
}

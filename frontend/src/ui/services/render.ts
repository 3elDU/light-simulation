import { TypedEventTarget } from "typescript-event-target";
import { RenderSettings, RenderState, RenderStats } from "../../models/render";
import { MessageFromWorker, MessageToWorker } from "../../models/ipc";
import { SceneObject } from "../../models/object";

export type FrameEvent = CustomEvent<{
  image: ImageData;
  sample: number;
}>;

export type LastFrameEvent = CustomEvent<{
  image: ImageData;
  stats: RenderStats;
}>;

export type RenderStateChangeEvent = CustomEvent<RenderState>;

interface RenderEventMap {
  frame: FrameEvent;
  lastframe: LastFrameEvent;
  load: CustomEvent<{}>;
  statechange: RenderStateChangeEvent;
}

/** Abstracts communication with the worker that runs WebAssembly code */
export default class RenderService extends TypedEventTarget<RenderEventMap> {
  #worker?: Worker;
  #state: RenderState;

  get state() {
    return this.#state;
  }
  private set state(newState) {
    this.#state = newState;
    this.dispatchTypedEvent(
      "statechange",
      new CustomEvent("statechange", {
        detail: newState,
      })
    );
  }

  constructor() {
    super();

    this.state = { state: "loading" };
  }

  /** [re]load the worker */
  async load() {
    try {
      this.state = { state: "loading" };

      // terminate an existing worker, if it exists
      if (this.#worker) {
        this.#worker.terminate();
      }

      // Initialize WebAssembly worker
      this.#worker = new Worker(
        new URL("/src/worker/index.ts", import.meta.url),
        {
          name: "Wasm Worker",
          type: "module",
        }
      );

      // Listen for events from worker
      this.#worker.addEventListener("message", this.#onMessage.bind(this));
    } catch (e) {
      throw e;
    }
  }

  #onMessage(event: MessageEvent) {
    const data = event.data as MessageFromWorker;

    switch (data.type) {
      case "loaded":
        this.state = {
          state: "ready",
        };
        break;
      case "frame":
        this.state = {
          state: "rendering",
          progress: data.progress,
          image: data.image,
        };
        break;
      case "lastframe":
        this.state = {
          state: "finished",
          stats: data.stats,
          image: data.image,
        };
        break;
    }
  }

  /** Starts rendering. Rendered frames are sent in 'frame' events */
  async render(settings: RenderSettings, objects: SceneObject[]) {
    this.#worker.postMessage({
      type: "renderRequest",
      objects,
      settings,
    } satisfies MessageToWorker);
    this.state = {
      state: "rendering",
      progress: 0,
    };
  }
}

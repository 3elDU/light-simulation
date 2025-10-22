export interface RenderSettings {
  width: number;
  height: number;
  maxBounceCount: number;
  samplesPerPixel: number;
}

/** Abstracts communication with the worker that runs WebAssembly code */
export default class RenderController {
  #worker: Worker;
  #resolve?: (image: ImageData) => void;
  #reject?: (error: string) => void;

  constructor(worker: Worker) {
    this.#worker = worker;
    this.#worker.addEventListener("message", this.#handleMessage.bind(this));
    this.#worker.addEventListener("error", this.#handleError.bind(this));
    this.#worker.addEventListener("messageerror", this.#handleError.bind(this));
  }

  #handleMessage(event: MessageEvent) {
    if (this.#resolve && event.data instanceof ImageData) {
      this.#resolve(event.data);
      this.#clearHandlers();
    }
  }

  #handleError(event: Event) {
    if (this.#reject) {
      this.#reject("Error inside a Worker");
      this.#clearHandlers();
    }
  }

  #clearHandlers() {
    this.#resolve = undefined;
    this.#reject = undefined;
  }

  render(opts: RenderSettings): Promise<ImageData> {
    this.#worker.postMessage(opts);

    return new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }
}

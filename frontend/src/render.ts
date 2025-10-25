export interface RenderSettings {
  width: number;
  height: number;
  maxBounceCount: number;
  samplesPerPixel: number;
}

/** Abstracts communication with the worker that runs WebAssembly code */
export default class RenderController {
  #worker?: Worker;
  #onMessage?: (data: unknown) => void;
  #onError?: (error: string) => void;

  async load() {
    try {
      // Initialize WebAssembly worker
      this.#worker = new Worker(new URL("./worker.ts", import.meta.url), {
        name: "Wasm Worker",
        type: "module",
      });

      this.#registerListeners();

      // Wait for the "loaded" event
      return new Promise<true>((resolve, reject) => {
        setTimeout(
          () => reject("Timeout reached while waiting for worker to load"),
          30_000
        );

        this.#onMessage = () => {
          resolve(true);
        };
        this.#onError = reject;
      });
    } catch (e) {
      throw e;
    }
  }

  #registerListeners() {
    this.#worker.addEventListener("message", this.#handleMessage.bind(this));
    this.#worker.addEventListener("error", this.#handleError.bind(this));
    this.#worker.addEventListener("messageerror", this.#handleError.bind(this));
  }

  #handleMessage(event: MessageEvent) {
    this.#onMessage(event.data);
    this.#clearHandlers();
  }

  #handleError(event: Event) {
    if (this.#onError) {
      this.#onError("Unknown error inside a Worker. Check the devtools.");
      this.#clearHandlers();
    }
  }

  #clearHandlers() {
    this.#onMessage = undefined;
    this.#onError = undefined;
  }

  render(opts: RenderSettings): Promise<ImageData> {
    this.#worker.postMessage(opts);

    return new Promise((resolve, reject) => {
      this.#onMessage = resolve;
      this.#onError = reject;
    });
  }
}

export interface RenderSettings {
  width: number;
  height: number;
  maxBounceCount: number;
  samplesPerPixel: number;
}

interface RenderResponse {
  image: ImageData;
  sample: number;
}

/** Abstracts communication with the worker that runs WebAssembly code */
export default class RenderController {
  #worker?: Worker;

  async load() {
    try {
      // Initialize WebAssembly worker
      this.#worker = new Worker(new URL("./worker/index.ts", import.meta.url), {
        name: "Wasm Worker",
        type: "module",
      });

      let timeout = setTimeout(() => {
        throw new Error("Timeout reached while waiting for worker to load");
      }, 30_000);

      // Wait for the "loaded" event
      await this.#waitForMessage();
      clearTimeout(timeout);
    } catch (e) {
      throw e;
    }
  }

  #waitForMessage() {
    return new Promise<any>((resolve, reject) => {
      this.#worker.addEventListener(
        "message",
        (event) => {
          resolve(event.data);
        },
        { once: true }
      );
      this.#worker.addEventListener(
        "error",
        () => {
          reject("Error inside worker");
        },
        { once: true }
      );
    });
  }

  async *render(opts: RenderSettings): AsyncGenerator<RenderResponse> {
    this.#worker.postMessage(opts);

    for (let i = 0; i < opts.samplesPerPixel; i++) {
      const message = (await this.#waitForMessage()) as RenderResponse;
      yield message;
    }
  }
}

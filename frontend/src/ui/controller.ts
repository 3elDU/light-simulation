import RenderController from "../render";
import elements from "./elements";
import {
  getDefaultModel,
  RenderState,
  RenderStats,
  UIModel,
  UINumberInputKey,
} from "./model";

export default class UIController {
  #model: UIModel;
  #ctx: CanvasRenderingContext2D;
  #renderController: RenderController;

  constructor() {
    this.#model = getDefaultModel();
    this.#ctx = elements.outputCanvas.getContext("2d");
    this.#renderController = new RenderController();

    this.registerEvents();
    this.update();
  }

  async load() {
    try {
      await this.#renderController.load();
      this.#setState({
        state: "ready",
      });
    } catch (error) {
      this.#setState({
        state: "error",
        error: error,
      });
      throw error;
    }
  }

  registerEvents() {
    const makeInputListener = (key: UINumberInputKey) => {
      return (event: Event) => {
        this.#handleNumberChange(key, (event.target as HTMLInputElement).value);
      };
    };

    const elementKeyPairs: [HTMLInputElement, UINumberInputKey][] = [
      [elements.widthInput, "width"],
      [elements.heightInput, "height"],
      [elements.samplesPerPixelInput, "samplesPerPixel"],
      [elements.maxBounceCountInput, "maxBounceCount"],
    ];

    for (const [el, key] of elementKeyPairs) {
      el.addEventListener("input", makeInputListener(key));
    }

    elements.renderButton.addEventListener(
      "click",
      this.#handleRender.bind(this)
    );
  }

  #handleNumberChange(key: UINumberInputKey, newValue: string) {
    const num = Number.parseInt(newValue);

    if (!Number.isNaN(num)) {
      this.#model[key] = num;
    }
  }

  async #handleRender() {
    try {
      this.#setState({
        state: "rendering",
        progress: 0,
      });

      let image: ImageData;
      const start = performance.now();

      for await (const response of this.#renderController.render(this.#model)) {
        this.#setState({
          state: "rendering",
          progress: (response.sample / this.#model.samplesPerPixel) * 100,
          image: response.image,
        });

        image = response.image;
      }

      const totalRenderTime = (performance.now() - start) / 1000;
      const samplesPerSecond = this.#model.samplesPerPixel / totalRenderTime;
      const megapixelsPerSecond =
        (samplesPerSecond * this.#model.width * this.#model.height) / 1_000_000;
      const stats: RenderStats = {
        // Round numbers to two digits after comma
        totalRenderTime: Math.round(totalRenderTime * 100) / 100,
        samplesPerSecond: Math.round(samplesPerSecond * 100) / 100,
        megapixelsPerSecond: Math.round(megapixelsPerSecond * 100) / 100,
      };

      this.#setState({
        state: "finished",
        image: image,
        stats,
      });
    } catch (e) {
      console.error(e);
      this.#setState({
        state: "error",
        error: e,
      });
    }
  }

  #setState(newState: RenderState) {
    this.#model.render = newState;
    this.update();
  }

  /** Update UI from model */
  update() {
    const state = this.#model.render;

    switch (state.state) {
      case "loading":
        elements.renderButton.disabled = true;
        elements.skipButton.disabled = true;
        elements.mainContainer.dataset.state = "empty";
        break;
      case "ready":
        elements.renderButton.disabled = false;
        elements.skipButton.disabled = true;
        elements.mainContainer.dataset.state = "empty";
        break;
      case "rendering":
        elements.renderButton.disabled = true;
        elements.skipButton.disabled = false;
        elements.mainContainer.dataset.state = "rendering";

        elements.progressBar.ariaValueNow = state.progress.toString();
        (
          elements.progressBar.children[0] as HTMLElement
        ).style.width = `${state.progress}%`;

        if (state.image) {
          elements.outputCanvas.width = state.image.width;
          elements.outputCanvas.height = state.image.height;
          this.#ctx.putImageData(state.image, 0, 0);
        }

        break;
      case "finished":
        elements.renderButton.disabled = false;
        elements.skipButton.disabled = true;
        elements.mainContainer.dataset.state = "has-image";

        elements.outputCanvas.width = state.image.width;
        elements.outputCanvas.height = state.image.height;
        this.#ctx.putImageData(state.image, 0, 0);

        elements.infoTitleText.textContent = `${state.stats.totalRenderTime}s render time`;
        elements.infoSupportingText.textContent = `${state.image.width} x ${state.image.height} image, ${state.stats.samplesPerSecond} samples/sec, ${state.stats.megapixelsPerSecond} MP/sec`;

        break;
      case "error":
        elements.mainContainer.dataset.state = "error";
        elements.errorText.textContent = `Error: ${state.error}`;
        break;
    }

    // Update inputs from model
    elements.widthInput.value = this.#model.width.toString();
    elements.heightInput.value = this.#model.height.toString();
    elements.maxBounceCountInput.value = this.#model.maxBounceCount.toString();
    elements.samplesPerPixelInput.value =
      this.#model.samplesPerPixel.toString();
  }
}

import RenderController from "../render";
import elements from "./elements";
import {
  getDefaultModel,
  RenderState,
  UIModel,
  UINumberInputKey,
} from "./model";

export default class UIController {
  #model: UIModel;
  #ctx: CanvasRenderingContext2D;
  #renderController: RenderController;

  constructor(renderController: RenderController) {
    this.#model = getDefaultModel();
    this.#ctx = elements.outputCanvas.getContext("2d");
    this.#renderController = renderController;

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
      console.log("number changed", key, num);
      this.#model[key] = num;
    }
  }

  async #handleRender() {
    try {
      this.#setState({
        state: "rendering",
        progress: 25,
      });

      const image = await this.#renderController.render(this.#model);

      this.#setState({
        state: "finished",
        image: image,
      });
    } catch (e) {
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
        break;
      case "finished":
        elements.renderButton.disabled = false;
        elements.skipButton.disabled = true;
        elements.mainContainer.dataset.state = "has-image";

        elements.outputCanvas.width = state.image.width;
        elements.outputCanvas.height = state.image.height;
        this.#ctx.putImageData(state.image, 0, 0);

        elements.sampleCountText.textContent = `${
          this.#model.samplesPerPixel
        } samples`;
        elements.resolutionText.textContent = `${state.image.width} x ${state.image.height} image`;

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

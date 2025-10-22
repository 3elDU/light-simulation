import RenderController from "../render";
import elements from "./elements";
import { getDefaultModel, UIModel, UINumberInputKey } from "./model";

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

  registerEvents() {
    const makeListener = (key: UINumberInputKey) => {
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
      el.addEventListener("input", makeListener(key));
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
      const image = await this.#renderController.render(this.#model);
      this.#model.renderingProgress = 100;
      this.#model.image = image;
    } catch (e) {
      this.#model.error = e as string;
    } finally {
      this.update();
    }
  }

  /** Update UI from model */
  update() {
    elements.widthInput.value = this.#model.width.toString();
    elements.heightInput.value = this.#model.height.toString();
    elements.maxBounceCountInput.value = this.#model.maxBounceCount.toString();
    elements.samplesPerPixelInput.value =
      this.#model.samplesPerPixel.toString();

    if (this.#model.image) {
      elements.sampleCountText.textContent = `${
        this.#model.samplesPerPixel
      } samples`;
      elements.resolutionText.textContent = `${this.#model.image.width} x ${
        this.#model.image.height
      } image`;
    }

    if (this.#model.renderingProgress) {
      elements.progressBar.ariaValueNow =
        this.#model.renderingProgress.toString();
      (elements.progressBar.children[0] as HTMLElement).style.width = `${
        this.#model.renderingProgress
      }%`;

      if (this.#model.renderingProgress < 100) {
        elements.mainContainer.dataset.state = "rendering";
      } else if (this.#model.renderingProgress === 100) {
        elements.mainContainer.dataset.state = "has-image";
      }
    }

    if (this.#model.error) {
      elements.mainContainer.dataset.state = "error";
      elements.errorText.textContent = `Error: ${this.#model.error}`;
    }

    if (this.#model.image) {
      elements.outputCanvas.width = this.#model.image.width;
      elements.outputCanvas.height = this.#model.image.height;
      this.#ctx.putImageData(this.#model.image, 0, 0);
    }
  }
}

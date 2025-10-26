import Panzoom, { PanzoomObject } from "@panzoom/panzoom";
import RenderController, { FrameEvent, LastFrameEvent } from "../render";
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
  #render: RenderController;
  #panzoom: PanzoomObject;

  #panzoomEventsRegistered = false;

  constructor() {
    this.#model = getDefaultModel();
    this.#ctx = elements.outputCanvas.getContext("2d");
    this.#render = new RenderController();
    this.#panzoom = Panzoom(elements.outputCanvas, {
      minScale: 0.5,
      maxScale: 8,
      step: 0.1,
      canvas: true,
    });

    this.#registerEvents();
    this.update();

    this.#render.reset();
  }

  /** Called when renderer worker has finished loading */
  #onload() {
    this.#setState({
      state: "ready",
    });
  }

  /** Called when a new frame has arrived from renderer */
  #onframe(event: FrameEvent) {
    this.#setState({
      state: "rendering",
      progress: (event.detail.sample / this.#model.samplesPerPixel) * 100,
      image: event.detail.image,
    });
    this.#registerPanZoomEvents();
  }

  /** Called when the last frame has finished rendering */
  #onlastframe(event: LastFrameEvent) {
    this.#setState({
      state: "finished",
      image: event.detail.image,
      stats: event.detail.stats,
    });
  }

  #registerEvents() {
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

    // Register number input event listeners
    for (const [el, key] of elementKeyPairs) {
      el.addEventListener("input", makeInputListener(key));
    }

    // Register button event listeners
    elements.renderButton.addEventListener(
      "click",
      this.#handleRender.bind(this)
    );
    elements.skipButton.addEventListener("click", this.#handleSkip.bind(this));
    elements.downloadButton.addEventListener(
      "click",
      this.#handleSave.bind(this)
    );
    elements.fullscreenButton.addEventListener(
      "click",
      this.#handleFullscreen.bind(this)
    );

    // Register render event listeners
    this.#render.addEventListener("load", this.#onload.bind(this));
    this.#render.addEventListener("frame", this.#onframe.bind(this));
    this.#render.addEventListener("lastframe", this.#onlastframe.bind(this));
  }

  /** Those events will only be registered once the canvas has appeared on screen */
  #registerPanZoomEvents() {
    if (this.#panzoomEventsRegistered) return;

    // Allow panning and zooming the canvas
    elements.canvasContainer.addEventListener(
      "wheel",
      this.#panzoom.zoomWithWheel
    );
    // Hide the informational badge when canvas is interacted with
    elements.outputCanvas.addEventListener(
      "panzoomzoom",
      this.#handlePanZoom.bind(this)
    );
    elements.outputCanvas.addEventListener(
      "panzoompan",
      this.#handlePanZoom.bind(this)
    );

    this.#panzoomEventsRegistered = true;
  }

  #handleNumberChange(key: UINumberInputKey, newValue: string) {
    const num = Number.parseInt(newValue);

    if (!Number.isNaN(num)) {
      this.#model[key] = num;
    }
  }

  async #handleRender() {
    this.#render.startRender(this.#model);
    this.#setState({
      state: "rendering",
      progress: 0,
    });
  }

  async #handleSkip() {
    this.#render.reset();
    this.#setState({
      state: "loading",
    });
  }

  #handleSave() {
    elements.outputCanvas.toBlob((blob) => {
      if (!blob) {
        this.#setState({
          state: "error",
          error: "Failed to extract image from canvas",
        });
        return;
      }

      const url = URL.createObjectURL(blob);

      console.log(blob.size, url);

      const a = document.createElement("a");
      a.download = "image.png";
      a.href = url;
      a.click();

      a.remove();
      URL.revokeObjectURL(url);
    }, "image/png");
  }

  #handleFullscreen() {
    if (elements.canvasContainer.requestFullscreen) {
      elements.canvasContainer.requestFullscreen();
    } else {
      alert("Fullscreen API is not available on your device");
    }
  }

  #handlePanZoom() {
    elements.panzoomBadge.classList.add("hidden");
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

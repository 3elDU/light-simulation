import Panzoom, { PanzoomObject } from "@panzoom/panzoom";
import {
  getDefaultSettings,
  RenderSettings,
  RenderState,
} from "../../models/render";
import elements from "../elements";
import RenderService from "../services/render";
import { SceneService } from "../services/scene";

type UINumberInputKey =
  | "width"
  | "height"
  | "maxBounceCount"
  | "samplesPerPixel";

export default class RenderController {
  #scene: SceneService;
  #render: RenderService;
  #settings: RenderSettings;

  #ctx: CanvasRenderingContext2D;
  #panzoom: PanzoomObject;
  #panzoomEventsRegistered = false;

  constructor(sceneService: SceneService) {
    this.#scene = sceneService;
    this.#settings = getDefaultSettings();
    this.#ctx = elements.outputCanvas.getContext("2d");
    this.#render = new RenderService();
    this.#panzoom = Panzoom(elements.outputCanvas, {
      minScale: 0.5,
      maxScale: 8,
      step: 0.1,
      canvas: true,
    });

    this.#registerEvents();
    this.#render.load();
  }

  /** Called when scene is changed */
  #onupdated() {
    if (!elements.quickPreviewCheckbox.checked) return;
  }

  #registerEvents() {
    // Subscribe to render state changes
    this.#render.addEventListener("statechange", (event) => {
      if (event.detail.state === "rendering") {
        this.#registerPanZoomEvents();
      }

      this.update(event.detail);
    });

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
    elements.renderButton.addEventListener("click", () => {
      this.#render.render(this.#settings, this.#scene.all());
    });
    elements.skipButton.addEventListener("click", () => {
      this.#render.load();
    });
    elements.downloadButton.addEventListener(
      "click",
      this.#handleSave.bind(this)
    );
    elements.fullscreenButton.addEventListener(
      "click",
      this.#handleFullscreen.bind(this)
    );

    // Render quick preview when scene is changed
    this.#scene.addEventListener("updated", this.#onupdated.bind(this));
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
      this.#settings[key] = num;
    }
  }

  #handleSave() {
    elements.outputCanvas.toBlob((blob) => {
      if (!blob) {
        this.showError("Failed to extract image from canvas");
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

  /** Update UI from model */
  update(state: RenderState) {
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

        // Convert into a scale from 0 to 100
        const progress = Math.round(state.progress * 100);

        elements.progressBar.ariaValueNow = progress.toString();
        (
          elements.progressBar.children[0] as HTMLElement
        ).style.width = `${progress}%`;

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
        this.showError(state.error);
    }

    // Update inputs from model
    elements.widthInput.value = this.#settings.width.toString();
    elements.heightInput.value = this.#settings.height.toString();
    elements.maxBounceCountInput.value =
      this.#settings.maxBounceCount.toString();
    elements.samplesPerPixelInput.value =
      this.#settings.samplesPerPixel.toString();
  }

  showError(error: string) {
    elements.mainContainer.dataset.state = "error";
    elements.errorText.textContent = `Error: ${error}`;
  }
}

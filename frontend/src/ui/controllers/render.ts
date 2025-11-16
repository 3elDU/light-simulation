import Panzoom, { PanzoomObject } from "@panzoom/panzoom";
import { RenderState } from "../../models/render";
import elements from "../elements";
import RenderService from "../services/render";
import { SceneService } from "../services/scene";
import { setValueOnPositionInput } from "../helpers/dom";

type UINumberInputKey =
  | "width"
  | "height"
  | "maxBounceCount"
  | "samplesPerPixel";

export default class RenderController {
  #scene: SceneService;
  #render: RenderService;

  #ctx: CanvasRenderingContext2D;
  #panzoom: PanzoomObject;
  #panzoomEventsRegistered = false;

  constructor(sceneService: SceneService) {
    this.#scene = sceneService;
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

  #quickPreview() {
    if (!elements.quickPreviewCheckbox.checked) return;

    this.#render.render(
      {
        ...this.#scene.settings,
        maxBounceCount: 16,
        samplesPerPixel: 1,
        width: Math.min(this.#scene.settings.width / 4, 160),
        height: Math.min(this.#scene.settings.height / 4, 90),
      },
      this.#scene.objects
    );
  }

  #registerEvents() {
    // Subscribe to render state changes
    this.#render.addEventListener("statechange", (event) => {
      if (event.detail.state === "rendering") {
        this.#registerPanZoomEvents();
      }

      this.update(event.detail);
    });

    // Register camera position input listeners
    elements.cameraXInput.addEventListener(
      "change",
      this.#handleCameraPositionChange.bind(this)
    );
    elements.cameraYInput.addEventListener(
      "change",
      this.#handleCameraPositionChange.bind(this)
    );
    elements.cameraZInput.addEventListener(
      "change",
      this.#handleCameraPositionChange.bind(this)
    );

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
      el.addEventListener("change", makeInputListener(key));
    }

    // Register button event listeners
    elements.renderButton.addEventListener("click", () => {
      this.#render.render(this.#scene.settings, this.#scene.objects);
    });
    elements.skipButton.addEventListener("click", () => {
      this.#render.load();
    });
    elements.resetButton.addEventListener("click", () => this.#scene.reset());
    elements.downloadButton.addEventListener(
      "click",
      this.#handleSave.bind(this)
    );
    elements.fullscreenButton.addEventListener(
      "click",
      this.#handleFullscreen.bind(this)
    );

    // Render quick preview when scene is changed
    this.#scene.addEventListener("updated", this.#quickPreview.bind(this));
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

  #handleCameraPositionChange() {
    const x = Number.parseFloat(elements.cameraXInput.value);
    const y = Number.parseFloat(elements.cameraYInput.value);
    const z = Number.parseFloat(elements.cameraZInput.value);

    this.#scene.settings = {
      ...this.#scene.settings,
      cameraPosition: { x, y, z },
    };
  }

  #handleNumberChange(key: UINumberInputKey, newValue: string) {
    const num = Number.parseInt(newValue);

    if (!Number.isNaN(num)) {
      this.#scene.settings = {
        ...this.#scene.settings,
        [key]: num,
      };
    }
  }

  #handleSave() {
    elements.outputCanvas.toBlob((blob) => {
      if (!blob) {
        this.showError("Failed to extract image from canvas");
        return;
      }

      const url = URL.createObjectURL(blob);

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
        elements.renderButton.disabled = false;
        elements.skipButton.disabled = true;

        this.showError(state.error);

        break;
    }

    // Update inputs from model
    setValueOnPositionInput(this.#scene.settings.cameraPosition, [
      elements.cameraXInput,
      elements.cameraYInput,
      elements.cameraZInput,
    ]);
    setValueOnPositionInput(this.#scene.settings.lookingAt, [
      elements.lookXInput,
      elements.lookYInput,
      elements.lookZInput,
    ]);

    elements.widthInput.value = this.#scene.settings.width.toString();
    elements.heightInput.value = this.#scene.settings.height.toString();
    elements.maxBounceCountInput.value =
      this.#scene.settings.maxBounceCount.toString();
    elements.samplesPerPixelInput.value =
      this.#scene.settings.samplesPerPixel.toString();
  }

  showError(error: string) {
    elements.mainContainer.dataset.state = "error";
    elements.errorText.textContent = `Error: ${error}`;
  }
}

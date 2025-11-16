import { TypedEventTarget } from "typescript-event-target";
import { getDefaultScene, SceneObject } from "../../models/object";
import { getDefaultSettings, RenderSettings } from "../../models/render";

/** Manages scene with its objects and settings */
export class SceneService extends TypedEventTarget<{
  updated: Event;
  reset: Event;
}> {
  #scene: SceneObject[] = [];
  #settings: RenderSettings = getDefaultSettings();

  reset() {
    localStorage.removeItem("savedScene");

    this.#scene = getDefaultScene();
    this.#settings = getDefaultSettings();

    this.markUpdated();
    this.dispatchTypedEvent("reset", new Event("reset"));
  }

  constructor() {
    super();

    // Try to load saved scene
    const saved = localStorage.getItem("savedScene");
    if (!saved) return;

    try {
      const savedParsed = JSON.parse(saved);

      this.#scene = savedParsed.scene;
      this.#settings = savedParsed.settings;

      console.info("[scene] loaded a saved scene from localStorage");
      this.markUpdated();
    } catch (e) {
      console.info(
        "[scene] no saved scene in localStorage, starting with a fresh one"
      );
    }
  }

  add(object: SceneObject) {
    const idx = this.#scene.length;
    this.#scene.push(object);
    this.markUpdated();
    return idx;
  }
  get objects() {
    return this.#scene;
  }
  get(idx: number) {
    return this.#scene.at(idx);
  }
  delete(idx: number) {
    this.#scene.splice(idx, 1);
    this.markUpdated();
  }
  clear() {
    this.#scene = [];
    this.markUpdated();
  }

  get settings() {
    return this.#settings;
  }
  set settings(settings) {
    this.#settings = settings;
    this.markUpdated();
  }

  markUpdated() {
    // Save settings to local storage
    localStorage.setItem(
      "savedScene",
      JSON.stringify({
        scene: this.#scene,
        settings: this.#settings,
      })
    );

    this.dispatchTypedEvent("updated", new Event("updated"));
  }
}

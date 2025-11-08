import { TypedEventTarget } from "typescript-event-target";
import { SceneObject } from "../../models/object";

/** Manages objects on the scene */
export class SceneService extends TypedEventTarget<{
  updated: Event;
}> {
  #scene: SceneObject[] = [];

  constructor() {
    super();
  }

  add(object: SceneObject) {
    const idx = this.#scene.length;
    this.#scene.push(object);
    this.markUpdated();
    return idx;
  }
  all() {
    return this.#scene;
  }
  get(idx: number) {
    return this.#scene.at(idx);
  }
  delete(idx: number) {
    delete this.#scene[idx];
    this.markUpdated();
  }
  clear() {
    this.#scene = [];
    this.markUpdated();
  }

  markUpdated() {
    this.dispatchTypedEvent("updated", new Event("updated"));
  }
}

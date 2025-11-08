import newEmpty, { SceneObject } from "../../models/object";
import elements from "../elements";
import { onNestedEvent } from "../helpers/dom";
import { SceneService } from "../services/scene";

const extractIndex = (event: Event) =>
  Number.parseInt(
    (event.target as HTMLElement).closest<HTMLElement>(".object").dataset.idx
  );

export default class ObjectEditorController {
  #scene: SceneService;

  constructor(sceneService: SceneService) {
    this.#scene = sceneService;

    this.#addListeners();
  }

  #addListeners() {
    // Add new object / clear all object buttons
    elements.addObjectButton.addEventListener(
      "click",
      this.#addObject.bind(this)
    );
    elements.clearObjectsButton.addEventListener(
      "click",
      this.#clearObjects.bind(this)
    );

    // Input events on all input fields
    for (const [selector, property] of [
      [".x-input", "x"],
      [".y-input", "y"],
      [".z-input", "z"],
      [".radius-input", "radius"],
      [".color-input", "color"],
      [".emission-input", "emission"],
    ] as [string, keyof SceneObject][]) {
      onNestedEvent<InputEvent>(
        elements.objectList,
        "input",
        selector,
        (event) => {
          this.#setNumericProperty(event, property);
        }
      );
    }

    // Remove specific object
    onNestedEvent(elements.objectList, "click", ".delete-btn", (event) =>
      this.#removeObject(event)
    );
  }

  #addObject() {
    const idx = this.#scene.add(newEmpty());

    const cloned = elements.objectTemplate.content.cloneNode(
      true
    ) as DocumentFragment;
    const li = cloned.querySelector("li");

    li.dataset.idx = idx.toString();
    elements.objectList.appendChild(li);
  }

  #clearObjects() {
    this.#scene.clear();

    // clear element children
    elements.objectList.querySelectorAll("li").forEach((li) => li.remove());
  }

  #removeObject(event: Event) {
    const idx = extractIndex(event);

    this.#scene.delete(idx);
    elements.objectList.querySelector(`.object[data-idx="${idx}"]`).remove();
  }

  #setNumericProperty<K extends keyof SceneObject>(
    event: InputEvent,
    property: K
  ) {
    const obj = this.#scene.get(extractIndex(event));
    const value = (event.target as HTMLInputElement).value;

    if (typeof obj[property] === "number") {
      obj[property] = Number.parseInt(value) as SceneObject[K];
    } else {
      obj[property] = value as SceneObject[K];
    }

    this.#scene.markUpdated();
  }
}

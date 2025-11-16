import { newEmpty, SceneObject } from "../../models/object";
import elements from "../elements";
import { cssColorToHex, hexToCssColor } from "../helpers/color";
import { onNestedEvent, setValueOnInput } from "../helpers/dom";
import { SceneService } from "../services/scene";

const extractIndex = (event: Event) =>
  Number.parseInt(
    (event.target as HTMLElement).closest<HTMLElement>(".object").dataset.idx
  );

function createObjectEl(idx?: number): HTMLLIElement {
  const cloned = elements.objectTemplate.content.cloneNode(
    true
  ) as DocumentFragment;
  const li = cloned.querySelector("li");

  if (idx) {
    li.dataset.idx = idx.toString();
  }

  elements.objectList.appendChild(li);

  return li;
}

export default class ObjectEditorController {
  #scene: SceneService;

  constructor(sceneService: SceneService) {
    this.#scene = sceneService;

    this.#addListeners();
    this.#load();
  }

  // Loads previously saved objects
  #load() {
    const objects = this.#scene.objects;

    for (const [i, obj] of objects.entries()) {
      const li = createObjectEl(i);

      setValueOnInput(li, ".x-input", obj.x);
      setValueOnInput(li, ".y-input", obj.y);
      setValueOnInput(li, ".z-input", obj.z);
      setValueOnInput(li, ".radius-input", obj.radius);
      setValueOnInput(li, "input.color-input", hexToCssColor(obj.color));
      setValueOnInput(li, ".emission-input", obj.emission);
    }
  }

  #addListeners() {
    // Listen to scene reset event
    this.#scene.addEventListener("reset", () => {
      elements.objectList.querySelectorAll("li").forEach((li) => li.remove());
      this.#load();
    });

    // Add new object / clear all object buttons
    elements.addObjectButton.addEventListener(
      "click",
      this.#addObject.bind(this)
    );
    elements.clearObjectsButton.addEventListener(
      "click",
      this.#clearObjects.bind(this)
    );

    // Events from numeric inputs
    for (const [selector, property] of [
      [".x-input", "x"],
      [".y-input", "y"],
      [".z-input", "z"],
      [".radius-input", "radius"],
      [".emission-input", "emission"],
    ] as const) {
      onNestedEvent<InputEvent>(
        elements.objectList,
        "input",
        selector,
        (event) => {
          this.#setNumericProperty(event, property);
        }
      );
    }

    // Parse color values before setting them on the model
    onNestedEvent<InputEvent>(
      elements.objectList,
      "input",
      ".color-input",
      (event) => this.#setColor(event)
    );

    // Remove specific object
    onNestedEvent(elements.objectList, "click", ".delete-btn", (event) =>
      this.#removeObject(event)
    );
  }

  #addObject() {
    const idx = this.#scene.add(newEmpty());

    createObjectEl(idx);
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

  #setNumericProperty<K extends "x" | "y" | "z" | "radius" | "emission">(
    event: InputEvent,
    property: K
  ) {
    const obj = this.#scene.get(extractIndex(event));
    const value = (event.target as HTMLInputElement).value;

    obj[property] = Number.parseInt(value) as SceneObject[K];

    this.#scene.markUpdated();
  }

  #setColor(event: InputEvent) {
    const obj = this.#scene.get(extractIndex(event));
    const value = (event.target as HTMLInputElement).value;

    const color = cssColorToHex(value);
    if (!color) {
      console.warn("color cannot be parsed", value);
      return;
    }

    obj.color = color;
    this.#scene.markUpdated();
  }
}

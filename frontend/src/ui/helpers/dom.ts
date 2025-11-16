import { Position } from "../../models/position";

/**
 * Listens for events from nested element(s) matching a selector,
 * and calls a handler for them providing the event object
 */
export function onNestedEvent<T extends Event>(
  element: Element,
  type: string,
  selector: string,
  callback: (event: T) => void
) {
  element.addEventListener(type, (event: T) => {
    const target = event.target as HTMLElement;

    if (!target.matches(selector)) return;

    callback(event);
  });
}

/**
 * Replaces text content in a child of element matching a selector
 */
export function setTextOnChild(
  element: Element,
  selector: string,
  text: string
) {
  const el = element.querySelector(selector);
  if (el) {
    el.textContent = text;
  }
}

/**
 * Replaces value on input element that is a child of element that matches
 * the given selector
 */
export function setValueOnInput(
  parent: Element,
  selector: string,
  value: string | number
) {
  const el = parent.querySelector(selector);
  if (el && "value" in el) {
    el.value = typeof value === "number" ? value.toString() : value;
  }
}

/**
 * Replaces value on XYZ inputs with coordinates from the given position
 */
export function setValueOnPositionInput(
  position: Position,
  values: [HTMLInputElement, HTMLInputElement, HTMLInputElement]
) {
  values[0].value = position.x.toString();
  values[1].value = position.y.toString();
  values[2].value = position.z.toString();
}

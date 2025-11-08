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

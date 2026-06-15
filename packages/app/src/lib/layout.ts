import { browser } from "$app/env";

// Browser check because window doesn't exist on the server
export const isNarrowScreen = (browser &&
  window.matchMedia("(max-width: 1024px)")) as MediaQueryList;

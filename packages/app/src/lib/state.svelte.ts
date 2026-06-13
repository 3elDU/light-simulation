import { getDefaultScene } from "@models/object";
import { getDefaultSettings, type RenderState } from "@models/render";
import { startRender } from "./worker.svelte";

export const render = $state({
  settings: getDefaultSettings(),
  state: { state: "loading" } as RenderState,
  objects: getDefaultScene(),
  quickPreview: false,
});

$effect.root(() => {
  $effect(() => {
    console.log("effect running!");
    if (render.quickPreview) {
      startRender(true);
    }
  });
});

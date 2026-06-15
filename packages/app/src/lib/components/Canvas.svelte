<script lang="ts">
  import { isNarrowScreen } from "$lib/layout";
  import { render } from "$lib/state.svelte";
  import { on } from "svelte/events";

  let error = $state("");
  let ctx: ImageBitmapRenderingContext | null = null;
  let canvas = $state<HTMLCanvasElement | undefined>();

  function attachCanvas(canvas: HTMLCanvasElement) {
    ctx = canvas.getContext("bitmaprenderer");

    if (!ctx) {
      error = "Unable to get canvas context";
      return;
    }
  }

  async function panzoom(canvas: HTMLCanvasElement) {
    const Panzoom = await import("@panzoom/panzoom").then(
      (module) => module.default,
    );

    let panzoom = Panzoom(canvas, {
      minScale: 0.5,
      maxScale: 8,
      step: 0.1,
      canvas: true,
    });

    const off = on(canvas, "wheel", panzoom.zoomWithWheel);

    return () => {
      panzoom.destroy();
      off();
    };
  }

  $effect(() => {
    if (render.state.state === "finished") {
      ctx!.transferFromImageBitmap(render.state.image);

      if (isNarrowScreen.matches) {
        canvas?.scrollIntoView({
          behavior: "smooth",
        });
      }
    } else if (render.state.state === "rendering" && render.state.image) {
      ctx?.transferFromImageBitmap(render.state.image);
    } else if (render.state.state === "error") {
      error = render.state.error;
    }
  });

  export function enterFullscreen() {
    canvas?.requestFullscreen();
  }

  export function downloadImage() {
    canvas?.toBlob((blob) => {
      if (!blob) {
        error = "Failed to extract image from canvas";
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
</script>

<div class={["canvas-container", { error }]}>
  {#if error}
    <h4 class="text-large">Error: <br />{error}</h4>
  {:else}
    <canvas
      bind:this={canvas}
      {@attach attachCanvas}
      {@attach panzoom}
      width={render.settings.width}
      height={render.settings.height}
    ></canvas>
  {/if}
</div>

<style>
  .canvas-container {
    width: 100%;
    height: 100%;
    border-radius: inherit;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 0.25rem;

    contain: strict;
    overflow: clip;
  }

  @media (max-width: 1024px) {
    .canvas-container {
      height: 67vh;
    }
  }

  .error {
    padding: 4rem;
    text-align: center;
    text-wrap: balance;
  }
</style>

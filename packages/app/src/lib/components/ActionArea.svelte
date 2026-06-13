<script lang="ts">
  import MdiDownload from "~icons/mdi/download";
  import MdiFullscreen from "~icons/mdi/fullscreen";
  import Canvas from "$lib/components/Canvas.svelte";
  import { render } from "$lib/state.svelte";

  let canvas = $state<Canvas | undefined>();
</script>

{#if render.state.state === "finished"}
  <div class="action-area">
    <section class="info">
      <h2 class="text-large">
        {render.state.stats.totalRenderTime.toFixed(2)}s render time
      </h2>
      <p>
        {render.state.image.width} x {render.state.image.height} image, {render.state.stats.samplesPerSecond.toFixed(
          2,
        )} samples/sec, {render.state.stats.megapixelsPerSecond.toFixed(2)} MP/sec
      </p>
    </section>
    <section class="actions">
      <button class="input c-primary" onclick={canvas?.downloadImage}>
        <MdiDownload />
        Download image
      </button>
      <button
        class="input square c-secondary"
        title="Open image in fullscreen"
        onclick={canvas?.enterFullscreen}
      >
        <MdiFullscreen />
      </button>
    </section>
  </div>
{/if}

<Canvas bind:this={canvas}></Canvas>

<style>
  .action-area {
    padding: 16px;
    display: flex;
    gap: 1rem;
    flex-direction: column;
    align-items: start;
  }

  @media (min-width: 1024px) {
    .action-area {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .actions {
    display: flex;
    gap: 0.25rem;
    align-items: stretch;
  }
</style>

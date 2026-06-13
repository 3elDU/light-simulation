<script lang="ts">
  import { render } from "$lib/state.svelte";
</script>

{#if render.state.state === "rendering"}
  <div
    class="progress"
    role="progressbar"
    aria-label="Rendering progress"
    aria-valuenow={render.state.progress}
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div
      class="progressbar"
      style="width: {render.state.progress * 100}%"
    ></div>
  </div>
{/if}

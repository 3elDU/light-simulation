<script>
  import { render } from "$lib/state.svelte";
  import ActionArea from "./ActionArea.svelte";
  import ProgressBar from "./ProgressBar.svelte";
</script>

{#if !render.fresh}
  <main class="vstack">
    <ProgressBar></ProgressBar>
    <div class="result surface">
      <ActionArea></ActionArea>
    </div>
  </main>
{:else}
  <section class="surface click-to-see">
    <h3>Click "Render" to see an image here</h3>
  </section>
{/if}

<style>
  main {
    height: 100%;
  }

  .result {
    flex: 1;
    padding: 0;
    gap: 0;
  }

  .click-to-see {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>

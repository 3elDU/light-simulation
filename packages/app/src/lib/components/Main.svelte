<script>
  import ActionArea from "./ActionArea.svelte";
  import ProgressBar from "./ProgressBar.svelte";
</script>

<main class="vstack">
  <ProgressBar></ProgressBar>
  <div class="result surface">
    <ActionArea></ActionArea>
  </div>
</main>

<style>
  main {
    height: 100%;
  }

  .result {
    flex: 1;
    padding: 0;
    gap: 0;
  }
</style>

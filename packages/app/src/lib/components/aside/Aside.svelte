<script>
  import Objects from "./Objects.svelte";
  import RenderSettings from "./RenderSettings.svelte";
</script>

<aside id="controls" class="surface">
  <RenderSettings></RenderSettings>
  <Objects></Objects>
</aside>

<style>
  #controls {
    width: 100%;
  }

  @media (min-width: 1024px) {
    #controls {
      width: 320px;
      overflow-y: auto;
    }
  }
</style>

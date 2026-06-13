<script lang="ts">
  import { render } from "$lib/state.svelte";
  import { load, startRender } from "$lib/worker.svelte";
  import MdiClose from "virtual:icons/mdi/close";
  import MdiPlay from "virtual:icons/mdi/play";
  import MdiSkip from "virtual:icons/mdi/skip-next";
</script>

<h2 class="section-title">Render Settings</h2>

<label
  class="checkbox-label"
  title="Render an image with low sample count whenever the scene changes"
>
  <input
    type="checkbox"
    id="quick-preview"
    class="input"
    bind:checked={render.quickPreview}
  />
  <span>Quick Preview</span>
</label>

<div class="labelled-input">
  <label for="camera-position" class="label">Camera Position</label>
  <div id="camera-position" class="input-row">
    <label class="inline-labelled-input">
      <span class="label">X</span>
      <input
        id="camera-x"
        class="input"
        type="number"
        bind:value={render.settings.cameraPosition.x}
      />
    </label>
    <label class="inline-labelled-input">
      <span class="label">Y</span>
      <input
        id="camera-y"
        class="input"
        type="number"
        bind:value={render.settings.cameraPosition.y}
      />
    </label>
    <label class="inline-labelled-input">
      <span class="label">Z</span>
      <input
        id="camera-z"
        class="input"
        type="number"
        bind:value={render.settings.cameraPosition.z}
      />
    </label>
  </div>
</div>
<div class="labelled-input">
  <label for="looking-at" class="label">Looking at</label>
  <div id="looking-at" class="input-row">
    <label class="inline-labelled-input">
      <span class="label">X</span>
      <input
        id="lookat-x"
        class="input"
        type="number"
        bind:value={render.settings.lookingAt.x}
      />
    </label>
    <label class="inline-labelled-input">
      <span class="label">Y</span>
      <input
        id="lookat-y"
        class="input"
        type="number"
        bind:value={render.settings.lookingAt.y}
      />
    </label>
    <label class="inline-labelled-input">
      <span class="label">Z</span>
      <input
        id="lookat-z"
        class="input"
        type="number"
        bind:value={render.settings.lookingAt.z}
      />
    </label>
  </div>
</div>

<div class="input-row">
  <div class="labelled-input">
    <label for="width" class="label">Width</label>
    <input
      id="width"
      type="number"
      class="input c-container"
      min="1"
      bind:value={render.settings.width}
    />
  </div>

  <div class="cross" aria-hidden="true">
    <MdiClose style="font-size: 13px" />
  </div>

  <div class="labelled-input">
    <label for="height" class="label">Height</label>
    <input
      id="height"
      type="number"
      class="input c-container"
      min="1"
      bind:value={render.settings.height}
    />
  </div>
</div>

<div class="input-row">
  <div class="labelled-input">
    <label for="max-bounce-count" class="label">Max bounce count</label>
    <input
      type="number"
      id="max-bounce-count"
      class="input c-container"
      min="1"
      bind:value={render.settings.maxBounceCount}
    />
  </div>
</div>

<div class="input-row">
  <div class="labelled-input">
    <label for="samples-per-pixel" class="label">Samples per pixel</label>
    <input
      type="number"
      id="samples-per-pixel"
      class="input c-container"
      min="1"
      bind:value={render.settings.samplesPerPixel}
    />
  </div>
</div>

<div class="input-row">
  <button
    id="render-btn"
    class="input c-primary"
    disabled={!["ready", "finished"].includes(render.state.state)}
    onclick={() => startRender()}
  >
    <MdiPlay />
    Render
  </button>
  <button
    id="skip-btn"
    class="input c-secondary"
    disabled={render.state.state !== "rendering"}
    onclick={load}
  >
    <MdiSkip />
    Skip
  </button>
</div>

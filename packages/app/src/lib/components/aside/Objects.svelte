<script lang="ts">
  import { render } from "$lib/state.svelte";
  import MdiPlus from "virtual:icons/mdi/plus";
  import MdiTrash from "virtual:icons/mdi/trash-can-outline";
  import { newEmptyObject } from "../../../../../models/object";
  import { cssColorToHex, hexToCssColor } from "$lib/color";
</script>

<h2 class="section-title">Objects</h2>

<div class="input-row">
  <button
    id="add-object-btn"
    class="input square c-container"
    title="Add object"
    onclick={() => render.objects.push(newEmptyObject())}
  >
    <MdiPlus />
  </button>
  <button
    id="clear-objects-btn"
    class="input square c-container"
    title="Clear objects"
    onclick={() => render.objects.splice(0, render.objects.length)}
  >
    <MdiTrash />
  </button>
</div>

<ul class="object-list">
  {#if !render.objects.length}
    <h3>No objects</h3>
  {/if}

  {#each render.objects as object, i}
    <li class="object">
      <h4 class="section-title small">
        Sphere
        <button
          class="delete-btn input square c-container"
          title="Delete this object"
          onclick={() => render.objects.splice(i, 1)}
        >
          <MdiTrash />
        </button>
      </h4>
      <div class="input-row">
        <label class="inline-labelled-input">
          <span class="label">X</span>
          <input class="x-input input" type="number" bind:value={object.x} />
        </label>
        <label class="inline-labelled-input">
          <span class="label">Y</span>
          <input class="y-input input" type="number" bind:value={object.y} />
        </label>
        <label class="inline-labelled-input">
          <span class="label">Z</span>
          <input class="z-input input" type="number" bind:value={object.z} />
        </label>
      </div>
      <label class="inline-labelled-input">
        <span class="label">Radius</span>
        <input
          class="radius-input input"
          type="number"
          bind:value={object.radius}
        />
      </label>
      <div class="input-row">
        <label class="color-input" title="Object color">
          <span class="sr-only">Object color</span>
          <input
            class="color-input input"
            type="color"
            bind:value={
              () => hexToCssColor(object.color),
              (value) => {
                object.color = cssColorToHex(value)!;
              }
            }
          />
        </label>
        <label class="inline-labelled-input">
          <span class="label">Emission</span>
          <input
            class="emission-input input"
            type="number"
            bind:value={object.emission}
          />
        </label>
      </div>
    </li>
  {/each}
</ul>

<style>
  .object-list {
    list-style: none;
    padding: 0;
  }
  .object-list > .object {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
</style>

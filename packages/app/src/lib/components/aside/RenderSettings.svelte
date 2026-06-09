<h2 class="section-title">Render Settings</h2>

<label
  class="checkbox-label"
  title="Render an image with low sample count whenever the scene changes"
>
  <input type="checkbox" id="quick-preview" class="input" />
  <span>Quick Preview</span>
</label>

<div class="labelled-input">
  <label for="camera-position" class="label">Camera Position</label>
  <div id="camera-position" class="input-row">
    <label class="inline-labelled-input">
      <span class="label">X</span>
      <input id="camera-x" class="input" type="number" value="0" />
    </label>
    <label class="inline-labelled-input">
      <span class="label">Y</span>
      <input id="camera-y" class="input" type="number" value="0" />
    </label>
    <label class="inline-labelled-input">
      <span class="label">Z</span>
      <input id="camera-z" class="input" type="number" value="0" />
    </label>
  </div>
</div>
<div class="labelled-input">
  <label for="looking-at" class="label">Looking at</label>
  <div id="looking-at" class="input-row">
    <label class="inline-labelled-input">
      <span class="label">X</span>
      <input id="lookat-x" class="input" type="number" value="0" />
    </label>
    <label class="inline-labelled-input">
      <span class="label">Y</span>
      <input id="lookat-y" class="input" type="number" value="0" />
    </label>
    <label class="inline-labelled-input">
      <span class="label">Z</span>
      <input id="lookat-z" class="input" type="number" value="0" />
    </label>
  </div>
</div>

<div class="input-row">
  <div class="labelled-input">
    <label for="width" class="label">Width</label>
    <input id="width" type="number" class="input c-container" min="1" />
  </div>

  <div class="cross" aria-hidden="true">
    <svg
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M335.28-279 279-335l144.72-145L279-624l56.28-56L480-535.39 623.72-680 680-624 535.28-480 680-335l-56.28 56L480-423.61 335.28-279Z"
      />
    </svg>
  </div>

  <div class="labelled-input">
    <label for="height" class="label">Height</label>
    <input id="height" type="number" class="input c-container" min="1" />
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
    />
  </div>
</div>

<div class="input-row">
  <button id="render-btn" class="input c-primary" disabled>
    <svg
      aria-hidden="true"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M320-200v-560l440 280-440 280Z" />
    </svg>
    Render
  </button>
  <button id="skip-btn" class="input c-secondary" disabled>
    <svg
      aria-hidden="true"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M660-240v-480h80v480h-80Zm-440 0v-480l360 240-360 240Z" />
    </svg>
    Skip
  </button>
  <button
    id="reset-btn"
    class="input square c-container"
    title="Reset all settings and objects. Also clears previously saved scene"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      aria-hidden="true"
    >
      <path
        d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
      />
    </svg>
  </button>
</div>

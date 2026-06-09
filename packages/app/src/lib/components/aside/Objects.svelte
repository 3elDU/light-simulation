<h2 class="section-title">Objects</h2>

<div class="input-row">
  <button
    id="add-object-btn"
    class="input square c-container"
    title="Add object"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      aria-hidden="true"
    >
      <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
    </svg>
  </button>
  <button
    id="clear-objects-btn"
    class="input square c-container"
    title="Clear objects"
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

<ul id="object-list">
  <h3 id="empty-list-label">No objects</h3>

  <template id="object-template">
    <li class="object">
      <h4 class="section-title small">
        Sphere
        <button
          class="delete-btn input square c-container"
          title="Delete this object"
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
      </h4>
      <div class="input-row">
        <label class="inline-labelled-input">
          <span class="label">X</span>
          <input class="x-input input" type="number" value="0" />
        </label>
        <label class="inline-labelled-input">
          <span class="label">Y</span>
          <input class="y-input input" type="number" value="0" />
        </label>
        <label class="inline-labelled-input">
          <span class="label">Z</span>
          <input class="z-input input" type="number" value="0" />
        </label>
      </div>
      <label class="inline-labelled-input">
        <span class="label">Radius</span>
        <input class="radius-input input" type="number" value="1" />
      </label>
      <div class="input-row">
        <label class="color-input" title="Object color">
          <span class="sr-only">Object color</span>
          <input class="color-input input" type="color" value="#000000" />
        </label>
        <label class="inline-labelled-input">
          <span class="label">Emission</span>
          <input class="emission-input input" type="number" value="0" />
        </label>
      </div>
    </li>
  </template>
</ul>

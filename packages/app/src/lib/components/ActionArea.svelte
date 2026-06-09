<script>
  import Canvas from "./Canvas.svelte";
</script>

<div class="action-area">
  <section class="info">
    <h2 class="text-large">8.34s render time</h2>
    <p>3840 x 2160 image, 1.2 samples/sec, 9.94 MP/sec</p>
  </section>
  <section class="actions">
    <button class="input c-primary">
      <svg
        aria-hidden="true"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"
        />
      </svg>
      Download image
    </button>
    <button class="input square c-secondary" title="Open image in fullscreen">
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
      >
        <path
          d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z"
        />
      </svg>
    </button>
  </section>
</div>
<Canvas></Canvas>

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

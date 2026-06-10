<script lang="ts">
  import Aside from "$lib/components/aside/Aside.svelte";
  import Main from "$lib/components/Main.svelte";
  import "$lib/css/index.css";
  import { onMount } from "svelte";

  onMount(() => {
    const worker = new Worker(
      new URL("../../../worker/src/index", import.meta.url),
      {
        name: "Wasm Worker",
        type: "module",
      },
    );
    console.log(worker);
  });
</script>

<Aside></Aside>
<Main></Main>

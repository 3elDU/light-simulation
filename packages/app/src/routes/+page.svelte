<script lang="ts">
  import Aside from "$lib/components/aside/Aside.svelte";
  import Main from "$lib/components/Main.svelte";
  import "$lib/css/index.css";
  import { onMount } from "svelte";

  onMount(() => {
    const worker = new Worker(
      new URL("../../../worker/src/index.ts", import.meta.url),
    );
  });
</script>

<Aside></Aside>
<Main></Main>

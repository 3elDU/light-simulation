<script lang="ts">
  import Aside from "$lib/components/aside/Aside.svelte";
  import Main from "$lib/components/Main.svelte";
  import "$lib/css/index.css";
  import { load } from "$lib/worker.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    load();
  });
</script>

<Aside></Aside>
<Main></Main>

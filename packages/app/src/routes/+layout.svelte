<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import ogImage from "$lib/assets/og-image.jpg";
  import "$lib/css/index.css";

  let { children } = $props();
</script>

<svelte:head>
  <meta name="title" content="Light simulation" />
  <meta
    name="description"
    content="Raytracing light simulation written in Rust"
  />
  <meta property="og:title" content="Light simulation" />
  <meta
    property="og:description"
    content="Raytracing light simulation written in Rust"
  />
  <meta property="og:image" content={ogImage} />
  <meta property="og:url" content="https://light.petafloppa.cc" />

  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

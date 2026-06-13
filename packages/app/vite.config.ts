import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import Icons from "unplugin-icons/vite";

export default defineConfig({
  plugins: [
    wasm(),
    sveltekit(),
    Icons({
      compiler: "svelte",
    }),
  ],
  server: {
    fs: {
      allow: ["../worker"],
    },
  },
  worker: {
    format: "es",
    plugins() {
      return [wasm()];
    },
  },
});

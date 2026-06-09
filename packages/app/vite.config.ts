import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [wasm(), sveltekit()],
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

import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

export default defineConfig({
  root: "./frontend",
  build: {
    modulePreload: false,
    outDir: "../dist",
    emptyOutDir: true,
    assetsDir: "assets",
  },
  worker: {
    plugins() {
      return [wasm(), topLevelAwait()];
    },
  },
});

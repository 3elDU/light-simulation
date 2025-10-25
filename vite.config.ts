import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  root: "./frontend",
  build: {
    modulePreload: false,
    outDir: "../dist",
    emptyOutDir: true,
    assetsDir: "assets",
  },
  plugins: [wasm()],
  worker: {
    format: "es",
    plugins() {
      return [wasm()];
    },
  },
});

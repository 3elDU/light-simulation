import RenderController from "./render";
import UIController from "./ui/controller";

// Initialize WebAssembly worker
const worker = new Worker(new URL("./worker.ts", import.meta.url));

const render = new RenderController(worker);

const controller = new UIController(render);

console.log("controller", controller);

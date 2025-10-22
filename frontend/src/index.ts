import RenderController from "./render";
import UIController from "./ui/controller";
import WasmWorker from "./worker?worker";

// Initialize WebAssembly worker
const worker = new WasmWorker();
const render = new RenderController(worker);

const controller = new UIController(render);

console.log("controller", controller);

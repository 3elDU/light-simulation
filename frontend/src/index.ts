import RenderController from "./ui/controllers/render";
import ObjectEditorController from "./ui/controllers/objects";
import { SceneService } from "./ui/services/scene";

const sceneService = new SceneService();

const controllers = [
  new RenderController(sceneService),
  new ObjectEditorController(sceneService),
];

console.debug("controllers", controllers);

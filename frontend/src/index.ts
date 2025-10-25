import RenderController from "./render";
import UIController from "./ui/controller";

const controller = new UIController(new RenderController());
controller
  .load()
  .then(() => {
    console.log("controller loaded", controller);
  })
  .catch((error) => {
    console.error("error while loading controller", error);
  });

/** Types between worker and main thread */

import { SceneObject } from "./object";
import { RenderSettings, RenderStats } from "./render";

export type MessageFromWorker =
  | { type: "loaded" }
  | { type: "frame"; progress: number; image: ImageData }
  | { type: "lastframe"; image: ImageData; stats: RenderStats }
  | { type: "error"; error: string };

export type MessageToWorker = {
  type: "renderRequest";
  objects: SceneObject[];
  settings: RenderSettings;
};

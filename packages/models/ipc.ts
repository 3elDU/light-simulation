/** Types between worker and main thread */

import type { SceneObject } from "./object";
import type { RenderSettings, RenderStats } from "./render";

export type MessageFromWorker =
  | { type: "loaded" }
  | { type: "frame"; progress: number; image: ImageBitmap }
  | { type: "lastframe"; image: ImageBitmap; stats: RenderStats }
  | { type: "error"; error: string };

export type MessageToWorker = {
  type: "renderRequest";
  objects: SceneObject[];
  settings: RenderSettings;
};

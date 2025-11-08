export interface RenderSettings {
  width: number;
  height: number;
  maxBounceCount: number;
  samplesPerPixel: number;
}

export interface RenderStats {
  samplesPerSecond: number;
  totalRenderTime: number;
  megapixelsPerSecond: number;
}

export type RenderState =
  /** Initial empty state */
  | { state: "loading" }
  /** Renderer code has been loaded and we're ready to render */
  | { state: "ready" }
  /** Progress is from 0 to 100 */
  | { state: "rendering"; progress: number; image?: ImageData }
  | { state: "finished"; image: ImageData; stats: RenderStats }
  /** Error during rendering, loading, or in the script */
  | { state: "error"; error: string };

export const getDefaultSettings = (): RenderSettings => ({
  width: 1920 / 3,
  height: 1080 / 3,
  maxBounceCount: 128,
  samplesPerPixel: 10,
});

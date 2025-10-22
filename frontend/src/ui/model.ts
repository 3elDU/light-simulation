export interface UIModel {
  showControls: boolean;
  width: number;
  height: number;
  maxBounceCount: number;
  samplesPerPixel: number;
  error?: string;

  /**
   * From 0 to 100.
   *
   * A value of undefined means rendering has not yet started,
   * and a value of 100 means we have an image
   */
  renderingProgress: number | undefined;
  image: ImageData | undefined;
}

export type UINumberInputKey =
  | "width"
  | "height"
  | "maxBounceCount"
  | "samplesPerPixel";

export const getDefaultModel = () =>
  ({
    showControls: false,
    width: 480,
    height: 360,
    maxBounceCount: 4,
    samplesPerPixel: 3,
    renderingProgress: undefined,
    image: undefined,
  } satisfies UIModel);

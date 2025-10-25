const q = <T extends HTMLElement>(q: string) => document.getElementById(q) as T;

export default {
  hideControlsButton: q<HTMLButtonElement>("hide-controls-btn"),
  widthInput: q<HTMLInputElement>("width"),
  heightInput: q<HTMLInputElement>("height"),
  maxBounceCountInput: q<HTMLInputElement>("max-bounce-count"),
  samplesPerPixelInput: q<HTMLInputElement>("samples-per-pixel"),
  renderButton: q<HTMLButtonElement>("render-btn"),
  skipButton: q<HTMLButtonElement>("skip-btn"),
  progressBar: q<HTMLDivElement>("render-progress"),
  infoTitleText: q<HTMLHeadingElement>("info-title-text"),
  infoSupportingText: q<HTMLParagraphElement>("info-supporting-text"),
  mainContainer: q<HTMLDivElement>("main-container"),
  resultContainer: q<HTMLElement>("result"),
  errorText: q<HTMLParagraphElement>("error-text"),
  outputCanvas: q<HTMLCanvasElement>("output"),
};

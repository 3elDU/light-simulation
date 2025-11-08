const q = <T extends HTMLElement>(q: string) => document.getElementById(q) as T;

export default {
  quickPreviewCheckbox: q<HTMLInputElement>("quick-preview"),
  widthInput: q<HTMLInputElement>("width"),
  heightInput: q<HTMLInputElement>("height"),
  maxBounceCountInput: q<HTMLInputElement>("max-bounce-count"),
  samplesPerPixelInput: q<HTMLInputElement>("samples-per-pixel"),
  renderButton: q<HTMLButtonElement>("render-btn"),
  skipButton: q<HTMLButtonElement>("skip-btn"),
  downloadButton: q<HTMLButtonElement>("download-btn"),
  fullscreenButton: q<HTMLButtonElement>("fullscreen-btn"),
  progressBar: q<HTMLDivElement>("render-progress"),
  infoTitleText: q<HTMLHeadingElement>("info-title-text"),
  infoSupportingText: q<HTMLParagraphElement>("info-supporting-text"),
  mainContainer: q<HTMLDivElement>("main-container"),
  resultContainer: q<HTMLElement>("result"),
  errorText: q<HTMLParagraphElement>("error-text"),
  canvasContainer: q<HTMLDivElement>("canvas-container"),
  panzoomBadge: q<HTMLParagraphElement>("panzoom-badge"),
  outputCanvas: q<HTMLCanvasElement>("output"),
  // Object editor elements
  addObjectButton: q<HTMLButtonElement>("add-object-btn"),
  clearObjectsButton: q<HTMLButtonElement>("clear-objects-btn"),
  objectList: q<HTMLUListElement>("object-list"),
  objectTemplate: q<HTMLTemplateElement>("object-template"),
};

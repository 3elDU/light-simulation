/**
 * Every value must be a number from 0 to 255
 */
export interface Color {
  r: number;
  g: number;
  b: number;
}

export const getDefaultColor = (): Color => ({
  r: 0,
  g: 0,
  b: 0,
});

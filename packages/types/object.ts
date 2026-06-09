import { Color, getDefaultColor } from "./color";

export interface SceneObject {
  x: number;
  y: number;
  z: number;
  color: Color;
  radius: number;
  // An emission strength of 0 means this object does not emit light
  emission: number;
}

export const getDefaultScene = (): SceneObject[] => [
  {
    x: 0,
    y: 0,
    z: 0,
    color: { r: 255, g: 255, b: 255 },
    radius: 3,
    emission: 1,
  },
];

export function newEmpty(): SceneObject {
  return {
    x: 0,
    y: 0,
    z: 0,
    color: getDefaultColor(),
    radius: 1,
    emission: 0,
  };
}

export interface SceneObject {
  x: number;
  y: number;
  z: number;
  // Color in #RRGGBB hexadecimal format
  color: string;
  radius: number;
  // An emission strength of 0 means this object does not emit light
  emission: number;
}

export default function newEmpty(): SceneObject {
  return {
    x: 0,
    y: 0,
    z: 0,
    color: "#000000",
    radius: 1,
    emission: 0,
  };
}

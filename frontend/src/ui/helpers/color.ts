import { Color } from "../../models/color";

/**
 * Converts a color component into css color in format #RRGGBB
 */
export function hexToCssColor(color: Color): string {
  const r = color.r.toString(16).padStart(2, "0");
  const g = color.g.toString(16).padStart(2, "0");
  const b = color.b.toString(16).padStart(2, "0");
  return `#${r}${g}${b}`;
}

/**
 * Tries to convert a CSS color in the form #RRGGBB into a color component
 */
export function cssColorToHex(color: string): Color | undefined {
  const result = /#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/.exec(color);
  if (result?.length !== 4) return undefined;

  return {
    r: Number.parseInt(result[1], 16),
    g: Number.parseInt(result[2], 16),
    b: Number.parseInt(result[3], 16),
  };
}

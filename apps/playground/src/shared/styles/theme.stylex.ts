import * as stylex from "@stylexjs/stylex";
import { colors } from "./tokens.stylex";

// Scope a light preview without changing the workspace theme.
export const lightPreview = stylex.createTheme(colors, {
  canvas: "#e4e7ef",
  border: "#c6ccd8",
  subtle: "#69748b",
});

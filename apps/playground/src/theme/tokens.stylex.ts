import * as stylex from "@stylexjs/stylex";

export const tokens = {
  background: "#070b18",
  surface: "#0d1224",
  code: "#0a0f1f",
  border: "#202a44",
  text: "#e2e8f0",
  muted: "#94a3b8",
  heading: "#f8fafc",
  primary: "#7c6cf8",
  primaryLight: "#aea4fc",
  primaryText: "#c9c2fd",
  success: "#34d399",
  warning: "#fbbf24",
  danger: "#fb7185",
} as const;

export const theme = stylex.create({
  root: { backgroundColor: tokens.background, color: tokens.text },
});

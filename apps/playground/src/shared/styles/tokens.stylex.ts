import * as stylex from "@stylexjs/stylex";

export const colors = stylex.defineVars({
  background: "#101218",
  navbar: "rgb(7 11 24 / 92%)",
  navbarBorder: "#171f35",
  navbarText: "#e2e8f0",
  navbarHover: "#7c6cf8",
  surface: "#161920",
  elevated: "#1e222c",
  canvas: "#12151c",
  border: "#2b303c",
  text: "#edf0f7",
  muted: "#a2abbd",
  subtle: "#778299",
  accent: "#9079ff",
  action: "#715de8",
  accentHover: "#a692ff",
  accentSoft: "#28223e",
  onAccent: "#ffffff",
  success: "#73dcb1",
  warning: "#e9c180",
  danger: "#ff8c9f",
  cyan: "#8bd3e6",
  lightCanvas: "#e4e7ef",
  transparent: "transparent",
});
export const space = stylex.defineVars({
  xxs: "4px",
  xs: "8px",
  sm: "12px",
  code: "13px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
});
export const type = stylex.defineVars({
  navbar: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
  navSize: "16px",
  navWeight: "700",
  sans: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'SFMono-Regular', Consolas, 'Liberation Mono', monospace",
  xs: "11px",
  sm: "12px",
  code: "13px",
  body: "14px",
  title: "24px",
  regular: "400",
  medium: "500",
  bold: "600",
  line: "1.6",
});
export const shape = stylex.defineVars({ sm: "6px", md: "10px", pill: "999px", border: "1px" });
export const motion = stylex.defineVars({
  fast: "140ms",
  disabled: "0.45",
  focus: "2px solid #a692ff",
});

import * as stylex from "@stylexjs/stylex";
import { tokens } from "../../theme/tokens.stylex";

export const styles = stylex.create({
  aside: { display: "grid", gap: 10, alignContent: "start", position: "sticky", top: 24 },
  label: { color: tokens.muted, fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" },
  list: { display: "grid", gap: 4, margin: 0, padding: 0, listStyle: "none" },
  button: { width: "100%", border: 0, borderLeft: `2px solid ${tokens.border}`, paddingBlock: 10, paddingInline: 14, backgroundColor: "transparent", color: tokens.muted, cursor: "pointer", font: "inherit", textAlign: "left" },
  active: { borderLeftColor: tokens.primary, backgroundColor: tokens.surface, color: tokens.heading, fontWeight: 700 },
});

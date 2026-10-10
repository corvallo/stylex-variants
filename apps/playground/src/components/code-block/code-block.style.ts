import * as stylex from "@stylexjs/stylex";

export const styles = stylex.create({
  wrapper: {
    overflow: "hidden",
    border: "1px solid #202a44",
    borderRadius: 10,
    backgroundColor: "#0a0f1f",
  },
  header: {
    paddingBlock: 8,
    paddingInline: 14,
    borderBottom: "1px solid #202a44",
    color: "#94a3b8",
    fontFamily: '"DM Sans", ui-sans-serif, system-ui, sans-serif',
    fontSize: 12,
    fontWeight: 600,
  },
  pre: {
    overflowX: "auto",
    margin: 0,
    padding: 16,
    fontFamily: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
    fontSize: 13,
    lineHeight: 1.65,
  },
});

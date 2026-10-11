import * as stylex from "@stylexjs/stylex";
import type { Example } from "../entities/playground-example";
import { colors, space, type, motion } from "../shared/styles/tokens.stylex";
export function ExampleNavigation({
  examples,
  selected,
  onSelect,
}: {
  examples: readonly Example[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <nav aria-label="Examples" {...stylex.props(s.nav)}>
      {examples.map((example, i) => (
        <button
          type="button"
          key={example.id}
          aria-current={selected === example.id ? "page" : undefined}
          onClick={() => onSelect(example.id)}
          {...stylex.props(s.tab, selected === example.id && s.active)}
        >
          <span {...stylex.props(s.index)}>{String(i + 1).padStart(2, "0")}</span>
          {example.name}
        </button>
      ))}
    </nav>
  );
}
const s = stylex.create({
  nav: {
    display: "flex",
    overflowX: "auto",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.border,
    marginBottom: space.lg,
    gap: space.xs,
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: space.xs,
    backgroundColor: colors.transparent,
    borderWidth: 0,
    borderStyle: "solid",
    borderBottomWidth: 2,
    borderBottomStyle: "solid",
    borderBottomColor: colors.transparent,
    paddingBlock: space.md,
    paddingInline: space.sm,
    whiteSpace: "nowrap",
    color: { default: colors.muted, ":hover": colors.text },
    fontFamily: type.sans,
    fontSize: type.sm,
    cursor: "pointer",
    outline: { default: "none", ":focus-visible": motion.focus },
    outlineOffset: -3,
  },
  active: { color: colors.text, borderBottomColor: colors.accent },
  index: { fontSize: type.xs, fontFamily: type.mono, color: colors.subtle },
});

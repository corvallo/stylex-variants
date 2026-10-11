import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import { colors, space, type, shape } from "../styles/tokens.stylex";
export function Panel({
  title,
  detail,
  action,
  children,
}: {
  title: string;
  detail?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section {...stylex.props(s.panel)} aria-label={title}>
      <div {...stylex.props(s.header)}>
        <div {...stylex.props(s.title)}>
          <h2 {...stylex.props(s.heading)}>{title}</h2>
          {detail && <span {...stylex.props(s.detail)}>{detail}</span>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
const s = stylex.create({
  panel: {
    minWidth: 0,
    borderWidth: shape.border,
    borderStyle: "solid",
    borderColor: colors.border,
    borderRadius: shape.md,
    backgroundColor: colors.surface,
    overflow: "hidden",
  },
  header: {
    minHeight: 52,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.sm,
    paddingInline: space.md,
    borderBottomWidth: shape.border,
    borderBottomStyle: "solid",
    borderBottomColor: colors.border,
  },
  title: { display: "flex", alignItems: "center", gap: space.sm, flexWrap: "wrap" },
  heading: { margin: 0, fontSize: type.body, fontWeight: type.bold },
  detail: { color: colors.subtle, fontSize: type.xs, fontFamily: type.mono },
});

import type { ButtonHTMLAttributes } from "react";
import { sxv } from "@stylex-variants/core";
import { colors, space, type, shape, motion } from "../styles/tokens.stylex";

const button = sxv({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    fontFamily: type.sans,
    fontSize: type.sm,
    fontWeight: type.medium,
    lineHeight: type.line,
    minHeight: 32,
    paddingInline: space.sm,
    paddingBlock: space.xxs,
    borderWidth: shape.border,
    borderStyle: "solid",
    borderRadius: shape.sm,
    cursor: "pointer",
    whiteSpace: "nowrap",
    outline: { default: "none", ":focus-visible": motion.focus },
    outlineOffset: 3,
    transitionDuration: motion.fast,
    transitionProperty: "background-color, color, border-color",
  },
  variants: {
    tone: {
      quiet: {
        backgroundColor: { default: colors.transparent, ":hover": colors.elevated },
        color: colors.muted,
        borderColor: colors.transparent,
      },
      surface: {
        backgroundColor: { default: colors.surface, ":hover": colors.elevated },
        color: colors.text,
        borderColor: colors.border,
      },
      selected: {
        backgroundColor: colors.accentSoft,
        color: colors.accentHover,
        borderColor: colors.accent,
      },
    },
  },
  defaultVariants: { tone: "quiet" },
});
export function Button({
  tone = "quiet",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "quiet" | "surface" | "selected" }) {
  return <button type="button" {...button({ tone })} {...props} />;
}

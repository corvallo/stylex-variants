// This executable example deliberately keeps the inferred recipe and component together.
/* eslint-disable react-refresh/only-export-components */
import { sxv } from "@stylex-variants/core";
import { colors, space, type, shape, motion } from "../../shared/styles/tokens.stylex";
import type { VariantProps } from "@stylex-variants/core";

export const button = sxv({
  variants: {
    tone: {
      primary: {
        backgroundColor: colors.action,
        color: colors.onAccent,
      },
      neutral: {
        backgroundColor: colors.elevated,
        color: colors.text,
      },
      outline: {
        backgroundColor: colors.transparent,
        color: colors.accentHover,
        borderColor: colors.accent,
      },
    },
    size: {
      sm: {
        paddingBlock: space.xxs,
        paddingInline: space.sm,
        fontSize: type.sm,
      },
      md: {
        paddingBlock: space.xs,
        paddingInline: space.md,
        fontSize: type.body,
      },
      lg: {
        paddingBlock: space.sm,
        paddingInline: space.lg,
        fontSize: type.body,
      },
    },
  },
  defaultVariants: {
    tone: "primary",
    size: "md",
  },
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: type.sans,
    fontWeight: type.bold,
    lineHeight: type.line,
    borderRadius: shape.sm,
    borderWidth: shape.border,
    borderStyle: "solid",
    borderColor: colors.transparent,
    cursor: "pointer",
    outline: {
      default: "none",
      ":focus-visible": motion.focus,
    },
    outlineOffset: 4,
    transitionProperty: "background-color, color, opacity",
    transitionDuration: motion.fast,
  },
});

export type ButtonVariants = VariantProps<typeof button>;
export function Button({ children, ...variants }: ButtonVariants & { children: React.ReactNode }) {
  return <button {...button(variants)}>{children}</button>;
}
// ButtonVariants infers tone?: "primary" | "neutral" | "outline"
// and size?: "sm" | "md" | "lg" — no manual union required.

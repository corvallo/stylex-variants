import { sxv } from "@stylex-variants/core";
import { colors, space, type, shape, motion } from "../../shared/styles/tokens.stylex";

export const baseButton = sxv({
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
});

// Inherit variants; add base styles and defaults without overlapping config keys.
// Keep both recipes in one module for static compilation.
export const button = sxv.extend(baseButton, {
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: type.sans,
    fontWeight: type.bold,
    lineHeight: type.line,
    borderRadius: shape.pill,
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
  defaultVariants: {
    tone: "outline",
    size: "lg",
  },
});

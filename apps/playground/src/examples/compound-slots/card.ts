import { sxv } from "@stylex-variants/core";
import { colors, space, type, shape } from "../../shared/styles/tokens.stylex";

export const card = sxv({
  slots: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: space.sm,
      padding: space.lg,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: colors.border,
      borderRadius: shape.md,
      backgroundColor: colors.surface,
      minWidth: 0,
      maxWidth: 320,
      boxSizing: "border-box",
      fontFamily: type.sans,
    },
    title: {
      margin: 0,
      color: colors.text,
      fontSize: type.body,
      fontWeight: type.bold,
    },
    description: {
      margin: 0,
      color: colors.muted,
      fontSize: type.sm,
      lineHeight: type.line,
    },
  },
  variants: {
    tone: {
      neutral: {
        root: {
          backgroundColor: colors.surface,
        },
        title: {
          color: colors.text,
        },
      },
      accent: {
        root: {
          backgroundColor: colors.accentSoft,
        },
        title: {
          color: colors.accentHover,
        },
      },
    },
    density: {
      compact: {
        root: {
          padding: space.sm,
          gap: space.xxs,
        },
      },
      comfortable: {
        root: {
          padding: space.lg,
          gap: space.sm,
        },
      },
    },
  },
  defaultVariants: {
    tone: "neutral",
    density: "comfortable",
  },
  compoundSlots: [
    {
      tone: "accent",
      density: "compact",
      slots: {
        root: {
          borderWidth: 2,
          borderColor: colors.accent,
        },
        title: {
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        },
      },
    },
  ],
});

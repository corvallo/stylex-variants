import { tokens } from "../../theme/tokens.stylex";
import { sxv } from "@stylex-variants/core";

export const card = sxv({
  base: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    padding: 20,
    borderRadius: 12,
    borderStyle: "solid",
    borderWidth: 1,
  },

  variants: {
    appearance: {
      elevated: {
        backgroundColor: tokens.surface,
        borderColor: tokens.border,
        color: tokens.text,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.24)",
      },

      outlined: {
        backgroundColor: tokens.background,
        borderColor: tokens.border,
        color: tokens.text,
        boxShadow: "none",
      },

      filled: {
        backgroundColor: tokens.surface,
        borderColor: tokens.border,
        color: tokens.text,
        boxShadow: "none",
      },
    },

    spacing: {
      compact: {
        padding: 12,
        gap: 8,
      },

      normal: {
        padding: 20,
        gap: 16,
      },

      relaxed: {
        padding: 32,
        gap: 24,
      },
    },

    interactive: {
      true: {
        cursor: "pointer",
      },

      false: {
        cursor: "default",
      },
    },
  },

  defaultVariants: {
    appearance: "elevated",
    spacing: "normal",
    interactive: false,
  },

  compoundVariants: [
    {
      appearance: "elevated",
      interactive: true,

      style: {
        outlineStyle: "solid",
        outlineWidth: 2,
        outlineColor: "transparent",
      },
    },

    {
      appearance: "filled",
      spacing: "compact",

      style: {
        borderRadius: 6,
      },
    },
  ],
});

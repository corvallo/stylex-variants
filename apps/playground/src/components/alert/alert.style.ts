import { tokens } from "../../theme/tokens.stylex";
import { sxv } from "@stylex-variants/core";

export const alert = sxv({
  base: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: 16,
    borderRadius: 8,
    borderStyle: "solid",
    borderWidth: 1,
  },

  variants: {
    status: {
      info: {
        backgroundColor: tokens.primaryText,
        borderColor: tokens.primaryLight,
        color: tokens.primary,
      },

      success: {
        backgroundColor: tokens.surface,
        borderColor: tokens.success,
        color: tokens.success,
      },

      warning: {
        backgroundColor: tokens.surface,
        borderColor: tokens.warning,
        color: tokens.warning,
      },

      error: {
        backgroundColor: tokens.surface,
        borderColor: tokens.danger,
        color: tokens.danger,
      },
    },

    emphasis: {
      subtle: {
        borderWidth: 1,
      },

      strong: {
        borderWidth: 2,
        fontWeight: 600,
      },
    },
  },

  defaultVariants: {
    status: "info",
    emphasis: "subtle",
  },

  compoundVariants: [
    {
      status: "error",
      emphasis: "strong",

      style: {
        borderWidth: 3,
      },
    },

    {
      status: "warning",
      emphasis: "strong",

      style: {
        textTransform: "uppercase",
      },
    },
  ],
});

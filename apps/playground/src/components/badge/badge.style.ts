import { tokens } from "../../theme/tokens.stylex";
import { sxv } from "@stylex-variants/core";

export const badge = sxv({
  base: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 9999,
    fontWeight: 600,
  },

  variants: {
    tone: {
      neutral: {
        backgroundColor: tokens.surface,
        color: tokens.text,
      },

      success: {
        backgroundColor: tokens.surface,
        color: tokens.success,
      },

      warning: {
        backgroundColor: tokens.surface,
        color: tokens.warning,
      },

      danger: {
        backgroundColor: tokens.surface,
        color: tokens.danger,
      },
    },

    size: {
      sm: {
        paddingBlock: 2,
        paddingInline: 8,
        fontSize: 11,
      },

      md: {
        paddingBlock: 4,
        paddingInline: 10,
        fontSize: 13,
      },
    },

    outlined: {
      true: {
        borderStyle: "solid",
        borderWidth: 1,
      },

      false: {
        borderStyle: "solid",
        borderWidth: 0,
      },
    },
  },

  defaultVariants: {
    tone: "neutral",
    size: "md",
    outlined: false,
  },

  compoundVariants: [
    {
      tone: "success",
      outlined: true,

      style: {
        borderColor: tokens.success,
      },
    },

    {
      tone: "warning",
      outlined: true,

      style: {
        borderColor: tokens.warning,
      },
    },

    {
      tone: "danger",
      outlined: true,

      style: {
        borderColor: tokens.danger,
      },
    },
  ],
});

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
        backgroundColor: "#f3f4f6",
        color: "#374151",
      },

      success: {
        backgroundColor: "#dcfce7",
        color: "#166534",
      },

      warning: {
        backgroundColor: "#fef3c7",
        color: "#92400e",
      },

      danger: {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
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
        borderColor: "#16a34a",
      },
    },

    {
      tone: "warning",
      outlined: true,

      style: {
        borderColor: "#d97706",
      },
    },

    {
      tone: "danger",
      outlined: true,

      style: {
        borderColor: "#dc2626",
      },
    },
  ],
});

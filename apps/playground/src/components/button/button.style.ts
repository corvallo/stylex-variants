import { sxv } from "@stylex-variants/core";

export const button = sxv({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 600,
  },

  variants: {
    variant: {
      primary: {
        backgroundColor: "#2563eb",
        borderColor: "#2563eb",
        color: "#ffffff",
      },

      secondary: {
        backgroundColor: "#e5e7eb",
        borderColor: "#e5e7eb",
        color: "#111827",
      },

      outline: {
        backgroundColor: "transparent",
        borderColor: "#2563eb",
        color: "#2563eb",
      },

      danger: {
        backgroundColor: "#dc2626",
        borderColor: "#dc2626",
        color: "#ffffff",
      },
    },

    size: {
      sm: {
        minHeight: 32,
        paddingBlock: 4,
        paddingInline: 12,
        fontSize: 12,
      },

      md: {
        minHeight: 40,
        paddingBlock: 8,
        paddingInline: 16,
        fontSize: 14,
      },

      lg: {
        minHeight: 48,
        paddingBlock: 12,
        paddingInline: 24,
        fontSize: 16,
      },
    },

    fullWidth: {
      true: {
        width: "100%",
      },

      false: {
        width: "auto",
      },
    },
  },

  defaultVariants: {
    variant: "primary",
    size: "md",
    fullWidth: false,
  },

  compoundVariants: [
    {
      variant: "primary",
      size: "lg",

      style: {
        textTransform: "uppercase",
        letterSpacing: 1,
      },
    },

    {
      variant: "outline",
      size: "sm",

      style: {
        borderWidth: 2,
      },
    },

    {
      variant: "danger",
      fullWidth: true,

      style: {
        textTransform: "uppercase",
      },
    },
  ],
});

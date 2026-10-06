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
        backgroundColor: "#eff6ff",
        borderColor: "#93c5fd",
        color: "#1e40af",
      },

      success: {
        backgroundColor: "#f0fdf4",
        borderColor: "#86efac",
        color: "#166534",
      },

      warning: {
        backgroundColor: "#fffbeb",
        borderColor: "#fcd34d",
        color: "#92400e",
      },

      error: {
        backgroundColor: "#fef2f2",
        borderColor: "#fca5a5",
        color: "#991b1b",
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

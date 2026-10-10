import { sxv } from "@stylex-variants/core";

export const card = sxv({
  slots: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      padding: 20,
      borderRadius: 12,
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#d1d5db",
      backgroundColor: "#ffffff",
    },
    title: {
      fontSize: 18,
      fontWeight: 700,
      color: "#111827",
    },
    description: {
      color: "green",
    },
  },
  variants: {
    tone: {
      neutral: {
        root: { backgroundColor: "#ffffff" },
        title: { color: "#111827" },
      },
      accent: {
        root: { backgroundColor: "#eff6ff" },
        title: { color: "#2563eb" },
      },
    },
  },
  defaultVariants: { tone: "neutral" },
  compoundSlots: [
    {
      tone: "accent",
      slots: {
        root: { borderWidth: 2, borderColor: "#2563eb" },
        title: { textTransform: "uppercase", color: "green" },
        description: { color: "red" },
      },
    },
  ],
});

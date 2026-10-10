import { tokens } from "../../theme/tokens.stylex";
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
      borderColor: tokens.border,
      backgroundColor: tokens.heading,
    },
    title: {
      fontSize: 18,
      fontWeight: 700,
      color: tokens.text,
    },
    description: {
      color: tokens.success,
    },
  },
  variants: {
    tone: {
      neutral: {
        root: { backgroundColor: tokens.heading },
        title: { color: tokens.text },
      },
      accent: {
        root: { backgroundColor: tokens.primaryText },
        title: { color: tokens.primary },
      },
    },
  },
  defaultVariants: { tone: "neutral" },
  compoundSlots: [
    {
      tone: "accent",
      slots: {
        root: { borderWidth: 2, borderColor: tokens.primary },
        title: { textTransform: "uppercase", color: tokens.success },
        description: { color: tokens.danger },
      },
    },
  ],
});

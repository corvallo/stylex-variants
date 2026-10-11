import type { VariantProps } from "@stylex-variants/core";
import { button, baseButton } from "./button";

export function ButtonExample({ variants }: { variants: VariantProps<typeof baseButton> }) {
  return <button {...button(variants)}>Ship something great</button>;
}

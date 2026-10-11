import type { VariantProps } from "@stylex-variants/core";
import { button } from "./button";

export function ButtonExample({ variants }: { variants: VariantProps<typeof button> }) {
  return <button {...button(variants)}>Ship something great</button>;
}

import type { VariantProps } from "@stylex-variants/core";
import type { button } from "./button.style";

export type ButtonVariants = VariantProps<typeof button>;

export type ButtonProps = React.ComponentProps<"button"> & ButtonVariants;

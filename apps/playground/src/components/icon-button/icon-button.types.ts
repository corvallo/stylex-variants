import type { VariantProps } from "@stylex-variants/core";
import type { button } from "../button/button.style";

export type IconButtonVariants = VariantProps<typeof button>;
export type IconButtonProps = React.ComponentProps<"button"> & IconButtonVariants;

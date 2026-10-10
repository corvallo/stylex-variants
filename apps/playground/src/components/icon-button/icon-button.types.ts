import type { VariantProps } from "@stylex-variants/core";
import type { iconButton } from "./icon-button.style";

export type IconButtonVariants = VariantProps<typeof iconButton>;
export type IconButtonProps = React.ComponentProps<"button"> & IconButtonVariants;

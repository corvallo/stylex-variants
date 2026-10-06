import type { VariantProps } from "@stylex-variants/core";
import type { card } from "./card.style";

export type CardVariants = VariantProps<typeof card>;

export type CardProps = React.ComponentProps<"div"> & CardVariants;

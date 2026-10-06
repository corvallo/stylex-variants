import type { VariantProps } from "@stylex-variants/core";
import type { badge } from "./badge.style";

export type BadgeVariants = VariantProps<typeof badge>;

export type BadgeProps = React.ComponentProps<"span"> & BadgeVariants;

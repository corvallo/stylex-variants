import type { VariantProps } from "@stylex-variants/core";
import type { alert } from "./alert.style";

export type AlertVariants = VariantProps<typeof alert>;

export type AlertProps = React.ComponentProps<"div"> &
  AlertVariants & {
    title: string;
  };

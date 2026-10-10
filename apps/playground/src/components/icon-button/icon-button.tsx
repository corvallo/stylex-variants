import { iconButton } from "./icon-button.style";
import type { IconButtonProps } from "./icon-button.types";

export function IconButton({ variant, size, children, ...props }: IconButtonProps) {
  const { className, style, ...rest } = props;
  return (
    <button {...iconButton({ variant, size, className, style })} {...rest}>
      {children}
    </button>
  );
}

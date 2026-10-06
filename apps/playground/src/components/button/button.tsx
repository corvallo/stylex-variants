import { button } from "./button.style";
import type { ButtonProps } from "./button.types";

export function Button({ variant, size, fullWidth, children, ...props }: ButtonProps) {
  const { className, style, ...rest } = props;
  return (
    <button
      {...button({
        variant,
        size,
        fullWidth,
        className,
        style,
      })}
      {...rest}
    >
      {children}
    </button>
  );
}

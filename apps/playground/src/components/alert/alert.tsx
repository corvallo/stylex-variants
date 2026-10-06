import { alert } from "./alert.style";
import type { AlertProps } from "./alert.types";

export function Alert({ status, emphasis, title, children, ...props }: AlertProps) {
  return (
    <div
      {...alert({
        status,
        emphasis,
      })}
      {...props}
    >
      <strong>{title}</strong>
      <span>{children}</span>
    </div>
  );
}

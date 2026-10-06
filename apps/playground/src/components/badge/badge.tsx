import { badge } from "./badge.style";
import type { BadgeProps } from "./badge.types";

export function Badge({ tone, size, outlined, children, ...props }: BadgeProps) {
  return (
    <span
      {...badge({
        tone,
        size,
        outlined,
      })}
      {...props}
    >
      {children}
    </span>
  );
}

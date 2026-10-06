import { card } from "./card.style";
import type { CardProps } from "./card.types";

export function Card({ appearance, spacing, interactive, children, ...props }: CardProps) {
  return (
    <div
      {...card({
        appearance,
        spacing,
        interactive,
      })}
      {...props}
    >
      {children}
    </div>
  );
}

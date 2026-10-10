import type { ReactNode } from "react";
import { card } from "./slot-card.style";

export function SlotCard({ children, tone }: { children: ReactNode; tone?: "neutral" | "accent" }) {
  const { root, title, description } = card;
  return (
    <article {...root({ tone, className: "slot-card-override" })}>
      <h2 {...title({ tone, style: { letterSpacing: 0.2 } })}>Title</h2>
      <p {...description({ tone })}>{children}</p>
    </article>
  );
}

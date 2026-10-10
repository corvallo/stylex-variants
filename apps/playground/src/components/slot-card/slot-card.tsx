import type { ReactNode } from "react";
import { card } from "./slot-card.style";

export function SlotCard({ children, tone }: { children: ReactNode; tone?: "neutral" | "accent" }) {
  const { root, title, description } = card;
  return (
    <article {...root({ tone })}>
      <h2 {...title({ tone })}>Title</h2>
      <p {...description({ tone })}>{children}</p>
    </article>
  );
}

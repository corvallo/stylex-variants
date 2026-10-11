import { card } from "./card";

// Each slot accepts the recipe's inferred variant selection.
export type CardVariants = NonNullable<Parameters<typeof card.root>[0]>;

export function CardExample({ variants }: { variants: CardVariants }) {
  return (
    <article {...card.root(variants)}>
      <h3 {...card.title(variants)}>One recipe, multiple elements</h3>
      <p {...card.description(variants)}>
        Root, title and description each resolve their own styles.
      </p>
    </article>
  );
}

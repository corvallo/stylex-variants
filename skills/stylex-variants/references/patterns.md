# Recommended patterns

## Typed React component with DOM props

```tsx
import type { ComponentPropsWithoutRef } from "react";
import { sxv, type VariantProps } from "@stylex-variants/core";

const button = sxv({
  base: { display: "inline-flex" },
  variants: {
    tone: {
      primary: { backgroundColor: "blue", color: "white" },
      neutral: { backgroundColor: "gray", color: "black" },
    },
    fullWidth: { true: { width: "100%" }, false: { width: "auto" } },
  },
  defaultVariants: { tone: "primary", fullWidth: false },
});

type ButtonVariants = VariantProps<typeof button>;
type ButtonProps = ButtonVariants & Omit<ComponentPropsWithoutRef<"button">, keyof ButtonVariants>;

export function Button({ tone, fullWidth, className, style, children, ...domProps }: ButtonProps) {
  return (
    <button {...domProps} {...button({ tone, fullWidth, className, style })}>
      {children}
    </button>
  );
}
```

Keep events, accessibility attributes, and other DOM props on the element;
recipes return styling props only. Passing all component props to a recipe
would drop the DOM props. Do not forward variant-only props to the DOM.

## Multiple elements with shared selections

```tsx
import { sxv, type VariantProps } from "@stylex-variants/core";

const card = sxv({
  slots: {
    root: { display: "flex", flexDirection: "column" },
    title: { fontSize: 18 },
  },
  variants: {
    tone: {
      neutral: { root: { backgroundColor: "white" } },
      accent: {
        root: { backgroundColor: "lightblue" },
        title: { color: "navy" },
      },
    },
  },
  defaultVariants: { tone: "neutral" },
  compoundSlots: [{ tone: "accent", slots: { title: { fontWeight: 700 } } }],
});

type CardProps = VariantProps<typeof card.root> & { title: string };

export function Card({ tone, className, style, title }: CardProps) {
  return (
    <article {...card.root({ tone, className, style })}>
      <h2 {...card.title({ tone })}>{title}</h2>
    </article>
  );
}
```

Pass the same selection to each slot that should share state. Overrides are
local to the slot call; root overrides do not automatically affect the title.

## Responsive and interactive styles

Use StyleX conditional values inside inline styles, with a default value:

```ts
import { sxv } from "@stylex-variants/core";

const panel = sxv({
  base: {
    padding: { default: 8, "@media (min-width: 768px)": 16 },
    color: { default: "black", ":hover": "blue" },
  },
});
```

For a one-off runtime value, pass `panel({ style: { width } })`. Keep recurring
finite states in variants. Do not turn a style object into a function.

## Vite integration

Adapt the existing build rather than replacing its configuration. The local
`apps/playground/vite.config.ts` uses this order:

```ts
import babel from "@rolldown/plugin-babel";
import stylex from "@stylexjs/unplugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import variants from "@stylex-variants/core/babel";

export default defineConfig({
  plugins: [babel({ plugins: [variants] }), react(), stylex({ useCSSLayers: true })],
});
```

Retain an imported CSS entry asset for the application's StyleX CSS output.
For standalone Babel verification, follow `behavior.test.ts`: transform with
the variants plugin first, then feed that output to the StyleX Babel plugin.
A successful variants-only transform does not prove CSS extraction works.

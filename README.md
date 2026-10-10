# StyleX Variants

![StyleX Variants](assets/stylex-variants-banner.png)

Typed, compile-time variants for [StyleX](https://stylexjs.com/), inspired by
[Tailwind Variants](https://www.tailwind-variants.org/).

## Installation

```sh
npm install @stylex-variants/core @stylexjs/stylex
npm install -D @babel/core@^8 @rolldown/plugin-babel @stylexjs/unplugin
```

The library targets ESM consumers and is verified with Vite 8, Babel 8 and
StyleX 0.19.1.

## Configuration

Run the variants Babel plugin before the StyleX plugin:

```ts
import babel from "@rolldown/plugin-babel";
import stylex from "@stylexjs/unplugin/vite";
import variants from "@stylex-variants/core/babel";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), babel({ plugins: [variants] }), stylex({ useCSSLayers: true })],
});
```

Import a CSS asset from the application entry point so Vite has an asset where
StyleX can emit its generated rules:

```ts
import "./index.css";
```

## Usage

```tsx
import { sxv, type VariantProps } from "@stylex-variants/core";

const button = sxv({
  base: { display: "inline-flex", borderRadius: 8 },
  variants: {
    tone: { primary: { backgroundColor: "blue" }, neutral: { backgroundColor: "gray" } },
    size: { sm: { padding: 8 }, lg: { padding: 16 } },
    fullWidth: { true: { width: "100%" }, false: { width: "auto" } },
  },
  defaultVariants: { tone: "primary", size: "sm", fullWidth: false },
  compoundVariants: [{ tone: "primary", size: "lg", style: { fontWeight: 700 } }],
});

type ButtonVariants = VariantProps<typeof button>;
export function Button(props: ButtonVariants) {
  return <button {...button(props)}>Continue</button>;
}
```

`button()` accepts variant selections, `className` and `style`. Defaults are
used when a selection is omitted; explicit `false` overrides a boolean default.
Custom classes are concatenated and inline styles are merged with StyleX props.

## Extending a recipe

Create a new recipe from an existing one with `sxv.extend`. Existing variant
groups are preserved, matching values are overridden by the extension, defaults
from the extension take precedence, and compound variants are appended.

```tsx
const iconButton = sxv.extend(button, {
  base: { borderRadius: 999 },
  variants: {
    size: { sm: { padding: 4 }, lg: { padding: 12 } },
  },
});
```

The base recipe and the extension must currently be declared in the same
module. The Babel plugin analyzes the base configuration at compile time and
does not follow imported recipes. Keep the component files separate if useful,
but declare the extended recipe beside its base and re-export it from the
component's style module:

```tsx
// button.style.ts
export const button = sxv({ /* ... */ });
export const iconButton = sxv.extend(button, { base: styles.iconButton });

// icon-button.style.ts
export { iconButton } from "../button/button.style";
```

Calling `sxv.extend` with a recipe imported from another module is not supported
yet and will remain uncompiled.

## Current limitations

- Configuration and styles must be static inline literals.
- Spreads, computed keys, external style objects and dynamic style functions are rejected.
- Boolean variants use `true` and `false` keys.
- ESM only; Babel 8 is required for the plugin.
- Slots and composition APIs are not implemented yet.

Calling `sxv()` without the Babel transform throws a configuration error.

## Development

```sh
pnpm install
pnpm check-types
pnpm --filter @stylex-variants/core test:run
pnpm build
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development and release workflow.

# API quick reference

## Single-element recipes

```ts
import { sxv, type VariantProps } from "@stylex-variants/core";

const button = sxv({
  base: { display: "inline-flex" },
  variants: {
    tone: {
      primary: { backgroundColor: "blue" },
      neutral: { backgroundColor: "gray" },
    },
    active: { true: { opacity: 1 }, false: { opacity: 0.5 } },
    size: { 1: { padding: 4 }, 2: { padding: 8 } },
  },
  defaultVariants: { tone: "primary", active: true, size: 1 },
  compoundVariants: [{ tone: "primary", active: true, style: { fontWeight: 700 } }],
});

type ButtonVariants = VariantProps<typeof button>;
const props = button({ active: false, size: 2, className: "custom" });
```

All four configuration fields are optional; `sxv({})` is valid. The result is
`(props?) => ReturnType<typeof stylex.props>`, with caller overrides merged in.
It returns element props, not a class string, raw styles, or a StyleX style
object to pass back to `stylex.props`.

## Selections and precedence

- Selections are optional. String and numeric literal keys determine accepted
  values. A group whose keys are only `true` and/or `false` accepts booleans
  (even a one-sided `true` group); mixed keys do not get boolean conversion.
- Defaults use `selection ?? default`: omitted and `undefined` selections use
  defaults, while `false` is preserved. Runtime `null` also falls back, but
  `null` is not part of the public selection type or a disable-default API.
- Variant lookup stringifies the selected value. Unknown values generally
  select no style; this is not runtime validation. Use the inferred types.
- Compound conditions use strict equality against selections after defaults.
  All conditions must match; use booleans/numbers of the correct type. Arrays
  are not OR conditions. A compound with only `style` is unconditional.
- StyleX receives base first, variants in group declaration order, then all
  matching compounds in array order. Later styles win conflicting properties.
- A truthy caller `className` is appended with a space; it is not deduplicated,
  and class-string order does not guarantee CSS precedence. Caller `style` is
  shallow-merged after generated inline styles, so caller keys win.

`VariantProps<typeof button>` includes optional `className` and `style`, not
just variant selections. It does not supply DOM props such as `onClick`.

## Slot recipes

`sxv({ slots, variants?, defaultVariants?, compoundSlots? })` returns an object
of functions keyed by declared slot names. Call `card.root({ tone: "accent" })`
and `card.title({ tone: "accent" })` individually; `card(...)` is not callable.
Selections are supplied independently to each slot; there is no shared mutable
selection state.

- `slots` maps each element name to its base style object.
- A variant value maps slot names to style objects; it may affect only some slots.
- Each `compoundSlots` entry contains scalar conditions and a `slots` style map.
- Each slot accepts variants plus `className` and `style`, and follows the same
  default, compound, and override behavior as a single-element recipe.
- Use `VariantProps<typeof card.root>`. `VariantProps<typeof card>` is `never`.
- Use `slots` instead of top-level `base`, and `compoundSlots` instead of
  `compoundVariants`; those single-element fields are not consumed by the slot path.

See [patterns](patterns.md) for a complete example and
[limitations](limitations.md) for slot validation gaps and `sxv.extend`.

## Public exports

The package root exports the runtime `sxv` and these types:

- `SXVConfig`, `SXVResult`, `SXVProps`, `StyleXCreateStyle`
- `VariantDefinition`, `VariantSelection`, `VariantProps`, `CompoundVariant`
- `SlotDefinition`, `SXVSlotsResult`, `SlotVariantDefinition`, `SlotCompoundVariant`

`SXVConfig` describes single-element recipes. The slot overload is inferred
through `sxv`; `SXVSlotsConfig` and `SXVFactory` are not root exports. Neither
are internal `VariantDefinitionOf` and `MergeVariantDefinitions` helpers.
The `@stylex-variants/core/babel` subpath exports the Babel plugin as default.
There is no public `compose` export.

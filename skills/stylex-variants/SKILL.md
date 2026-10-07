---
name: stylex-variants
description: Create and review StyleX Variants recipes and React components using the sxv API, Babel constraints, and type-safe variant patterns.
---

# StyleX Variants

Use this skill when writing or reviewing code that uses `@stylex-variants/core`.
Prefer the package's static, type-safe recipe model and keep generated examples
compatible with the Babel transform.

## Workflow

1. Identify the component states and separate recurring states into named
   variant groups.
2. Put shared, always-applied styles in `base`.
3. Add `defaultVariants` for the normal state and `compoundVariants` only for
   combinations of existing selections.
4. Derive component props with `VariantProps<typeof recipe>`.
5. Preserve caller `className` and `style` by passing them to the recipe.
6. Keep all recipe configuration and styles static and inline so the Babel
   plugin can transform them.

Read [references/api.md](references/api.md) for the configuration and return
types, [references/patterns.md](references/patterns.md) for component recipes,
and [references/limitations.md](references/limitations.md) before suggesting a
dynamic or unsupported pattern.

Do not invent `extend`, `compose`, slots, or other APIs that are not present in
the current package. If a requested pattern needs one of those APIs, explain
the limitation and show the closest supported static recipe.

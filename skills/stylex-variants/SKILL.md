---
name: stylex-variants
description: Write, integrate, debug, and review @stylex-variants/core recipes, slots, and typed components using the sxv API and its Babel transform. Use for StyleX Variants work, not general StyleX styling alone.
---

# StyleX Variants

Use the implementation available in the working project as the authority. In
this repository, inspect `packages/core/src/index.ts`, `sxv.ts`, `types.ts`,
`babel/`, and `__tests__/` under `packages/core/src` when behavior is uncertain.
README examples can lag implementation, especially for slots and extension.

## Workflow

1. Check that the variants Babel transform runs before the StyleX compiler.
   Use a named `sxv` import from `@stylex-variants/core`; import aliases work.
2. Choose a single-element recipe (`base`, `compoundVariants`) or a slot recipe
   (`slots`, `compoundSlots`). Keep configurations and style containers inline.
3. Model recurring states as variants, use defaults where appropriate, and use
   scalar compound conditions for combinations. Runtime variant selections and
   caller inline overrides are supported; dynamic recipe style functions are not.
4. Derive props from the recipe function, or from an individual slot function.
   Forward DOM props separately from variant selections. Pass caller `className`
   and `style` into the recipe or relevant slot so generated styles are retained.
5. Validate types and the actual compiler pipeline for changed examples. Type
   acceptance alone does not establish that a configuration is transformable.

Read only the references relevant to the task:

- [API](references/api.md): return shapes, selections, precedence, public types.
- [Patterns](references/patterns.md): React, slots, responsive styles, Vite setup.
- [Limitations](references/limitations.md): static syntax, missing transforms,
  and current extension and slot implementation gaps. Read before using
  `sxv.extend` or promising composition behavior.

Slots and `sxv.extend` exist, but extension is not a typed deep-merge API in the
current implementation. Do not invent `compose`, callable slot factories, or
cross-module recipe inheritance.

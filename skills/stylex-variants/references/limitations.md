# Compiler constraints and implementation gaps

## Build and static syntax

The package is ESM-only; its current Babel peer requirement is `^8.0.6`.
Run `@stylex-variants/core/babel` before the StyleX compiler and retain the
application's CSS extraction integration. The variants plugin generates
`stylex.create` and selection functions; it does not itself emit the final CSS.
The behavior tests exercise two sequential Babel passes.

Use `import { sxv } from "@stylex-variants/core"` (optionally aliased).
Namespace calls, re-export wrappers, and assigning `sxv` to another variable
are not supported recipe recognition patterns.

Single-element `sxv` calls require exactly one inline object. Keep `variants`,
variant groups, `defaultVariants`, and compound entries inline; compounds use
an inline array. Configuration spreads, methods, and computed keys are rejected.
Base, variant, and compound styles must be inline objects, not external object
identifiers or dynamic functions. Quoted group names and numeric variant keys
are supported. Keep recipes at module scope for the StyleX compilation pipeline.

The variants validator checks style containers, not every nested style value.
StyleX evaluates the contents: do not describe every identifier as forbidden.
StyleX-supported token references and static conditional values still depend
on the downstream compiler. Keep computed conditions/defaults simple and
verify the full pipeline rather than assuming Babel acceptance is sufficient.
Call-time selections and inline `style` overrides can be dynamic.

Without compilation, `sxv(config)` returns a throwing function rather than
usable styles (also for slot configurations). Calling that result throws the
setup error. Uncompiled `sxv.extend(...)` throws immediately.

## `sxv.extend` exists, with limited behavior

The current factory exposes `extend: (...args: any[]) => any`; it does not
preserve inferred variant types. The transform recognizes a base identifier
whose binding is a local variable initialized by a call with an inline object,
plus an inline extension object. Imported base recipes cannot be resolved.
Do not assume arbitrary expressions or extension chains work.

The implementation concatenates base configuration properties followed by
extension properties. Subsequent lookups use the **first** matching property.
Consequently, duplicate top-level fields keep the base field: an extension
`base`, `variants`, `defaultVariants`, or `compoundVariants` cannot override or
deep-merge the same field already present in the base. New top-level fields
can take effect when absent in the base. For example:

```ts
import { sxv } from "@stylex-variants/core";

const base = sxv({ base: { display: "inline-flex" } });
const padded = sxv.extend(base, {
  variants: { size: { sm: { padding: 4 }, lg: { padding: 8 } } },
});
// `variants` is new, so it is included; `padded` is typed as any.
// Adding another `base` here would not override the original base.
```

For reliable typed customization, define a complete inline recipe with the
intended combined styles. Do not promise the inheritance semantics shown in
older documentation. When debugging the transform, note that its member-call
guard does not currently check the member name or import source; unrelated
member calls on an imported binding named `sxv` can be misidentified. This is
an implementation defect, not an additional supported API.

## Slot-specific gaps

Slots take a separate transform path that bypasses single-recipe validation.
Unsupported spreads, external objects, or malformed entries can be skipped
instead of producing diagnostics. Use static inline maps and explicit declared
slot names; neither slot variant nor compound types restrict their style-map
keys to the declared slots, so a typo can be accepted without useful output.

Use simple identifier slot names such as `root`, `title`, and `icon`: output
keys are emitted as identifiers. Slot style keys concatenate group, value,
and slot names with underscores without the collision protection used by
single-element recipes. Avoid ambiguous combinations involving underscores.
Slot StyleX namespace reuse also lacks the single-recipe path's shadowing
checks; prefer module-scope recipes and ordinary top-level imports.

## Local verification sources

- `packages/core/src/index.ts`, `sxv.ts`, `types.ts`: exports, overloads, stubs.
- `packages/core/src/babel/transform-recipe.ts`, `helpers.ts`,
  `validate-config.ts`: selection, merging, and validation.
- `packages/core/src/babel/transform-slots.ts`, `transform-extend.ts`: gaps above.
- `packages/core/src/__tests__/babel.test.ts`: emitted code and regressions.
- `packages/core/src/__tests__/behavior.test.ts`: real StyleX CSS behavior.
- `packages/core/src/__tests__/types.test.ts`, `sxv.test.ts`: type and stub checks.

The existing slot tests mainly inspect generated code; they do not establish
full slot CSS behavior. There are no dedicated extension tests in this suite.
For changed guidance, supplement these with focused local compiler probes.

# StyleX Variants laboratory

A local React + Vite workspace for exploring the real `@stylex-variants/core`
compiler. Eight executable examples cover basic, default, compound, and boolean
variants, recipe composition, `VariantProps` inference, slots, and compound slots.
Controls drive both the preview and the generated React component from the same state.

From the repository root (Node 24+, the workspace's pnpm version):

```sh
pnpm install
pnpm --filter @stylex-variants/core build
pnpm dev:playground
```

Validation:

```sh
pnpm --filter playground build
pnpm --filter playground lint
node --experimental-strip-types --test apps/playground/tests/model.test.ts
pnpm --filter @stylex-variants/core test:run
```

The core package must have its `dist` build and declarations available before
building the playground. If an incremental core build has stale declaration
outputs, regenerate them with
`pnpm --filter @stylex-variants/core exec tsc -p tsconfig.build.json --incremental false`.

## Source organization

- `src/app`: bootstrap, document styles, application shell.
- `src/pages/playground`: workspace composition and selection state.
- `src/widgets`: source, preview, React component output, navigation, and header.
- `src/features`: clipboard interaction and schema-driven variant controls.
- `src/entities/playground-example`: example contract and resolution analysis.
- `src/shared`: StyleX tokens, preview theme, reusable UI primitives.
- `src/examples`: executable, precompiled recipes and their registry.

To add an example, place its recipe in its own `examples/` directory and register
an `Example` in `examples/index.tsx`. Declare controls, initial values, recipe
defaults, render/resolve functions, source, and generated usage. Generic widgets
accept string and boolean selections; validate them at the typed recipe boundary.
Choices with more than four options use a select. No layout changes are needed.

Source panels import recipe files with Vite's `?raw`, so copied recipes stay in
sync with the executable code. The tokens tab contains the recipe dependencies;
when copying outside this workspace, copy that file too and adjust its import.
The React component panel imports the exact `ButtonExample.tsx` or `CardExample.tsx`
module used by the live preview through `?raw`. It includes the full component
implementation and an exported `Example` that passes the current control values.
Only that invocation is generated; the component body is never reconstructed from
a separate JSX template. Copy it next to the recipe shown in the Recipe panel.
Undefined values are omitted so recipe defaults still apply; booleans remain booleans.

The slots examples use the actual `card.root(variants)`, `card.title(variants)`,
and `card.description(variants)` API. Compound Slots demonstrates a two-condition
rule affecting root and title while leaving description unchanged.

The receiving project must configure the variants Babel plugin before StyleX,
as this app does in `vite.config.ts`. Recipe source is read only: there is no
runtime compilation or arbitrary-code execution.

The composition example keeps its base and extension in the same module, as required
by the compiler. This checkout retains the first duplicate top-level configuration
key during extension, so the example inherits variants and adds base/defaults
without overlapping configuration keys. It does not claim override support.

All styling, including syntax colors, is authored in StyleX. Prism only tokenizes
code; it does not apply inline styles. The CSS entry point exists solely for
StyleX's generated CSS layers. Dark is the workspace default; the preview canvas
can independently use a light StyleX theme. No network fonts or new dependencies
are required.

## Browser regression checks

`tests/browser.mjs` uses Node's built-in WebSocket client to check actual compiled
styles, all eight examples, resets, generated components, clipboard, and small
viewports without adding a browser automation dependency. Start the app and a
separate Chromium instance with `--headless --remote-debugging-port=9227` and an
isolated temporary `--user-data-dir`, then run:

```sh
node apps/playground/tests/browser.mjs
```

`PLAYGROUND_URL` and `CDP_URL` can point at another local preview and isolated
browser, including a production preview. Do not attach this test to your daily
browser profile: it navigates a tab and grants that local origin clipboard access.

# Playground and documentation release

This release updates the website. `@stylex-variants/core` remains at `0.1.0`;
no npm version bump or package publication is required.

## Changes

- Replace the playground with an interactive StyleX workspace featuring eight
  examples: basic, default, compound and boolean variants, composition,
  TypeScript inference, slots and compound slots.
- Show the actual React component used by each preview, alongside a complete
  usage example reflecting the selected controls. Include copy and reset actions.
- Improve code formatting, syntax highlighting and responsive layouts, using
  StyleX throughout the playground.
- Align the playground navigation and logo with the documentation website.
- Add a Playground link to the documentation navbar and publish both apps in
  the same GitHub Pages deployment.
- Fix installation-command contrast in the documentation's light theme.
- Update the repository skill guidance to describe the current compiler API
  and limitations.

## Deployment

Merge the reviewed changes into `main`. The Documentation workflow builds the
core dependency, the playground with base `/stylex-variants/playground/`, and
the docs. It copies the playground into `apps/docs/build/playground/` before
uploading the combined Pages artifact.

Expected URLs after a successful deployment:

- Documentation: https://corvallo.github.io/stylex-variants/
- Playground: https://corvallo.github.io/stylex-variants/playground/

The deployment is also triggered by changes to the playground or core package.
Do not run `release:version` or `release:publish` for this website release.

## Verification

- Core regression suite and playground model/generated-code tests.
- TypeScript checks, production builds and formatting/lint checks on changed files.
- Combined artifact contains the playground HTML, JavaScript, CSS and logo at
  the configured base path.
- Browser checks cover all eight examples, compiled styles, reset, clipboard,
  generated components and mobile overflow.

After deployment, follow the Docs → Playground → Docs links, check the logo
and assets load, and exercise the Compound Slots example.

## Known limits

- Recipes are precompiled; the source panel is read only.
- The composition example uses non-overlapping configuration keys because the
  current compiler retains the first duplicate top-level extension entry.

To roll back the website, revert the release changes on `main` and let the
Documentation workflow publish the previous implementation again.

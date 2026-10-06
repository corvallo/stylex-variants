# Contributing

Use Node.js 24 or newer and pnpm 11.

```sh
pnpm install
pnpm check-types
pnpm --filter @stylex-variants/core test:run
pnpm build
```

Keep changes focused and add tests for behavior or public type changes.

## Changesets

Every user-facing change should include a changeset:

```sh
pnpm changeset
```

Use `patch` for fixes, `minor` for backwards-compatible API additions, and
`major` for breaking changes. Release automation consumes changesets to update
versions and publish packages.

## Pull requests

Target `main`. Describe user-visible behavior, include relevant tests, and call
out changes to the public API or supported toolchain.

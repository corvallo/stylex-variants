# API quick reference

## `sxv(config)`

`sxv` creates a recipe transformed by `@stylex-variants/core/babel`:

```ts
const button = sxv({
  base: {display: 'inline-flex'},
  variants: {
    tone: {
      primary: {backgroundColor: 'blue'},
      neutral: {backgroundColor: 'gray'},
    },
  },
  defaultVariants: {tone: 'primary'},
  compoundVariants: [
    {tone: 'primary', style: {fontWeight: 700}},
  ],
});
```

Configuration values:

- `base`: optional style applied to every call;
- `variants`: groups of string or boolean selections mapped to static styles;
- `defaultVariants`: values used when a selection is omitted;
- `compoundVariants`: selection conditions plus a `style` to apply.

The recipe accepts variant selections plus optional `className` and `style` and
returns the props produced by `stylex.props`.

`VariantProps<typeof recipe>` extracts the selection props for a component.

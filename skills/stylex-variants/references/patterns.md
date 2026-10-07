# Recommended patterns

## Typed React component

```tsx
import {sxv, type VariantProps} from '@stylex-variants/core';

const button = sxv({
  base: {display: 'inline-flex'},
  variants: {
    tone: {
      primary: {backgroundColor: 'blue', color: 'white'},
      neutral: {backgroundColor: 'gray', color: 'black'},
    },
    fullWidth: {
      true: {width: '100%'},
      false: {width: 'auto'},
    },
  },
  defaultVariants: {tone: 'primary', fullWidth: false},
});

type ButtonProps = VariantProps<typeof button> & {children: React.ReactNode};

export function Button({children, ...props}: ButtonProps) {
  return <button {...button(props)}>{children}</button>;
}
```

Boolean selections use `true` and `false`; an explicit `false` must be kept
when a default is `true`.

## Overrides

Pass `className` for a caller class and `style` for a local inline override.
Keep repeated states in the recipe instead of using ad hoc overrides.

## Responsive styles

Use static StyleX media query keys inside `base` or a variant style. Do not
compute breakpoints or style objects at runtime.

import type {
  CompoundVariant,
  SXVResult,
  StyleXCreateStyle,
  VariantDefinition,
  VariantSelection,
} from "./types.js";

export type SXVConfig<T extends VariantDefinition> = {
  base?: StyleXCreateStyle;
  variants?: T;
  defaultVariants?: VariantSelection<T>;
  compoundVariants?: CompoundVariant<T>[];
};

export function sxv<const T extends VariantDefinition>(_config: SXVConfig<T>): SXVResult<T> {
  return (() => {
    throw new Error(
      "sxv() must be compiled. Configure @stylex-variants/core/babel before the StyleX compiler.",
    );
  }) as SXVResult<T>;
}

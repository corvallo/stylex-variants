import type {
  CompoundVariant,
  SXVResult,
  StyleXCreateStyle,
  VariantDefinition,
  VariantSelection,
  SlotDefinition,
  SXVSlotsResult,
  SlotVariantDefinition,
  SlotCompoundVariant,
} from "./types.js";

export type SXVConfig<T extends VariantDefinition> = {
  base?: StyleXCreateStyle;
  variants?: T;
  defaultVariants?: VariantSelection<T>;
  compoundVariants?: CompoundVariant<T>[];
  slots?: never;
};

export type SXVSlotsConfig<S extends SlotDefinition, V extends SlotVariantDefinition = SlotVariantDefinition> = {
  slots: S;
  variants?: V;
  defaultVariants?: VariantSelection<V>;
  compoundSlots?: SlotCompoundVariant<V>[];
};

export function sxv<const T extends VariantDefinition>(_config: SXVConfig<T>): SXVResult<T>;
export function sxv<const S extends SlotDefinition, const V extends SlotVariantDefinition = SlotVariantDefinition>(_config: SXVSlotsConfig<S, V>): SXVSlotsResult<S, V>;
export function sxv(_config: unknown): unknown {
  return (() => {
    throw new Error(
      "sxv() must be compiled. Configure @stylex-variants/core/babel before the StyleX compiler.",
    );
  });
}

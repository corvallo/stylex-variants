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

export type SXVFactory = {
  <const T extends VariantDefinition>(config: SXVConfig<T>): SXVResult<T>;
  <const S extends SlotDefinition, const V extends SlotVariantDefinition = SlotVariantDefinition>(config: SXVSlotsConfig<S, V>): SXVSlotsResult<S, V>;
  extend: (...args: any[]) => any;
};

export const sxv: SXVFactory = Object.assign(
  (_config: unknown) => {
    return (() => {
      throw new Error("sxv() must be compiled. Configure @stylex-variants/core/babel before the StyleX compiler.");
    }) as any;
  },
  {
    extend: (_base: unknown, _config: unknown) => {
      throw new Error("sxv.extend() must be compiled. Configure @stylex-variants/core/babel before the StyleX compiler.");
    },
  },
);

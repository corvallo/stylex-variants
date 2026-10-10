import type * as stylex from "@stylexjs/stylex";

type StyleXCreateInput = Parameters<typeof stylex.create>[0];

export type StyleXCreateStyle = Exclude<StyleXCreateInput[string], (...args: never[]) => unknown>;

export type VariantDefinition = Record<string, Record<string, StyleXCreateStyle>>;

type VariantValue<T> = keyof T extends "true" | "false" ? boolean : keyof T;

export type VariantSelection<T extends VariantDefinition> = {
  -readonly [K in keyof T]?: VariantValue<T[K]>;
};

export type SXVProps<T extends VariantDefinition> = VariantSelection<T> &
  Partial<Pick<ReturnType<typeof stylex.props>, "className" | "style">>;

export type CompoundVariant<T extends VariantDefinition> = VariantSelection<T> & {
  style: StyleXCreateStyle;
};

export type SXVResult<T extends VariantDefinition> = (
  props?: SXVProps<T>,
) => ReturnType<typeof stylex.props>;

export type SlotDefinition = Record<string, StyleXCreateStyle>;
export type SlotVariantDefinition = Record<string, Record<string, Partial<SlotDefinition>>>;
export type SlotCompoundVariant<T extends SlotVariantDefinition> = VariantSelection<T> & {
  slots: Partial<SlotDefinition>;
};
export type SXVSlotsResult<T extends SlotDefinition, V extends SlotVariantDefinition = SlotVariantDefinition> = {
  [K in keyof T]: (props?: VariantSelection<V> & Partial<Pick<ReturnType<typeof stylex.props>, "className" | "style">>) => ReturnType<typeof stylex.props>;
};

export type VariantProps<T> = T extends (props?: infer Props) => ReturnType<typeof stylex.props>
  ? Props
  : never;

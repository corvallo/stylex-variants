import type { VariantDefinition, SXVConfig, MergeVariantDefinitions, VariantDefinitionOf, SXVResult } from "./types.js";

type SXVFactory = {
  <const T extends VariantDefinition>(config: SXVConfig<T>): SXVResult<T>;
  extend<const Base extends SXVResult<VariantDefinition>, const Extension extends VariantDefinition>(
    base: Base,
    config: SXVConfig<Extension>,
  ): SXVResult<MergeVariantDefinitions<VariantDefinitionOf<Base>, Extension>>;
};

export const sxv: SXVFactory = Object.assign(
  <const T extends VariantDefinition>(_config: SXVConfig<T>): SXVResult<T> => {
    return (() => {
    throw new Error(
      "sxv() must be compiled. Configure @stylex-variants/core/babel before the StyleX compiler.",
    );
    }) as SXVResult<T>;
  },
  {
    extend(_base: SXVResult<VariantDefinition>, _config: SXVConfig<VariantDefinition>) {
    throw new Error(
      "sxv.extend() must be compiled. Configure @stylex-variants/core/babel before the StyleX compiler.",
    );
    },
  },
) as SXVFactory;

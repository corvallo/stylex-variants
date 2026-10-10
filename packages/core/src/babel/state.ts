import type { NodePath, PluginPass } from "@babel/core";
import type * as t from "@babel/types";

export type PluginState = PluginPass & {
  sxvImports?: NodePath<t.ImportSpecifier>[];
  stylexLocalName?: string;
};

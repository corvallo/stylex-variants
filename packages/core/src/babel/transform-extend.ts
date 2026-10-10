import type { NodePath } from "@babel/core";
import * as t from "@babel/types";
import type { PluginState } from "./state.js";

/** Extension-specific AST helpers are kept here for future isolated transforms. */
export type ExtendTransformContext = { path: NodePath<t.CallExpression>; state: PluginState };

export function isExtendCall(path: NodePath<t.CallExpression>): boolean {
  return t.isMemberExpression(path.node.callee) && t.isIdentifier(path.node.callee.property, { name: "extend" });
}

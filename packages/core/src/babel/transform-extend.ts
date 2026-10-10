import type { NodePath } from "@babel/core";
import * as t from "@babel/types";
import type { PluginState } from "./state.js";

/** Extension-specific AST helpers are kept here for future isolated transforms. */
export type ExtendTransformContext = { path: NodePath<t.CallExpression>; state: PluginState };

export function isExtendCall(path: NodePath<t.CallExpression>): boolean {
  return t.isMemberExpression(path.node.callee) && t.isIdentifier(path.node.callee.property, { name: "extend" });
}

export function transformExtend(path: NodePath<t.CallExpression>): boolean {
  if (!t.isMemberExpression(path.node.callee) || !t.isIdentifier(path.node.callee.object)) return false;
  const binding = path.scope.getBinding(path.node.callee.object.name);
  if (!binding?.path.isImportSpecifier() || !t.isIdentifier(binding.path.node.imported, { name: "sxv" })) return false;
  const [base, extension] = path.node.arguments;
  if (!t.isIdentifier(base) || !t.isObjectExpression(extension)) return false;
  const baseBinding = path.scope.getBinding(base.name);
  const init = baseBinding?.path.isVariableDeclarator() ? baseBinding.path.node.init : null;
  if (!t.isCallExpression(init) || !t.isIdentifier(init.callee) || !t.isObjectExpression(init.arguments[0])) return false;
  const merged = t.objectExpression([...init.arguments[0].properties, ...extension.properties].map((p) => t.cloneNode(p, true)));
  path.replaceWith(t.callExpression(t.cloneNode(init.callee), [merged]));
  return true;
}

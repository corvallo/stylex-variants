import type { NodePath } from "@babel/core";
import * as t from "@babel/types";
import { getObjectProperty } from "./helpers.js";

export function isSxvCall(path: NodePath<t.CallExpression>): boolean {
  if (!t.isIdentifier(path.node.callee)) return false;
  const binding = path.scope.getBinding(path.node.callee.name);
  return Boolean(binding?.path.isImportSpecifier() && t.isIdentifier(binding.path.node.imported, { name: "sxv" }) && binding.path.parentPath.isImportDeclaration() && binding.path.parentPath.node.source.value === "@stylex-variants/core");
}

export function getInlineConfig(path: NodePath<t.CallExpression>): t.ObjectExpression {
  const [config] = path.node.arguments;
  if (path.node.arguments.length !== 1 || !t.isObjectExpression(config)) {
    throw path.buildCodeFrameError("sxv requires one inline object configuration.");
  }
  return config;
}

export function hasSlots(config: t.ObjectExpression): boolean {
  return Boolean(getObjectProperty(config, "slots"));
}

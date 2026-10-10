import type { PluginObject } from "@babel/core";
import { transformCallExpression } from "./transform-recipe.js";
import * as t from "@babel/types";
import type { PluginState } from "./state.js";
import { transformExtend } from "./transform-extend.js";

export default function stylexVariantsPlugin(): PluginObject<PluginState> {
  return {
    name: "stylex-variants",

    visitor: {
      ImportDeclaration(path, state) {
        if (path.node.source.value === "@stylex-variants/core") {
          const specifierPaths = path.get("specifiers");

          for (const specifier of specifierPaths) {
            if (
              specifier.isImportSpecifier() &&
              t.isIdentifier(specifier.node.imported, { name: "sxv" }) &&
              specifier.node.importKind !== "type" &&
              path.node.importKind !== "type"
            ) {
              (state.sxvImports ??= []).push(specifier);
            }
          }

          return;
        }

        if (path.node.source.value === "@stylexjs/stylex") {
          const stylexImport = path.node.specifiers.find(
            (specifier): specifier is t.ImportNamespaceSpecifier =>
              t.isImportNamespaceSpecifier(specifier),
          );

          if (stylexImport) {
            state.stylexLocalName = stylexImport.local.name;
          }
        }
      },

      CallExpression(path, state) {
        if (transformExtend(path)) return;
        transformCallExpression(path, state);
      },

      Program: {
        enter(path) {
          path.traverse({
            CallExpression(callPath) {
              transformExtend(callPath);
            },
          });
        },
        exit(path, state) {
          path.scope.crawl();
          for (const specifier of state.sxvImports ?? []) {
            const binding = path.scope.getBinding(specifier.node.local.name);
            if (binding?.referenced) continue;
            const declaration = specifier.parentPath;
            specifier.remove();
            if (declaration.isImportDeclaration() && declaration.node.specifiers.length === 0) {
              declaration.remove();
            }
          }
        },
      },
    },
  };
}

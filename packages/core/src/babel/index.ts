import type { NodePath, PluginObject, PluginPass } from "@babel/core";
import * as t from "@babel/types";

type PluginState = PluginPass & {
  sxvImports?: NodePath<t.ImportSpecifier>[];
  stylexLocalName?: string;
};

type VariantStyle = {
  groupName: string;
  valueName: string;
  styleName: string;
};

type CompoundCondition = {
  groupName: string;
  value: t.Expression;
};

type CompoundStyle = {
  styleName: string;
  conditions: CompoundCondition[];
};

function getObjectProperty(object: t.ObjectExpression, name: string): t.ObjectProperty | undefined {
  return object.properties.find(
    (property): property is t.ObjectProperty =>
      t.isObjectProperty(property) &&
      ((t.isIdentifier(property.key) && property.key.name === name) ||
        (t.isStringLiteral(property.key) && property.key.value === name)),
  );
}

function getPropertyName(property: t.ObjectProperty): string | undefined {
  if (t.isIdentifier(property.key)) {
    return property.key.name;
  }

  if (t.isStringLiteral(property.key) || t.isNumericLiteral(property.key)) {
    return String(property.key.value);
  }

  return undefined;
}

function mergeObjectProperties(base: t.ObjectExpression, extension: t.ObjectExpression): t.ObjectExpression {
  const properties = base.properties.map((property) => t.cloneNode(property, true));
  for (const property of extension.properties) {
    if (!t.isObjectProperty(property)) continue;
    const name = getPropertyName(property);
    const existing = properties.find(
      (candidate) => t.isObjectProperty(candidate) && getPropertyName(candidate) === name,
    );
    if (existing && t.isObjectProperty(existing)) {
      existing.value = t.cloneNode(property.value, true);
    } else {
      properties.push(t.cloneNode(property, true));
    }
  }
  return t.objectExpression(properties);
}

function mergeRecipeConfigs(base: t.ObjectExpression, extension: t.ObjectExpression): t.ObjectExpression {
  const result = t.objectExpression([]);
  const names = new Set<string>();
  for (const property of [...base.properties, ...extension.properties]) {
    if (!t.isObjectProperty(property)) continue;
    const name = getPropertyName(property);
    if (!name || names.has(name)) continue;
    names.add(name);
    const baseProperty = getObjectProperty(base, name);
    const extensionProperty = getObjectProperty(extension, name);
    if (name === "variants" && baseProperty && extensionProperty && t.isObjectExpression(baseProperty.value) && t.isObjectExpression(extensionProperty.value)) {
      const groups = t.objectExpression([]);
      const groupNames = new Set<string>();
      for (const group of [...baseProperty.value.properties, ...extensionProperty.value.properties]) {
        if (!t.isObjectProperty(group)) continue;
        const groupName = getPropertyName(group);
        if (!groupName || groupNames.has(groupName)) continue;
        groupNames.add(groupName);
        const oldGroup = baseProperty.value.properties.find((item) => t.isObjectProperty(item) && getPropertyName(item) === groupName);
        const newGroup = extensionProperty.value.properties.find((item) => t.isObjectProperty(item) && getPropertyName(item) === groupName);
        if (oldGroup && newGroup && t.isObjectProperty(oldGroup) && t.isObjectProperty(newGroup) && t.isObjectExpression(oldGroup.value) && t.isObjectExpression(newGroup.value)) {
          groups.properties.push(t.objectProperty(t.stringLiteral(groupName), mergeObjectProperties(oldGroup.value, newGroup.value)));
        } else groups.properties.push(t.cloneNode(group, true));
      }
      result.properties.push(t.objectProperty(t.stringLiteral(name), groups));
    } else if (name === "compoundVariants" && baseProperty && extensionProperty && t.isArrayExpression(baseProperty.value) && t.isArrayExpression(extensionProperty.value)) {
      result.properties.push(t.objectProperty(t.stringLiteral(name), t.arrayExpression([...baseProperty.value.elements, ...extensionProperty.value.elements].map((element) => element && t.cloneNode(element, true)))));
    } else if (name === "base" && baseProperty && extensionProperty && t.isObjectExpression(baseProperty.value) && t.isObjectExpression(extensionProperty.value)) {
      result.properties.push(t.objectProperty(t.stringLiteral(name), mergeObjectProperties(baseProperty.value, extensionProperty.value)));
    } else if (name === "defaultVariants" && baseProperty && extensionProperty && t.isObjectExpression(baseProperty.value) && t.isObjectExpression(extensionProperty.value)) {
      result.properties.push(t.objectProperty(t.stringLiteral(name), mergeObjectProperties(baseProperty.value, extensionProperty.value)));
    } else if (extensionProperty) result.properties.push(t.cloneNode(extensionProperty, true));
    else if (baseProperty) result.properties.push(t.cloneNode(baseProperty, true));
  }
  return result;
}

function normaliseVariantValue(expression: t.Expression): t.Expression {
  return t.callExpression(t.identifier("String"), [expression]);
}

function createSelectedVariantValue(
  propsIdentifier: t.Identifier,
  groupName: string,
  defaults: Map<string, t.Expression>,
): t.Expression {
  const propValue = t.memberExpression(propsIdentifier, t.stringLiteral(groupName), true);

  const defaultValue = defaults.get(groupName);

  if (!defaultValue) {
    return propValue;
  }

  return t.logicalExpression("??", propValue, t.cloneNode(defaultValue, true));
}

function createCompoundCondition(
  propsIdentifier: t.Identifier,
  condition: CompoundCondition,
  defaults: Map<string, t.Expression>,
): t.Expression {
  const selectedValue = createSelectedVariantValue(propsIdentifier, condition.groupName, defaults);

  return t.binaryExpression("===", selectedValue, t.cloneNode(condition.value, true));
}

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
        if (!t.isIdentifier(path.node.callee)) return;
        const binding = path.scope.getBinding(path.node.callee.name);
        if (
          !binding?.path.isImportSpecifier() ||
          !t.isIdentifier(binding.path.node.imported, { name: "sxv" }) ||
          !binding.path.parentPath.isImportDeclaration() ||
          binding.path.parentPath.node.source.value !== "@stylex-variants/core"
        )
          return;

        const [config] = path.node.arguments;
        if (path.node.arguments.length !== 1 || !t.isObjectExpression(config)) {
          throw path.buildCodeFrameError("sxv requires one inline object configuration.");
        }
        const validateObject = (object: t.ObjectExpression) => {
          for (const property of object.properties) {
            if (
              !t.isObjectProperty(property) ||
              property.computed ||
              getPropertyName(property) === undefined ||
              !t.isExpression(property.value)
            ) {
              throw path.buildCodeFrameError(
                "sxv configuration requires static properties; spreads, methods and computed keys are not supported.",
              );
            }
          }
        };
        const validateStyle = (value: t.Node) => {
          if (!t.isObjectExpression(value)) {
            throw path.buildCodeFrameError(
              "sxv styles must be inline objects; dynamic style functions are not supported in this release.",
            );
          }
        };
        validateObject(config);
        for (const property of config.properties) {
          if (!t.isObjectProperty(property)) continue;
          const name = getPropertyName(property);
          if (name === "base") validateStyle(property.value);
          if (name === "variants" || name === "defaultVariants") {
            if (!t.isObjectExpression(property.value)) {
              throw path.buildCodeFrameError(
                "sxv variants and defaultVariants must be inline objects.",
              );
            }
            validateObject(property.value);
            if (name === "variants") {
              for (const group of property.value.properties) {
                if (!t.isObjectProperty(group) || !t.isObjectExpression(group.value)) {
                  throw path.buildCodeFrameError("sxv variant groups must be inline objects.");
                }
                validateObject(group.value);
                for (const variant of group.value.properties) {
                  if (t.isObjectProperty(variant)) validateStyle(variant.value);
                }
              }
            }
          }
          if (name === "compoundVariants") {
            if (!t.isArrayExpression(property.value)) {
              throw path.buildCodeFrameError("sxv compoundVariants must be an inline array.");
            }
            for (const compound of property.value.elements) {
              if (!t.isObjectExpression(compound)) {
                throw path.buildCodeFrameError("sxv compound variants must be inline objects.");
              }
              validateObject(compound);
              const compoundStyle = getObjectProperty(compound, "style");
              if (compoundStyle) validateStyle(compoundStyle.value);
              if (!compoundStyle) {
                throw path.buildCodeFrameError("sxv compound variants require a style property.");
              }
            }
          }
        }

        const baseProperty = getObjectProperty(config, "base");

        const variantsProperty = getObjectProperty(config, "variants");

        const defaultVariantsProperty = getObjectProperty(config, "defaultVariants");

        const compoundVariantsProperty = getObjectProperty(config, "compoundVariants");

        const program = path.findParent((parent) => parent.isProgram());

        if (!program || !program.isProgram()) {
          return;
        }

        /*
         * Ensure StyleX import.
         */
        state.stylexLocalName = undefined;
        for (const declaration of program.get("body")) {
          if (
            !declaration.isImportDeclaration() ||
            declaration.node.source.value !== "@stylexjs/stylex" ||
            declaration.node.importKind === "type"
          )
            continue;
          for (const specifier of declaration.get("specifiers")) {
            if (
              specifier.isImportNamespaceSpecifier() &&
              path.scope.getBinding(specifier.node.local.name)?.path === specifier
            ) {
              state.stylexLocalName = specifier.node.local.name;
            }
          }
        }
        if (!state.stylexLocalName) {
          const stylexIdentifier = program.scope.generateUidIdentifier("stylex");

          const stylexImport = t.importDeclaration(
            [t.importNamespaceSpecifier(stylexIdentifier)],
            t.stringLiteral("@stylexjs/stylex"),
          );

          const [insertedImport] = program.unshiftContainer("body", stylexImport);
          if (insertedImport) program.scope.registerDeclaration(insertedImport);

          state.stylexLocalName = stylexIdentifier.name;
        }

        const stylexIdentifier = t.identifier(state.stylexLocalName);

        const stylesIdentifier = path.scope.generateUidIdentifier("styles");

        const styleProperties: t.ObjectProperty[] = [];

        /*
         * BASE
         */
        if (baseProperty && t.isExpression(baseProperty.value)) {
          styleProperties.push(t.objectProperty(t.identifier("base"), baseProperty.value));
        }

        /*
         * VARIANTS
         */
        const variantStyles: VariantStyle[] = [];

        if (variantsProperty && t.isObjectExpression(variantsProperty.value)) {
          for (const groupProperty of variantsProperty.value.properties) {
            if (!t.isObjectProperty(groupProperty) || !t.isObjectExpression(groupProperty.value)) {
              continue;
            }

            const groupName = getPropertyName(groupProperty);

            if (groupName === undefined) {
              continue;
            }

            for (const valueProperty of groupProperty.value.properties) {
              if (!t.isObjectProperty(valueProperty) || !t.isExpression(valueProperty.value)) {
                continue;
              }

              const valueName = getPropertyName(valueProperty);

              if (valueName === undefined) {
                continue;
              }

              const styleName = `variant_${groupName.length}_${groupName}_${valueName}`;

              styleProperties.push(
                t.objectProperty(t.stringLiteral(styleName), valueProperty.value),
              );

              variantStyles.push({
                groupName,
                valueName,
                styleName,
              });
            }
          }
        }

        /*
         * COMPOUND VARIANTS
         */
        const compoundStyles: CompoundStyle[] = [];

        if (compoundVariantsProperty && t.isArrayExpression(compoundVariantsProperty.value)) {
          compoundVariantsProperty.value.elements.forEach((element, index) => {
            if (!element || !t.isObjectExpression(element)) {
              return;
            }

            const styleProperty = getObjectProperty(element, "style");

            if (!styleProperty || !t.isExpression(styleProperty.value)) {
              return;
            }

            const styleName = `compound_${index}`;

            const conditions: CompoundCondition[] = [];

            for (const property of element.properties) {
              if (!t.isObjectProperty(property)) {
                continue;
              }

              const propertyName = getPropertyName(property);

              if (
                propertyName === undefined ||
                propertyName === "style" ||
                !t.isExpression(property.value)
              ) {
                continue;
              }

              conditions.push({
                groupName: propertyName,

                value: property.value,
              });
            }

            styleProperties.push(t.objectProperty(t.stringLiteral(styleName), styleProperty.value));

            compoundStyles.push({
              styleName,
              conditions,
            });
          });
        }

        /*
         * const _styles =
         *   stylex.create({...});
         */
        const stylexCreate = t.callExpression(
          t.memberExpression(stylexIdentifier, t.identifier("create")),
          [t.objectExpression(styleProperties)],
        );

        const declaration = t.variableDeclaration("const", [
          t.variableDeclarator(stylesIdentifier, stylexCreate),
        ]);

        const statement = path.getStatementParent();

        if (!statement) {
          return;
        }

        statement.insertBefore(declaration);

        /*
         * DEFAULT VARIANTS
         */
        const defaults = new Map<string, t.Expression>();

        if (defaultVariantsProperty && t.isObjectExpression(defaultVariantsProperty.value)) {
          for (const property of defaultVariantsProperty.value.properties) {
            if (!t.isObjectProperty(property) || !t.isExpression(property.value)) {
              continue;
            }

            const name = getPropertyName(property);

            if (name === undefined) {
              continue;
            }

            defaults.set(name, property.value);
          }
        }

        const propsIdentifier = path.scope.generateUidIdentifier("props");

        const styleArguments: t.Expression[] = [];

        /*
         * BASE runtime style.
         */
        if (baseProperty) {
          styleArguments.push(t.memberExpression(stylesIdentifier, t.identifier("base")));
        }

        /*
         * Raggruppiamo le variants.
         */
        const groups = new Map<string, VariantStyle[]>();

        for (const variant of variantStyles) {
          const existing = groups.get(variant.groupName) ?? [];

          existing.push(variant);

          groups.set(variant.groupName, existing);
        }

        /*
         * Variant runtime selection.
         */
        for (const [groupName] of groups) {
          const selectedValue = createSelectedVariantValue(propsIdentifier, groupName, defaults);

          const normalisedValue = normaliseVariantValue(selectedValue);

          const styleKey = t.binaryExpression(
            "+",
            t.stringLiteral(`variant_${groupName.length}_${groupName}_`),
            normalisedValue,
          );

          styleArguments.push(t.memberExpression(stylesIdentifier, styleKey, true));
        }

        /*
         * COMPOUND runtime selection.
         */
        for (const compound of compoundStyles) {
          if (compound.conditions.length === 0) {
            styleArguments.push(
              t.memberExpression(stylesIdentifier, t.stringLiteral(compound.styleName), true),
            );

            continue;
          }

          const conditions = compound.conditions.map((condition) =>
            createCompoundCondition(propsIdentifier, condition, defaults),
          );

          const compoundMatch = conditions.reduce((match, condition) =>
            t.logicalExpression("&&", match, condition),
          );

          const compoundStyle = t.memberExpression(
            stylesIdentifier,
            t.stringLiteral(compound.styleName),
            true,
          );

          styleArguments.push(t.logicalExpression("&&", compoundMatch, compoundStyle));
        }

        /*
         * stylex.props(...)
         */
        const stylexProps = t.callExpression(
          t.memberExpression(stylexIdentifier, t.identifier("props")),
          styleArguments,
        );

        /*
         * (props = {}) =>
         *   stylex.props(...)
         */
        const resultIdentifier = path.scope.generateUidIdentifier("result");
        const className = t.conditionalExpression(
          t.memberExpression(propsIdentifier, t.identifier("className")),
          t.conditionalExpression(
            t.memberExpression(resultIdentifier, t.identifier("className")),
            t.binaryExpression(
              "+",
              t.binaryExpression(
                "+",
                t.memberExpression(resultIdentifier, t.identifier("className")),
                t.stringLiteral(" "),
              ),
              t.memberExpression(propsIdentifier, t.identifier("className")),
            ),
            t.memberExpression(propsIdentifier, t.identifier("className")),
          ),
          t.memberExpression(resultIdentifier, t.identifier("className")),
        );
        const style = t.conditionalExpression(
          t.memberExpression(propsIdentifier, t.identifier("style")),
          t.callExpression(t.memberExpression(t.identifier("Object"), t.identifier("assign")), [
            t.objectExpression([]),
            t.memberExpression(resultIdentifier, t.identifier("style")),
            t.memberExpression(propsIdentifier, t.identifier("style")),
          ]),
          t.memberExpression(resultIdentifier, t.identifier("style")),
        );
        const runtimeFunction = t.arrowFunctionExpression(
          [t.assignmentPattern(propsIdentifier, t.objectExpression([]))],
          t.blockStatement([
            t.variableDeclaration("const", [t.variableDeclarator(resultIdentifier, stylexProps)]),
            t.returnStatement(
              t.objectExpression([
                t.spreadElement(resultIdentifier),
                t.objectProperty(t.identifier("className"), className),
                t.objectProperty(t.identifier("style"), style),
              ]),
            ),
          ]),
        );

        path.replaceWith(runtimeFunction);
      },

      Program: {
        enter(path) {
          path.traverse({
            CallExpression(callPath) {
              const call = callPath.node;
              if (!t.isMemberExpression(call.callee) || !t.isIdentifier(call.callee.object) || !t.isIdentifier(call.callee.property, { name: "extend" })) return;
              const binding = callPath.scope.getBinding(call.callee.object.name);
              if (!binding?.path.isImportSpecifier() || !t.isIdentifier(binding.path.node.imported, { name: "sxv" })) return;
              const [baseReference, extension] = call.arguments;
              if (!t.isIdentifier(baseReference) || !t.isObjectExpression(extension)) return;
              const baseBinding = callPath.scope.getBinding(baseReference.name);
              if (!baseBinding?.path.isVariableDeclarator() || !t.isCallExpression(baseBinding.path.node.init)) return;
              const baseCall = baseBinding.path.node.init;
              if (!t.isIdentifier(baseCall.callee) || baseCall.arguments.length !== 1 || !t.isObjectExpression(baseCall.arguments[0])) return;
              callPath.replaceWith(t.callExpression(t.cloneNode(baseCall.callee), [mergeRecipeConfigs(baseCall.arguments[0], extension)]));
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

import type { NodePath } from "@babel/core";
import * as t from "@babel/types";
import type { PluginState } from "./state.js";
import { createCompoundCondition, createSelectedVariantValue, getObjectProperty, getPropertyName, normaliseVariantValue } from "./helpers.js";
import { getInlineConfig, isSxvCall } from "./guards.js";
import { validateRecipeConfig } from "./validate-config.js";
import { transformSlots } from "./transform-slots.js";

type VariantStyle = { groupName: string; valueName: string; styleName: string };
type CompoundCondition = { groupName: string; value: t.Expression };
type CompoundStyle = { styleName: string; conditions: CompoundCondition[] };

export function transformCallExpression(path: NodePath<t.CallExpression>, state: PluginState) {
        if (!isSxvCall(path)) return;

        const config = getInlineConfig(path);
        if (transformSlots(path, state, config)) return;
        const error = (message: string): never => {
          throw path.buildCodeFrameError(message);
        };
        validateRecipeConfig(config, error);
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
}

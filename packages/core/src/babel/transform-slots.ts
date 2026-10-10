import type { NodePath } from "@babel/core";
import * as t from "@babel/types";
import type { PluginState } from "./state.js";
import { getObjectProperty, getPropertyName } from "./helpers.js";
import { hasSlots } from "./guards.js";

export function transformSlots(path: NodePath<t.CallExpression>, state: PluginState, config: t.ObjectExpression): boolean | undefined {
  const slotsProperty = getObjectProperty(config, "slots");
  if (hasSlots(config) && slotsProperty && t.isObjectExpression(slotsProperty.value)) {
          const slotsProperty = getObjectProperty(config, "slots");
          if (hasSlots(config) && slotsProperty && t.isObjectExpression(slotsProperty.value)) {
            const program = path.findParent((parent) => parent.isProgram());
            if (!program?.isProgram()) return;
            let stylexName = state.stylexLocalName;
            if (!stylexName) {
              const id = program.scope.generateUidIdentifier("stylex");
              const [decl] = program.unshiftContainer("body", t.importDeclaration([t.importNamespaceSpecifier(id)], t.stringLiteral("@stylexjs/stylex")));
              if (decl) program.scope.registerDeclaration(decl);
              stylexName = id.name;
              state.stylexLocalName = stylexName;
            }
            const stylesId = path.scope.generateUidIdentifier("slotStyles");
            const styleProperties: t.ObjectProperty[] = [];
            const slotNames: string[] = [];
            const variantsProperty = getObjectProperty(config, "variants");
            const defaultsProperty = getObjectProperty(config, "defaultVariants");
            const compoundSlotsProperty = getObjectProperty(config, "compoundSlots");
            const variantGroups: { group: string; value: string; slot: string; key: string }[] = [];
            const compounds: { index: number; slot: string; conditions: { group: string; value: t.Expression }[]; key: string }[] = [];
            for (const property of slotsProperty.value.properties) {
              if (!t.isObjectProperty(property) || !t.isObjectExpression(property.value)) continue;
              const name = getPropertyName(property);
              if (!name) continue;
              slotNames.push(name);
              styleProperties.push(t.objectProperty(t.stringLiteral(name), t.cloneNode(property.value, true)));
            }
            if (variantsProperty && t.isObjectExpression(variantsProperty.value)) {
              for (const group of variantsProperty.value.properties) {
                if (!t.isObjectProperty(group) || !t.isObjectExpression(group.value)) continue;
                const groupName = getPropertyName(group);
                if (!groupName) continue;
                for (const value of group.value.properties) {
                  if (!t.isObjectProperty(value) || !t.isObjectExpression(value.value)) continue;
                  const valueName = getPropertyName(value);
                  if (!valueName) continue;
                  for (const slot of value.value.properties) {
                    if (!t.isObjectProperty(slot) || !t.isObjectExpression(slot.value)) continue;
                    const slotName = getPropertyName(slot);
                    if (!slotName) continue;
                    const key = `variant_${groupName}_${valueName}_${slotName}`;
                    styleProperties.push(t.objectProperty(t.stringLiteral(key), t.cloneNode(slot.value, true)));
                    variantGroups.push({ group: groupName, value: valueName, slot: slotName, key });
                  }
                }
              }
            }
            if (compoundSlotsProperty && t.isArrayExpression(compoundSlotsProperty.value)) {
              compoundSlotsProperty.value.elements.forEach((element, index) => {
                if (!element || !t.isObjectExpression(element)) return;
                const slotsProperty = getObjectProperty(element, "slots");
                if (!slotsProperty || !t.isObjectExpression(slotsProperty.value)) return;
                const conditions: { group: string; value: t.Expression }[] = [];
                for (const property of element.properties) {
                  if (!t.isObjectProperty(property) || getPropertyName(property) === "slots" || !t.isExpression(property.value)) continue;
                  const group = getPropertyName(property);
                  if (group) conditions.push({ group, value: property.value });
                }
                for (const slot of slotsProperty.value.properties) {
                  if (!t.isObjectProperty(slot) || !t.isObjectExpression(slot.value)) continue;
                  const slotName = getPropertyName(slot);
                  if (!slotName) continue;
                  const key = `compound_${index}_${slotName}`;
                  styleProperties.push(t.objectProperty(t.stringLiteral(key), t.cloneNode(slot.value, true)));
                  compounds.push({ index, slot: slotName, conditions, key });
                }
              });
            }
            const declaration = t.variableDeclaration("const", [t.variableDeclarator(stylesId, t.callExpression(t.memberExpression(t.identifier(stylexName), t.identifier("create")), [t.objectExpression(styleProperties)]))]);
            const statement = path.getStatementParent();
            if (!statement) return;
            statement.insertBefore(declaration);
            const propsId = path.scope.generateUidIdentifier("slotProps");
            const resultId = path.scope.generateUidIdentifier("slotResult");
            const defaults = new Map<string, t.Expression>();
            if (defaultsProperty && t.isObjectExpression(defaultsProperty.value)) for (const p of defaultsProperty.value.properties) if (t.isObjectProperty(p)) { const n = getPropertyName(p); if (n && t.isExpression(p.value)) defaults.set(n, p.value); }
            const slots = slotNames.map((name) => {
              const args: t.Expression[] = [t.memberExpression(stylesId, t.stringLiteral(name), true)];
              for (const group of new Set(variantGroups.map((v) => v.group))) {
                const selected = t.memberExpression(propsId, t.stringLiteral(group), true);
                const fallback = defaults.get(group);
                const value = fallback ? t.logicalExpression("??", selected, t.cloneNode(fallback)) : selected;
                const key = t.binaryExpression("+", t.binaryExpression("+", t.stringLiteral(`variant_${group}_`), t.callExpression(t.identifier("String"), [value])), t.binaryExpression("+", t.stringLiteral("_"), t.stringLiteral(name)));
                args.push(t.memberExpression(stylesId, key, true));
              }
              for (const compound of compounds.filter((item) => item.slot === name)) {
                const checks = compound.conditions.map((condition) => {
                  const selected = t.memberExpression(propsId, t.stringLiteral(condition.group), true);
                  const fallback = defaults.get(condition.group);
                  const value = fallback ? t.logicalExpression("??", selected, t.cloneNode(fallback)) : selected;
                  return t.binaryExpression("===", value, t.cloneNode(condition.value));
                });
                const match: t.Expression = checks.length === 0 ? t.booleanLiteral(true) : checks.slice(1).reduce<t.Expression>((a, b) => t.logicalExpression("&&", a, b), checks[0]!);
                args.push(t.logicalExpression("&&", match, t.memberExpression(stylesId, t.stringLiteral(compound.key), true)));
              }
              return t.objectProperty(t.identifier(name), t.arrowFunctionExpression([t.assignmentPattern(propsId, t.objectExpression([]))], t.blockStatement([
              t.variableDeclaration("const", [t.variableDeclarator(resultId, t.callExpression(t.memberExpression(t.identifier(stylexName!), t.identifier("props")), args))]),
              t.returnStatement(t.objectExpression([
                t.spreadElement(resultId),
                t.objectProperty(t.identifier("className"), t.conditionalExpression(t.memberExpression(propsId, t.identifier("className")), t.conditionalExpression(t.memberExpression(resultId, t.identifier("className")), t.binaryExpression("+", t.binaryExpression("+", t.memberExpression(resultId, t.identifier("className")), t.stringLiteral(" ")), t.memberExpression(propsId, t.identifier("className"))), t.memberExpression(propsId, t.identifier("className"))), t.memberExpression(resultId, t.identifier("className")))),
                t.objectProperty(t.identifier("style"), t.conditionalExpression(t.memberExpression(propsId, t.identifier("style")), t.callExpression(t.memberExpression(t.identifier("Object"), t.identifier("assign")), [t.objectExpression([]), t.memberExpression(resultId, t.identifier("style")), t.memberExpression(propsId, t.identifier("style"))]), t.memberExpression(resultId, t.identifier("style")))),
              ])),
            ])));
            });
            path.replaceWith(t.objectExpression(slots));
            return;
          }
  }
  return false;

}

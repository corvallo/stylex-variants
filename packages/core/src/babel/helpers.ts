import * as t from "@babel/types";

export type CompoundCondition = { groupName: string; value: t.Expression };

export function getObjectProperty(object: t.ObjectExpression, name: string): t.ObjectProperty | undefined {
  return object.properties.find((property): property is t.ObjectProperty =>
    t.isObjectProperty(property) && ((t.isIdentifier(property.key) && property.key.name === name) || (t.isStringLiteral(property.key) && property.key.value === name)));
}

export function getPropertyName(property: t.ObjectProperty): string | undefined {
  if (t.isIdentifier(property.key)) return property.key.name;
  if (t.isStringLiteral(property.key) || t.isNumericLiteral(property.key)) return String(property.key.value);
  return undefined;
}

export function normaliseVariantValue(expression: t.Expression): t.Expression {
  return t.callExpression(t.identifier("String"), [expression]);
}

export function createSelectedVariantValue(props: t.Identifier, group: string, defaults: Map<string, t.Expression>): t.Expression {
  const value = t.memberExpression(props, t.stringLiteral(group), true);
  const fallback = defaults.get(group);
  return fallback ? t.logicalExpression("??", value, t.cloneNode(fallback, true)) : value;
}

export function createCompoundCondition(props: t.Identifier, condition: CompoundCondition, defaults: Map<string, t.Expression>): t.Expression {
  return t.binaryExpression("===", createSelectedVariantValue(props, condition.groupName, defaults), t.cloneNode(condition.value, true));
}

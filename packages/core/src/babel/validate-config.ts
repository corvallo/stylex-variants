import * as t from "@babel/types";
import { getObjectProperty, getPropertyName } from "./helpers.js";

export function validateObject(object: t.ObjectExpression, error: (message: string) => never): void {
  for (const property of object.properties) {
    if (!t.isObjectProperty(property) || property.computed || getPropertyName(property) === undefined || !t.isExpression(property.value)) {
      error("sxv configuration requires static properties; spreads, methods and computed keys are not supported.");
    }
  }
}

export function validateStyle(value: t.Node, error: (message: string) => never): void {
  if (!t.isObjectExpression(value)) error("sxv styles must be inline objects; dynamic style functions are not supported in this release.");
}

export function validateRecipeConfig(config: t.ObjectExpression, error: (message: string) => never): void {
  validateObject(config, error);
  for (const property of config.properties) {
    if (!t.isObjectProperty(property)) continue;
    const name = getPropertyName(property);
    if (name === "base") validateStyle(property.value, error);
    if (name === "variants" || name === "defaultVariants") {
      if (!t.isObjectExpression(property.value)) error(`sxv ${name} must be an inline object.`);
      validateObject(property.value as t.ObjectExpression, error);
      if (name === "variants") for (const group of (property.value as t.ObjectExpression).properties) {
        if (!t.isObjectProperty(group) || !t.isObjectExpression(group.value)) error("sxv variant groups must be inline objects.");
        validateObject(group.value as t.ObjectExpression, error);
        for (const variant of (group.value as t.ObjectExpression).properties) if (t.isObjectProperty(variant)) validateStyle(variant.value, error);
      }
    }
    if (name === "compoundVariants") {
      if (!t.isArrayExpression(property.value)) error("sxv compoundVariants must be an inline array.");
      for (const compound of (property.value as t.ArrayExpression).elements) {
        if (!t.isObjectExpression(compound)) error("sxv compound variants must be inline objects.");
        validateObject(compound, error);
        const style = getObjectProperty(compound, "style");
        if (!style) error("sxv compound variants require a style property.");
        validateStyle(style.value, error);
      }
    }
    if (name === "compoundSlots") {
      if (!t.isArrayExpression(property.value)) error("sxv compoundSlots must be an inline array.");
    }
  }
}

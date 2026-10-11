import assert from "node:assert/strict";
import { test } from "node:test";
import { matches, resolveSelection } from "../src/entities/playground-example/index.ts";
import type { Example } from "../src/entities/playground-example/index.ts";
import { componentUsage } from "../src/examples/component-usage.ts";
import { readFileSync } from "node:fs";
import ts from "typescript";

const example: Example = {
  id: "test",
  name: "Test",
  concept: "",
  source: "",
  defaults: { tone: "primary", size: "md", disabled: true },
  initial: {},
  controls: [],
  resolve: () => ({}),
  render: () => null,
  usage: () => "",
};
test("omitted and undefined props inherit defaults, explicit false overrides true", () => {
  assert.deepEqual(resolveSelection(example, { tone: undefined, disabled: false }), {
    tone: "primary",
    size: "md",
    disabled: false,
  });
  assert.deepEqual(example.defaults, { tone: "primary", size: "md", disabled: true });
});
test("compound conditions require every selected value, including booleans", () => {
  const resolved = resolveSelection(example, { size: "lg" });
  assert.equal(matches({ tone: "primary", size: "lg" }, resolved), true);
  assert.equal(matches({ tone: "outline", size: "lg" }, resolved), false);
  assert.equal(matches({ disabled: false }, resolved), false);
});

test("generated component preserves actual source and omits undefined defaults", () => {
  const source =
    "export function Demo({ variants }: { variants: { disabled?: boolean } }) { return <button disabled={variants.disabled} />; }";
  const generated = componentUsage(source, "Demo", { tone: undefined, disabled: false });
  assert.ok(generated.startsWith(source));
  assert.doesNotMatch(generated, /"tone"/);
  assert.match(generated, /"disabled": false/);
  assert.match(generated, /export default function Example/);
  assert.match(componentUsage(source, "Demo", {}), /<Demo variants=\{\{\}\} \/>/);
});
for (const folder of [
  "basic-variants",
  "default-variants",
  "compound-variants",
  "boolean-variants",
  "composition",
  "typescript-inference",
  "slots",
  "compound-slots",
]) {
  test(`${folder} output embeds its executable React component and parses as TSX`, () => {
    const name = folder.includes("slots") ? "CardExample" : "ButtonExample";
    const source = readFileSync(
      new URL(`../src/examples/${folder}/${name}.tsx`, import.meta.url),
      "utf8",
    );
    const selection = folder.includes("slots")
      ? { tone: "accent", density: "compact" }
      : {
          tone: "primary",
          size: "lg",
          ...(folder === "boolean-variants" ? { disabled: true } : {}),
        };
    const generated = componentUsage(source, name, selection);
    assert.ok(generated.startsWith(source.trim()));
    assert.match(generated, new RegExp(`<${name}\\s+variants=`));
    const result = ts.transpileModule(generated, {
      fileName: "Example.tsx",
      compilerOptions: { jsx: ts.JsxEmit.ReactJSX },
      reportDiagnostics: true,
    });
    assert.deepEqual(result.diagnostics, []);
  });
}

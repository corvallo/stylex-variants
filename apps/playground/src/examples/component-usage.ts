import type { Selection } from "../entities/playground-example";

export function componentUsage(source: string, component: string, selection: Selection): string {
  const values = Object.fromEntries(
    Object.entries(selection).filter(([, value]) => value !== undefined),
  );
  const props = JSON.stringify(values, null, 2).replaceAll("\n", "\n      ");
  const element = Object.keys(values).length
    ? `<${component}\n      variants={${props}}\n    />`
    : `<${component} variants={{}} />`;
  return `${source.trim()}\n\nexport default function Example() {\n  return (\n    ${element}\n  );\n}\n`;
}

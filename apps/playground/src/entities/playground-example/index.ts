import type { ReactNode } from "react";
export type Selection = Record<string, string | boolean | undefined>;
export type Control = {
  key: keyof Selection;
  label: string;
  kind: "choice" | "boolean";
  options?: readonly string[];
  allowDefault?: boolean;
};
export type ResolvedProps = { className?: string; style?: Record<string, string | number> };
export type Example = {
  id: string;
  name: string;
  concept: string;
  source: string;
  filename?: string;
  initial: Selection;
  defaults: Selection;
  controls: readonly Control[];
  resolve: (selection: Selection) => ResolvedProps;
  render: (selection: Selection) => ReactNode;
  usage: (selection: Selection) => string;
  compounds?: readonly { when: Selection; effect: string }[];
};
export function resolveSelection(example: Example, selection: Selection): Selection {
  return {
    ...example.defaults,
    ...Object.fromEntries(Object.entries(selection).filter(([, value]) => value !== undefined)),
  };
}
export function matches(when: Selection, selection: Selection): boolean {
  return Object.entries(when).every(([key, value]) => selection[key as keyof Selection] === value);
}

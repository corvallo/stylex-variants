import { card as slots } from "./slots/card";
import slotsSource from "./slots/card.ts?raw";
import { CardExample as SlotsExample, type CardVariants } from "./slots/CardExample";
import slotsComponent from "./slots/CardExample.tsx?raw";
import { card as compoundSlots } from "./compound-slots/card";
import compoundSlotsSource from "./compound-slots/card.ts?raw";
import { CardExample as CompoundSlotsExample } from "./compound-slots/CardExample";
import compoundSlotsComponent from "./compound-slots/CardExample.tsx?raw";
import { ButtonExample as TypedExample } from "./typescript-inference/ButtonExample";
import typedComponent from "./typescript-inference/ButtonExample.tsx?raw";
import { ButtonExample as ComposedExample } from "./composition/ButtonExample";
import composedComponent from "./composition/ButtonExample.tsx?raw";
import { ButtonExample as BooleanExample } from "./boolean-variants/ButtonExample";
import booleanComponent from "./boolean-variants/ButtonExample.tsx?raw";
import { ButtonExample as CompoundExample } from "./compound-variants/ButtonExample";
import compoundComponent from "./compound-variants/ButtonExample.tsx?raw";
import { ButtonExample as DefaultExample } from "./default-variants/ButtonExample";
import defaultComponent from "./default-variants/ButtonExample.tsx?raw";
import { ButtonExample as BasicExample } from "./basic-variants/ButtonExample";
import basicComponent from "./basic-variants/ButtonExample.tsx?raw";
import type { VariantProps } from "@stylex-variants/core";
import type { Example, Selection, Control } from "../entities/playground-example";
import { componentUsage } from "./component-usage";
import { button as basic } from "./basic-variants/button";
import basicSource from "./basic-variants/button.ts?raw";
import { button as defaults } from "./default-variants/button";
import defaultSource from "./default-variants/button.ts?raw";
import { button as compound } from "./compound-variants/button";
import compoundSource from "./compound-variants/button.ts?raw";
import { button as boolean } from "./boolean-variants/button";
import booleanSource from "./boolean-variants/button.ts?raw";
import { button as composed } from "./composition/button";
import compositionSource from "./composition/button.ts?raw";
import { button as typed } from "./typescript-inference/button";
import typedSource from "./typescript-inference/button.tsx?raw";

const choices: readonly Control[] = [
  { key: "tone", label: "Tone", kind: "choice", options: ["primary", "neutral", "outline"] },
  { key: "size", label: "Size", kind: "choice", options: ["sm", "md", "lg"] },
];
const defaultControls = choices.map((control) => ({ ...control, allowDefault: true }));
// Validate generic control values at the typed recipe boundary.
function buttonValues(selection: Selection): VariantProps<typeof basic> {
  const { tone, size } = selection;
  return {
    tone: tone === "primary" || tone === "neutral" || tone === "outline" ? tone : undefined,
    size: size === "sm" || size === "md" || size === "lg" ? size : undefined,
  };
}
const resolvers = {
  basic: (values: Selection) => basic(buttonValues(values)),
  defaults: (values: Selection) => defaults(buttonValues(values)),
  compound: (values: Selection) => compound(buttonValues(values)),
  boolean: (values: Selection) =>
    boolean({
      ...buttonValues(values),
      disabled: typeof values.disabled === "boolean" ? values.disabled : undefined,
    }),
  composed: (values: Selection) => composed(buttonValues(values)),
  typed: (values: Selection) => typed(buttonValues(values)),
};
const initial: Selection = { tone: "primary", size: "md" };
function cardValues(selection: Selection): CardVariants {
  return {
    tone: selection.tone === "accent" || selection.tone === "neutral" ? selection.tone : undefined,
    density:
      selection.density === "compact" || selection.density === "comfortable"
        ? selection.density
        : undefined,
  };
}
const cardControls: readonly Control[] = [
  {
    key: "tone",
    label: "Tone",
    kind: "choice",
    options: ["neutral", "accent"],
    allowDefault: true,
  },
  {
    key: "density",
    label: "Density",
    kind: "choice",
    options: ["compact", "comfortable"],
    allowDefault: true,
  },
];
export const examples: readonly Example[] = [
  {
    id: "basic",
    name: "Basic Variants",
    concept: "Select a tone and size to see independent variants compose.",
    source: basicSource,
    initial,
    defaults: {},
    controls: choices,
    resolve: resolvers.basic,
    render: (selection) => <BasicExample variants={buttonValues(selection)} />,
    usage: (selection) => componentUsage(basicComponent, "ButtonExample", selection),
  },
  {
    id: "defaults",
    name: "Default Variants",
    concept: "Default omits the prop entirely. The recipe resolves its fallback.",
    source: defaultSource,
    initial: {},
    defaults: initial,
    controls: defaultControls,
    resolve: resolvers.defaults,
    render: (selection) => <DefaultExample variants={buttonValues(selection)} />,
    usage: (selection) => componentUsage(defaultComponent, "ButtonExample", selection),
  },
  {
    id: "compound",
    name: "Compound Variants",

    concept: "Try primary + lg for uppercase text or outline + sm for a thicker border.",
    source: compoundSource,
    initial: { tone: "primary", size: "lg" },
    defaults: initial,
    controls: choices,
    resolve: resolvers.compound,
    render: (selection) => <CompoundExample variants={buttonValues(selection)} />,
    usage: (selection) => componentUsage(compoundComponent, "ButtonExample", selection),
    compounds: [
      { when: { tone: "primary", size: "lg" }, effect: "Uppercase + letter spacing" },
      { when: { tone: "outline", size: "sm" }, effect: "2px border" },
    ],
  },
  {
    id: "boolean",
    name: "Boolean Variants",
    concept: "The disabled variant changes styles; the native disabled prop changes behavior.",
    source: booleanSource,
    initial: { ...initial, disabled: false },
    defaults: { ...initial, disabled: false },
    controls: [...choices, { key: "disabled", label: "Disabled", kind: "boolean" }],
    resolve: resolvers.boolean,
    render: (selection) => (
      <BooleanExample
        variants={{
          ...buttonValues(selection),
          disabled: typeof selection.disabled === "boolean" ? selection.disabled : undefined,
        }}
      />
    ),
    usage: (selection) => componentUsage(booleanComponent, "ButtonExample", selection),
  },
  {
    id: "composition",
    name: "Composition",
    concept: "sxv.extend inherits the base variants and gives this button a pill shape.",
    source: compositionSource,
    initial: {},
    defaults: { tone: "outline", size: "lg" },
    controls: defaultControls,
    resolve: resolvers.composed,
    render: (selection) => <ComposedExample variants={buttonValues(selection)} />,
    usage: (selection) => componentUsage(composedComponent, "ButtonExample", selection),
  },
  {
    id: "typescript",
    name: "TypeScript Inference",
    concept: "VariantProps<typeof button> powers the typed Button component in this preview.",
    source: typedSource,
    filename: "button.tsx",
    initial,
    defaults: initial,
    controls: choices,
    resolve: resolvers.typed,
    render: (selection) => <TypedExample variants={buttonValues(selection)} />,
    usage: (selection) => componentUsage(typedComponent, "ButtonExample", selection),
  },
  {
    id: "slots",
    name: "Slots",
    concept: "One recipe styles three elements. Each slot receives the same variant selection.",
    source: slotsSource,
    filename: "card.ts",
    initial: {},
    defaults: { tone: "neutral", density: "comfortable" },
    controls: cardControls,
    resolve: (selection) => slots.root(cardValues(selection)),
    render: (selection) => <SlotsExample variants={cardValues(selection)} />,
    usage: (selection) => componentUsage(slotsComponent, "CardExample", selection),
  },
  {
    id: "compound-slots",
    name: "Compound Slots",
    concept:
      "Accent + compact activates a border on root and uppercase text on title. The description slot stays unchanged.",
    source: compoundSlotsSource,
    filename: "card.ts",
    initial: { tone: "accent", density: "compact" },
    defaults: { tone: "neutral", density: "comfortable" },
    controls: cardControls,
    resolve: (selection) => compoundSlots.root(cardValues(selection)),
    render: (selection) => <CompoundSlotsExample variants={cardValues(selection)} />,
    usage: (selection) => componentUsage(compoundSlotsComponent, "CardExample", selection),
    compounds: [
      {
        when: { tone: "accent", density: "compact" },
        effect: "root: accent border; title: uppercase + letter spacing",
      },
    ],
  },
];

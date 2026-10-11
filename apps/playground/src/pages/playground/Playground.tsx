import { useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { examples } from "../../examples";
import type { Selection } from "../../entities/playground-example";
import { ExampleNavigation } from "../../widgets/example-navigation";
import { CodePanel } from "../../widgets/code-panel";
import { PreviewPanel } from "../../widgets/preview-panel";
import { GeneratedUsage } from "../../widgets/generated-usage";
import { colors, space, type } from "../../shared/styles/tokens.stylex";

export function Playground() {
  const [selected, setSelected] = useState("basic");
  const example = examples.find((item) => item.id === selected) ?? examples[0]!;
  const [selection, setSelection] = useState<Selection>({ ...example.initial });
  function select(id: string) {
    const next = examples.find((item) => item.id === id);
    if (next) {
      setSelected(id);
      setSelection({ ...next.initial });
    }
  }
  return (
    <main id="workspace" {...stylex.props(s.main)}>
      <div {...stylex.props(s.intro)}>
        <div>
          <h1 {...stylex.props(s.eyebrow)}>INTERACTIVE LAB</h1>
        </div>
      </div>
      <ExampleNavigation examples={examples} selected={selected} onSelect={select} />
      <div {...stylex.props(s.context)}>
        <h2 {...stylex.props(s.exampleTitle)}>{example.name}</h2>

        <span {...stylex.props(s.count)}>
          {String(examples.indexOf(example) + 1).padStart(2, "0")} /{" "}
          {String(examples.length).padStart(2, "0")}
        </span>
      </div>
      <div {...stylex.props(s.workspace)}>
        <CodePanel source={example.source} filename={example.filename} />
        <PreviewPanel example={example} selection={selection} onChange={setSelection} />
        <GeneratedUsage code={example.usage(selection)} />
      </div>
      <footer {...stylex.props(s.footer)}>
        <span>
          <span {...stylex.props(s.accent)}>✦</span> Built with StyleX Variants.
        </span>
      </footer>
    </main>
  );
}
const s = stylex.create({
  main: {
    maxWidth: 1520,
    marginInline: "auto",
    padding: { default: space.xl, "@media (max-width: 600px)": space.md },
  },
  intro: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.lg,
    paddingTop: 0,
    paddingBottom: space.sm,
  },
  eyebrow: {
    color: colors.accentHover,
    fontFamily: type.mono,
    fontSize: type.xs,
    letterSpacing: "0.14em",
    marginBottom: space.sm,
  },

  muted: { color: colors.muted },
  accent: { color: colors.accent },

  context: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: space.sm,
    marginBottom: space.md,
  },
  exampleTitle: { fontSize: type.body, fontWeight: type.bold, margin: 0 },
  count: { marginLeft: "auto", fontFamily: type.mono, fontSize: type.xs, color: colors.subtle },
  workspace: {
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1.1fr) minmax(0, 1fr)",
      "@media (max-width: 900px)": "minmax(0, 1fr)",
    },
    alignItems: "start",
    gap: space.md,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: space.sm,
    paddingTop: space.lg,
    color: colors.subtle,
    fontSize: type.xs,
  },
});

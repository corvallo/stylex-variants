import { useState } from "react";
import * as stylex from "@stylexjs/stylex";
import type { Example, Selection } from "../entities/playground-example";
import { Panel } from "../shared/ui/Panel";
import { Button } from "../shared/ui/Button";
import { ConfigureVariants } from "../features/configure-variants";
import { lightPreview } from "../shared/styles/theme.stylex";
import { colors, space, type } from "../shared/styles/tokens.stylex";
export function PreviewPanel({
  example,
  selection,
  onChange,
}: {
  example: Example;
  selection: Selection;
  onChange: (selection: Selection) => void;
}) {
  const [light, setLight] = useState(false);
  return (
    <Panel title="Live preview">
      <div {...stylex.props(s.canvas, light && lightPreview)}>
        <div {...stylex.props(s.canvasToolbar)}>
          <span>COMPONENT PREVIEW</span>
          <Button
            aria-label="Use light preview background"
            aria-pressed={light}
            onClick={() => setLight(!light)}
          >
            {light ? "◐ Light" : "◑ Dark"}
          </Button>
        </div>
        <div {...stylex.props(s.component)}>{example.render(selection)}</div>
      </div>
      <div {...stylex.props(s.controlHeader)}>
        <h3 {...stylex.props(s.heading)}>Variant controls</h3>
        <Button onClick={() => onChange({ ...example.initial })}>↺ Reset</Button>
      </div>
      <ConfigureVariants example={example} selection={selection} onChange={onChange} />
      <p {...stylex.props(s.hint)}>{example.concept}</p>
    </Panel>
  );
}
const s = stylex.create({
  canvas: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: 267,
    backgroundColor: colors.canvas,
    backgroundImage: `radial-gradient(${colors.border} 1px, transparent 1px)`,
    backgroundSize: "20px 20px",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.border,
  },
  canvasToolbar: {
    alignSelf: "stretch",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: space.sm,
    fontFamily: type.mono,
    fontSize: type.xs,
    letterSpacing: "0.08em",
    color: colors.subtle,
  },
  component: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    paddingInline: space.md,
  },
  controlHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingInline: space.lg,
    paddingTop: space.md,
  },
  heading: { margin: 0, fontSize: type.sm, fontWeight: type.bold },
  hint: {
    margin: 0,
    paddingInline: space.lg,
    paddingBottom: space.lg,
    color: colors.muted,
    fontSize: type.sm,
    lineHeight: type.line,
  },
});

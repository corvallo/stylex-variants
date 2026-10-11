import { useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { Panel } from "../shared/ui/Panel";
import { Code } from "../shared/ui/Code";
import { Button } from "../shared/ui/Button";
import { CopyCode } from "../features/copy-code";
import { colors, space, type } from "../shared/styles/tokens.stylex";
import tokenSource from "../shared/styles/tokens.stylex.ts?raw";
export function CodePanel({
  source,
  filename = "button.ts",
}: {
  source: string;
  filename?: string;
}) {
  const [file, setFile] = useState<"recipe" | "tokens">("recipe");
  const code = file === "recipe" ? source : tokenSource;
  return (
    <Panel title="Recipe" action={<CopyCode code={code} />}>
      <div {...stylex.props(s.toolbar)}>
        <div role="group" aria-label="Source file">
          <Button
            aria-pressed={file === "recipe"}
            tone={file === "recipe" ? "selected" : "quiet"}
            onClick={() => setFile("recipe")}
          >
            {filename}
          </Button>
          <Button
            aria-pressed={file === "tokens"}
            tone={file === "tokens" ? "selected" : "quiet"}
            onClick={() => setFile("tokens")}
          >
            tokens.stylex.ts
          </Button>
        </div>
        <span {...stylex.props(s.label)}>Read only</span>
      </div>
      <Code code={code} label="Example source code" />
      <div {...stylex.props(s.footer)}>
        <span>TypeScript + StyleX</span>
      </div>
    </Panel>
  );
}
const s = stylex.create({
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: space.xs,
    gap: space.xs,
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.border,
  },
  label: { color: colors.subtle, fontSize: type.xs, paddingRight: space.xs },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    gap: space.xs,
    paddingBlock: space.sm,
    paddingInline: space.md,
    fontFamily: type.mono,
    fontSize: type.xs,
    color: colors.subtle,
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.border,
  },
});

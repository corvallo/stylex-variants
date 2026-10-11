import * as stylex from "@stylexjs/stylex";
import { Panel } from "../shared/ui/Panel";
import { Code } from "../shared/ui/Code";
import { CopyCode } from "../features/copy-code";
export function GeneratedUsage({ code }: { code: string }) {
  return (
    <div {...stylex.props(styles.panel)}>
      <Panel title="React component" action={<CopyCode code={code} />}>
        <Code code={code} label="Generated React usage" compact />
      </Panel>
    </div>
  );
}

const styles = stylex.create({ panel: { gridColumn: "1 / -1", minWidth: 0 } });

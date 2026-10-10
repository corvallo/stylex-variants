import * as stylex from "@stylexjs/stylex";
import { Badge } from "../badge/badge";
import { Button } from "../button/button";
import { CodeBlock } from "../code-block/code-block";
import { styles } from "../../playground.style";

export function OverridesDemo() {
  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.sectionHeader)}>
        <h2 {...stylex.props(styles.sectionTitle)}>Overrides and extend</h2>
        <p {...stylex.props(styles.muted)}>
          Keep the recipe reusable while customizing a call site or deriving a new recipe.
        </p>
      </div>
      <div {...stylex.props(styles.panel)}>
        <div {...stylex.props(styles.card)}>
          <Button className="custom-class" style={{ boxShadow: "0 0 0 3px #f0abfc" }}>
            className + style
          </Button>
          <Badge tone="success" outlined>
            Override example
          </Badge>
        </div>
        <CodeBlock
          title="icon-button.style.ts · extend"
          code={`const iconButton = sxv.extend(button, {\n  base: styles.iconButton,\n  variants: { size: { sm: styles.small, lg: styles.large } },\n  defaultVariants: { size: "md" },\n});\n\niconButton({ className: "custom", style: styles.ring });`}
        />
      </div>
    </section>
  );
}

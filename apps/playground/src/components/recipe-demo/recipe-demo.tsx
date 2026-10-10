import { useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { Button } from "../button/button";
import { Card } from "../card/card";
import { CodeBlock } from "../code-block/code-block";
import { styles } from "../../playground.style";

export function RecipeDemo() {
  const [tone, setTone] = useState<"primary" | "danger">("primary");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [fullWidth, setFullWidth] = useState(false);
  return <section {...stylex.props(styles.section)}><div {...stylex.props(styles.sectionHeader)}><h2 {...stylex.props(styles.sectionTitle)}>Variants and recipes</h2><p {...stylex.props(styles.muted)}>Change the props and compare the live result with the static recipe.</p></div><div {...stylex.props(styles.panel)}><div {...stylex.props(styles.card)}><div {...stylex.props(styles.controls)}><label {...stylex.props(styles.label)}>Tone<select {...stylex.props(styles.select)} value={tone} onChange={(e) => setTone(e.target.value as typeof tone)}><option value="primary">primary</option><option value="danger">danger</option></select></label><label {...stylex.props(styles.label)}>Size<select {...stylex.props(styles.select)} value={size} onChange={(e) => setSize(e.target.value as typeof size)}><option value="sm">sm</option><option value="md">md</option><option value="lg">lg</option></select></label><label {...stylex.props(styles.label)}>Full width<input type="checkbox" checked={fullWidth} onChange={(e) => setFullWidth(e.target.checked)} /></label></div><div {...stylex.props(styles.result)}><Button variant={tone} size={size} fullWidth={fullWidth}>Preview button</Button></div></div><CodeBlock title="button.style.ts · recipe" code={`const button = sxv({\n  base: styles.base,\n  variants: { tone, size, fullWidth },\n  defaultVariants: { tone: "primary", size: "md", fullWidth: false },\n  compoundVariants: [\n    { tone: "primary", size: "lg", style: styles.hero },\n  ],\n});`} /></div><div {...stylex.props(styles.panel)}><Card><strong>Compound variant</strong><span>When <code>variant="primary"</code> and <code>size="lg"</code> match, the rule adds uppercase text and letter spacing.</span><Button variant="primary" size="lg">Compound</Button></Card></div></section>;
}

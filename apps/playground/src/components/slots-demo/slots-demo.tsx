import * as stylex from "@stylexjs/stylex";
import { CodeBlock } from "../code-block/code-block";
import { SlotCard } from "../slot-card/slot-card";
import { styles } from "../../playground.style";

export function SlotsDemo() { return <section {...stylex.props(styles.section)}><div {...stylex.props(styles.sectionHeader)}><h2 {...stylex.props(styles.sectionTitle)}>Slots and compoundSlots</h2><p {...stylex.props(styles.muted)}>Style multiple elements from one recipe and apply conditions to selected slots.</p></div><div {...stylex.props(styles.panel)}><SlotCard tone="accent"><strong>Slot content</strong><span>Root, title, and description are independently styled.</span></SlotCard><CodeBlock title="card.style.ts · slots + compoundSlots" code={`const card = sxv({\n  slots: { root: styles.root, title: styles.title },\n  variants: { tone: { accent: { root: styles.accent } } },\n  compoundSlots: [{\n    tone: "accent",\n    slots: { root: styles.accentBorder, title: styles.accentTitle },\n  }],\n});`} /></div></section>; }

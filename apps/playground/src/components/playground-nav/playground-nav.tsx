import * as stylex from "@stylexjs/stylex";
import { styles } from "./playground-nav.style";

export const sections = ["recipes", "overrides", "slots"] as const;
export type Section = (typeof sections)[number];

export function PlaygroundNav({ active, onChange }: { active: Section; onChange: (section: Section) => void }) {
  return <aside {...stylex.props(styles.aside)}><span {...stylex.props(styles.label)}>Explore</span><nav aria-label="Playground sections"><ul {...stylex.props(styles.list)}>{sections.map((section) => <li key={section}><button type="button" {...stylex.props(styles.button, active === section && styles.active)} onClick={() => onChange(section)}>{section === "recipes" ? "Variants & recipes" : section === "overrides" ? "Overrides & extend" : "Slots & compoundSlots"}</button></li>)}</ul></nav></aside>;
}

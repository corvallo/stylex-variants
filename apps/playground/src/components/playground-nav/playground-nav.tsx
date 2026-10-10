import * as stylex from "@stylexjs/stylex";
import { styles } from "../../playground.style";

export const sections = ["recipes", "overrides", "slots"] as const;
export type Section = (typeof sections)[number];

export function PlaygroundNav({ active, onChange }: { active: Section; onChange: (section: Section) => void }) {
  return <nav aria-label="Playground sections" {...stylex.props(styles.nav)}>{sections.map((section) => <button key={section} type="button" {...stylex.props(styles.navButton, active === section && styles.navButtonActive)} onClick={() => onChange(section)}>{section === "recipes" ? "Variants & recipes" : section === "overrides" ? "Overrides & extend" : "Slots & compoundSlots"}</button>)}</nav>;
}

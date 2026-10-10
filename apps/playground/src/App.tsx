import { useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { PlaygroundNav, type Section } from "./components/playground-nav/playground-nav";
import { RecipeDemo } from "./components/recipe-demo/recipe-demo";
import { OverridesDemo } from "./components/overrides-demo/overrides-demo";
import { SlotsDemo } from "./components/slots-demo/slots-demo";
import { styles } from "./playground.style";
import { theme } from "./theme/tokens.stylex";

export function App() {
  const [section, setSection] = useState<Section>("recipes");
  return <main {...stylex.props(styles.page, theme.root)}><div {...stylex.props(styles.shell)}><header {...stylex.props(styles.header)}><span {...stylex.props(styles.eyebrow)}>Interactive examples</span><h1 {...stylex.props(styles.title)}>StyleX Variants Playground</h1><p {...stylex.props(styles.lead)}>Explore recipes, change variant props, and compare each result with the source configuration.</p></header><PlaygroundNav active={section} onChange={setSection} />{section === "recipes" && <RecipeDemo />}{section === "overrides" && <OverridesDemo />}{section === "slots" && <SlotsDemo />}</div></main>;
}

import * as stylex from "@stylexjs/stylex";
import { Playground } from "../pages/playground/Playground";
import { PlaygroundHeader } from "../widgets/playground-header";
import { colors, space, type } from "../shared/styles/tokens.stylex";
export function App() {
  return (
    <div {...stylex.props(s.root)}>
      <a href="#workspace" {...stylex.props(s.skip)}>
        Skip to playground
      </a>
      <PlaygroundHeader />
      <Playground />
    </div>
  );
}
const s = stylex.create({
  root: {
    minHeight: "100vh",
    backgroundColor: colors.background,
    color: colors.text,
    fontFamily: type.sans,
    lineHeight: type.line,
    colorScheme: "dark",
  },
  skip: {
    position: "fixed",
    top: { default: -100, ":focus": 8 },
    left: 8,
    zIndex: 10,
    padding: space.sm,
    color: colors.text,
    backgroundColor: colors.elevated,
  },
});

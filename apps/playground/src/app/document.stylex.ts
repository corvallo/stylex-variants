import * as stylex from "@stylexjs/stylex";
import { colors } from "../shared/styles/tokens.stylex";

export const documentStyles = stylex.create({
  body: { margin: 0, backgroundColor: colors.background },
});

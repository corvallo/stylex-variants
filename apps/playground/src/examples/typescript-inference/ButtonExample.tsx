import { Button, type ButtonVariants } from "./button";

export function ButtonExample({ variants }: { variants: ButtonVariants }) {
  return <Button {...variants}>Ship something great</Button>;
}

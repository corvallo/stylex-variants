import type { ReactNode } from "react";
import Heading from "@theme/Heading";
import CodeBlock from "@theme/CodeBlock";
import styles from "./DemoSection.module.css";

export default function DemoSection(): ReactNode {
  return (
    <section className={`container ${styles.demoSection}`}>
      <div className={styles.demoCopy}>
        <p className={styles.eyebrow}>Live recipe</p>
        <Heading as="h2">Variants by default.</Heading>
        <p>Define a recipe once, then keep every call site concise and type-safe.</p>
      </div>
      <div className={styles.demoCard}>
        <div className={styles.demoToolbar}>
          <span>button.styles.ts</span>
        </div>
        <CodeBlock language="tsx">{`const button = sxv({
  base: styles.base,
  variants: { tone: { primary: styles.primary } },
  defaultVariants: { tone: "primary" },
});`}</CodeBlock>
        <div className={styles.previewButtons}>
          <button className="button button--primary">Primary</button>
          <button className="button button--secondary">Secondary</button>
          <button className="button button--outline">Large</button>
        </div>
      </div>
    </section>
  );
}

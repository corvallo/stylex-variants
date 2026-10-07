import type { ReactNode } from "react";
import { useState } from "react";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import CodeBlock from "@theme/CodeBlock";
import styles from "./ConceptsSection.module.css";

const concepts = [
  {
    title: "Variants",
    summary: "Declare variant, size and state once.",
    code: `const button = sxv({\n  base: styles.base,\n  variants: { tone: { primary: styles.primary } },\n});`,
  },
  {
    title: "Compound variants",
    summary: "Style combinations only when they match.",
    code: `compoundVariants: [\n  { tone: 'primary', size: 'lg', style: styles.emphasis },\n]`,
  },
  {
    title: "Defaults",
    summary: "Keep every call site small and predictable.",
    code: `defaultVariants: { tone: 'primary', size: 'sm' }`,
  },
  {
    title: "Type safe",
    summary: "Let TypeScript follow your variant map.",
    code: `type ButtonVariants = VariantProps<typeof button>;\nbutton({ tone: 'primary' });`,
  },
];

export default function ConceptsSection(): ReactNode {
  const [activeConcept, setActiveConcept] = useState(0);
  const concept = concepts[activeConcept];
  return (
    <section className={`container ${styles.concepts}`}>
      <div className={styles.conceptList} role="tablist" aria-label="Core concepts">
        <p className={styles.eyebrow}>Core concepts</p>
        <Heading as="h2">Minimal by default. Powerful when you need it.</Heading>
        {concepts.map((item, index) => (
          <button
            className={`${styles.conceptTab} ${index === activeConcept ? styles.conceptTabActive : ""}`}
            key={item.title}
            onClick={() => setActiveConcept(index)}
            role="tab"
            aria-selected={index === activeConcept}
          >
            <strong>{item.title}</strong>
            <span>{item.summary}</span>
          </button>
        ))}
      </div>
      <div className={styles.conceptPanel} role="tabpanel">
        <div className={styles.demoToolbar}>
          <span>{concept.title}</span>
        </div>
        <p>{concept.summary}</p>
        <CodeBlock language="tsx">{concept.code}</CodeBlock>
        <Link to="/docs/variants">Read the guide →</Link>
      </div>
    </section>
  );
}

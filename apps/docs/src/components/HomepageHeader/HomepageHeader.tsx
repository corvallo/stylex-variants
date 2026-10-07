import type { ReactNode } from "react";
import Link from "@docusaurus/Link";
import Heading from "@theme/Heading";
import styles from "./HomepageHeader.module.css";

export default function HomepageHeader(): ReactNode {
  return (
    <header
      className={styles.heroBanner}
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgb(4 8 24 / 20%), rgb(4 8 24 / 58%)), url('/stylex-variants/img/neon-waves.png')",
        backgroundPosition: "center 38%",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container">
        <p className={styles.eyebrow}>StyleX Variants</p>
        <Heading as="h1" className={styles.heroTitle}>
          A first-class variant API for StyleX.
        </Heading>
        <p className={styles.heroSubtitle}>
          Typed, compile-time variants with predictable class and style merging for React design
          systems.
        </p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/intro">
            Get started
          </Link>
          <a
            className="button button--secondary button--lg"
            href="https://github.com/corvallo/stylex-variants"
          >
            GitHub
          </a>
        </div>
        <div className={styles.install}>
          <code>npm install @stylex-variants/core @stylexjs/stylex</code>
        </div>
      </div>
    </header>
  );
}

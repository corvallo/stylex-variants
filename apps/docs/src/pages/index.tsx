import type { ReactNode } from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import ConceptsSection from "@site/src/components/ConceptsSection/ConceptsSection";
import DemoSection from "@site/src/components/DemoSection/DemoSection";
import HomepageHeader from "@site/src/components/HomepageHeader/HomepageHeader";

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description="Typed, compile-time variants for StyleX">
      <HomepageHeader />
      <main>
        <DemoSection />
        <ConceptsSection />
      </main>
    </Layout>
  );
}

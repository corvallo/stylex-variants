import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    "intro",
    "installation",
    {
      type: "category",
      label: "Concepts",
      items: ["variants", "boolean-variants", "compound-variants", "overriding", "responsive"],
    },

    "api",
    "ai-skill",
    "limitations",
  ],
};

export default sidebars;

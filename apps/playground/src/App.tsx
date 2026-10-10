import { useState } from "react";
import * as stylex from "@stylexjs/stylex";
import { Alert } from "./components/alert/alert";
import { Badge } from "./components/badge/badge";
import { Button } from "./components/button/button";
import { Card } from "./components/card/card";
import { CodeBlock } from "./components/code-block/code-block";
import { SlotCard } from "./components/slot-card/slot-card";
import { styles } from "./playground.style";
import { theme } from "./theme/tokens.stylex";

const sections = ["recipes", "overrides", "slots"] as const;
type Section = (typeof sections)[number];

export function App() {
  const [section, setSection] = useState<Section>("recipes");
  const [tone, setTone] = useState<"primary" | "danger">("primary");
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [fullWidth, setFullWidth] = useState(false);

  return (
    <main {...stylex.props(styles.page, theme.root)}>
      <div {...stylex.props(styles.shell)}>
        <header {...stylex.props(styles.header)}>
          <span {...stylex.props(styles.eyebrow)}>Interactive examples</span>
          <h1 {...stylex.props(styles.title)}>StyleX Variants Playground</h1>
          <p {...stylex.props(styles.lead)}>
            Explore recipes, change variant props, and compare each result with the source
            configuration.
          </p>
        </header>
        <nav aria-label="Playground sections" {...stylex.props(styles.nav)}>
          {sections.map((item) => (
            <button
              key={item}
              type="button"
              {...stylex.props(styles.navButton, section === item && styles.navButtonActive)}
              onClick={() => setSection(item)}
            >
              {item === "recipes"
                ? "Variants & recipes"
                : item === "overrides"
                  ? "Overrides & extend"
                  : "Slots & compoundSlots"}
            </button>
          ))}
        </nav>
        {section === "recipes" && (
          <section {...stylex.props(styles.section)}>
            <div {...stylex.props(styles.sectionHeader)}>
              <h2 {...stylex.props(styles.sectionTitle)}>Variants by default</h2>
              <p {...stylex.props(styles.muted)}>
                Change the props below to see one recipe select different static StyleX rules.
              </p>
            </div>
            <div {...stylex.props(styles.panel)}>
              <div {...stylex.props(styles.card)}>
                <div {...stylex.props(styles.controls)}>
                  <label {...stylex.props(styles.label)}>
                    Tone
                    <select
                      {...stylex.props(styles.select)}
                      value={tone}
                      onChange={(event) => setTone(event.target.value as typeof tone)}
                    >
                      <option value="primary">primary</option>
                      <option value="danger">danger</option>
                    </select>
                  </label>
                  <label {...stylex.props(styles.label)}>
                    Size
                    <select
                      {...stylex.props(styles.select)}
                      value={size}
                      onChange={(event) => setSize(event.target.value as typeof size)}
                    >
                      <option value="sm">sm</option>
                      <option value="md">md</option>
                      <option value="lg">lg</option>
                    </select>
                  </label>
                  <label {...stylex.props(styles.label)}>
                    Full width
                    <input
                      type="checkbox"
                      checked={fullWidth}
                      onChange={(event) => setFullWidth(event.target.checked)}
                    />
                  </label>
                </div>
                <div {...stylex.props(styles.result)}>
                  <Button variant={tone} size={size} fullWidth={fullWidth}>
                    Preview button
                  </Button>
                </div>
                <span {...stylex.props(styles.note)}>
                  Selected: tone={tone}, size={size}, fullWidth={String(fullWidth)}
                </span>
              </div>
              <CodeBlock
                title="button.style.ts · recipe"
                code={`const button = sxv({
  base: styles.base,
  variants: {
    tone: { primary: styles.primary, danger: styles.danger },
    size: { sm: styles.sm, md: styles.md, lg: styles.lg },
    fullWidth: { true: styles.full, false: styles.auto },
  },
  defaultVariants: { tone: "primary", size: "md", fullWidth: false },
  compoundVariants: [
    { tone: "primary", size: "lg", style: styles.hero },
  ],
});`}
              />
            </div>
            <div {...stylex.props(styles.panel)}>
              <Card>
                <strong>Compound variant</strong>
                <span>Primary + large activates the uppercase compound style.</span>
                <Button variant="primary" size="lg">
                  Compound
                </Button>
              </Card>
              <Alert status="warning" emphasis="strong" title="Boolean variant">
                Toggle `fullWidth` to select the explicit branch.
              </Alert>
            </div>
          </section>
        )}
        {section === "overrides" && (
          <section {...stylex.props(styles.section)}>
            <div {...stylex.props(styles.sectionHeader)}>
              <h2 {...stylex.props(styles.sectionTitle)}>Overrides and extension</h2>
              <p {...stylex.props(styles.muted)}>
                See call-site overrides and the derived recipe in action.
              </p>
            </div>
            <div {...stylex.props(styles.panel)}>
              <div {...stylex.props(styles.card)}>
                <Button className="custom-class" style={{ boxShadow: "0 0 0 3px #f0abfc" }}>
                  className + style
                </Button>
                <Badge tone="success" outlined>
                  Override example
                </Badge>
              </div>
              <CodeBlock
                title="icon-button.style.ts · extend"
                code={`const iconButton = sxv.extend(button, {
  base: styles.iconButton,
  variants: {
    size: { sm: styles.small, lg: styles.large },
  },
  defaultVariants: { size: "md" },
});

iconButton({ className: "custom", style: styles.ring });`}
              />
            </div>
          </section>
        )}
        {section === "slots" && (
          <section {...stylex.props(styles.section)}>
            <div {...stylex.props(styles.sectionHeader)}>
              <h2 {...stylex.props(styles.sectionTitle)}>Slots and compoundSlots</h2>
              <p {...stylex.props(styles.muted)}>
                Each slot selects its own StyleX output while sharing recipe variants.
              </p>
            </div>
            <div {...stylex.props(styles.panel)}>
              <SlotCard tone="accent">
                <strong>Slot content</strong>
                <span>Root, title, and description are independently styled.</span>
              </SlotCard>
              <CodeBlock
                title="card.style.ts · slots + compoundSlots"
                code={`const card = sxv({
  slots: {
    root: styles.root,
    title: styles.title,
    description: styles.description,
  },
  variants: {
    tone: {
      neutral: { root: styles.neutral },
      accent: { root: styles.accent },
    },
  },
  compoundSlots: [{
    tone: "accent",
    slots: {
      root: styles.accentBorder,
      title: styles.accentTitle,
    },
  }],
});`}
              />
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

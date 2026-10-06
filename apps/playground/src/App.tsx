import { Alert } from "./components/alert/alert";
import { Badge } from "./components/badge/badge";
import { Button } from "./components/button/button";
import { Card } from "./components/card/card";

export function App() {
  return (
    <main
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 40,
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <h1>StyleX Variants Playground</h1>

      <section>
        <h2>Buttons</h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
          }}
        >
          <Button>Default</Button>

          <Button variant="secondary" size="sm">
            Secondary
          </Button>

          <Button variant="outline" size="sm">
            Outline compound
          </Button>

          <Button variant="primary" size="lg">
            Primary LG compound
          </Button>

          <Button variant="danger">Delete</Button>
        </div>

        <div
          style={{
            marginTop: 12,
          }}
        >
          <Button variant="danger" fullWidth>
            Full width danger compound
          </Button>
        </div>
      </section>

      <section>
        <h2>Badges</h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <Badge>Neutral</Badge>

          <Badge tone="success">Success</Badge>

          <Badge tone="success" outlined>
            Success outlined
          </Badge>

          <Badge tone="warning" outlined>
            Warning outlined
          </Badge>

          <Badge tone="danger" size="sm" outlined>
            Danger
          </Badge>
        </div>
      </section>

      <section>
        <h2>Cards</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          <Card>
            <strong>Default card</strong>

            <span>Elevated, normal spacing and non-interactive.</span>

            <Button size="sm">Action</Button>
          </Card>

          <Card appearance="outlined" spacing="relaxed">
            <strong>Outlined card</strong>

            <Badge tone="success">Active</Badge>

            <span>This card uses relaxed spacing.</span>
          </Card>

          <Card appearance="filled" spacing="compact">
            <strong>Filled compact</strong>

            <span>This matches a compound variant.</span>
          </Card>

          <Card appearance="elevated" interactive>
            <strong>Interactive</strong>

            <span>Elevated + interactive compound.</span>
          </Card>
        </div>
      </section>

      <section>
        <h2>Alerts</h2>

        <div
          style={{
            display: "grid",
            gap: 12,
          }}
        >
          <Alert title="Information">This is the default alert.</Alert>

          <Alert status="success" title="Success">
            Everything completed successfully.
          </Alert>

          <Alert status="warning" emphasis="strong" title="Warning">
            Strong warning compound variant.
          </Alert>

          <Alert status="error" emphasis="strong" title="Error">
            Error + strong produces the special compound styling.
          </Alert>
        </div>
      </section>
    </main>
  );
}

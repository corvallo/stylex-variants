import { useEffect, useRef, useState } from "react";
import { Button } from "../shared/ui/Button";
export function CopyCode({ code }: { code: string }) {
  const [status, setStatus] = useState("Copy code");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  async function copy() {
    clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(code);
      setStatus("Copied ✓");
    } catch {
      setStatus("Copy failed — select code");
    }
    timer.current = setTimeout(() => setStatus("Copy code"), 2500);
  }
  return (
    <Button onClick={copy}>
      <span aria-live="polite">{status}</span>
    </Button>
  );
}

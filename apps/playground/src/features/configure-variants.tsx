import * as stylex from "@stylexjs/stylex";
import type { Example, Selection } from "../entities/playground-example";
import { Button } from "../shared/ui/Button";
import { colors, space, type, shape, motion } from "../shared/styles/tokens.stylex";
export function ConfigureVariants({
  example,
  selection,
  onChange,
}: {
  example: Example;
  selection: Selection;
  onChange: (selection: Selection) => void;
}) {
  function change(key: string, value: string | boolean | undefined) {
    onChange({ ...selection, [key]: value });
  }
  return (
    <div {...stylex.props(s.controls)}>
      {example.controls.map((control) => {
        const value = selection[control.key];
        return (
          <div key={control.key} {...stylex.props(s.row)}>
            <span id={`label-${control.key}`} {...stylex.props(s.label)}>
              {control.label}
              <span {...stylex.props(s.kind)}>
                {control.kind === "boolean" ? "boolean" : "variant"}
              </span>
            </span>
            {control.kind === "boolean" ? (
              <button
                type="button"
                role="switch"
                aria-checked={Boolean(value)}
                aria-labelledby={`label-${control.key}`}
                onClick={() => change(control.key, !value)}
                {...stylex.props(s.switch, Boolean(value) && s.on)}
              >
                <span {...stylex.props(s.thumb, Boolean(value) && s.thumbOn)} />
              </button>
            ) : (control.options?.length ?? 0) > 4 ? (
              <select
                aria-labelledby={`label-${control.key}`}
                value={typeof value === "string" ? value : ""}
                onChange={(event) => change(control.key, event.target.value || undefined)}
                {...stylex.props(s.select)}
              >
                {control.allowDefault && <option value="">default</option>}
                {control.options?.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <div
                role="group"
                aria-labelledby={`label-${control.key}`}
                {...stylex.props(s.options)}
              >
                {control.allowDefault && (
                  <Button
                    tone={value === undefined ? "selected" : "quiet"}
                    aria-pressed={value === undefined}
                    onClick={() => change(control.key, undefined)}
                  >
                    default
                  </Button>
                )}
                {control.options?.map((option) => (
                  <Button
                    key={option}
                    tone={value === option ? "selected" : "quiet"}
                    aria-pressed={value === option}
                    onClick={() => change(control.key, option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
const s = stylex.create({
  controls: { display: "grid", gap: space.md, padding: space.lg },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: space.sm,
  },
  label: {
    fontSize: type.sm,
    fontWeight: type.medium,
    display: "flex",
    alignItems: "center",
    gap: space.xs,
  },
  kind: {
    color: colors.subtle,
    fontFamily: type.mono,
    fontSize: type.xs,
    fontWeight: type.regular,
  },
  options: {
    display: "flex",
    flexWrap: "wrap",
    padding: space.xxs,
    gap: space.xxs,
    backgroundColor: colors.canvas,
    borderRadius: shape.sm,
  },
  select: {
    backgroundColor: colors.canvas,
    color: colors.text,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.border,
    borderRadius: shape.sm,
    fontFamily: type.sans,
    padding: space.xs,
    outlineColor: colors.accent,
  },
  switch: {
    width: 40,
    height: 24,
    padding: 3,
    backgroundColor: colors.border,
    borderWidth: 0,
    borderStyle: "solid",
    borderRadius: shape.pill,
    cursor: "pointer",
    outline: { default: "none", ":focus-visible": motion.focus },
    outlineOffset: 3,
  },
  on: { backgroundColor: colors.accent },
  thumb: {
    display: "block",
    width: 18,
    height: 18,
    borderRadius: shape.pill,
    backgroundColor: colors.text,
    transitionProperty: "transform",
    transitionDuration: motion.fast,
  },
  thumbOn: { transform: "translateX(16px)" },
});

import { Highlight } from "prism-react-renderer";
import * as stylex from "@stylexjs/stylex";
import { colors, space, type } from "../styles/tokens.stylex";

// Prism only tokenizes. All presentation is compiled by StyleX.
export function Code({
  code,
  label,
  compact = false,
}: {
  code: string;
  label: string;
  compact?: boolean;
}) {
  return (
    <Highlight code={code.trim()} language="tsx" theme={{ plain: {}, styles: [] }}>
      {({ tokens }) => (
        <pre tabIndex={0} aria-label={label} {...stylex.props(s.pre, compact && s.compact)}>
          <code {...stylex.props(s.code)}>
            {tokens.map((line, i) => (
              <span key={i} {...stylex.props(s.line)}>
                <span aria-hidden="true" {...stylex.props(s.number)}>
                  {i + 1}
                </span>
                <span {...stylex.props(s.content)}>
                  {line.map((token, j) => (
                    <span
                      key={j}
                      {...stylex.props(
                        token.types.some((t) => ["keyword", "operator", "tag"].includes(t)) &&
                          s.keyword,
                        token.types.some((t) => ["string", "attr-value"].includes(t)) && s.string,
                        token.types.some((t) => ["function", "class-name"].includes(t)) &&
                          s.function,
                        token.types.some((t) => ["boolean", "number"].includes(t)) && s.literal,
                        token.types.includes("comment") && s.comment,
                      )}
                    >
                      {token.content}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}
const s = stylex.create({
  pre: {
    margin: 0,
    paddingBlock: space.lg,
    paddingRight: space.lg,
    backgroundColor: colors.canvas,
    color: colors.text,
    overflow: "auto",
    scrollbarWidth: "thin",
    scrollbarColor: `${colors.border} ${colors.canvas}`,
    height: 460,
    boxSizing: "border-box",
    fontFamily: type.mono,
    fontSize: type.code,
    lineHeight: 1.8,
    whiteSpace: "pre",
    tabSize: 2,
    outlineColor: colors.accent,
  },
  compact: { height: "auto", maxHeight: 560, minHeight: 180 },
  code: { fontFamily: "inherit", fontSize: "inherit", lineHeight: "inherit" },
  content: { flexShrink: 0, whiteSpace: "pre" },
  line: { display: "flex", minHeight: "1.8em" },
  number: {
    color: colors.subtle,
    userSelect: "none",
    width: 46,
    flexShrink: 0,
    textAlign: "right",
    paddingRight: space.lg,
  },
  keyword: { color: colors.accentHover },
  string: { color: colors.success },
  function: { color: colors.cyan },
  literal: { color: colors.warning },
  comment: { color: colors.subtle },
});

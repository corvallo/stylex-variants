import type { ReactNode } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { styles } from "./code-block.style";
import * as stylex from "@stylexjs/stylex";

type CodeBlockProps = { title: string; code: string; language?: "tsx" | "ts" };

export function CodeBlock({ title, code, language = "tsx" }: CodeBlockProps): ReactNode {
  return (
    <div {...stylex.props(styles.wrapper)}>
      <div {...stylex.props(styles.header)}>{title}</div>
      <Highlight code={code.trim()} language={language} theme={themes.nightOwl}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={{ ...style, ...stylex.props(styles.pre).style }}>
            {tokens.map((line, index) => (
              <div key={index} {...getLineProps({ line })}>
                {line.map((token, tokenIndex) => <span key={tokenIndex} {...getTokenProps({ token })} />)}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

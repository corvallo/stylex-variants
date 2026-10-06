import { transformSync } from "@babel/core";
import { createRequire } from "node:module";
const stylexPlugin = createRequire(import.meta.url).resolve("@stylexjs/babel-plugin");
import * as stylex from "@stylexjs/stylex";
import { describe, expect, it } from "vitest";
import plugin from "../babel";

function compile(config: string) {
  const first = transformSync(
    `import {sxv} from '@stylex-variants/core';
    const button = sxv(${config});`,
    {
      plugins: [plugin],
      configFile: false,
      babelrc: false,
    },
  );
  if (!first?.code) throw new Error("Missing variant transform");
  const second = transformSync(first.code, {
    plugins: [[stylexPlugin, { dev: false, runtimeInjection: false }]],
    configFile: false,
    babelrc: false,
  });
  if (!second?.code) throw new Error("Missing StyleX transform");
  const code = second.code.replace(
    /import \* as (\w+) from ["']@stylexjs\/stylex["'];/g,
    "const $1 = runtime;",
  );
  const button = new Function("runtime", `${code}; return button;`)(stylex) as (
    props?: Record<string, unknown>,
  ) => { className?: string };
  const rules = (second.metadata as { stylex?: [string, { ltr: string }, number][] }).stylex ?? [];
  return {
    css(props?: Record<string, unknown>) {
      const classes = new Set(button(props).className?.split(" ") ?? []);
      return rules
        .filter(([name]) => classes.has(name))
        .map(([, rule]) => rule.ltr)
        .join("\n");
    },
    rules,
  };
}

const config = `{
  base:{color:'red',display:'flex'},
  variants:{
    size:{sm:{fontSize:12},lg:{fontSize:20}},
    active:{true:{opacity:1},false:{opacity:.5}},
    tone:{primary:{color:'blue'},secondary:{color:'green'}}
  },
  defaultVariants:{size:'sm',active:true,tone:'primary'},
  compoundVariants:[
    {size:'lg',active:true,style:{color:'purple'}},
    {size:'lg',active:true,style:{color:'orange',fontWeight:700}},
    {size:'sm',tone:'primary',style:{textTransform:'uppercase'}}
  ]
}`;

describe("compiled StyleX behavior", () => {
  it("emits actual CSS and props for base styles", () => {
    const result = compile("{base:{color:'red',display:'flex'}}");
    expect(result.rules.length).toBeGreaterThan(0);
    expect(result.css()).toContain("color:red");
    expect(result.css()).toContain("display:flex");
  });

  it("selects a single variant without defaults", () => {
    const result = compile("{variants:{tone:{red:{color:'red'},blue:{color:'blue'}}}}");
    expect(result.css()).toBe("");
    expect(result.css({ tone: "blue" })).toContain("color:blue");
    expect(result.css({ tone: "blue" })).not.toContain("color:red");
  });

  it.each([undefined, {}, { size: undefined }])("uses defaults for omitted props: %j", (props) => {
    const css = compile(config).css(props);
    expect(css).toContain("font-size:12px");
    expect(css).toContain("opacity:1");
    expect(css).toContain("text-transform:uppercase");
  });

  it.each([true, false])("selects boolean %s, overriding the default", (active) => {
    const css = compile(config).css({ active });
    expect(css).toContain(active ? "opacity:1" : "opacity:.5");
    expect(css).not.toContain(active ? "opacity:.5" : "opacity:1");
  });

  it("selects multiple groups and rejects partially matched compounds", () => {
    const css = compile(config).css({ size: "lg", active: false, tone: "secondary" });
    expect(css).toContain("font-size:20px");
    expect(css).toContain("color:green");
    expect(css).not.toContain("color:orange");
    expect(css).not.toContain("text-transform:uppercase");
  });

  it("applies matching compounds using defaults and gives the last compound precedence", () => {
    const css = compile(config).css({ size: "lg" });
    expect(css).toContain("color:orange");
    expect(css).toContain("font-weight:700");
    for (const color of ["red", "blue", "purple"]) expect(css).not.toContain(`color:${color}`);
    expect(css).toContain("display:flex");
  });

  it("gives variants precedence over base", () => {
    const css = compile(config).css({ tone: "secondary" });
    expect(css).toContain("color:green");
    expect(css).not.toContain("color:red");
  });

  it("preserves independent styles from simultaneous compounds", () => {
    const css = compile(`{variants:{enabled:{true:{opacity:1}}},
      compoundVariants:[
        {enabled:true,style:{color:'red'}},
        {enabled:true,style:{fontSize:12}}
      ]}`).css({ enabled: true });
    expect(css).toContain("color:red");
    expect(css).toContain("font-size:12px");
  });
});

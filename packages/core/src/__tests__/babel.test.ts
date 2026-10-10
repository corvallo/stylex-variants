import { transformSync } from "@babel/core";
import { describe, expect, it } from "vitest";

import plugin from "../babel";

describe("babel plugin", () => {
  it("loads correctly", () => {
    const result = transformSync(
      `
        const foo = 'bar';
      `,
      {
        plugins: [plugin],
      },
    );

    expect(result?.code).toContain("const foo");
  });

  it("transforms sxv base styles", () => {
    const result = transformSync(
      `
      import { sxv } from '@stylex-variants/core';

      const button = sxv({
        base: {
          backgroundColor: 'red',
          padding: 8,
        },
      });
    `,
      {
        plugins: [plugin],
      },
    );

    console.log(result?.code);

    expect(result?.code).toContain("stylex.create");
  });

  it("transforms static slots and preserves slot overrides", () => {
    const result = transformSync(
      `import { sxv } from '@stylex-variants/core'; const card = sxv({ slots: { root: { display: 'flex' }, title: { fontSize: 18 } } });`,
      { plugins: [plugin] },
    );
    expect(result?.code).toContain("slotStyles");
    expect(result?.code).toContain("root: (_slotProps");
    expect(result?.code).toContain("title: (_slotProps");
    expect(result?.code).toContain("Object.assign");
  });

  it("transforms slot variants and compoundSlots", () => {
    const result = transformSync(
      `import { sxv } from '@stylex-variants/core'; const card = sxv({ slots: { root: { display: 'flex' } }, variants: { tone: { accent: { root: { color: 'blue' } } } }, defaultVariants: { tone: 'accent' }, compoundSlots: [{ tone: 'accent', slots: { root: { borderWidth: 2 } } }] });`,
      { plugins: [plugin] },
    );
    expect(result?.code).toContain("variant_tone_");
    expect(result?.code).toContain("compound_0_root");
    expect(result?.code).toContain("=== 'accent'");
  });

  it("does not transform unrelated sxv functions", () => {
    const result = transformSync(
      `
        function sxv(config) {
          return config;
        }

        const button = sxv({
          base: {
            backgroundColor: 'red',
          },
        });
      `,
      {
        plugins: [plugin],
      },
    );

    expect(result?.code).not.toContain("stylex.create");
  });

  it("transforms aliased sxv imports", () => {
    const result = transformSync(
      `
        import { sxv as variants } from '@stylex-variants/core';

        const button = variants({
          base: {
            backgroundColor: 'red',
          },
        });
      `,
      {
        plugins: [plugin],
      },
    );

    expect(result?.code).toContain("stylex.create");
  });

  it("adds the StyleX import", () => {
    const result = transformSync(
      `
        import { sxv } from '@stylex-variants/core';

        const button = sxv({
          base: {
            backgroundColor: 'red',
          },
        });
      `,
      {
        plugins: [plugin],
      },
    );

    expect(result?.code).toContain("@stylexjs/stylex");
  });

  it("adds the StyleX import only once", () => {
    const result = transformSync(
      `
        import { sxv } from '@stylex-variants/core';

        const button = sxv({
          base: {
            backgroundColor: 'red',
          },
        });

        const card = sxv({
          base: {
            backgroundColor: 'blue',
          },
        });
      `,
      {
        plugins: [plugin],
      },
    );

    const matches = result?.code?.match(/@stylexjs\/stylex/g) ?? [];

    expect(matches).toHaveLength(1);
  });

  it("does not add StyleX import when it already exists", () => {
    const result = transformSync(
      `
        import * as stylex from '@stylexjs/stylex';
        import { sxv } from '@stylex-variants/core';

        const button = sxv({
          base: {
            backgroundColor: 'red',
          },
        });
      `,
      {
        plugins: [plugin],
      },
    );

    const matches = result?.code?.match(/@stylexjs\/stylex/g) ?? [];

    expect(matches).toHaveLength(1);
  });

  it("uses the existing StyleX import alias", () => {
    const result = transformSync(
      `
        import * as sx from '@stylexjs/stylex';
        import { sxv } from '@stylex-variants/core';

        const button = sxv({
          base: {
            backgroundColor: 'red',
          },
        });
      `,
      {
        plugins: [plugin],
      },
    );

    expect(result?.code).toContain("sx.create");
    expect(result?.code).not.toContain("stylex.create");
  });

  it("replaces sxv with a function that returns StyleX props", () => {
    const result = transformSync(
      `
        import { sxv } from '@stylex-variants/core';

        const button = sxv({
          base: {
            backgroundColor: 'red',
          },
        });
      `,
      {
        plugins: [plugin],
      },
    );

    expect(result?.code).toContain("stylex.props(_styles.base)");

    expect(result?.code).not.toContain("const button = sxv(");
  });

  it("merges generated props with className and style overrides", () => {
    const result = transformSync(
      `
      import { sxv } from '@stylex-variants/core';
      const button = sxv({ base: { color: 'red' } });
    `,
      { plugins: [plugin] },
    );

    expect(result?.code).toContain("_props.className");
    expect(result?.code).toContain("Object.assign({}, _result.style, _props.style)");
  });

  it("removes the sxv import after transformation", () => {
    const result = transformSync(
      `
      import { sxv } from '@stylex-variants/core';

      const button = sxv({
        base: {
          backgroundColor: 'red',
        },
      });
    `,
      {
        plugins: [plugin],
      },
    );

    expect(result?.code).not.toContain("from '@stylex-variants/core'");
  });

  it("preserves other imports from the core package", () => {
    const result = transformSync(
      `
      import {
        sxv,
        somethingElse,
      } from '@stylex-variants/core';

      const button = sxv({
        base: {
          backgroundColor: 'red',
        },
      });

      console.log(somethingElse);
    `,
      {
        plugins: [plugin],
      },
    );

    expect(result?.code).toContain("somethingElse");

    expect(result?.code).not.toMatch(/import\s*\{[^}]*\bsxv\b[^}]*\}\s*from/);
  });
});

function compile(source: string) {
  const code = transformSync(source, {
    plugins: [plugin],
    configFile: false,
    babelrc: false,
  })?.code;
  if (!code) throw new Error("Expected generated code");
  return code;
}

// Execute selection logic with a StyleX stand-in to inspect selected style objects.
function runVariants(config: string, props: Record<string, unknown> = {}) {
  const code = compile(`import { sxv } from '@stylex-variants/core';
    const button = sxv(${config});`).replace(
    /import \* as (\w+) from ["']@stylexjs\/stylex["'];/,
    "const $1 = stylex;",
  );
  const output = new Function("stylex", "props", `${code}; return button(props);`)(
    {
      create: (styles: unknown) => styles,
      props: (...styles: unknown[]) => styles.filter(Boolean),
    },
    props,
  );
  if (Array.isArray(output)) return output;
  return Object.keys(output)
    .filter((key) => /^\d+$/.test(key))
    .map((key) => output[key]);
}

describe("Babel regressions", () => {
  it("does not transform a shadowed sxv binding", () => {
    const code = compile(`import { sxv } from '@stylex-variants/core';
      const button = sxv({base:{color:'red'}});
      function local(sxv) { return sxv({base:{color:'blue'}}); }`);
    expect(code).toContain("return sxv(");
    expect(code.match(/\.create\(/g)).toHaveLength(1);
  });

  it("preserves imports with remaining references", () => {
    const code = compile(`import { sxv } from '@stylex-variants/core';
      const button = sxv({base:{color:'red'}});
      const factory = sxv;`);
    expect(code).toContain("import { sxv }");
    expect(code).toContain("const factory = sxv");
  });

  it.each([
    "config",
    "{...config}",
    "{variants: config}",
    "{variants: {size: config}}",
    "{variants: {size: {...config}}}",
    "{variants: {[key]: {sm: {color:'red'}}}}",
    "{defaultVariants: config}",
    "{compoundVariants: config}",
    "{compoundVariants: [...config]}",
    "{compoundVariants: [{size:'sm'}]}",
  ])("rejects unsupported configuration: %s", (config) => {
    expect(() =>
      compile(`import {sxv} from '@stylex-variants/core';
      const button = sxv(${config});`),
    ).toThrow(/sxv/);
  });

  it("supports quoted group names in defaults and compounds", () => {
    expect(
      runVariants(`{
      variants: {'font-size': {sm: {fontSize:12}}},
      defaultVariants: {'font-size':'sm'},
      compoundVariants: [{'font-size':'sm', style:{color:'red'}}]
    }`),
    ).toEqual([{ fontSize: 12 }, { color: "red" }]);
  });

  it("supports numeric variant keys", () => {
    expect(runVariants("{variants:{size:{1:{fontSize:12}}}}", { size: 1 })).toEqual([
      { fontSize: 12 },
    ]);
  });

  it("does not collide across group and value names", () => {
    expect(
      runVariants(
        `{variants:{
      a_b:{c:{color:'red'}},
      a:{b_c:{color:'blue'}},
      compound:{0:{fontSize:12}}
    }, compoundVariants:[{a_b:'c',style:{margin:4}}]}`,
        { a_b: "c", a: "b_c", compound: "0" },
      ),
    ).toEqual([{ color: "red" }, { color: "blue" }, { fontSize: 12 }, { margin: 4 }]);
  });

  it("supports multiple imported aliases", () => {
    const code = compile(`import {sxv as first, sxv as second} from '@stylex-variants/core';
      const a=first({base:{color:'red'}});
      const b=second({base:{color:'blue'}});`);
    expect(code.match(/\.create\(/g)).toHaveLength(2);
    expect(code).not.toContain("@stylex-variants/core");
  });

  it("transforms empty configurations", () => {
    expect(runVariants("{}")).toEqual([]);
  });

  it("merges className and style props into the StyleX result", () => {
    const code = compile(`import { sxv } from '@stylex-variants/core';
      const button = sxv({base:{color:'red'}});`).replace(
      /import \* as (\w+) from ["']@stylexjs\/stylex["'];/,
      "const $1 = stylex;",
    );
    const button = new Function("stylex", `${code}; return button;`)({
      create: () => ({ base: "base" }),
      props: () => ({ className: "stylex-class", style: { color: "red" } }),
    });
    expect(button({ className: "custom-class", style: { margin: 4 } })).toEqual({
      className: "stylex-class custom-class",
      style: { color: "red", margin: 4 },
    });
  });
});

it("does not reuse a shadowed StyleX namespace", () => {
  const code = compile(`import {sxv} from '@stylex-variants/core';
    import * as stylex from '@stylexjs/stylex';
    function make(stylex) { return sxv({base:{color:'red'}}); }`);
  expect(code).not.toContain("= stylex.create(");
  expect(code).toContain("_stylex.create(");
});

it("finds imports declared after the call", () => {
  const code = compile(`const button = sxv({base:{color:'red'}});
    import {sxv} from '@stylex-variants/core';
    import * as sx from '@stylexjs/stylex';`);
  expect(code).toContain("sx.create(");
  expect(code).not.toContain("@stylex-variants/core");
});

it.each([
  "{base: (color) => ({color})}",
  "{base: dynamicStyle}",
  "{variants: {tone: {primary: (color) => ({color})}}}",
  "{compoundVariants: [{style: (color) => ({color})}]}",
])("rejects unsupported dynamic styles: %s", (config) => {
  expect(() =>
    compile(`import {sxv} from '@stylex-variants/core'; const b=sxv(${config});`),
  ).toThrow("dynamic style functions are not supported");
});

import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const tarball = `stylex-variants-core-${manifest.version}.tgz`;
const temp = mkdtempSync(join(tmpdir(), "stylex-variants-package-"));
const run = (command, args, cwd = temp) =>
  execFileSync(command, args, {
    cwd,
    stdio: "inherit",
    env: {
      ...process.env,
      npm_config_cache: join(temp, "cache"),
    },
  });
try {
  run("npm", ["pack", "--pack-destination", temp], root);
  mkdirSync(join(temp, "consumer"));
  const consumer = join(temp, "consumer");
  writeFileSync(
    join(consumer, "package.json"),
    JSON.stringify({
      private: true,
      type: "module",
      dependencies: {
        "@stylex-variants/core": `file:${join(temp, tarball)}`,
        "@babel/core": "8.0.6",
        "@types/convert-source-map": "^2.0.3",
        typescript: "~6.0.2",
      },
    }),
  );
  run("npm", ["install", "--ignore-scripts", "--no-audit", "--no-fund"], consumer);
  writeFileSync(
    join(consumer, "check.ts"),
    `
    import {sxv, type VariantProps} from '@stylex-variants/core';
    import plugin from '@stylex-variants/core/babel';
    import {transformSync} from '@babel/core';
    const makeButton = () => sxv({variants:{size:{sm:{fontSize:12}}}});
    declare const button: ReturnType<typeof makeButton>;
    const props: VariantProps<typeof button>={size:'sm'};
    void props;
    // @ts-expect-error invalid public variant value
    const invalid: VariantProps<typeof button> = {size:'invalid'};
    void invalid;
    const result=transformSync("import {sxv} from '@stylex-variants/core'; const b=sxv({base:{color:'red'}});",
      {plugins:[plugin],configFile:false,babelrc:false});
    if (!result?.code?.includes('.create(') || result.code.includes('sxv(')) {
      throw new Error('Packed Babel plugin did not transform the call');
    }
  `,
  );
  run(
    process.execPath,
    [
      "node_modules/typescript/bin/tsc",
      "--noEmit",
      "--strict",
      "--module",
      "NodeNext",
      "--target",
      "ES2023",
      "check.ts",
    ],
    consumer,
  );
  run(process.execPath, ["check.ts"], consumer);
  console.log("Packed exports, declarations and Babel plugin passed.");
} finally {
  rmSync(temp, { recursive: true, force: true });
}

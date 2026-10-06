import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
        babel: fileURLToPath(new URL("./src/babel/index.ts", import.meta.url)),
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    // Bundle @babel/types so the plugin has no undeclared runtime dependency.
    rolldownOptions: {
      external: ["@stylexjs/stylex", "@babel/core"],
    },
    target: "es2023",
  },
});

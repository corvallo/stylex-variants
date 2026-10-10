import babel from "@rolldown/plugin-babel";
import stylex from "@stylexjs/unplugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import stylexVariantsPlugin from "@stylex-variants/core/babel";

export default defineConfig({
  plugins: [
    babel({
      plugins: [stylexVariantsPlugin],
    }),

    react(),

    stylex({
      useCSSLayers: true,
    }),
  ],
});

// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: {
        "stage-magician": resolve(__dirname, "src/index.ts"),
        utils: resolve(__dirname, "src/utils/index.ts"),
      },
    },
  },
  plugins: [
    dts({
      exclude: [
        "./vite.config.ts",
        "./.eslintrc.cjs",
        "./jest.config.cjs",
        "./src/main.ts",
        "**/*.test.ts",
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
});

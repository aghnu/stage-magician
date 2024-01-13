// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "stage-magician",
      fileName: "stage-magician",
    },
  },
  plugins: [
    dts({
      exclude: [
        "./vite.config.ts",
        "./.eslintrc.cjs",
        "./jest.config.cjs",
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

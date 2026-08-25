import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@@": fileURLToPath(new URL("./", import.meta.url)),
      "@core": fileURLToPath(new URL("./core", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: [
      "core/**/adapters/**/*.spec.ts",
      "core/**/use-cases/**/*.spec.ts",
      "src/app-runtime/runtime/**/*.spec.ts",
    ],
  },
});

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
    include: ["core/**/use-cases/**/*.spec.ts"],
  },
});

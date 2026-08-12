import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      include: ["**/*.{ts,tsx}"],
      exclude: [
        "node_modules/**",
        ".next/**",
        "out/**",
        "coverage/**",
        "*.config.{ts,js,mjs}",
        "**/*.d.ts",
        "components/ui/**",
        "components/providers/**",
        "app/**/layout.tsx",
        "lib/mocks/**",
        "lib/types/**",
        "app/api/**",
        "components/reui/**",
        "components/selectLevel/**",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});

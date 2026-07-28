import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["components/**/*.tsx", "components/**/*.ts", "lib/**/*.ts"],
    rules: {
      "import/no-default-export": "error",
    },
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*"],
              message:
                "Prefer absolute imports with `@/` prefix instead of relative imports `../.`.",
            },
          ],
        },
      ],
    },
  },
  {
    rules: {
      "@next/next/no-img-element": "off",
    },
    files: ["**/*.spec.tsx", "**/*.test.tsx"],
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "pnpm-lock.yaml",
    "node_modules/**",
    "coverage/**",
  ]),
]);

export default eslintConfig;

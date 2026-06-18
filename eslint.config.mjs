import path from "node:path";
import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import { configs, plugins } from "eslint-config-airbnb-extended";
import { rules as prettierConfigRules } from "eslint-config-prettier";
import jsdocPlugin from "eslint-plugin-jsdoc";
import oxlintPlugin from "eslint-plugin-oxlint";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

const configDirectoryPath = path.dirname(fileURLToPath(import.meta.url));
const gitignorePath = path.resolve(configDirectoryPath, ".gitignore");

const jsConfig = defineConfig([
  {
    name: "js/config",
    ...js.configs.recommended,
  },
  plugins.stylistic,
  plugins.importX,
  ...configs.base.recommended,
  {
    rules: {
      "import-x/prefer-default-export": "off",
      "no-param-reassign": "off",
      "no-promise-executor-return": "off",
      "func-names": "off",
      "consistent-return": "off",
      eqeqeq: ["error", "always"],
      curly: ["warn", "multi-line", "consistent"],
      "no-nested-ternary": "off",
      "no-plusplus": "off",
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "VariableDeclarator[id.type='Identifier'][init.type='ArrowFunctionExpression']",
          message:
            "Declare named functions with `function name()` instead of `const name = () =>`.",
        },
      ],
      "no-await-in-loop": "off",
      "no-continue": "off",
      "id-denylist": [
        "error",
        "ev",
        "e",
        "err",
        "res",
        "req",
        "ctx",
        "cfg",
        "tmp",
        "val",
      ],
      "import-x/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "unknown",
            "type",
          ],
          "newlines-between": "always",
        },
      ],
    },
  },
]);

const reactConfig = defineConfig([
  plugins.react,
  plugins.reactHooks,
  plugins.reactA11y,
  ...configs.react.recommended,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/require-default-props": "off",
      "react/no-unused-prop-types": "off",
      "react/no-unstable-nested-components": "off",
      "react/no-array-index-key": "off",
      "react/no-unescaped-entities": "off",
      "react/destructuring-assignment": "off",
      "react/jsx-no-bind": "off",
    },
  },
]);

const typescriptConfig = defineConfig([
  plugins.typescriptEslint,
  ...configs.base.typescript,
  ...configs.react.typescript,
  {
    rules: {
      "class-methods-use-this": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/prefer-as-const": "off",
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "never" },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "variableLike",
          format: ["camelCase", "UPPER_CASE", "PascalCase"],
          leadingUnderscore: "allowSingleOrDouble",
          custom: {
            regex: "^_*(?:[A-Z][A-Z0-9_]*|(?:(?![A-Z]{2,}).)*)$",
            match: true,
          },
        },
        {
          selector: "function",
          format: ["camelCase", "PascalCase"],
          custom: {
            regex: "^(?:(?![A-Z]{2,}).)*$",
            match: true,
          },
        },
        {
          selector: ["typeLike", "enumMember"],
          format: ["PascalCase"],
          custom: {
            regex: "^(?:(?![A-Z]{2,}).)*$",
            match: true,
          },
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
    },
  },
]);

const documentationConfig = defineConfig([
  {
    name: "documentation/jsdoc",
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      jsdoc: jsdocPlugin,
    },
    rules: {
      "jsdoc/check-tag-names": "warn",
      "jsdoc/require-description": [
        "warn",
        {
          contexts: [
            "FunctionDeclaration",
            "MethodDefinition",
            "TSInterfaceDeclaration",
            "TSTypeAliasDeclaration",
            "TSEnumDeclaration",
          ],
        },
      ],
      "jsdoc/require-jsdoc": [
        "warn",
        {
          contexts: [
            "FunctionDeclaration",
            "MethodDefinition",
            "TSInterfaceDeclaration",
            "TSTypeAliasDeclaration",
            "TSEnumDeclaration",
          ],
        },
      ],
    },
  },
]);

const scriptsConfig = defineConfig([
  {
    name: "scripts/config",
    files: ["scripts/**/*.{js,ts}"],
    rules: {
      "no-console": "off",
    },
  },
]);

const prettierConfig = defineConfig([
  {
    name: "prettier/plugin/config",
    plugins: {
      prettier: prettierPlugin,
    },
  },
  {
    name: "prettier/config",
    rules: {
      ...prettierConfigRules,
      "prettier/prettier": "error",
    },
  },
]);

export default defineConfig([
  includeIgnoreFile(gitignorePath),
  {
    name: "generated/core-api-sdk/ignore",
    ignores: ["core/shared/adapters/core-api/generated/**"],
  },
  ...jsConfig,
  ...reactConfig,
  ...typescriptConfig,
  ...documentationConfig,
  ...scriptsConfig,
  ...oxlintPlugin.buildFromOxlintConfigFile("./.oxlintrc.json"),
  ...prettierConfig,
]);

/**
 * THIS FILE WAS AUTO-GENERATED.
 * PLEASE DO NOT EDIT IT MANUALLY.
 * ===============================
 * IF YOU COPY THIS INTO AN ESLINT CONFIG, REMOVE THIS COMMENT BLOCK.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

import { includeIgnoreFile } from "@eslint/compat";
import js from "@eslint/js";
import { configs, plugins } from "eslint-config-airbnb-extended";
import { rules as prettierConfigRules } from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

const configDirectoryPath = path.dirname(fileURLToPath(import.meta.url));
const gitignorePath = path.resolve(configDirectoryPath, ".gitignore");

const jsConfig = defineConfig([
  // ESLint recommended config
  {
    name: "js/config",
    ...js.configs.recommended,
  },
  // Stylistic plugin
  plugins.stylistic,
  // Import X plugin
  plugins.importX,
  // Airbnb base recommended config
  ...configs.base.recommended,
  {
    rules: {
      "import-x/prefer-default-export": "off",
      "no-param-reassign": "off",
      "no-promise-executor-return": "off",
      "func-names": "off",
      "consistent-return": "off",
      "no-nested-ternary": "off",
      "no-plusplus": "off",
      "no-restricted-syntax": "off",
      "no-await-in-loop": "off",
      "no-continue": "off",
    },
  },
]);

const reactConfig = defineConfig([
  // React plugin
  plugins.react,
  // React hooks plugin
  plugins.reactHooks,
  // React JSX A11y plugin
  plugins.reactA11y,
  // Airbnb React recommended config
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
    },
  },
]);

const typescriptConfig = defineConfig([
  // TypeScript ESLint plugin
  plugins.typescriptEslint,
  // Airbnb base TypeScript config
  ...configs.base.typescript,
  // Airbnb React TypeScript config
  ...configs.react.typescript,
  {
    rules: {
      "class-methods-use-this": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-empty-function": "off",
    },
  },
]);

const prettierConfig = defineConfig([
  // Prettier plugin
  {
    name: "prettier/plugin/config",
    plugins: {
      prettier: prettierPlugin,
    },
  },
  // Prettier config
  {
    name: "prettier/config",
    rules: {
      ...prettierConfigRules,
      "prettier/prettier": "error",
    },
  },
]);

export default defineConfig([
  // Ignore files and folders listed in .gitignore
  includeIgnoreFile(gitignorePath),
  // JavaScript config
  ...jsConfig,
  // React config
  ...reactConfig,
  // TypeScript config
  ...typescriptConfig,
  // Prettier config
  ...prettierConfig,
]);

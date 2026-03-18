import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettierConfig from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["frontend/src/**/*.{js,jsx}"],
    plugins: { js, react, "react-hooks": reactHooks },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...prettierConfig.rules,
      "react/react-in-jsx-scope": "off",
    },
  },
  {
    files: [
      "*.js",
      "db/**/*.js",
      "routes/**/*.js",
      "controllers/**/*.js",
      "middleware/**/*.js",
      "config/**/*.js",
      "seed/**/*.js",
    ],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.node },
    rules: {
      ...prettierConfig.rules,
    },
  },
]);

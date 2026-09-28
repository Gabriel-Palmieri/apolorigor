import js from "@eslint/js";
import globals from "globals";
import hooks from "eslint-plugin-react-hooks";
import frontend from './eslint-frontend-rules.js';
export default [
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "test-results/**",
      "playwright-report/**",
    ],
  },
  {
    files: ["src/**/*.{js,jsx}", "tests/**/*.js", "scripts/**/*.mjs", "eslint-frontend-rules.js", "*.config.js"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { "react-hooks": hooks, frontend },
    rules: {
      ...js.configs.recommended.rules,
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],
      'frontend/jsx-bindings': 'error',
      'frontend/utility-styles': 'error',
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

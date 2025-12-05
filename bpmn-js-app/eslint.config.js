// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

const files = {
  ts: ["**/*.ts"],
  html: ["**/*.html"]
};

module.exports = [
  {
    ignores: [
      "dist"
    ],
  },
  {
    ...eslint.configs.recommended,
    files: files.ts
  },
  ...angular.configs.tsRecommended.map(config => ({
    ...config,
    files: files.ts
  })),
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: files.ts,
  })),
  ...angular.configs.templateRecommended.map(config => ({
    ...config,
    files: files.html,
    languageOptions: {
      parser: angular.templateParser,
    },
    processor: angular.processInlineTemplates
  }))
];

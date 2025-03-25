module.exports = {
  root: true,
  extends: [
    "next",
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended", // Add Prettier integration
  ],
  plugins: ["react", "jsx-a11y", "import", "prettier"],
  env: {
    browser: true, // Add browser environment for web applications.
    node: true, // Add Node.js environment for server-side code.
    es6: true, // Enable ES6 syntax.
  },
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 2024, // Set to latest ECMAScript version.
    sourceType: "module",
    ecmaFeatures: {
      jsx: true, // Enable JSX syntax.
    },
  },
  rules: {
    // Customize ESLint rules here
    "react/react-in-jsx-scope": "off", // Next.js does not require importing React in JSX files.
    "prettier/prettier": "error", // Enforce Prettier formatting as errors.
    "react/no-unknown-property": [
      "error",
      {
        ignore: [
          "jsx", // Ignore the 'jsx' property in JSX.
          "global", // Ignore the 'global' property in JSX.
        ],
      },
    ],
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal"],
        pathGroups: [
          {
            pattern: "react",
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
        "newlines-between": "always",
        warnOnUnassignedImports: true,
      },
    ],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};

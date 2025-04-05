module.exports = {
  root: true, // Specify that this is the root configuration file.
  extends: [
    "next", // Use Next.js-specific ESLint rules.
    "next/core-web-vitals", // Include rules for Next.js Core Web Vitals.
    "eslint:recommended", // Use recommended ESLint rules.
    "plugin:react/recommended", // Use recommended React rules.
    "plugin:jsx-a11y/recommended", // Use recommended accessibility rules for JSX.
    "plugin:prettier/recommended", // Integrate Prettier with ESLint.
  ],
  plugins: [
    "react", // Add React-specific linting rules.
    "jsx-a11y", // Add accessibility linting rules for JSX.
    "import", // Add linting rules for import/export syntax.
    "prettier", // Add Prettier plugin for code formatting.
  ],
  env: {
    browser: true, // Define global variables for browser environments.
    node: true, // Define global variables for Node.js environments.
    es6: true, // Enable ES6 syntax and features.
  },
  parser: "@babel/eslint-parser", // Use Babel ESLint parser for modern JavaScript syntax.
  parserOptions: {
    ecmaVersion: "latest", // Use the latest ECMAScript version.
    sourceType: "module", // Enable ECMAScript modules.
    ecmaFeatures: {
      jsx: true, // Enable linting for JSX syntax.
    },
  },
  rules: {
    // Customize ESLint rules here
    "react/react-in-jsx-scope": "off", // Disable the rule requiring React to be in scope in JSX files (Next.js handles this).
    "prettier/prettier": "error", // Treat Prettier formatting issues as errors.
    "react/no-unknown-property": [
      "error", // Disallow unknown DOM properties in JSX.
      {
        ignore: [
          "jsx", // Allow the 'jsx' property in JSX.
          "global", // Allow the 'global' property in JSX.
        ],
      },
    ],
    "import/order": [
      "error", // Enforce a specific order for import statements.
      {
        groups: ["builtin", "external", "internal"], // Group imports into categories.
        pathGroups: [
          {
            pattern: "react", // Place React imports at the top of external imports.
            group: "external",
            position: "before",
          },
        ],
        pathGroupsExcludedImportTypes: ["react"], // Exclude React from other import groups.
        alphabetize: {
          order: "asc", // Alphabetize imports in ascending order.
          caseInsensitive: true, // Ignore case when alphabetizing.
        },
        "newlines-between": "always", // Require newlines between import groups.
      },
    ],
  },
  settings: {
    react: {
      version: "detect", // Automatically detect the React version.
    },
  },
};

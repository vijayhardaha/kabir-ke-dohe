module.exports = {
  root: true, // Specify that this is the root configuration file.
  extends: [
    "eslint:recommended", // Use recommended ESLint rules.
    "plugin:prettier/recommended", // Integrate Prettier with ESLint.
  ],
  plugins: [
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
  },
  rules: {
    // Customize ESLint rules here
    "prettier/prettier": "error", // Treat Prettier formatting issues as errors.
    "import/order": [
      "error", // Enforce a specific order for import statements.
      {
        groups: ["builtin", "external", "internal"], // Group imports into categories.
        alphabetize: {
          order: "asc", // Alphabetize imports in ascending order.
          caseInsensitive: true, // Ignore case when alphabetizing.
        },
        "newlines-between": "always", // Require newlines between import groups.
      },
    ],
  },
};

/**
 * ======================================================================
 * Vitest Configuration
 * ======================================================================
 * Purpose: Defines test execution, coverage, and file discovery for the
 *          CLI tools test suite.
 * Docs:    https://vitest.dev/config/
 * ======================================================================
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  // ---- Test Runtime ----
  test: {
    // Expose describe/it/expect globally without explicit imports.
    globals: true,

    // Limit discovery to test and spec files within the source tree.
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],

    // ---- Coverage ----
    coverage: {
      // Use V8 native instrumentation for fast coverage collection.
      provider: 'v8',

      // Generate terminal, machine-readable, and browsable reports.
      reporter: ['text', 'json', 'html'],

      // Write generated coverage artifacts into the project coverage folder.
      reportsDirectory: './coverage',

      // Exclude setup, generated, build, and non-target files from coverage.
      exclude: ['node_modules/', 'vitest.config.ts', '**/*.test.ts', '**/*.spec.ts', '**/dist/', '**/build/'],
    },
  },
});

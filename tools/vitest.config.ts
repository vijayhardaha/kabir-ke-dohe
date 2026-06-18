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
  },
});

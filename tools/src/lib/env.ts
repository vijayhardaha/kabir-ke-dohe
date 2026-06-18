/**
 * Script environment variables required for database, storage, and sheet operations.
 *
 * Bun injects env vars from the file specified via `--env-file`:
 *   bun --env-file=.env.local run tools/couplets-upload.ts
 *   bun --env-file=.env.production run tools/couplets-upload.ts
 *
 * Make sure all required keys are defined in the referenced .env file.
 */
export interface ScriptEnv {
  NODE_ENV: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  GOOGLE_SERVICE_ACCOUNT_BASE64: string;
  GOOGLE_SHEET_ID: string;
}

/**
 * Reads environment variables from process.env.
 *
 * Bun's `--env-file` flag injects the variables before the script runs,
 * so no explicit dotenv call is needed. Consumers are responsible for
 * checking missing values.
 *
 * @returns {ScriptEnv} Environment variables read from process.env.
 *
 * @example
 * const env = loadScriptEnv();
 * const supabase = createSupabaseClient(env);
 */
export function loadScriptEnv(): ScriptEnv {
  return {
    NODE_ENV: (process.env.NODE_ENV as string) || 'development',
    SUPABASE_URL: process.env.SUPABASE_URL as string,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    GOOGLE_SERVICE_ACCOUNT_BASE64: process.env.GOOGLE_SERVICE_ACCOUNT_BASE64 as string,
    GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID as string,
  };
}

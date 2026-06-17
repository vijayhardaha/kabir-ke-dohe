/**
 * Unit tests for environment variable loading.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

import { loadScriptEnv, type ScriptEnv } from '../env';

describe('env', () => {
  describe('loadScriptEnv', () => {
    let originalEnv: NodeJS.ProcessEnv;

    beforeEach(() => {
      originalEnv = { ...process.env };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    function setEnv(key: string, value: string) {
      process.env[key] = value;
    }

    it('should read environment variables from process.env', () => {
      setEnv('NODE_ENV', 'development');
      setEnv('SUPABASE_URL', 'https://example.supabase.co');
      setEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-service-key');
      setEnv('GOOGLE_SERVICE_ACCOUNT_BASE64', 'eyJjbGllbnRfZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0=');
      setEnv('GOOGLE_SHEET_ID', 'test-sheet-id');

      const env = loadScriptEnv();

      expect(env).toEqual({
        NODE_ENV: 'development',
        SUPABASE_URL: 'https://example.supabase.co',
        SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
        GOOGLE_SERVICE_ACCOUNT_BASE64: 'eyJjbGllbnRfZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIn0=',
        GOOGLE_SHEET_ID: 'test-sheet-id',
      } satisfies ScriptEnv);
    });

    it('should default NODE_ENV to development when not set', () => {
      delete (process.env as Record<string, string>)['NODE_ENV'];
      setEnv('SUPABASE_URL', 'https://example.supabase.co');
      setEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-key');
      setEnv('GOOGLE_SERVICE_ACCOUNT_BASE64', 'dGVzdC1iYXNlNjQ=');
      setEnv('GOOGLE_SHEET_ID', 'test-id');

      const env = loadScriptEnv();

      expect(env.NODE_ENV).toBe('development');
    });

    it('should return the correct type ScriptEnv', () => {
      setEnv('NODE_ENV', 'production');
      setEnv('SUPABASE_URL', 'https://prod.supabase.co');
      setEnv('SUPABASE_SERVICE_ROLE_KEY', 'prod-key');
      setEnv('GOOGLE_SERVICE_ACCOUNT_BASE64', 'cHJvZC1iYXNlNjQ=');
      setEnv('GOOGLE_SHEET_ID', 'prod-id');

      const env = loadScriptEnv();

      const expected: ScriptEnv = {
        NODE_ENV: 'production',
        SUPABASE_URL: 'https://prod.supabase.co',
        SUPABASE_SERVICE_ROLE_KEY: 'prod-key',
        GOOGLE_SERVICE_ACCOUNT_BASE64: 'cHJvZC1iYXNlNjQ=',
        GOOGLE_SHEET_ID: 'prod-id',
      };

      expect(env).toEqual(expected);
    });
  });
});

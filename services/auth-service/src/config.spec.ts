import { validateConfig } from './config';

describe('Configuration Schema Validation', () => {
  it('should validate valid postgresql:// DATABASE_URL', () => {
    const env = {
      DATABASE_URL:
        'postgresql://postgres:postgres@localhost:5432/auth_db?schema=public',
    };
    const parsed = validateConfig(env);
    expect(parsed.DATABASE_URL).toBe(env.DATABASE_URL);
  });

  it('should validate valid postgres:// DATABASE_URL', () => {
    const env = {
      DATABASE_URL: 'postgres://user:secret@localhost:5432/auth_db',
    };
    const parsed = validateConfig(env);
    expect(parsed.DATABASE_URL).toBe(env.DATABASE_URL);
  });

  it('should reject missing DATABASE_URL without fallback secrets', () => {
    const env = {};
    expect(() => validateConfig(env)).toThrow();
  });

  it('should reject empty string DATABASE_URL', () => {
    const env = {
      DATABASE_URL: '',
    };
    expect(() => validateConfig(env)).toThrow();
  });

  it('should reject invalid URL format', () => {
    const env = {
      DATABASE_URL: 'not-a-valid-url',
    };
    expect(() => validateConfig(env)).toThrow();
  });

  it('should reject non-PostgreSQL database URLs', () => {
    const mysqlEnv = {
      DATABASE_URL: 'mysql://root:password@localhost:3306/auth_db',
    };
    expect(() => validateConfig(mysqlEnv)).toThrow();

    const httpEnv = {
      DATABASE_URL: 'https://localhost:5432/auth_db',
    };
    expect(() => validateConfig(httpEnv)).toThrow();
  });
});

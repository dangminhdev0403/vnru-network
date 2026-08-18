import { validateConfig } from './config';

describe('Configuration Schema Validation', () => {
  const validBaseEnv = {
    DATABASE_URL:
      'postgresql://postgres:postgres@localhost:5432/auth_db?schema=public',
    KEYCLOAK_ISSUER_URL: 'https://keycloak.example.com/realms/vnru',
    KEYCLOAK_CLIENT_ID: 'vnru-auth',
    KEYCLOAK_REDIRECT_URI: 'https://portal.example.com/auth/callback',
  };

  it('should validate valid postgresql:// DATABASE_URL with Keycloak configuration', () => {
    const env = { ...validBaseEnv };
    const parsed = validateConfig(env);
    expect(parsed.DATABASE_URL).toBe(env.DATABASE_URL);
    expect(parsed.KEYCLOAK_ISSUER_URL).toBe(env.KEYCLOAK_ISSUER_URL);
    expect(parsed.KEYCLOAK_CLIENT_ID).toBe(env.KEYCLOAK_CLIENT_ID);
    expect(parsed.KEYCLOAK_REDIRECT_URI).toBe(env.KEYCLOAK_REDIRECT_URI);
  });

  it('should validate valid postgres:// DATABASE_URL', () => {
    const env = {
      ...validBaseEnv,
      DATABASE_URL: 'postgres://user:secret@localhost:5432/auth_db',
    };
    const parsed = validateConfig(env);
    expect(parsed.DATABASE_URL).toBe(env.DATABASE_URL);
  });

  it('should reject missing DATABASE_URL without fallback secrets', () => {
    const env = {
      KEYCLOAK_ISSUER_URL: validBaseEnv.KEYCLOAK_ISSUER_URL,
      KEYCLOAK_CLIENT_ID: validBaseEnv.KEYCLOAK_CLIENT_ID,
      KEYCLOAK_REDIRECT_URI: validBaseEnv.KEYCLOAK_REDIRECT_URI,
    };
    expect(() => validateConfig(env)).toThrow();
  });

  it('should reject empty string DATABASE_URL', () => {
    const env = {
      ...validBaseEnv,
      DATABASE_URL: '',
    };
    expect(() => validateConfig(env)).toThrow();
  });

  it('should reject invalid URL format for DATABASE_URL', () => {
    const env = {
      ...validBaseEnv,
      DATABASE_URL: 'not-a-valid-url',
    };
    expect(() => validateConfig(env)).toThrow();
  });

  it('should reject non-PostgreSQL database URLs', () => {
    const mysqlEnv = {
      ...validBaseEnv,
      DATABASE_URL: 'mysql://root:password@localhost:3306/auth_db',
    };
    expect(() => validateConfig(mysqlEnv)).toThrow();

    const httpEnv = {
      ...validBaseEnv,
      DATABASE_URL: 'https://localhost:5432/auth_db',
    };
    expect(() => validateConfig(httpEnv)).toThrow();
  });

  it('should reject missing KEYCLOAK_ISSUER_URL without fallback secrets', () => {
    const env = {
      DATABASE_URL: validBaseEnv.DATABASE_URL,
      KEYCLOAK_CLIENT_ID: validBaseEnv.KEYCLOAK_CLIENT_ID,
      KEYCLOAK_REDIRECT_URI: validBaseEnv.KEYCLOAK_REDIRECT_URI,
    };
    expect(() => validateConfig(env)).toThrow();
  });

  it('should reject empty string or invalid KEYCLOAK_ISSUER_URL', () => {
    expect(() =>
      validateConfig({ ...validBaseEnv, KEYCLOAK_ISSUER_URL: '' }),
    ).toThrow();
    expect(() =>
      validateConfig({
        ...validBaseEnv,
        KEYCLOAK_ISSUER_URL: 'not-a-valid-url',
      }),
    ).toThrow();
    expect(() =>
      validateConfig({
        ...validBaseEnv,
        KEYCLOAK_ISSUER_URL: 'ftp://keycloak.example.com',
      }),
    ).toThrow();
  });

  it('should reject missing or empty KEYCLOAK_CLIENT_ID', () => {
    const env = {
      DATABASE_URL: validBaseEnv.DATABASE_URL,
      KEYCLOAK_ISSUER_URL: validBaseEnv.KEYCLOAK_ISSUER_URL,
      KEYCLOAK_REDIRECT_URI: validBaseEnv.KEYCLOAK_REDIRECT_URI,
    };
    expect(() => validateConfig(env)).toThrow();
    expect(() =>
      validateConfig({ ...validBaseEnv, KEYCLOAK_CLIENT_ID: '' }),
    ).toThrow();
  });

  it('should reject missing or invalid KEYCLOAK_REDIRECT_URI', () => {
    const env = {
      DATABASE_URL: validBaseEnv.DATABASE_URL,
      KEYCLOAK_ISSUER_URL: validBaseEnv.KEYCLOAK_ISSUER_URL,
      KEYCLOAK_CLIENT_ID: validBaseEnv.KEYCLOAK_CLIENT_ID,
    };
    expect(() => validateConfig(env)).toThrow();
    expect(() =>
      validateConfig({ ...validBaseEnv, KEYCLOAK_REDIRECT_URI: '' }),
    ).toThrow();
    expect(() =>
      validateConfig({
        ...validBaseEnv,
        KEYCLOAK_REDIRECT_URI: 'not-a-valid-url',
      }),
    ).toThrow();
    expect(() =>
      validateConfig({
        ...validBaseEnv,
        KEYCLOAK_REDIRECT_URI: 'javascript:void(0)',
      }),
    ).toThrow();
  });

  it('should reject completely empty environment object without fallback defaults', () => {
    expect(() => validateConfig({})).toThrow();
  });
});

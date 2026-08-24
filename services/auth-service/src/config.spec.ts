import { validateConfig } from './config';

describe('validateConfig', () => {
  it('requires PostgreSQL and a strong Auth.js bridge secret', () => {
    expect(
      validateConfig({
        DATABASE_URL: 'postgresql://test:test@localhost/test',
        AUTH_BRIDGE_SECRET: 'x'.repeat(32),
      }).AUTH_BRIDGE_SECRET,
    ).toHaveLength(32);
    expect(() =>
      validateConfig({
        DATABASE_URL: 'postgresql://test:test@localhost/test',
        AUTH_BRIDGE_SECRET: 'short',
      }),
    ).toThrow();
  });
});

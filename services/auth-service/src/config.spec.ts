import { validateConfig } from './config';

describe('validateConfig', () => {
  it('requires PostgreSQL and a strong Auth.js bridge secret', () => {
    expect(
      validateConfig({
        DATABASE_URL: 'postgresql://test:***@localhost/test',
        AUTH_BRIDGE_SECRET: 'x'.repeat(32),
        CLOUDINARY_CLOUD_NAME: 'cloud',
        CLOUDINARY_API_KEY: 'key',
        CLOUDINARY_API_SECRET: 'secret',
      }).AUTH_BRIDGE_SECRET,
    ).toHaveLength(32);
    expect(() =>
      validateConfig({
        DATABASE_URL: 'postgresql://test:***@localhost/test',
        AUTH_BRIDGE_SECRET: 'short',
        CLOUDINARY_CLOUD_NAME: 'cloud',
        CLOUDINARY_API_KEY: 'key',
        CLOUDINARY_API_SECRET: 'secret',
      }),
    ).toThrow();
  });
});

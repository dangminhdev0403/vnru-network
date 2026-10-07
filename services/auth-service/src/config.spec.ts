import { validateConfig } from './config';

const valid = {
  DATABASE_URL: 'postgresql://test:***@localhost/test',
  AUTH_BRIDGE_SECRET: 'x'.repeat(32),
  GOOGLE_CLOUD_PROJECT: 'vnru-production',
  GCS_BUCKET: 'vnru-public-media',
};

describe('validateConfig', () => {
  it('requires PostgreSQL, a strong Auth.js bridge secret, and GCS identity', () => {
    expect(validateConfig(valid)).toEqual(expect.objectContaining(valid));
    expect(() =>
      validateConfig({ ...valid, AUTH_BRIDGE_SECRET: 'short' }),
    ).toThrow();
    expect(() =>
      validateConfig({ ...valid, GCS_BUCKET: 'Bad Bucket' }),
    ).toThrow();
  });
});

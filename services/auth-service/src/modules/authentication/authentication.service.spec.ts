import { createHmac } from 'node:crypto';
import { UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService Auth.js bridge', () => {
  const secret = 'synthetic-auth-bridge-secret-32-characters';
  const identity = {
    id: 'user-1',
    email: 'member@example.test',
    status: 'ACTIVE',
  };
  const identityService = {
    resolveOrCreateByExternalIdentity: jest.fn().mockResolvedValue(identity),
    findById: jest.fn(),
  };
  const sessionService = {
    createSession: jest.fn().mockResolvedValue({ token: 'opaque-token' }),
    validateSession: jest.fn(),
    revokeSession: jest.fn(),
  };
  const accessControlService = { resolveCapabilities: jest.fn() };
  const service = new AuthenticationService(
    identityService as never,
    sessionService as never,
    accessControlService as never,
  );

  beforeAll(() => {
    process.env.DATABASE_URL = 'postgresql://test:test@localhost/test';
    process.env.AUTH_BRIDGE_SECRET = secret;
  });

  it('accepts a fresh signed Auth.js assertion and creates an opaque session', async () => {
    const account = 'member@example.test';
    const timestamp = Date.now().toString();
    const signature = createHmac('sha256', secret)
      .update(`${timestamp}\n${account}`)
      .digest('hex');
    await expect(
      service.exchangeAuthJsAssertion({ account, timestamp, signature }),
    ).resolves.toEqual({ token: 'opaque-token', user: identity });
    expect(
      identityService.resolveOrCreateByExternalIdentity,
    ).toHaveBeenCalledWith({
      issuer: 'authjs:credentials',
      subject: account,
      email: account,
    });
  });

  it('rejects stale assertions', async () => {
    const timestamp = (Date.now() - 31_000).toString();
    await expect(
      service.exchangeAuthJsAssertion({
        account: 'member',
        timestamp,
        signature: '0'.repeat(64),
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});

import { KeycloakProfileService } from './keycloak-profile.service';

describe('KeycloakProfileService', () => {
  const originalFetch = global.fetch;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.DATABASE_URL = 'postgresql://x:y@localhost:5432/x';
    process.env.KEYCLOAK_ISSUER_URL = 'https://id.example/realms/vnru';
    process.env.KEYCLOAK_CLIENT_ID = 'vnru-auth';
    process.env.KEYCLOAK_REDIRECT_URI = 'https://app.example/callback';
    process.env.KEYCLOAK_PROFILE_CLIENT_ID = 'profile-service';
    process.env.KEYCLOAK_PROFILE_CLIENT_SECRET = 'synthetic-secret';
  });

  afterAll(() => {
    global.fetch = originalFetch;
    process.env = originalEnv;
  });

  it('updates only names and returns the current provider profile', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: 'token' }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: 'token' }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            firstName: 'Minh',
            lastName: 'Hoàng',
            email: 'minh@example.com',
          }),
          { status: 200 },
        ),
      );
    global.fetch = fetchMock as typeof fetch;

    const result = await new KeycloakProfileService().update('kc-user-1', {
      firstName: 'Minh',
      lastName: 'Hoàng',
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://id.example/admin/realms/vnru/users/kc-user-1',
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ firstName: 'Minh', lastName: 'Hoàng' }),
      }),
    );
    expect(result).toEqual({
      firstName: 'Minh',
      lastName: 'Hoàng',
      email: 'minh@example.com',
    });
  });

  it('removes OTP credentials without touching password credentials', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: 'token' }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            { id: 'password-1', type: 'password' },
            { id: 'otp-1', type: 'otp' },
          ]),
          { status: 200 },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: 'token' }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    global.fetch = fetchMock as typeof fetch;

    await expect(
      new KeycloakProfileService().disableMfa('kc-user-1'),
    ).resolves.toEqual({ enabled: false });
    expect(fetchMock).toHaveBeenNthCalledWith(
      4,
      'https://id.example/admin/realms/vnru/users/kc-user-1/credentials/otp-1',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('terminates Keycloak sessions server-side', async () => {
    const fetchMock = jest
      .fn()
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: 'token' }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 204 }));
    global.fetch = fetchMock as typeof fetch;

    await expect(
      new KeycloakProfileService().logout('kc-user-1'),
    ).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://id.example/admin/realms/vnru/users/kc-user-1/logout',
      expect.objectContaining({ method: 'POST' }),
    );
  });
});

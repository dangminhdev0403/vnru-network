import {
  BadGatewayException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { validateConfig } from '../../config';

export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
}

export interface MfaStatus {
  enabled: boolean;
}

@Injectable()
export class KeycloakProfileService {
  private async request(
    subject: string,
    init?: RequestInit,
    suffix = '',
  ): Promise<Response> {
    const config = validateConfig();
    if (
      !config.KEYCLOAK_PROFILE_CLIENT_ID ||
      !config.KEYCLOAK_PROFILE_CLIENT_SECRET
    ) {
      throw new ServiceUnavailableException(
        'Profile management is not configured',
      );
    }

    const issuer = new URL(config.KEYCLOAK_ISSUER_URL);
    const realm = issuer.pathname.split('/realms/')[1]?.split('/')[0];
    if (!realm)
      throw new ServiceUnavailableException('Invalid Keycloak issuer');

    const tokenResponse = await fetch(
      `${issuer.href.replace(/\/$/, '')}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: config.KEYCLOAK_PROFILE_CLIENT_ID,
          client_secret: config.KEYCLOAK_PROFILE_CLIENT_SECRET,
        }),
      },
    );
    if (!tokenResponse.ok)
      throw new BadGatewayException('Identity provider unavailable');
    const token = (await tokenResponse.json()) as { access_token?: unknown };
    if (typeof token.access_token !== 'string')
      throw new BadGatewayException('Identity provider unavailable');

    return fetch(
      `${issuer.origin}/admin/realms/${encodeURIComponent(realm)}/users/${encodeURIComponent(subject)}${suffix}`,
      {
        ...init,
        headers: {
          authorization: `Bearer ${token.access_token}`,
          'content-type': 'application/json',
          ...init?.headers,
        },
      },
    );
  }

  async get(subject: string): Promise<UserProfile> {
    const response = await this.request(subject);
    if (!response.ok) throw new BadGatewayException('Unable to load profile');
    const profile = (await response.json()) as Partial<UserProfile>;
    return {
      firstName: typeof profile.firstName === 'string' ? profile.firstName : '',
      lastName: typeof profile.lastName === 'string' ? profile.lastName : '',
      email: typeof profile.email === 'string' ? profile.email : '',
    };
  }

  async update(
    subject: string,
    profile: Pick<UserProfile, 'firstName' | 'lastName'>,
  ): Promise<UserProfile> {
    const response = await this.request(subject, {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
    if (!response.ok) throw new BadGatewayException('Unable to update profile');
    return this.get(subject);
  }

  private async credentials(
    subject: string,
  ): Promise<Array<{ id: string; type: string }>> {
    const response = await this.request(subject, undefined, '/credentials');
    if (!response.ok)
      throw new BadGatewayException('Unable to load MFA status');
    const credentials = (await response.json()) as Array<{
      id?: unknown;
      type?: unknown;
    }>;
    return credentials.filter(
      (credential): credential is { id: string; type: string } =>
        typeof credential.id === 'string' &&
        typeof credential.type === 'string',
    );
  }

  async getMfaStatus(subject: string): Promise<MfaStatus> {
    return {
      enabled: (await this.credentials(subject)).some(
        ({ type }) => type === 'otp',
      ),
    };
  }

  async disableMfa(subject: string): Promise<MfaStatus> {
    const otpCredentials = (await this.credentials(subject)).filter(
      ({ type }) => type === 'otp',
    );
    for (const credential of otpCredentials) {
      const response = await this.request(
        subject,
        { method: 'DELETE' },
        `/credentials/${encodeURIComponent(credential.id)}`,
      );
      if (!response.ok) throw new BadGatewayException('Unable to disable MFA');
    }
    return { enabled: false };
  }

  async logout(subject: string): Promise<void> {
    const response = await this.request(subject, { method: 'POST' }, '/logout');
    if (!response.ok)
      throw new BadGatewayException('Unable to terminate identity session');
  }
}

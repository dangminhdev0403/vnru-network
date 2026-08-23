import { createHash } from "node:crypto";
import NextAuth from "next-auth";
import Keycloak from "next-auth/providers/keycloak";
import { cookies } from "next/headers";

function backendUrl(path: string): URL {
  const base = process.env.AUTH_SERVICE_URL;
  if (!base) throw new Error("AUTH_SERVICE_URL is required");
  return new URL(path, base.endsWith("/") ? base : `${base}/`);
}

type ProviderTokens = {
  accessToken?: string;
  accessTokenExpiresAt?: number;
  refreshToken?: string;
  error?: "RefreshTokenError";
};

type RefreshResult = Required<
  Pick<ProviderTokens, "accessToken" | "accessTokenExpiresAt" | "refreshToken">
>;

// ponytail: process-local lock/cache; use a shared lock when multiple Next.js instances run.
const refreshes = new Map<string, Promise<RefreshResult>>();

async function refreshAccessToken(
  refreshToken: string,
): Promise<RefreshResult> {
  const key = createHash("sha256").update(refreshToken).digest("hex");
  const active = refreshes.get(key);
  if (active) return active;

  const refresh = (async () => {
    const issuer = process.env.AUTH_KEYCLOAK_ISSUER;
    const clientId = process.env.AUTH_KEYCLOAK_ID;
    const clientSecret = process.env.AUTH_KEYCLOAK_SECRET;
    if (!issuer || !clientId || !clientSecret) {
      throw new Error("Keycloak refresh configuration is incomplete");
    }

    const response = await fetch(
      `${issuer.replace(/\/$/, "")}/protocol/openid-connect/token`,
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }),
      },
    );
    const body = (await response.json()) as {
      access_token?: unknown;
      expires_in?: unknown;
      refresh_token?: unknown;
    };
    if (
      !response.ok ||
      typeof body.access_token !== "string" ||
      typeof body.expires_in !== "number"
    ) {
      throw new Error("Keycloak refresh failed");
    }
    return {
      accessToken: body.access_token,
      accessTokenExpiresAt: Date.now() + body.expires_in * 1000,
      refreshToken:
        typeof body.refresh_token === "string"
          ? body.refresh_token
          : refreshToken,
    };
  })();

  refreshes.set(key, refresh);
  setTimeout(() => refreshes.delete(key), 5_000).unref();
  return refresh;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER,
    }),
  ],
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    async jwt({ token, account }) {
      const provider = token as typeof token & ProviderTokens;
      if (account) {
        if (
          !account.access_token ||
          !account.expires_at ||
          !account.refresh_token
        ) {
          throw new Error("Keycloak returned incomplete tokens");
        }
        const response = await fetch(backendUrl("api/v1/auth/exchange"), {
          method: "POST",
          headers: { authorization: `Bearer ${account.access_token}` },
        });
        if (!response.ok) throw new Error("Backend session exchange failed");
        const body = (await response.json()) as { token?: unknown };
        if (typeof body.token !== "string" || !body.token) {
          throw new Error("Backend session exchange returned no token");
        }
        (await cookies()).set("vnru_session", body.token, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: 30 * 24 * 60 * 60,
        });
        provider.accessToken = account.access_token;
        provider.accessTokenExpiresAt = account.expires_at * 1000;
        provider.refreshToken = account.refresh_token;
        delete provider.error;
        return provider;
      }

      if (
        provider.accessTokenExpiresAt &&
        Date.now() < provider.accessTokenExpiresAt - 1_000
      ) {
        return provider;
      }
      if (!provider.refreshToken) {
        provider.error = "RefreshTokenError";
        return provider;
      }

      try {
        Object.assign(
          provider,
          await refreshAccessToken(provider.refreshToken),
        );
        delete provider.error;
      } catch {
        provider.error = "RefreshTokenError";
      }
      return provider;
    },
    session({ session, token }) {
      (session as typeof session & Pick<ProviderTokens, "error">).error = (
        token as ProviderTokens
      ).error;
      return session;
    },
  },
});

import { createHmac, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { z } from "zod";

const accountConfigSchema = z.object({
  accounts: z.array(z.object({ account: z.string().min(1), password: z.string().min(1), role: z.string().min(1) })),
});

function backendUrl(path: string): URL {
  const base = process.env.AUTH_SERVICE_URL;
  if (!base) throw new Error("AUTH_SERVICE_URL is required");
  return new URL(path, base.endsWith("/") ? base : `${base}/`);
}

async function findAccount(account: string, password: string) {
  const path = process.env.ACCOUNT_CONFIG_PATH;
  if (!path) throw new Error("ACCOUNT_CONFIG_PATH is required");
  const config = accountConfigSchema.parse(JSON.parse(await readFile(path, "utf8")));
  return config.accounts.find((candidate) => {
    const actual = Buffer.from(candidate.password);
    const supplied = Buffer.from(password);
    return candidate.account === account && actual.length === supplied.length && timingSafeEqual(actual, supplied);
  });
}

async function verifyRegisteredAccount(account: string, password: string): Promise<boolean> {
  const response = await fetch(backendUrl("api/v1/auth/credentials/verify"), { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ account, password }), cache: "no-store" }).catch(() => null);
  if (!response?.ok) return false;
  return ((await response.json()) as { valid?: boolean }).valid === true;
}

async function createBackendSession(account: string): Promise<string> {
  const secret = process.env.AUTH_BRIDGE_SECRET;
  if (!secret) throw new Error("AUTH_BRIDGE_SECRET is required");
  const timestamp = Date.now().toString();
  const signature = createHmac("sha256", secret).update(`${timestamp}\n${account}`).digest("hex");
  const response = await fetch(backendUrl("api/v1/auth/exchange"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ account, timestamp, signature }),
  });
  if (!response.ok) throw new Error("Backend session exchange failed");
  const body = (await response.json()) as { token?: unknown };
  if (typeof body.token !== "string" || !body.token) throw new Error("Backend session exchange returned no token");
  return body.token;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [Credentials({
    credentials: {
      account: { label: "Tài khoản", type: "text" },
      password: { label: "Mật khẩu", type: "password" },
    },
    async authorize(credentials) {
      const parsed = z.object({ account: z.string().trim().min(1), password: z.string().min(1) }).safeParse(credentials);
      if (!parsed.success) return null;
      if (await verifyRegisteredAccount(parsed.data.account, parsed.data.password)) return { id: parsed.data.account.toLowerCase(), name: parsed.data.account };
      const matched = await findAccount(parsed.data.account, parsed.data.password);
      return matched ? { id: matched.account, name: matched.account } : null;
    },
  })],
  pages: { signIn: "/login", error: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (!user?.id) return token;
      const backendToken = await createBackendSession(user.id);
      (await cookies()).set("vnru_session", backendToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 30 * 24 * 60 * 60,
      });
      return token;
    },
  },
});

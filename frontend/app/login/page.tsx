import { sanitizeReturnTo } from "../../features/auth/server";

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { returnTo } = await searchParams;
  const query = new URLSearchParams({ returnTo: sanitizeReturnTo(typeof returnTo === "string" ? returnTo : undefined) });
  return <iframe className="stitch-page" src={`/stitch/login.html?${query}`} title="Login | Russia–Vietnam Knowledge Network" />;
}
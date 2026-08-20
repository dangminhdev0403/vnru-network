import { cookies } from "next/headers";
import { HomeMotion } from "./HomeMotion";
import { getCurrentSession, SESSION_COOKIE_NAME } from "../features/auth/server";

export default async function Home() {
  const isAuthenticated = Boolean(await getCurrentSession((await cookies()).get(SESSION_COOKIE_NAME)?.value));

  return <HomeMotion isAuthenticated={isAuthenticated} />;
}

import { readFile } from "node:fs/promises";
import path from "node:path";
import { cookies } from "next/headers";
import { HomeMotion } from "./HomeMotion";
import { getCurrentSession, SESSION_COOKIE_NAME } from "../features/auth/server";

export default async function Home() {
  const isAuthenticated = Boolean(await getCurrentSession((await cookies()).get(SESSION_COOKIE_NAME)?.value));
  const html = await readFile(path.join(process.cwd(), "stitch/index.html"), "utf8");
  const styles = html.match(/<style>([\s\S]*?)<\/style>/)?.[1];
  const body = html.match(/<body>([\s\S]*?)<\/body>/)?.[1]?.replace('<a href="#cooperation">Hợp tác 2+2</a>', '<a href="#cooperation">Hợp tác 2+2</a><span id="language-switcher-slot"></span>');

  if (!styles || !body) throw new Error("stitch/index.html must contain <style> and <body>");

  return <>
    <style dangerouslySetInnerHTML={{ __html: styles }} />
    <style>{`.language-switcher{display:flex;gap:2px;padding:3px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(255,255,255,.06)}.language-switcher button{border:0;border-radius:999px;padding:6px 8px;color:#cbd7e8;background:transparent;cursor:pointer;font:800 10px/1 system-ui}.language-switcher button[aria-pressed=true]{color:#07182f;background:#fff}.language-switcher button:focus-visible{outline:2px solid #7bdcff;outline-offset:2px}`}</style>
    <HomeMotion body={body} isAuthenticated={isAuthenticated} />
  </>;
}

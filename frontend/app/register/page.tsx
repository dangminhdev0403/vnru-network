import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentSession, SESSION_COOKIE_NAME } from "../../features/auth/server";

export default async function RegisterPage() {
  const session = await getCurrentSession(
    (await cookies()).get(SESSION_COOKIE_NAME)?.value,
  );
  if (session) redirect("/account");

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_75%_25%,rgba(59,130,246,.25),transparent_40%),linear-gradient(180deg,#dbeafe_0%,#eff6ff_55%,#e1effe_100%)] px-4 py-12 text-slate-950">
      <section className="w-full max-w-lg rounded-[32px] border border-blue-200 bg-white/90 p-8 text-center shadow-[0_24px_60px_-18px_rgba(37,99,235,.22)] backdrop-blur-xl sm:p-10">
        <Link href="/" className="mx-auto mb-7 inline-flex items-center gap-3 text-left" aria-label="Mạng lưới Tri thức Khoa học - Công nghệ Nga - Việt">
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-blue-200 bg-white shadow-xs">
            <span className="absolute inset-y-0 left-0 w-[62%] -skew-x-12 bg-blue-600" />
            <span className="absolute inset-y-0 right-0 w-[46%] -skew-x-12 bg-rose-500" />
          </span>
          <span>
            <strong className="block text-lg font-black tracking-tight">Mạng lưới Tri thức KH&amp;CN</strong>
            <small className="block text-sm font-extrabold uppercase tracking-wider text-slate-600">Nga – Việt</small>
          </span>
        </Link>

        <p className="text-sm font-black uppercase tracking-[0.12em] text-blue-700">Gia nhập mạng lưới song phương</p>
        <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight sm:text-4xl">Tạo tài khoản Nga – Việt</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          Đăng ký an toàn qua Keycloak để xây dựng hồ sơ chuyên môn, khám phá tri thức và kết nối cơ hội hợp tác.
        </p>

        <Link href="/api/auth/login?action=REGISTER&returnTo=/account" className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 text-base font-bold text-white shadow-[0_14px_32px_-14px_rgba(37,99,235,.9)] transition hover:bg-blue-700">
          Tiếp tục đăng ký →
        </Link>
        <p className="mt-5 text-base text-slate-600">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-bold text-blue-700 hover:underline">Đăng nhập</Link>
        </p>
      </section>
    </main>
  );
}
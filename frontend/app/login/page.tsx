import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentSession, sanitizeReturnTo, SESSION_COOKIE_NAME } from "../../features/auth/server";
import { BrandMark } from "@/components/shared/BrandMark";

export default async function LoginPage({ searchParams }: Readonly<{
  searchParams: Promise<{ returnTo?: string; error?: string }>;
}>) {
  const { returnTo, error } = await searchParams;
  const destination = sanitizeReturnTo(returnTo);
  const session = await getCurrentSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);
  if (session) redirect(destination);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_75%_25%,rgba(59,130,246,.25),transparent_40%),linear-gradient(180deg,#dbeafe_0%,#eff6ff_55%,#e1effe_100%)] px-4 py-12 text-slate-950">
      <section className="w-full max-w-md rounded-[32px] border border-blue-200 bg-white/90 p-8 shadow-[0_24px_60px_-18px_rgba(37,99,235,.22)] backdrop-blur-xl sm:p-10">
        <Link href="/" className="mb-8 inline-flex items-center gap-3" aria-label="Mạng lưới Tri thức Khoa học và Công nghệ Nga - Việt">
          <BrandMark className="size-12 border border-blue-200 shadow-xs" />
          <span><strong className="block text-lg font-black tracking-tight">Mạng lưới Tri thức KH&amp;CN</strong><small className="block text-sm font-extrabold uppercase tracking-wider text-slate-600">Nga – Việt</small></span>
        </Link>
        <p className="text-sm font-black uppercase tracking-[0.12em] text-blue-700">Cổng thành viên</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Đăng nhập</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Sử dụng tài khoản nội bộ đã được cấp quyền cho môi trường này.</p>
        {error && <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">Tài khoản hoặc mật khẩu không đúng.</p>}
        <form action="/api/auth/login" method="post" className="mt-6 space-y-5">
          <input type="hidden" name="returnTo" value={destination} />
          <label className="block text-sm font-bold text-slate-800">Tài khoản
            <input name="account" type="text" autoComplete="username" required autoFocus className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
          </label>
          <label className="block text-sm font-bold text-slate-800">Mật khẩu
            <input name="password" type="password" autoComplete="current-password" required className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
          </label>
          <button type="submit" className="min-h-12 w-full rounded-xl bg-blue-700 px-5 text-base font-bold text-white shadow-[0_14px_32px_-14px_rgba(37,99,235,.9)] transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">Đăng nhập</button>
        </form>
        <Link href="/" className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-5 text-sm font-bold text-blue-700 transition hover:bg-blue-100">Trở về Trang chủ</Link>
      </section>
    </main>
  );
}

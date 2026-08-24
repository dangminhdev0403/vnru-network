import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getCurrentSession,
  sanitizeReturnTo,
  SESSION_COOKIE_NAME,
} from "../../features/auth/server";

export default async function LoginPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ returnTo?: string; error?: string }>;
}>) {
  const { returnTo, error: errorParam } = await searchParams;
  const destination = sanitizeReturnTo(
    typeof returnTo === "string" ? returnTo : undefined,
  );
  const cookieStore = await cookies();
  const session = await getCurrentSession(
    cookieStore.get(SESSION_COOKIE_NAME)?.value,
  );

  if (session) {
    redirect(destination);
  }

  if (!errorParam)
    redirect(`/api/auth/login?returnTo=${encodeURIComponent(destination)}`);

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
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-black leading-tight tracking-tight">Dịch vụ xác thực tạm thời chưa khả dụng</h1>
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
          Hệ thống xác thực đang tạm thời ngoại tuyến hoặc đang được khởi động. Vui lòng thử lại sau.
        </p>
        <div className="mt-8 flex flex-col gap-3">
          <a href={`/api/auth/login?returnTo=${encodeURIComponent(destination)}`} className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-blue-600 px-5 text-base font-bold text-white transition hover:bg-blue-700">
            Thử kết nối lại
          </a>
          <Link href="/" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-blue-200 bg-blue-50 px-5 text-base font-bold text-blue-700 transition hover:bg-blue-100">
            Trở về Trang chủ
          </Link>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  authServiceUrl,
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
  const destination = sanitizeReturnTo(typeof returnTo === "string" ? returnTo : undefined);
  const session = await getCurrentSession((await cookies()).get(SESSION_COOKIE_NAME)?.value);

  if (session) {
    redirect(destination);
  }

  let error = errorParam;
  let targetLocation: string | null = null;
  if (!error) {
    try {
      const backend = await fetch(authServiceUrl("api/v1/auth/login"), {
        cache: "no-store",
        redirect: "manual",
      });
      const location = backend.headers.get("location");
      if (backend.status < 300 || backend.status >= 400 || !location) {
        error = "configuration-unavailable";
      } else {
        targetLocation = location;
      }
    } catch {
      error = "configuration-unavailable";
    }
  }

  if (targetLocation) {
    redirect(targetLocation);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#070e1b] px-4 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1829]/80 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">Dịch vụ xác thực tạm thời chưa khả dụng</h1>
        <p className="mt-3 text-sm text-slate-400">
          Hệ thống xác thực tập trung (Keycloak / Auth-Service) đang ngoại tuyến hoặc đang được khởi động. Vui lòng thử lại sau.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <a
            href={`/api/auth/login?returnTo=${encodeURIComponent(destination)}`}
            className="inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Thử kết nối lại
          </a>
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10"
          >
            Trở về Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}



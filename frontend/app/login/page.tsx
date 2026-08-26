import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentSession, sanitizeReturnTo, SESSION_COOKIE_NAME } from "../../features/auth/server";
import { LOCALE_COOKIE_NAME, sanitizeLocale } from "../../features/auth/server";
import { BrandMark } from "@/components/shared/BrandMark";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";

const copy = {
  vi: {
    brand: "Mạng lưới tri thức Nga - Việt",
    brandLabel: "Mạng lưới tri thức Nga - Việt",
    storyTitle: "Kết nối tri thức",
    storyAccent: "Kiến tạo tương lai",
    storyBody: "Cầu nối hợp tác khoa học và công nghệ giữa Nga và Việt Nam, chia sẻ tri thức – thúc đẩy đổi mới – phát triển bền vững.",
    eyebrow: "Cổng thành viên",
    title: "Đăng nhập",
    description: "Sử dụng tài khoản nội bộ đã được cấp quyền để truy cập hệ thống.",
    error: "Tài khoản hoặc mật khẩu không đúng.",
    account: "Tài khoản",
    accountPlaceholder: "Nhập tài khoản của bạn",
    password: "Mật khẩu",
    passwordPlaceholder: "Nhập mật khẩu",
    submit: "Đăng nhập",
    divider: "hoặc",
    home: "Trở về Trang chủ",
    accountNote: "Chưa có tài khoản?",
    register: "Đăng ký thành viên",
  },
  ru: {
    brand: "Mạng lưới tri thức Nga - Việt",
    brandLabel: "Mạng lưới tri thức Nga - Việt",
    storyTitle: "Объединяем знания",
    storyAccent: "Создаём будущее",
    storyBody: "Пространство научно-технологического сотрудничества России и Вьетнама для обмена знаниями, инноваций и устойчивого развития.",
    eyebrow: "Портал участника",
    title: "Вход",
    description: "Используйте выданную вам внутреннюю учётную запись для доступа к системе.",
    error: "Неверная учётная запись или пароль.",
    account: "Учётная запись",
    accountPlaceholder: "Введите учётную запись",
    password: "Пароль",
    passwordPlaceholder: "Введите пароль",
    submit: "Войти",
    divider: "или",
    home: "Вернуться на главную",
    accountNote: "Нет учётной записи?",
    register: "Подать заявку",
  },
  en: {
    brand: "Mạng lưới tri thức Nga - Việt",
    brandLabel: "Mạng lưới tri thức Nga - Việt",
    storyTitle: "Connecting knowledge",
    storyAccent: "Creating the future",
    storyBody: "A space for science and technology cooperation between Russia and Vietnam, advancing knowledge exchange, innovation, and sustainable development.",
    eyebrow: "Member portal",
    title: "Sign in",
    description: "Use your authorized internal account to access the system.",
    error: "The account or password is incorrect.",
    account: "Account",
    accountPlaceholder: "Enter your account",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    submit: "Sign in",
    divider: "or",
    home: "Return to Home",
    accountNote: "No account yet?",
    register: "Request membership",
  },
} as const;

export default async function LoginPage({ searchParams }: Readonly<{
  searchParams: Promise<{ returnTo?: string; error?: string }>;
}>) {
  const { returnTo, error } = await searchParams;
  const destination = sanitizeReturnTo(returnTo);
  const cookieStore = await cookies();
  const session = await getCurrentSession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (session) redirect(destination);
  const locale = sanitizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
  const t = copy[locale];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#edf5ff] text-slate-950">
      <Image
        src="/images/login-vnru-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover object-center"
      />

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1600px] items-center gap-10 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(460px,580px)] lg:px-12 xl:gap-16 xl:px-20">
        <section className="hidden max-w-2xl lg:block lg:-translate-y-[9.75rem]" aria-labelledby="login-story-title">
          <h2 id="login-story-title" className="text-4xl font-black leading-[1.12] tracking-tight text-slate-950 xl:text-5xl">
            {t.storyTitle}
            <span className="mt-2 block text-blue-700">{t.storyAccent}</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
            {t.storyBody}
          </p>
        </section>

        <section className="w-full rounded-[28px] border border-white/90 bg-white/92 p-6 shadow-[0_30px_80px_-35px_rgba(30,64,175,.35)] backdrop-blur-xl sm:p-9 lg:p-11">
          <div className="mb-8 flex items-start justify-between gap-4">
            <Link href="/" className="inline-flex min-w-0 items-center gap-3" aria-label={t.brandLabel}>
              <BrandMark className="size-12 shrink-0 border border-blue-200 shadow-xs" />
              <strong className="min-w-0 text-lg font-black leading-tight tracking-tight sm:text-xl">{t.brand}</strong>
            </Link>
            <LanguageSwitcher variant="light" compact refreshOnChange />
          </div>

          <p className="text-sm font-black uppercase tracking-[0.14em] text-blue-700">{t.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">{t.title}</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">{t.description}</p>

          {error && <p role="alert" className="mt-5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-base font-semibold text-rose-800">{t.error}</p>}

          <form action="/api/auth/login" method="post" className="mt-7 space-y-5">
            <input type="hidden" name="returnTo" value={destination} />
            <label className="block text-base font-bold text-slate-800">{t.account}
              <span className="relative mt-2 block">
                <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></svg>
                <input name="account" type="text" autoComplete="username" required autoFocus placeholder={t.accountPlaceholder} className="min-h-13 w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-12 text-base outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
              </span>
            </label>
            <label className="block text-base font-bold text-slate-800">{t.password}
              <span className="relative mt-2 block">
                <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
                <input name="password" type="password" autoComplete="current-password" required placeholder={t.passwordPlaceholder} className="min-h-13 w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-12 text-base outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
              </span>
            </label>
            <button type="submit" className="min-h-13 w-full rounded-xl bg-blue-700 px-5 text-base font-bold text-white shadow-[0_16px_34px_-16px_rgba(37,99,235,.9)] transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">{t.submit} <span aria-hidden="true">→</span></button>
          </form>

          <div className="my-6 flex items-center gap-4 text-sm text-slate-500" aria-hidden="true"><span className="h-px flex-1 bg-slate-200" /><span>{t.divider}</span><span className="h-px flex-1 bg-slate-200" /></div>
          <Link href="/" className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-blue-300 bg-white px-5 text-base font-bold text-blue-700 transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">⌂&nbsp;&nbsp; {t.home}</Link>
          <p className="mt-6 text-center text-sm leading-6 text-slate-500">
            {t.accountNote}{" "}
            <Link href="/register" className="font-bold text-blue-700 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">{t.register}</Link>
          </p>
        </section>
      </div>
    </main>
  );
}

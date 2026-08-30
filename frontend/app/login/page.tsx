import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getCurrentSession,
  sanitizeReturnTo,
  SESSION_COOKIE_NAME,
} from "../../features/auth/server";
import { LOCALE_COOKIE_NAME, sanitizeLocale } from "../../features/auth/server";
import { BrandMark } from "@/components/shared/BrandMark";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { LoginForm } from "./LoginForm";

const copy = {
  vi: {
    brand: "Mạng lưới tri thức Nga - Việt",
    brandLabel: "Mạng lưới tri thức Nga - Việt",
    storyTitle: "Kết nối tri thức",
    storyAccent: "Kiến tạo tương lai",
    storyBody:
      "Cầu nối hợp tác khoa học và công nghệ giữa Nga và Việt Nam, chia sẻ tri thức – thúc đẩy đổi mới – phát triển bền vững.",
    eyebrow: "Cổng thành viên",
    title: "Đăng nhập",
    description:
      "Sử dụng tài khoản nội bộ đã được cấp quyền để truy cập hệ thống.",
    error: "Thông tin đăng nhập không chính xác.",
    account: "Tài khoản",
    accountPlaceholder: "Nhập tài khoản của bạn",
    password: "Mật khẩu",
    passwordPlaceholder: "Nhập mật khẩu",
    showPassword: "Hiện mật khẩu",
    hidePassword: "Ẩn mật khẩu",
    submit: "Đăng nhập",
    submitting: "Đang đăng nhập, xin chờ...",
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
    storyBody:
      "Пространство научно-технологического сотрудничества России и Вьетнама для обмена знаниями, инноваций và устойчивого развития.",
    eyebrow: "Портал участника",
    title: "Вход",
    description:
      "Используйте выданную вам внутреннюю учётную запись для доступа к системе.",
    error: "Неверные данные для входа.",
    account: "Учётная запись",
    accountPlaceholder: "Введите учётную запись",
    password: "Пароль",
    passwordPlaceholder: "Введите пароль",
    showPassword: "Показать пароль",
    hidePassword: "Скрыть пароль",
    submit: "Войти",
    submitting: "Вход в систему, пожалуйста, подождите...",
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
    storyBody:
      "A space for science and technology cooperation between Russia and Vietnam, advancing knowledge exchange, innovation, and sustainable development.",
    eyebrow: "Member portal",
    title: "Sign in",
    description: "Use your authorized internal account to access the system.",
    error: "Incorrect login credentials.",
    account: "Account",
    accountPlaceholder: "Enter your account",
    password: "Password",
    passwordPlaceholder: "Enter your password",
    showPassword: "Show password",
    hidePassword: "Hide password",
    submit: "Sign in",
    submitting: "Signing in, please wait...",
    divider: "or",
    home: "Return to Home",
    accountNote: "No account yet?",
    register: "Request membership",
  },
} as const;

export default async function LoginPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{
    returnTo?: string;
    error?: string;
    account?: string;
  }>;
}>) {
  const { returnTo, error, account } = await searchParams;
  const destination = sanitizeReturnTo(returnTo);
  const cookieStore = await cookies();
  const session = await getCurrentSession(
    cookieStore.get(SESSION_COOKIE_NAME)?.value,
  );
  if (session) redirect(destination);
  const locale = sanitizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);
  const t = copy[locale];

  return (
    <main className="auth-surface relative min-h-screen overflow-hidden bg-[#edf5ff] text-slate-950">
      <Image
        src="/images/login-vnru-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover object-center"
      />

      <div className="relative mx-auto grid min-h-screen w-full max-w-[1600px] items-center gap-10 px-4 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(460px,580px)] lg:px-12 xl:gap-16 xl:px-20">
        <section
          className="hidden max-w-2xl lg:block lg:-translate-y-[9.75rem]"
          aria-labelledby="login-story-title"
        >
          <Link
            href="/"
            className="mb-5 inline-flex min-h-11 items-center text-base font-bold text-blue-700 underline decoration-2 underline-offset-4 transition-colors hover:text-blue-900 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            {t.home}
          </Link>
          <h2
            id="login-story-title"
            className="text-4xl font-black leading-[1.12] tracking-tight text-slate-950 xl:text-5xl"
          >
            {t.storyTitle}
            <span className="mt-2 block text-blue-700">{t.storyAccent}</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-700">
            {t.storyBody}
          </p>
        </section>

        <section className="w-full rounded-[28px] border border-white/90 bg-white/92 p-6 shadow-[0_30px_80px_-35px_rgba(30,64,175,.35)] backdrop-blur-xl sm:p-9 lg:p-11">
          <div className="mb-8 flex items-start justify-between gap-4">
            <Link
              href="/"
              className="inline-flex min-w-0 items-center gap-3.5"
              aria-label={t.brandLabel}
            >
              <BrandMark className="size-14 shrink-0 border border-blue-200 shadow-xs" />
              <strong className="hidden min-w-0 text-lg font-black leading-tight tracking-tight min-[400px]:block sm:text-xl">
                {t.brand}
              </strong>
            </Link>
            <LanguageSwitcher variant="light" compact refreshOnChange />
          </div>

          <p className="text-sm font-black uppercase tracking-[0.14em] text-blue-700">
            {t.eyebrow}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            {t.description}
          </p>

          <LoginForm
            destination={destination}
            error={error}
            initialAccount={account}
            t={t}
          />

          <div
            className="my-6 flex items-center gap-4 text-sm text-slate-500"
            aria-hidden="true"
          >
            <span className="h-px flex-1 bg-slate-200" />
            <span>{t.divider}</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <Link
            href="/"
            className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-blue-300 bg-white px-5 text-base font-bold text-blue-700 transition hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
          >
            ⌂&nbsp;&nbsp; {t.home}
          </Link>
          <p className="mt-6 text-center text-sm leading-6 text-slate-500">
            {t.accountNote}{" "}
            <Link
              href="/register"
              className="font-bold text-blue-700 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              {t.register}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

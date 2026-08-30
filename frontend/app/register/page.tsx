"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  createRegistrationSchema,
  isRegistrationField,
  type RegistrationField,
} from "./validation";
import { BrandMark } from "@/components/shared/BrandMark";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLocale, type Locale } from "@/core/i18n/locale";

const copy: Record<
  Locale,
  {
    brand: string;
    home: string;
    storyTitle: string;
    storyAccent: string;
    storyFuture: string;
    eyebrow: string;
    title: string;
    description: string;
    fullName: string;
    fullNamePlaceholder: string;
    email: string;
    password: string;
    confirmPassword: string;
    organization: string;
    organizationPlaceholder: string;
    role: string;
    rolePlaceholder: string;
    note: string;
    notePlaceholder: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    privacy: string;
    hasAccount: string;
    login: string;
    validation: {
      required: string;
      invalidEmail: string;
      minPassword: string;
      mismatch: string;
    };
  }
> = {
  vi: {
    brand: "Mạng lưới tri thức Nga - Việt",
    home: "Trở về Trang chủ",
    storyTitle: "Một mạng lưới tri thức",
    storyAccent: "Nhiều cơ hội",
    storyFuture: "hợp tác",
    eyebrow: "Cổng thành viên",
    title: "Đăng ký thành viên",
    description: "Tạo tài khoản bạn đọc để theo dõi nội dung của mạng lưới.",
    fullName: "Họ và tên",
    fullNamePlaceholder: "Nguyễn Văn An",
    email: "Email công việc",
    password: "Mật khẩu",
    confirmPassword: "Xác nhận mật khẩu",
    organization: "Cơ quan / tổ chức",
    organizationPlaceholder: "Tên viện, trường hoặc doanh nghiệp",
    role: "Vai trò chuyên môn",
    rolePlaceholder: "Nhà nghiên cứu, chuyên gia, quản lý...",
    note: "Lĩnh vực quan tâm",
    notePlaceholder: "Mô tả ngắn lĩnh vực hợp tác bạn quan tâm",
    submit: "Tạo tài khoản",
    submitting: "Đang tạo tài khoản, xin chờ...",
    success: "Tài khoản bạn đọc đã được tạo. Bạn có thể đăng nhập ngay.",
    error:
      "Không thể gửi yêu cầu. Vui lòng kiểm tra thông tin hoặc thử lại sau.",
    privacy:
      "Thông tin của bạn chỉ được dùng để xác minh tư cách thành viên, hỗ trợ kết nối và hợp tác trong mạng lưới.",
    hasAccount: "Đã có tài khoản?",
    login: "Trở về đăng nhập",
    validation: {
      required: "Vui lòng nhập thông tin này.",
      invalidEmail: "Vui lòng nhập địa chỉ email hợp lệ.",
      minPassword: "Mật khẩu phải có ít nhất 8 ký tự.",
      mismatch: "Mật khẩu xác nhận không khớp.",
    },
  },
  ru: {
    brand: "РОССИЙСКО-ВЬЕТНАМСКАЯ ИНТЕЛЛЕКТУАЛЬНАЯ СЕТЬ",
    home: "Вернуться на главную",
    storyTitle: "Единая сеть знаний",
    storyAccent: "Больше",
    storyFuture: "сотрудничества",
    eyebrow: "Портал участника",
    title: "Заявка на участие",
    description:
      "Создайте учётную запись читателя для просмотра материалов сети.",
    fullName: "Имя и фамилия",
    fullNamePlaceholder: "Иван Иванов",
    email: "Рабочая почта",
    password: "Пароль",
    confirmPassword: "Подтвердите пароль",
    organization: "Организация",
    organizationPlaceholder: "Институт, университет или компания",
    role: "Профессиональная роль",
    rolePlaceholder: "Исследователь, эксперт, руководитель...",
    note: "Область интересов",
    notePlaceholder: "Кратко опишите интересующее направление сотрудничества",
    submit: "Создать аккаунт",
    submitting: "Создание аккаунта, пожалуйста, подождите...",
    success: "Учётная запись читателя создана. Теперь вы можете войти.",
    error:
      "Не удалось отправить заявку. Проверьте данные или повторите попытку позже.",
    privacy:
      "Ваши данные используются только для проверки статуса участника, поддержки связей и сотрудничества внутри сети.",
    hasAccount: "Уже есть учётная запись?",
    login: "Вернуться ко входу",
    validation: {
      required: "Заполните это поле.",
      invalidEmail: "Введите корректный адрес электронной почты.",
      minPassword: "Пароль должен содержать не менее 8 символов.",
      mismatch: "Пароли не совпадают.",
    },
  },
  en: {
    brand: "Russia - Vietnam Knowledge Network",
    home: "Return to Home",
    storyTitle: "One knowledge network",
    storyAccent: "More",
    storyFuture: "collaboration",
    eyebrow: "Member portal",
    title: "Request membership",
    description:
      "Create a reader account to follow the network's published content.",
    fullName: "Full name",
    fullNamePlaceholder: "Alex Nguyen",
    email: "Work email",
    password: "Password",
    confirmPassword: "Confirm password",
    organization: "Organization",
    organizationPlaceholder: "Institute, university, or company",
    role: "Professional role",
    rolePlaceholder: "Researcher, expert, manager...",
    note: "Area of interest",
    notePlaceholder:
      "Briefly describe the collaboration area you are interested in",
    submit: "Create account",
    submitting: "Creating account, please wait...",
    success: "Your reader account was created. You can sign in now.",
    error:
      "Unable to submit the request. Check your details or try again later.",
    privacy:
      "Your information is used only to verify membership eligibility and support connections and collaboration within the network.",
    hasAccount: "Already have an account?",
    login: "Return to sign in",
    validation: {
      required: "Please complete this field.",
      invalidEmail: "Enter a valid email address.",
      minPassword: "Password must contain at least 8 characters.",
      mismatch: "Passwords do not match.",
    },
  },
};

export default function RegisterPage() {
  const { locale } = useLocale();
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<RegistrationField, string>>
  >({});
  const t = copy[locale] ?? copy.vi;

  function handleInput(event: FormEvent<HTMLFormElement>) {
    const field = (event.target as HTMLInputElement | HTMLTextAreaElement).name;
    if (!isRegistrationField(field) || !fieldErrors[field]) return;
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const parsed = createRegistrationSchema(t.validation).safeParse(
      Object.fromEntries(form),
    );
    if (!parsed.success) {
      const errors: Partial<Record<RegistrationField, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (isRegistrationField(field) && !errors[field])
          errors[field] = issue.message;
      }
      setFieldErrors(errors);
      setStatus("idle");
      const firstInvalidField = Object.keys(errors)[0];
      if (firstInvalidField) {
        (
          formElement.elements.namedItem(
            firstInvalidField,
          ) as HTMLElement | null
        )?.focus();
      }
      return;
    }

    setFieldErrors({});
    setStatus("submitting");
    const registration = {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      password: parsed.data.password,
    };
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(registration),
    }).catch(() => null);
    if (response?.ok) {
      setStatus("success");
      formElement.reset();
    } else {
      setStatus("error");
      const passwordInput = formElement.elements.namedItem(
        "password",
      ) as HTMLInputElement | null;
      const confirmPasswordInput = formElement.elements.namedItem(
        "confirmPassword",
      ) as HTMLInputElement | null;
      if (passwordInput) passwordInput.value = "";
      if (confirmPasswordInput) confirmPasswordInput.value = "";
    }
  }

  return (
    <main className="auth-surface relative min-h-[100dvh] overflow-hidden bg-[#eef4ff] text-slate-950">
      <Image
        src="/images/register-vnru-bg.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="pointer-events-none object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(219,234,254,.14),rgba(255,255,255,.08)_48%,rgba(255,255,255,.42)_100%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid min-h-[100dvh] w-full max-w-[1680px] items-center gap-8 px-4 py-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(560px,700px)] lg:px-10 xl:gap-14 xl:px-14">
        <section
          className="hidden min-w-0 self-stretch py-6 lg:flex lg:flex-col"
          aria-labelledby="register-story-title"
        >
          <div className="mt-28 max-w-[620px]">
            <Link
              href="/"
              className="mb-5 inline-flex min-h-11 items-center text-base font-bold text-blue-700 underline decoration-2 underline-offset-4 transition-colors hover:text-blue-900 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              {t.home}
            </Link>
            <h2
              id="register-story-title"
              className="text-[clamp(2rem,3.2vw,3rem)] font-black leading-[1.08] tracking-tight text-slate-950"
            >
              <span className="block">{t.storyTitle}</span>
              <span className="mt-2 block text-blue-700">
                {t.storyAccent} <span>{t.storyFuture}</span>
              </span>
            </h2>
          </div>
        </section>

        <section
          className="w-full rounded-3xl border border-white/90 bg-white/95 p-6 shadow-[0_30px_80px_-35px_rgba(30,64,175,.38)] backdrop-blur-xl sm:p-8 lg:p-9"
          aria-labelledby="register-title"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <Link
              href="/"
              className="inline-flex min-w-0 items-center gap-3.5"
              aria-label={t.brand}
            >
              <BrandMark className="size-14 shrink-0 border border-blue-200 shadow-xs" />
              <strong className="hidden min-w-0 text-base font-black leading-tight tracking-tight min-[400px]:block sm:text-lg lg:text-xl">
                {t.brand}
              </strong>
            </Link>
            <LanguageSwitcher variant="light" compact />
          </div>

          <p className="text-sm font-black uppercase tracking-[0.14em] text-blue-700">
            {t.eyebrow}
          </p>
          <h1
            id="register-title"
            className="mt-2 text-3xl font-black tracking-tight sm:text-4xl"
          >
            {t.title}
          </h1>
          <p className="mt-3 max-w-[58ch] text-base leading-6 text-slate-600">
            {t.description}
          </p>

          {status === "success" || status === "error" ? (
            <p
              role={status === "error" ? "alert" : "status"}
              className={`mt-5 rounded-xl border px-4 py-3 text-base font-semibold leading-6 ${status === "error" ? "border-red-200 bg-red-50 text-red-900" : "border-emerald-200 bg-emerald-50 text-emerald-900"}`}
            >
              {status === "error" ? t.error : t.success}
            </p>
          ) : null}

          <form
            onSubmit={handleSubmit}
            onInput={handleInput}
            noValidate
            className="mt-5 grid gap-4 sm:grid-cols-2"
          >
            <label className="block text-base font-bold text-slate-800">
              {t.fullName}{" "}
              <span className="text-red-600" aria-hidden="true">
                *
              </span>
              <input
                name="fullName"
                type="text"
                autoComplete="name"
                disabled={status === "submitting"}
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.fullName)}
                aria-describedby={
                  fieldErrors.fullName ? "fullName-error" : undefined
                }
                placeholder={t.fullNamePlaceholder}
                className={`mt-2 min-h-12 w-full rounded-xl border bg-white px-4 text-base transition focus-visible:outline-none disabled:bg-slate-50 disabled:text-slate-500 ${fieldErrors.fullName ? "border-red-600 focus:border-red-700" : "border-slate-300 focus:border-blue-700"}`}
              />
              {fieldErrors.fullName ? (
                <span
                  id="fullName-error"
                  className="mt-2 block text-sm font-semibold text-red-700"
                >
                  {fieldErrors.fullName}
                </span>
              ) : null}
            </label>
            <label className="block text-base font-bold text-slate-800">
              {t.email}{" "}
              <span className="text-red-600" aria-hidden="true">
                *
              </span>
              <input
                name="email"
                type="email"
                autoComplete="email"
                disabled={status === "submitting"}
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
                placeholder="name@organization.org"
                className={`mt-2 min-h-12 w-full rounded-xl border bg-white px-4 text-base transition focus-visible:outline-none disabled:bg-slate-50 disabled:text-slate-500 ${fieldErrors.email ? "border-red-600 focus:border-red-700" : "border-slate-300 focus:border-blue-700"}`}
              />
              {fieldErrors.email ? (
                <span
                  id="email-error"
                  className="mt-2 block text-sm font-semibold text-red-700"
                >
                  {fieldErrors.email}
                </span>
              ) : null}
            </label>
            <label className="block text-base font-bold text-slate-800">
              {t.password}{" "}
              <span className="text-red-600" aria-hidden="true">*</span>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                disabled={status === "submitting"}
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? "password-error" : undefined}
                className={`mt-2 min-h-12 w-full rounded-xl border bg-white px-4 text-base transition focus-visible:outline-none disabled:bg-slate-50 disabled:text-slate-500 ${fieldErrors.password ? "border-red-600 focus:border-red-700" : "border-slate-300 focus:border-blue-700"}`}
              />
              {fieldErrors.password ? (
                <span id="password-error" className="mt-2 block text-sm font-semibold text-red-700">
                  {fieldErrors.password}
                </span>
              ) : null}
            </label>
            <label className="block text-base font-bold text-slate-800">
              {t.confirmPassword}{" "}
              <span className="text-red-600" aria-hidden="true">*</span>
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                disabled={status === "submitting"}
                aria-required="true"
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                aria-describedby={fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
                className={`mt-2 min-h-12 w-full rounded-xl border bg-white px-4 text-base transition focus-visible:outline-none disabled:bg-slate-50 disabled:text-slate-500 ${fieldErrors.confirmPassword ? "border-red-600 focus:border-red-700" : "border-slate-300 focus:border-blue-700"}`}
              />
              {fieldErrors.confirmPassword ? (
                <span id="confirmPassword-error" className="mt-2 block text-sm font-semibold text-red-700">
                  {fieldErrors.confirmPassword}
                </span>
              ) : null}
            </label>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-blue-700 px-5 text-base font-bold text-white shadow-[0_16px_34px_-16px_rgba(37,99,235,.9)] transition hover:bg-blue-800 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:opacity-75 sm:col-span-2"
            >
              {status === "submitting" ? (
                <>
                  <svg
                    className="size-5 animate-spin motion-reduce:animate-none text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>{t.submitting}</span>
                </>
              ) : (
                t.submit
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm leading-6 text-slate-600">
            {t.hasAccount}{" "}
            <Link
              href="/login"
              className="font-bold text-blue-700 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              {t.login}
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}

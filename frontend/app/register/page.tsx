"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { BrandMark } from "@/components/shared/BrandMark";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLocale, type Locale } from "@/core/i18n/locale";

const copy: Record<Locale, {
  brand: string;
  storyTitle: string;
  storyAccent: string;
  storyFuture: string;
  eyebrow: string;
  title: string;
  description: string;
  fullName: string;
  fullNamePlaceholder: string;
  email: string;
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
}> = {
  vi: {
    brand: "Mạng lưới tri thức Nga - Việt",
    storyTitle: "Một mạng lưới tri thức",
    storyAccent: "Nhiều cơ hội",
    storyFuture: "hợp tác",
    eyebrow: "Cổng thành viên",
    title: "Đăng ký thành viên",
    description: "Gửi thông tin để quản trị viên xác minh tư cách và cấp tài khoản phù hợp.",
    fullName: "Họ và tên",
    fullNamePlaceholder: "Nguyễn Văn An",
    email: "Email công việc",
    organization: "Cơ quan / tổ chức",
    organizationPlaceholder: "Tên viện, trường hoặc doanh nghiệp",
    role: "Vai trò chuyên môn",
    rolePlaceholder: "Nhà nghiên cứu, chuyên gia, quản lý...",
    note: "Lĩnh vực quan tâm",
    notePlaceholder: "Mô tả ngắn lĩnh vực hợp tác bạn quan tâm",
    submit: "Gửi yêu cầu đăng ký",
    submitting: "Đang gửi…",
    success: "Yêu cầu đã được gửi. Quản trị viên sẽ xác minh trước khi cấp tài khoản.",
    error: "Không thể gửi yêu cầu. Vui lòng kiểm tra thông tin hoặc thử lại sau.",
    privacy: "Thông tin của bạn chỉ được dùng để xác minh tư cách thành viên, hỗ trợ kết nối và hợp tác trong mạng lưới.",
    hasAccount: "Đã có tài khoản?",
    login: "Trở về đăng nhập",
  },
  ru: {
    brand: "Mạng lưới tri thức Nga - Việt",
    storyTitle: "Единая сеть знаний",
    storyAccent: "Больше",
    storyFuture: "сотрудничества",
    eyebrow: "Портал участника",
    title: "Заявка на участие",
    description: "Отправьте сведения для проверки администратором и предоставления подходящей учётной записи.",
    fullName: "Имя и фамилия",
    fullNamePlaceholder: "Иван Иванов",
    email: "Рабочая почта",
    organization: "Организация",
    organizationPlaceholder: "Институт, университет или компания",
    role: "Профессиональная роль",
    rolePlaceholder: "Исследователь, эксперт, руководитель...",
    note: "Область интересов",
    notePlaceholder: "Кратко опишите интересующее направление сотрудничества",
    submit: "Отправить заявку",
    submitting: "Отправка…",
    success: "Заявка отправлена. Администратор проверит её перед созданием учётной записи.",
    error: "Не удалось отправить заявку. Проверьте данные или повторите попытку позже.",
    privacy: "Ваши данные используются только для проверки статуса участника, поддержки связей и сотрудничества внутри сети.",
    hasAccount: "Уже есть учётная запись?",
    login: "Вернуться ко входу",
  },
  en: {
    brand: "Mạng lưới tri thức Nga - Việt",
    storyTitle: "One knowledge network",
    storyAccent: "More",
    storyFuture: "collaboration",
    eyebrow: "Member portal",
    title: "Request membership",
    description: "Share your details so an administrator can verify your affiliation and issue the appropriate account.",
    fullName: "Full name",
    fullNamePlaceholder: "Alex Nguyen",
    email: "Work email",
    organization: "Organization",
    organizationPlaceholder: "Institute, university, or company",
    role: "Professional role",
    rolePlaceholder: "Researcher, expert, manager...",
    note: "Area of interest",
    notePlaceholder: "Briefly describe the collaboration area you are interested in",
    submit: "Submit registration request",
    submitting: "Submitting…",
    success: "Your request was submitted. An administrator will verify it before issuing an account.",
    error: "Unable to submit the request. Check your details or try again later.",
    privacy: "Your information is used only to verify membership eligibility and support connections and collaboration within the network.",
    hasAccount: "Already have an account?",
    login: "Return to sign in",
  },
};

export default function RegisterPage() {
  const { locale } = useLocale();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const t = copy[locale] ?? copy.vi;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const response = await fetch("/api/membership-applications", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(form)),
    }).catch(() => null);
    setStatus(response?.ok ? "success" : "error");
    if (response?.ok) formElement.reset();
  }

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-[#eef4ff] text-slate-950">
      <Image src="/images/register-vnru-bg.png" alt="" fill priority sizes="100vw" className="pointer-events-none object-cover object-center" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(219,234,254,.14),rgba(255,255,255,.08)_48%,rgba(255,255,255,.42)_100%)]" aria-hidden="true" />

      <div className="relative mx-auto grid min-h-[100dvh] w-full max-w-[1680px] items-center gap-8 px-4 py-5 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(560px,700px)] lg:px-10 xl:gap-14 xl:px-14">
        <section className="hidden min-w-0 self-stretch py-6 lg:flex lg:flex-col" aria-labelledby="register-story-title">
          <div className="mt-28 max-w-[620px]">
            <h2 id="register-story-title" className="text-[clamp(2rem,3.2vw,3rem)] font-black leading-[1.08] tracking-tight text-slate-950">
              <span className="block whitespace-nowrap">{t.storyTitle}</span>
              <span className="mt-2 block whitespace-nowrap text-blue-700">{t.storyAccent} <span>{t.storyFuture}</span></span>
            </h2>
          </div>
        </section>

        <section className="w-full rounded-3xl border border-white/90 bg-white/95 p-6 shadow-[0_30px_80px_-35px_rgba(30,64,175,.38)] backdrop-blur-xl sm:p-8 lg:p-9" aria-labelledby="register-title">
          <div className="mb-6 flex items-start justify-between gap-4">
            <Link href="/" className="inline-flex min-w-0 items-center gap-3" aria-label={t.brand}>
              <BrandMark className="size-12 shrink-0 border border-blue-200 shadow-xs" />
              <strong className="min-w-0 text-base font-black leading-tight tracking-tight sm:text-lg lg:text-xl">{t.brand}</strong>
            </Link>
            <LanguageSwitcher variant="light" compact />
          </div>

          <p className="text-sm font-black uppercase tracking-[0.14em] text-blue-700">{t.eyebrow}</p>
          <h1 id="register-title" className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">{t.title}</h1>
          <p className="mt-3 max-w-[58ch] text-base leading-6 text-slate-600">{t.description}</p>

          {status === "success" || status === "error" ? <p role={status === "error" ? "alert" : "status"} className={`mt-5 rounded-xl border px-4 py-3 text-base font-semibold leading-6 ${status === "error" ? "border-red-200 bg-red-50 text-red-900" : "border-emerald-200 bg-emerald-50 text-emerald-900"}`}>{status === "error" ? t.error : t.success}</p> : null}

          <form onSubmit={handleSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block text-base font-bold text-slate-800">{t.fullName} <span className="text-red-600" aria-hidden="true">*</span>
              <input name="fullName" type="text" autoComplete="name" required placeholder={t.fullNamePlaceholder} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="block text-base font-bold text-slate-800">{t.email} <span className="text-red-600" aria-hidden="true">*</span>
              <input name="email" type="email" autoComplete="email" required placeholder="name@organization.org" className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="block text-base font-bold text-slate-800">{t.organization} <span className="text-red-600" aria-hidden="true">*</span>
              <input name="organization" type="text" autoComplete="organization" required placeholder={t.organizationPlaceholder} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="block text-base font-bold text-slate-800">{t.role} <span className="text-red-600" aria-hidden="true">*</span>
              <input name="professionalRole" type="text" required placeholder={t.rolePlaceholder} className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-base outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
            </label>
            <label className="block text-base font-bold text-slate-800 sm:col-span-2">{t.note} <span className="text-red-600" aria-hidden="true">*</span>
              <textarea name="interest" rows={3} required placeholder={t.notePlaceholder} className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-base leading-6 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100" />
            </label>
            <p className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium leading-6 text-blue-950 sm:col-span-2">{t.privacy}</p>
            <button type="submit" disabled={status === "submitting"} className="min-h-12 w-full rounded-xl bg-blue-700 px-5 text-base font-bold text-white shadow-[0_16px_34px_-16px_rgba(37,99,235,.9)] transition hover:bg-blue-800 active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 disabled:cursor-wait disabled:opacity-60 sm:col-span-2">{status === "submitting" ? t.submitting : t.submit}</button>
          </form>

          <p className="mt-5 text-center text-sm leading-6 text-slate-600">{t.hasAccount}{" "}<Link href="/login" className="font-bold text-blue-700 underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">{t.login}</Link></p>
        </section>
      </div>
    </main>
  );
}

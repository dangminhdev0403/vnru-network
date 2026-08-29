"use client";

import { useLocale, type Locale } from "@/core/i18n/locale";
import { GuestPublicFooter } from "./GuestPublicFooter";
import { GuestPublicNav } from "./GuestPublicNav";
import { HOME_COPY } from "./GuestHomeV2";

const EMAIL = "info@rvstin.com";
const COPY: Record<Locale, { title: string; lead: string; email: string; action: string }> = {
  vi: {
    title: "Liên hệ",
    lead: "Kết nối với Mạng lưới RU-VN về hợp tác khoa học, giáo dục và chuyển giao tri thức.",
    email: "Email chính thức",
    action: "Gửi email",
  },
  en: {
    title: "Contact",
    lead: "Connect with the RU-VN Network about science, education and knowledge-transfer cooperation.",
    email: "Official email",
    action: "Send email",
  },
  ru: {
    title: "Контакты",
    lead: "Свяжитесь с сетью RU-VN по вопросам научного, образовательного сотрудничества и трансфера знаний.",
    email: "Официальная почта",
    action: "Написать",
  },
};

export function GuestContactV2() {
  const { locale } = useLocale();
  const t = COPY[locale] ?? COPY.vi;

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-950">
      <GuestPublicNav active="contact" />
      <main className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <section className="mx-auto max-w-4xl rounded-3xl border border-blue-100 bg-white p-8 shadow-sm sm:p-12">
          <p className="text-base font-bold uppercase tracking-[0.16em] text-blue-600">RU-VN</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{t.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{t.lead}</p>
          <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50 p-6">
            <p className="text-base font-bold text-slate-700">{t.email}</p>
            <a href={`mailto:${EMAIL}`} className="mt-2 block break-all text-xl font-black text-blue-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700">{EMAIL}</a>
          </div>
          <a href={`mailto:${EMAIL}`} className="mt-8 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-6 text-base font-bold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">{t.action}</a>
        </section>
      </main>
      <GuestPublicFooter copy={HOME_COPY[locale] ?? HOME_COPY.vi} />
    </div>
  );
}

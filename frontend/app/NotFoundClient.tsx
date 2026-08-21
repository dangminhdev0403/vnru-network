"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Locale = "vi" | "ru" | "en";

interface Translation {
  brandTitle: string;
  brandSubtitle: string;
  badge: string;
  errorCode: string;
  heading: string;
  description: string;
  technicalDetails: {
    statusLabel: string;
    statusValue: string;
    networkLabel: string;
    networkValue: string;
    actionLabel: string;
    actionValue: string;
  };
  goHome: string;
  goBack: string;
  operatorNote: string;
  operatorOrg: string;
}

const translations: Record<Locale, Translation> = {
  vi: {
    brandTitle: "Russia-Vietnam Science-Technology Intelligence Network",
    brandSubtitle: "Cổng thông tin hợp tác song phương",
    badge: "Lỗi điều hướng • HTTP 404",
    errorCode: "404",
    heading: "Không tìm thấy trang yêu cầu",
    description:
      "Đường dẫn bạn yêu cầu không tồn tại, đã bị thay đổi hoặc tạm thời không khả dụng. Vui lòng kiểm tra lại địa chỉ URL hoặc sử dụng các tùy chọn điều hướng bên dưới.",
    technicalDetails: {
      statusLabel: "Mã trạng thái",
      statusValue: "404 Not Found",
      networkLabel: "Hệ thống",
      networkValue: "Russia-Vietnam Science-Technology Intelligence Network",
      actionLabel: "Khuyến nghị",
      actionValue: "Quay lại trang trước hoặc về trang chủ",
    },
    goHome: "Về trang chủ",
    goBack: "Quay lại trang trước",
    operatorNote: "Sáng kiến hợp tác được sáng lập và điều phối bởi",
    operatorOrg: "Quỹ Truyền thống và Hữu nghị",
  },
  ru: {
    brandTitle: "Russia-Vietnam Science-Technology Intelligence Network",
    brandSubtitle: "Портал двустороннего сотрудничества",
    badge: "Ошибка навигации • HTTP 404",
    errorCode: "404",
    heading: "Запрашиваемая страница не найдена",
    description:
      "Запрашиваемый ресурс не существует, был перемещен или временно недоступен. Пожалуйста, проверьте правильность адреса URL или воспользуйтесь кнопками ниже.",
    technicalDetails: {
      statusLabel: "Код ошибки",
      statusValue: "404 Not Found",
      networkLabel: "Система",
      networkValue: "Russia-Vietnam Science-Technology Intelligence Network",
      actionLabel: "Рекомендация",
      actionValue: "Вернуться назад или перейти на главную",
    },
    goHome: "На главную",
    goBack: "Вернуться назад",
    operatorNote: "Инициатива сотрудничества учреждена и координируется",
    operatorOrg: "Фондом «Традиции и дружба»",
  },
  en: {
    brandTitle: "Russia-Vietnam Science-Technology Intelligence Network",
    brandSubtitle: "Bilateral Cooperation Portal",
    badge: "Navigation Error • HTTP 404",
    errorCode: "404",
    heading: "Requested Page Not Found",
    description:
      "The page you requested does not exist, has been relocated, or is temporarily unavailable. Please verify the URL or use the navigation options below.",
    technicalDetails: {
      statusLabel: "Status Code",
      statusValue: "404 Not Found",
      networkLabel: "System",
      networkValue: "Russia-Vietnam Science-Technology Intelligence Network",
      actionLabel: "Recommended Action",
      actionValue: "Go back to previous page or return to homepage",
    },
    goHome: "Return to Homepage",
    goBack: "Go to Previous Page",
    operatorNote: "Cooperation initiative founded and coordinated by the",
    operatorOrg: "Traditions and Friendship Foundation",
  },
};

export function NotFoundClient() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("vi");

  const t = translations[locale];

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="bg-[#f8fafc] text-[#0f172a] min-h-screen flex flex-col font-sans antialiased selection:bg-[#0284c7]/20 selection:text-[#071426]">
      {/* Background Subtle Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#0284c7]/12 via-[#1e3a8a]/6 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#0284c7]/6 rounded-full blur-3xl"></div>
      </div>

      {/* Top Header with Brand & Language Switcher */}
      <header className="relative z-20 bg-white/90 backdrop-blur-md border-b border-[#e2e8f0] w-full sticky top-0 shadow-2xs">
        <div className="flex justify-between items-center px-6 lg:px-12 h-16 max-w-7xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#071426] via-[#0f233d] to-[#0284c7] flex items-center justify-center text-white font-serif font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
              VR
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-[#071426] tracking-tight block">
                  {t.brandTitle}
                </span>
              </div>
              <p className="text-xs text-[#475569] hidden sm:block">
                {t.brandSubtitle}
              </p>
            </div>
          </Link>

          {/* Right: Language Switcher */}
          <div
            className="flex items-center p-1 rounded-xl bg-[#f1f5f9] border border-[#e2e8f0] text-xs font-semibold"
            role="group"
            aria-label="Language selector"
          >
            {(["vi", "ru", "en"] as const).map((code) => {
              const isActive = locale === code;
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocale(code)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-white text-[#071426] shadow-xs"
                      : "text-[#64748b] hover:text-[#071426]"
                  }`}
                  aria-pressed={isActive}
                >
                  {code.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Dedicated 404 Centerpiece */}
      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-6 py-16 sm:py-24 flex flex-col items-center justify-center text-center">
        {/* Error Status Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-semibold shadow-2xs mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          <span className="tracking-wide uppercase text-xs font-bold">{t.badge}</span>
        </div>

        {/* Sculptural 404 Artwork */}
        <div className="relative my-2 select-none flex items-center justify-center">
          {/* Ambient Glow */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-[#0284c7]/15 via-[#1e3a8a]/10 to-[#059669]/10 blur-3xl pointer-events-none"></div>

          {/* Large Typographic 404 */}
          <div className="relative font-serif text-8xl sm:text-9xl md:text-9xl font-extrabold tracking-tighter leading-none text-[#071426]">
            404
          </div>

          {/* Compass / Navigation Radar Vector Motif */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-15">
            <svg className="w-52 h-52 sm:w-72 sm:h-72 text-[#0284c7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="12" cy="12" r="10" strokeDasharray="3 3"></circle>
              <circle cx="12" cy="12" r="4"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="12" y1="2" x2="12" y2="22"></line>
            </svg>
          </div>
        </div>

        {/* Headline & Description */}
        <div className="space-y-3 max-w-xl mx-auto mt-4">
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#071426] tracking-tight leading-snug">
            {t.heading}
          </h1>
          <p className="text-sm sm:text-base text-[#475569] leading-relaxed">
            {t.description}
          </p>
        </div>

        {/* Diagnostic Metadata Panel */}
        <div className="my-8 w-full max-w-lg bg-white rounded-2xl border border-[#e2e8f0] p-4 sm:p-5 shadow-2xs text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[#64748b] block text-xs font-medium uppercase tracking-wider">
                {t.technicalDetails.statusLabel}
              </span>
              <span className="font-semibold text-red-600">
                {t.technicalDetails.statusValue}
              </span>
            </div>
            <div>
              <span className="text-[#64748b] block text-xs font-medium uppercase tracking-wider">
                {t.technicalDetails.networkLabel}
              </span>
              <span className="font-semibold text-[#071426]">
                {t.technicalDetails.networkValue}
              </span>
            </div>
          </div>
        </div>

        {/* The Two Dedicated Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {/* 1. Return to Home */}
          <Link
            href="/"
            className="px-7 py-3.5 rounded-xl bg-[#071426] hover:bg-[#0f233d] text-white text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>{t.goHome}</span>
          </Link>

          {/* 2. Go to Previous Page */}
          <button
            type="button"
            onClick={handleGoBack}
            className="px-7 py-3.5 rounded-xl bg-white hover:bg-[#f1f5f9] border border-[#cbd5e1] text-sm font-semibold text-[#071426] transition-all shadow-2xs hover:shadow-xs flex items-center gap-2.5 cursor-pointer"
          >
            <svg className="w-4 h-4 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{t.goBack}</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-[#e2e8f0] py-6 bg-white/80 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-[#64748b]">
          <p>
            {t.operatorNote} <span className="font-semibold text-[#071426]">{t.operatorOrg}</span>
          </p>
          <div className="flex items-center gap-3">
            <Link href="/" className="hover:text-[#0284c7] transition-colors font-medium">
              {t.goHome}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, type Locale } from "@/core/i18n/locale";

const MEDIA_COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    exploreCTA: string;
    moments: {
      title: string;
      meta: string;
      tag: string;
      badgeColor: string;
      image: string;
    }[];
    bannerTag: string;
    bannerTitle: string;
    bannerCTA: string;
    bannerItems: string[];
  }
> = {
  vi: {
    eyebrow: "Hình ảnh mạng lưới",
    title: "Khoảnh khắc kết nối Nga – Việt",
    subtitle:
      "Không gian hình ảnh dành cho hoạt động nghiên cứu, hội thảo, trao đổi chuyên gia và những điểm chạm nổi bật của mạng lưới.",
    exploreCTA: "Khám phá mạng lưới →",
    moments: [
      {
        title: "Kết nối nhóm nghiên cứu",
        meta: "Hà Nội · Việt Nam",
        tag: "Hợp tác",
        badgeColor: "bg-blue-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=82",
      },
      {
        title: "Đối thoại khoa học song phương",
        meta: "Moskva · Liên bang Nga",
        tag: "Diễn đàn",
        badgeColor: "bg-indigo-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=82",
      },
      {
        title: "AI & dữ liệu khoa học",
        meta: "Phòng nghiên cứu liên kết",
        tag: "Công nghệ",
        badgeColor: "bg-purple-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=82",
      },
      {
        title: "Đào tạo & trao đổi chuyên gia",
        meta: "Việt Nam ↔ Liên bang Nga",
        tag: "Học thuật",
        badgeColor: "bg-emerald-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=82",
      },
      {
        title: "Không gian đổi mới sáng tạo",
        meta: "Hệ sinh thái KH&CN",
        tag: "Đổi mới",
        badgeColor: "bg-amber-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=82",
      },
      {
        title: "Mạng lưới chuyên gia đa lĩnh vực",
        meta: "20+ lĩnh vực nghiên cứu",
        tag: "Chuyên gia",
        badgeColor: "bg-rose-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=82",
      },
    ],
    bannerTag: "Mạng lưới đang chuyển động",
    bannerTitle:
      "Theo dõi những kết nối mới, hoạt động mới và cơ hội hợp tác đang hình thành mỗi ngày.",
    bannerCTA: "Xem cơ hội đang mở →",
    bannerItems: [
      "Khoa học biển",
      "AI & dữ liệu",
      "Vật liệu mới",
      "Năng lượng",
      "Công nghệ sinh học",
      "Robot & tự động hoá",
      "Chuyển giao tri thức",
      "Hợp tác Nga – Việt",
    ],
  },
  ru: {
    eyebrow: "Галерея сети",
    title: "Моменты сотрудничества Россия – Вьетнам",
    subtitle:
      "Фотогалерея совместных исследований, конференций, академических стажировок и ключевых событий сети.",
    exploreCTA: "Исследовать сеть →",
    moments: [
      {
        title: "Совместные научные группы",
        meta: "Ханой · Вьетнам",
        tag: "Партнерство",
        badgeColor: "bg-blue-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=82",
      },
      {
        title: "Двусторонний научный диалог",
        meta: "Москва · Российская Федерация",
        tag: "Форум",
        badgeColor: "bg-indigo-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=82",
      },
      {
        title: "ИИ и научные данные",
        meta: "Объединенные лаборатории",
        tag: "Технологии",
        badgeColor: "bg-purple-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=82",
      },
      {
        title: "Подготовка и обмен кадрами",
        meta: "Вьетнам ↔ Российская Федерация",
        tag: "Академия",
        badgeColor: "bg-emerald-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=82",
      },
      {
        title: "Пространство инноваций",
        meta: "Инновационная экосистема",
        tag: "Инновации",
        badgeColor: "bg-amber-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=82",
      },
      {
        title: "Междисциплинарная сеть экспертов",
        meta: "20+ приоритетных областей",
        tag: "Эксперты",
        badgeColor: "bg-rose-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=82",
      },
    ],
    bannerTag: "Сеть в движении",
    bannerTitle:
      "Следите за новыми контактами, инициативами и возможностями сотрудничества каждый день.",
    bannerCTA: "Смотреть открытые конкурсы →",
    bannerItems: [
      "Морские науки",
      "ИИ и данные",
      "Наноматериалы",
      "Чистая энергетика",
      "Биотехнологии",
      "Робототехника",
      "Трансфер знаний",
      "Россия – Вьетнам",
    ],
  },
  en: {
    eyebrow: "Network Gallery",
    title: "Moments of Russia – Vietnam Partnership",
    subtitle:
      "Visual highlights of joint research missions, academic conferences, expert exchanges, and collaborative achievements.",
    exploreCTA: "Explore Network →",
    moments: [
      {
        title: "Joint Research Teams",
        meta: "Hanoi · Vietnam",
        tag: "Collaboration",
        badgeColor: "bg-blue-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=82",
      },
      {
        title: "Bilateral Science Dialogue",
        meta: "Moscow · Russian Federation",
        tag: "Forum",
        badgeColor: "bg-indigo-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=82",
      },
      {
        title: "AI & Scientific Data",
        meta: "Affiliated Research Labs",
        tag: "Technology",
        badgeColor: "bg-purple-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=82",
      },
      {
        title: "Training & Expert Exchange",
        meta: "Vietnam ↔ Russian Federation",
        tag: "Academic",
        badgeColor: "bg-emerald-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=82",
      },
      {
        title: "Innovation Hub",
        meta: "S&T Ecosystem",
        tag: "Innovation",
        badgeColor: "bg-amber-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=82",
      },
      {
        title: "Multidisciplinary Expert Network",
        meta: "20+ research domains",
        tag: "Experts",
        badgeColor: "bg-rose-600/90 text-white",
        image:
          "https://images.unsplash.com/photo-1484417894907-623942c8ee29?auto=format&fit=crop&w=1200&q=82",
      },
    ],
    bannerTag: "Network in Motion",
    bannerTitle:
      "Follow new connections, emerging activities, and bilateral opportunities forming daily.",
    bannerCTA: "View Open Calls →",
    bannerItems: [
      "Marine Science",
      "AI & Big Data",
      "New Materials",
      "Clean Energy",
      "Biotechnology",
      "Robotics",
      "Knowledge Transfer",
      "Russia – Vietnam",
    ],
  },
};

function RevealItem({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" },
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  return (
    <div
      ref={setRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-6 scale-[0.98]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function GuestExploreMedia() {
  const { locale } = useLocale();
  const t = MEDIA_COPY[locale] ?? MEDIA_COPY.vi;

  return (
    <>
      <section
        id="visual-stories"
        className="border-b border-blue-200/80 bg-[#e7f2fe] px-4 py-14 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-[1460px]">
          <RevealItem delay={50}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs sm:text-[13px] font-black uppercase tracking-[0.14em] text-blue-700">
                  {t.eyebrow}
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-950">
                  {t.title}
                </h2>
                <p className="mt-3 text-lg sm:text-xl md:text-[20px] font-normal leading-relaxed text-slate-700">
                  {t.subtitle}
                </p>
              </div>
              <Link
                href="/experts"
                className="inline-flex min-h-12 shrink-0 items-center justify-center self-start rounded-xl border border-blue-300/90 bg-white/95 px-6 text-sm sm:text-base font-bold text-blue-700 shadow-2xs transition hover:border-blue-400 hover:bg-white hover:shadow-xs sm:self-auto"
              >
                {t.exploreCTA}
              </Link>
            </div>
          </RevealItem>

          <div className="mt-8 grid auto-rows-[220px] gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[250px]">
            {t.moments.map((item, index) => (
              <RevealItem
                key={item.title}
                delay={index * 90}
                className={`h-full ${index === 0 ? "sm:row-span-2 lg:col-span-2" : ""} ${index === 3 ? "lg:col-span-2" : ""}`}
              >
                <article className="group relative isolate h-full min-h-[220px] overflow-hidden rounded-[24px] border border-blue-100 bg-blue-100 shadow-[0_22px_55px_-40px_rgba(37,99,235,.85)]">
                  <div
                    className="absolute inset-0 scale-[1.01] bg-cover bg-center transition duration-700 group-hover:scale-105"
                    style={{ backgroundImage: `url(${item.image})` }}
                    aria-hidden="true"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06152f]/92 via-[#0b3c91]/25 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <span
                      className={`inline-flex rounded-full border border-white/25 ${item.badgeColor} px-3.5 py-1 text-xs sm:text-[13px] font-black uppercase tracking-wider backdrop-blur`}
                    >
                      {item.tag}
                    </span>
                    <h3 className="mt-2.5 text-lg sm:text-xl md:text-2xl xl:text-[26px] font-bold leading-snug text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-base sm:text-lg font-medium text-blue-100">
                      {item.meta}
                    </p>
                  </div>
                </article>
              </RevealItem>
            ))}
          </div>

          <RevealItem delay={120}>
            <div className="relative mt-10 overflow-hidden rounded-[30px] border border-blue-200 bg-[radial-gradient(circle_at_15%_20%,rgba(147,197,253,.46),transparent_28%),linear-gradient(110deg,#0b5de8_0%,#1677ff_45%,#55b7ff_100%)] px-6 py-8 text-white shadow-[0_28px_75px_-42px_rgba(37,99,235,.95)] sm:px-10 sm:py-10">
              <div
                className="absolute -right-16 -top-20 size-64 rounded-full border border-white/20"
                aria-hidden="true"
              />
              <div
                className="absolute right-10 top-5 size-32 rounded-full border border-white/15"
                aria-hidden="true"
              />
              <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-xs sm:text-[13px] font-black uppercase tracking-wider backdrop-blur">
                    {t.bannerTag}
                  </span>
                  <h3 className="mt-4 max-w-3xl text-2xl sm:text-3xl md:text-4xl font-black leading-snug tracking-tight">
                    {t.bannerTitle}
                  </h3>
                  <div className="mt-5 flex max-w-3xl gap-2.5 overflow-hidden">
                    <div className="guest-banner-slide flex w-max gap-2.5">
                      {[...t.bannerItems, ...t.bannerItems].map(
                        (item, index) => (
                          <span
                            key={`${item}-banner-${index}`}
                            className="shrink-0 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-sm sm:text-base font-bold text-white backdrop-blur"
                          >
                            {item}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  href="/opportunities"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl bg-white px-7 text-sm sm:text-base font-black text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-blue-50"
                >
                  {t.bannerCTA}
                </Link>
              </div>
            </div>
          </RevealItem>
        </div>
      </section>

      <style>{`
        @keyframes guestMarquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes guestBannerSlide {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .guest-marquee { animation: guestMarquee 34s linear infinite; }
        .guest-banner-slide { animation: guestBannerSlide 26s linear infinite; }
        .guest-marquee:hover, .guest-banner-slide:hover { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .guest-marquee, .guest-banner-slide { animation: none; }
        }
      `}</style>
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { HOME_COPY, NetworkIconGlyph } from "./GuestHomeV2";
import { GuestPublicFooter } from "./GuestPublicFooter";
import { GuestPublicNav } from "./GuestPublicNav";

const MEMBER_ORGANIZATIONS = [
  { abbr: "HUST", name: "Đại học Bách khoa Hà Nội", country: "Việt Nam" },
  { abbr: "VNU", name: "Đại học Quốc gia Hà Nội", country: "Việt Nam" },
  { abbr: "VAST", name: "Viện Hàn lâm Khoa học và Công nghệ Việt Nam", country: "Việt Nam" },
  { abbr: "MSU", name: "Đại học Tổng hợp Quốc gia Moskva", country: "Liên bang Nga" },
  { abbr: "Sk", name: "Viện Khoa học và Công nghệ Skolkovo", country: "Liên bang Nga" },
  { abbr: "BMSTU", name: "Đại học Kỹ thuật Quốc gia Bauman Moskva", country: "Liên bang Nga" },
] as const;

const LEADERS = [
  { initials: "NK", name: "GS.TS. Nguyễn Văn Kính", role: "Đồng Chủ tịch Mạng lưới", organization: "Việt Nam" },
  { initials: "AP", name: "GS. Alexander Petrov", role: "Đồng Chủ tịch Mạng lưới", organization: "Liên bang Nga" },
  { initials: "TL", name: "TS. Trần Thị Lan", role: "Ủy viên Ban điều hành", organization: "Việt Nam" },
  { initials: "IS", name: "TS. Ivan Smirnov", role: "Ủy viên Ban điều hành", organization: "Liên bang Nga" },
  { initials: "LN", name: "PGS.TS. Lê Hoàng Nam", role: "Tổng thư ký", organization: "Việt Nam" },
] as const;

const COPY: Record<Locale, {
  eyebrow: string;
  title: string;
  alternateTitle: string;
  intro: string;
  missionTitle: string;
  mission: string;
  values: { icon: string; title: string; description: string }[];
  membersEyebrow: string;
  membersTitle: string;
  membersIntro: string;
  viewMembers: string;
  leadershipEyebrow: string;
  leadershipTitle: string;
  leadershipIntro: string;
  ctaTitle: string;
  ctaDescription: string;
  cta: string;
}> = {
  vi: {
    eyebrow: "Thông tin về Mạng lưới",
    title: "Kết nối tri thức, kiến tạo tương lai",
    alternateTitle: "Hợp tác bền vững, cùng mở tương lai",
    intro: "Cầu nối tri thức bền vững giữa Việt Nam và Liên bang Nga.",
    missionTitle: "Về chúng tôi",
    mission: "Mạng lưới thúc đẩy chia sẻ tri thức, hình thành hợp tác nghiên cứu và đưa kết quả khoa học vào thực tiễn. Chúng tôi tạo một không gian chung để các thành viên tìm đúng đối tác, tiếp cận nguồn lực và cùng phát triển sáng kiến song phương.",
    values: [
      { icon: "hub", title: "Kết nối tri thức", description: "Liên kết chuyên gia, viện nghiên cứu, trường đại học và doanh nghiệp." },
      { icon: "groups", title: "Hợp tác bền vững", description: "Phát triển quan hệ dài hạn dựa trên nhu cầu và năng lực thực tế." },
      { icon: "education", title: "Đào tạo & Phát triển", description: "Chia sẻ học thuật, phương pháp và cơ hội phát triển nguồn nhân lực." },
      { icon: "network", title: "Kiến tạo tương lai", description: "Đồng hành cùng các sáng kiến khoa học, công nghệ và đổi mới." },
    ],
    membersEyebrow: "Các tổ chức thành viên",
    membersTitle: "Cùng kiến tạo hệ sinh thái tri thức",
    membersIntro: "Kết nối các trường đại học, viện nghiên cứu và tổ chức khoa học tiêu biểu của Việt Nam và Liên bang Nga.",
    viewMembers: "Xem thành viên",
    leadershipEyebrow: "Ban điều hành",
    leadershipTitle: "Ban điều hành Mạng lưới",
    leadershipIntro: "Ban điều hành định hướng hoạt động, thúc đẩy hợp tác và kết nối các thành viên trong toàn Mạng lưới.",
    ctaTitle: "Tham gia Mạng lưới tri thức Nga - Việt",
    ctaDescription: "Kết nối · Hợp tác · Phát triển · Kiến tạo tương lai",
    cta: "Đăng ký tham gia",
  },
  en: {
    eyebrow: "About the Network",
    title: "Connecting knowledge, shaping the future",
    alternateTitle: "Building partnerships, shaping the future",
    intro: "A lasting knowledge bridge between Vietnam and Russia.",
    missionTitle: "Who we are",
    mission: "The Network advances knowledge exchange, research partnerships and the practical application of scientific results. It helps members find the right partners, access resources and develop bilateral initiatives together.",
    values: [
      { icon: "hub", title: "Knowledge connection", description: "Connect experts, research institutes, universities and businesses." },
      { icon: "groups", title: "Sustainable partnership", description: "Build lasting relationships grounded in real needs and capabilities." },
      { icon: "education", title: "Education & growth", description: "Share scholarship, methods and human-development opportunities." },
      { icon: "network", title: "Shape the future", description: "Support science, technology and innovation initiatives." },
    ],
    membersEyebrow: "Member organizations",
    membersTitle: "Building a knowledge ecosystem together",
    membersIntro: "Connecting leading universities, research institutes and scientific organizations in Vietnam and the Russian Federation.",
    viewMembers: "View member",
    leadershipEyebrow: "Leadership",
    leadershipTitle: "Network Executive Board",
    leadershipIntro: "The Executive Board guides the Network, advances collaboration and connects members across both countries.",
    ctaTitle: "Join the Russia - Vietnam Knowledge Network",
    ctaDescription: "Connect · Collaborate · Develop · Shape the future",
    cta: "Register to join",
  },
  ru: {
    eyebrow: "О сети",
    title: "Соединяем знания, создаём будущее",
    alternateTitle: "Объединяем идеи, создаём будущее",
    intro: "Прочный мост знаний между Вьетнамом и Россией.",
    missionTitle: "О нас",
    mission: "Сеть содействует обмену знаниями, исследовательскому партнёрству и практическому применению научных результатов. Участники находят партнёров, ресурсы и совместно развивают двусторонние инициативы.",
    values: [
      { icon: "hub", title: "Обмен знаниями", description: "Связь экспертов, институтов, университетов и предприятий." },
      { icon: "groups", title: "Устойчивое партнёрство", description: "Долгосрочные отношения на основе реальных потребностей и компетенций." },
      { icon: "education", title: "Образование и развитие", description: "Обмен научными методами и возможностями развития кадров." },
      { icon: "network", title: "Создание будущего", description: "Поддержка научных, технологических и инновационных инициатив." },
    ],
    membersEyebrow: "Организации-участники",
    membersTitle: "Вместе создаём экосистему знаний",
    membersIntro: "Объединяем ведущие университеты, научные институты и организации России и Вьетнама.",
    viewMembers: "Участник",
    leadershipEyebrow: "Руководство",
    leadershipTitle: "Правление сети",
    leadershipIntro: "Правление определяет направления работы сети, развивает сотрудничество и объединяет участников двух стран.",
    ctaTitle: "Присоединяйтесь к сети знаний Россия – Вьетнам",
    ctaDescription: "Связь · Сотрудничество · Развитие · Будущее",
    cta: "Подать заявку",
  },
};

const TYPE_DELAY_MS = 110;
const HOLD_DELAY_MS = 1_800;
const FADE_DELAY_MS = 600;

function TypingHeadline({
  primary,
  alternate,
}: {
  primary: string;
  alternate: string;
}) {
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const headline = headlineIndex === 0 ? primary : alternate;
  const reserveHeadline =
    primary.length >= alternate.length ? primary : alternate;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const delay = isFading
      ? FADE_DELAY_MS
      : characterCount < headline.length
        ? TYPE_DELAY_MS
        : HOLD_DELAY_MS;
    const timer = window.setTimeout(() => {
      if (isFading) {
        setHeadlineIndex((current) => (current === 0 ? 1 : 0));
        setCharacterCount(1);
        setIsFading(false);
      } else if (characterCount < headline.length) {
        setCharacterCount((current) => current + 1);
      } else {
        setIsFading(true);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [characterCount, headline, isFading]);

  return (
    <h1
      aria-label={primary}
      className="max-w-[15ch] text-balance font-sans text-4xl font-black leading-[1.08] tracking-[-0.045em] text-[#F4F8FF] [text-shadow:0_1px_0_rgba(255,255,255,.12),0_8px_30px_rgba(1,10,30,.62),0_0_28px_rgba(96,165,250,.12)] sm:text-5xl lg:text-6xl"
    >
      <span className="hidden motion-reduce:block">{primary}</span>
      <span className="grid motion-reduce:hidden" aria-hidden="true">
        <span className="invisible col-start-1 row-start-1">
          {reserveHeadline}
        </span>
        <span
          className={`col-start-1 row-start-1 transition-opacity duration-[600ms] ease-in ${
            isFading ? "opacity-0" : "opacity-100"
          }`}
        >
          {headline.slice(0, characterCount)}
        </span>
      </span>
    </h1>
  );
}

function NetworkMesh({ className }: Readonly<{ className: string }>) {
  return (
    <svg
      viewBox="0 0 320 180"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="0.8">
        <path d="M8 52 66 18l56 42 62-30 56 54 72-46" />
        <path d="m8 52 38 70 76-62 44 82 74-58 72 52" />
        <path d="M46 122 66 18l100 124 18-112 128 106" />
        <path d="m8 52 114 8 118 24 72-46" />
      </g>
      <g fill="currentColor">
        <circle cx="8" cy="52" r="3" />
        <circle cx="46" cy="122" r="2.5" />
        <circle cx="66" cy="18" r="4" />
        <circle cx="122" cy="60" r="3" />
        <circle cx="166" cy="142" r="3.5" />
        <circle cx="184" cy="30" r="2.5" />
        <circle cx="240" cy="84" r="4" />
        <circle cx="312" cy="38" r="3" />
        <circle cx="312" cy="136" r="2.5" />
      </g>
    </svg>
  );
}

export function GuestAboutV2() {
  const { locale } = useLocale();
  const t = COPY[locale] ?? COPY.vi;
  const homeCopy = HOME_COPY[locale] ?? HOME_COPY.vi;

  return (
    <div className="min-h-screen bg-[#f6f9fe] text-slate-950">
      <GuestPublicNav active="about" />
      <main>
        <section className="relative isolate min-h-[460px] overflow-hidden bg-[#04152f] px-4 text-white sm:min-h-[540px] sm:px-6 lg:min-h-[620px] lg:px-8">
          <Image
            src="/images/about-network-hero.png"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[68%_center] lg:object-contain lg:object-right"
            priority
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(90deg,rgba(3,15,39,.97)_0%,rgba(3,20,51,.86)_48%,rgba(3,20,51,.42)_76%,rgba(3,20,51,.18)_100%)]"
            aria-hidden="true"
          />
          <div className="relative z-10 mx-auto flex min-h-[460px] max-w-[1460px] items-center py-16 sm:min-h-[540px] lg:min-h-[620px] lg:py-24">
            <div className="max-w-3xl pl-3 sm:pl-6 lg:pl-10">
              <div className="mb-5 inline-flex max-w-full items-center gap-2.5 rounded-full border-[2.5px] border-amber-400/90 bg-black/20 px-4 py-2 text-base font-black text-amber-300 sm:mb-6 sm:px-5 sm:text-lg">
                <span
                  className="size-2.5 shrink-0 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]"
                  aria-hidden="true"
                />
                <span>{t.eyebrow}</span>
              </div>
              <TypingHeadline
                key={locale}
                primary={t.title}
                alternate={t.alternateTitle}
              />
              <p className="mt-7 max-w-2xl border-l border-blue-300/50 pl-5 text-lg font-medium leading-relaxed tracking-[0.01em] text-[#C9D7EA] [text-shadow:0_3px_18px_rgba(1,10,30,.48)] sm:text-xl">{t.intro}</p>
            </div>
          </div>
        </section>

        <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-8">
          <div>
            <div className="min-w-0">

              <section
                id="about-overview"
                className="scroll-mt-24 py-16 lg:py-20"
              >
            <div className="max-w-4xl">
              <p className="text-base font-extrabold uppercase tracking-[0.12em] text-blue-700">{t.missionTitle}</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{homeCopy.footer.brandTitle}</h2>
              <p className="mt-5 text-lg leading-8 text-slate-700">{t.mission}</p>
            </div>
            <div className="relative mt-10 overflow-hidden rounded-2xl border border-blue-100 bg-[#f3f8ff] p-3 shadow-[0_24px_54px_-38px_rgba(38,97,177,.5)] sm:p-4 lg:rounded-[2rem] lg:p-5">
              <NetworkMesh className="pointer-events-none absolute -left-16 -top-12 h-48 w-80 text-blue-400/25" />
              <NetworkMesh className="pointer-events-none absolute -bottom-16 -right-20 h-56 w-96 rotate-180 text-blue-400/25" />
              <ul className="relative grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {t.values.map((item, index) => (
                  <li
                    key={item.title}
                    className="relative min-h-[300px] rounded-2xl border border-blue-100/90 bg-white/85 p-6 backdrop-blur-[2px] sm:min-h-[320px] sm:p-7 lg:p-8"
                  >
                    <span className="relative grid size-16 place-items-center overflow-hidden rounded-xl border border-blue-200/90 bg-white/80 text-blue-600 shadow-[0_12px_26px_-14px_rgba(37,99,235,.55)]">
                      <span
                        className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,.9),rgba(219,234,254,.45)_52%,rgba(255,255,255,.75))]"
                        aria-hidden="true"
                      />
                      <span
                        className="absolute -right-5 -top-5 size-12 rotate-45 border border-blue-200/60 bg-blue-50/60"
                        aria-hidden="true"
                      />
                      <span className="relative">
                        <NetworkIconGlyph icon={item.icon} className="size-8" />
                      </span>
                    </span>
                    <h3 className="mt-7 text-balance font-serif text-2xl font-semibold leading-tight tracking-[-0.02em] text-[#0b2452] xl:min-h-16">
                      {item.title}
                    </h3>
                    <span className="mt-5 block h-0.5 w-10 bg-blue-600" aria-hidden="true" />
                    <p className="mt-4 max-w-[31ch] text-lg leading-8 text-slate-600">
                      {item.description}
                    </p>
                    {index < t.values.length - 1 ? (
                      <span
                        className="pointer-events-none absolute -right-[15px] top-40 z-20 hidden w-[18px] items-center xl:flex"
                        aria-hidden="true"
                      >
                        <span className="size-1.5 shrink-0 rounded-full border border-blue-400 bg-[#f3f8ff] shadow-[0_0_0_2px_rgba(219,234,254,.8)]" />
                        <span className="h-px flex-1 bg-blue-300" />
                        <span className="size-1.5 shrink-0 rounded-full border border-blue-400 bg-[#f3f8ff] shadow-[0_0_0_2px_rgba(219,234,254,.8)]" />
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
              </section>

              <section
                id="member-organizations"
                className="-mx-4 scroll-mt-24 border-y border-blue-100 bg-[#edf5ff] px-4 py-16 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 lg:py-20 min-[1200px]:mx-0 min-[1200px]:rounded-2xl min-[1200px]:border"
              >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-base font-extrabold uppercase tracking-[0.12em] text-blue-700">{t.membersEyebrow}</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{t.membersTitle}</h2>
                <p className="mt-4 text-base leading-7 text-slate-600">{t.membersIntro}</p>
              </div>
            </div>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MEMBER_ORGANIZATIONS.map((member) => (
                <Link key={member.abbr} href={`/experts?organization=${encodeURIComponent(member.abbr)}`} className="group flex min-h-36 items-center gap-5 rounded-2xl border border-blue-100 bg-white p-5 shadow-xs transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                  <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-[#0b3a79] px-2 text-center text-base font-black text-white">{member.abbr}</span>
                  <span className="min-w-0">
                    <strong className="block text-lg font-black leading-snug text-slate-950 group-hover:text-blue-700">{member.name}</strong>
                    <small className="mt-2 block text-sm font-semibold text-slate-500">{member.country} · {t.viewMembers} →</small>
                  </span>
                </Link>
              ))}
            </div>
              </section>

              <section
                id="board"
                className="scroll-mt-24 py-16 lg:py-20"
              >
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-base font-extrabold uppercase tracking-[0.12em] text-blue-700">{t.leadershipEyebrow}</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{t.leadershipTitle}</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{t.leadershipIntro}</p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 min-[1400px]:grid-cols-5">
              {LEADERS.map((leader) => (
                <article key={leader.name} className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_16px_40px_-32px_rgba(15,56,110,.4)]">
                  <div className="grid aspect-[4/3] place-items-center bg-gradient-to-br from-[#dceaff] to-[#abc9f2]">
                    <span className="grid size-24 place-items-center rounded-full border-4 border-white/80 bg-[#0b3a79] text-3xl font-black text-white shadow-lg">{leader.initials}</span>
                  </div>
                  <div className="p-5">
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-800">{leader.role}</span>
                    <h3 className="mt-4 text-lg font-black leading-snug text-slate-950">{leader.name}</h3>
                    <p className="mt-2 text-sm font-semibold text-slate-500">{leader.organization}</p>
                  </div>
                </article>
              ))}
            </div>
              </section>
            </div>
          </div>
        </div>

        <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
          <div className="mx-auto flex max-w-[1460px] flex-col items-start justify-between gap-7 overflow-hidden rounded-3xl bg-[#071b3d] p-8 text-white shadow-xl sm:p-10 lg:flex-row lg:items-center lg:p-12">
            <div>
              <h2 className="text-2xl font-black uppercase leading-tight sm:text-3xl">{t.ctaTitle}</h2>
              <p className="mt-3 text-base text-blue-100 sm:text-lg">{t.ctaDescription}</p>
            </div>
            <Link href="/register" className="inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 px-7 text-base font-extrabold text-white shadow-lg transition hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{t.cta} →</Link>
          </div>
        </section>
      </main>
      <GuestPublicFooter copy={homeCopy} />
    </div>
  );
}

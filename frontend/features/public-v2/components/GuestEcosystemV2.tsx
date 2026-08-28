"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { HOME_COPY } from "./GuestHomeV2";
import { GuestPublicFooter } from "./GuestPublicFooter";
import { GuestPublicNav } from "./GuestPublicNav";

const COPY: Record<Locale, Record<string, string>> = {
  vi: {
    eyebrow: "Hệ sinh thái hợp tác",
    title: "Kết nối hợp tác & tri thức Việt – Nga",
    intro:
      "Một điểm đến chung để khám phá chuyên gia, tổ chức, dự án, cơ hội và nguồn tri thức giữa Việt Nam và Liên bang Nga.",
    explore: "Khám phá hệ sinh thái",
    join: "Đăng ký tham gia",
    opportunities: "Cơ hội hợp tác",
    opportunitiesSubtitle:
      "Kết nối tri thức – Chia sẻ giá trị – Kiến tạo tương lai Việt – Nga",
    members: "Thành viên",
    membersSubtitle: "Mạng lưới chuyên gia và các tổ chức nghiên cứu hàng đầu",
    projects: "Dự án & kết quả",
    projectsSubtitle:
      "Các chương trình hợp tác khoa học trọng điểm và chuyển giao công nghệ",
    library: "Thư viện tri thức",
    librarySubtitle:
      "Cơ sở dữ liệu ấn phẩm khoa học, sáng chế và báo cáo chuyên ngành",
    impact: "Thống kê & tác động",
    preview: "Dữ liệu giới thiệu",
    viewAll: "Xem tất cả",
    connectPartner: "Kết nối đúng đối tác",
    connectPartnerDesc:
      "Tìm chuyên gia hoặc tổ chức phù hợp cho ý tưởng và dự án của bạn.",
    feature1: "Tiếp cận mạng lưới chuyên gia hàng đầu Việt – Nga",
    feature2: "Tăng tốc hợp tác & phát triển dự án",
    feature3: "Tin cậy – Minh bạch – Hiệu quả",
    startConnecting: "Bắt đầu kết nối",
    callsEvents: "Công bố & sự kiện",
    joinNetwork: "Tham gia mạng lưới",
    joinNetworkDesc:
      "Trở thành một phần của mạng lưới tri thức Việt – Nga, mở rộng cơ hội hợp tác và cùng kiến tạo giá trị mới.",
    registerNow: "Đăng ký ngay",
    memberCount: "Hơn 2.500+ thành viên đã tham gia",
    learnMoreNetwork: "Tìm hiểu thêm về mạng lưới",
    viewProfile: "Xem hồ sơ",
    viewDetail: "Xem chi tiết",
    viewDocument: "Xem tài liệu",
  },
  en: {
    eyebrow: "Collaboration ecosystem",
    title: "Connect Vietnam–Russia knowledge & collaboration",
    intro:
      "One shared destination to discover experts, organizations, projects, opportunities and knowledge across Vietnam and Russia.",
    explore: "Explore ecosystem",
    join: "Join the network",
    opportunities: "Opportunities",
    opportunitiesSubtitle:
      "Connecting Knowledge – Sharing Value – Building Vietnam–Russia Future",
    members: "Members",
    membersSubtitle:
      "Network of leading researchers and scientific institutions",
    projects: "Projects & outcomes",
    projectsSubtitle:
      "Key bilateral scientific programs and technology transfers",
    library: "Knowledge library",
    librarySubtitle:
      "Database of scientific publications, patents, and technical reports",
    impact: "Statistics & impact",
    preview: "Illustrative data",
    viewAll: "View all",
    connectPartner: "Targeted Partner Matching",
    connectPartnerDesc:
      "Find verified experts or institutions aligned with your research proposals.",
    feature1: "Access top Vietnam–Russia expert network",
    feature2: "Accelerate collaboration & project delivery",
    feature3: "Reliable – Transparent – High Impact",
    startConnecting: "Start Matching",
    callsEvents: "Calls & Events",
    joinNetwork: "Join the Network",
    joinNetworkDesc:
      "Become part of the bilateral knowledge network, expand joint opportunities and build new value together.",
    registerNow: "Register Now",
    memberCount: "Over 2,500+ members have joined",
    learnMoreNetwork: "Learn more about the network",
    viewProfile: "View profile",
    viewDetail: "View details",
    viewDocument: "View document",
  },
  ru: {
    eyebrow: "Экосистема сотрудничества",
    title: "Знания и сотрудничество России и Вьетнама",
    intro:
      "Единое пространство для поиска экспертов, организаций, проектов, возможностей и знаний России и Вьетнама.",
    explore: "Открыть экосистему",
    join: "Присоединиться",
    opportunities: "Возможности",
    opportunitiesSubtitle:
      "Объединяя знания – Разделяя ценности – Создавая будущее",
    members: "Участники",
    membersSubtitle:
      "Сеть ведущих ученых, экспертов и научно-исследовательских институтов",
    projects: "Проекты и результаты",
    projectsSubtitle: "Ключевые программы научно-технического сотрудничества",
    library: "Библиотека знаний",
    librarySubtitle:
      "База научных публикаций, патентов и специализированных отчетов",
    impact: "Статистика и влияние",
    preview: "Демонстрационные данные",
    viewAll: "Смотреть все",
    connectPartner: "Подбор партнёров",
    connectPartnerDesc:
      "Поиск профильных экспертов и организаций для совместных инициатив.",
    feature1: "Доступ к пулу ведущих экспертов России и Вьетнама",
    feature2: "Ускорение совместных проектов и разработок",
    feature3: "Надежность – Прозрачность – Результат",
    startConnecting: "Начать сотрудничество",
    callsEvents: "Объявления и события",
    joinNetwork: "Присоединиться к сети",
    joinNetworkDesc:
      "Станьте частью двусторонней научной сети, расширяйте возможности сотрудничества.",
    registerNow: "Зарегистрироваться",
    memberCount: "Более 2 500+ участников уже присоединились",
    learnMoreNetwork: "Узнать больше о сети",
    viewProfile: "Профиль",
    viewDetail: "Подробнее",
    viewDocument: "Смотреть",
  },
};

const CALLS_DATA = {
  vi: [
    {
      day: "20",
      month: "THG 06",
      year: "2026",
      tag: "HỘI THẢO QUỐC TẾ",
      tagClass: "text-red-600",
      title: "Hội thảo Quốc tế về Trí tuệ nhân tạo và Ứng dụng",
      location: "Hà Nội, Việt Nam",
      format: "Trực tiếp & trực tuyến",
      status: "Mở đăng ký",
      badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      icon: "person",
    },
    {
      day: "05",
      month: "THG 07",
      year: "2026",
      tag: "CALL FOR PAPERS",
      tagClass: "text-blue-600",
      title: "Call for Papers – Khoa học & Công nghệ Việt – Nga",
      location: "Đa quốc gia",
      format: "Hạn nộp: 15/08/2026",
      status: "Đang nhận bài",
      badgeClass: "border-blue-200 bg-blue-50 text-blue-700",
      icon: "description",
    },
    {
      day: "15",
      month: "THG 08",
      year: "2026",
      tag: "HỘI THẢO",
      tagClass: "text-purple-600",
      title: "Hội thảo Năng lượng sạch và Chuyển đổi số",
      location: "TP. Hồ Chí Minh, Việt Nam",
      format: "Sắp diễn ra",
      status: "Sắp diễn ra",
      badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
      icon: "calendar_month",
    },
  ],
  ru: [
    {
      day: "20",
      month: "ИЮН",
      year: "2026",
      tag: "МЕЖДУНАРОДНЫЙ СИМПОЗИУМ",
      tagClass: "text-red-600",
      title: "Международный симпозиум по ИИ và прикладным технологиям",
      location: "Ханой, Вьетнам",
      format: "Очно và онлайн",
      status: "Регистрация открыта",
      badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      icon: "person",
    },
    {
      day: "05",
      month: "ИЮЛ",
      year: "2026",
      tag: "CALL FOR PAPERS",
      tagClass: "text-blue-600",
      title: "Call for Papers – Наука và технологии Россия – Вьетнам",
      location: "Международный формат",
      format: "Дедлайн: 15.08.2026",
      status: "Приём заявок",
      badgeClass: "border-blue-200 bg-blue-50 text-blue-700",
      icon: "description",
    },
    {
      day: "15",
      month: "АВГ",
      year: "2026",
      tag: "СИМПОЗИУМ",
      tagClass: "text-purple-600",
      title: "Симпозиум по чистой энергии và цифровой трансформации",
      location: "Хошимин, Вьетнам",
      format: "Скоро",
      status: "Скоро",
      badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
      icon: "calendar_month",
    },
  ],
  en: [
    {
      day: "20",
      month: "JUN",
      year: "2026",
      tag: "INTERNATIONAL SYMPOSIUM",
      tagClass: "text-red-600",
      title: "International Symposium on AI and Applied Technologies",
      location: "Hanoi, Vietnam",
      format: "Hybrid (In-person & Online)",
      status: "Open for Registration",
      badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700",
      icon: "person",
    },
    {
      day: "05",
      month: "JUL",
      year: "2026",
      tag: "CALL FOR PAPERS",
      tagClass: "text-blue-600",
      title: "Call for Papers – Vietnam–Russia Science & Technology",
      location: "Bilateral / Multi-nation",
      format: "Deadline: Aug 15, 2026",
      status: "Call for Papers",
      badgeClass: "border-blue-200 bg-blue-50 text-blue-700",
      icon: "description",
    },
    {
      day: "15",
      month: "AUG",
      year: "2026",
      tag: "SYMPOSIUM",
      tagClass: "text-purple-600",
      title: "Clean Energy & Digital Transformation Symposium",
      location: "Ho Chi Minh City, Vietnam",
      format: "Upcoming",
      status: "Upcoming",
      badgeClass: "border-amber-200 bg-amber-50 text-amber-700",
      icon: "calendar_month",
    },
  ],
};

const EXPERTS = [
  {
    name: "GS. Trần Minh Đức",
    field: "Trí tuệ nhân tạo & Khoa học dữ liệu",
    organization: "ĐHQG Hà Nội",
    flag: "🇻🇳 VN",
  },
  {
    name: "PGS. Anna Petrova",
    field: "Vật liệu tiên tiến & Nano",
    organization: "Moscow State University",
    flag: "🇷🇺 RU",
  },
  {
    name: "TS. Nguyễn Hữu Lộc",
    field: "Năng lượng tái tạo & Lưu trữ",
    organization: "ĐH Bách khoa TP.HCM",
    flag: "🇻🇳 VN",
  },
];

const PROJECTS = [
  {
    title: "Học bổng Khai Sáng",
    desc: "Chương trình học bổng dành cho sinh viên Việt Nam học tập tại các trường đại học hàng đầu của Nga.",
    image:
      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80",
    meta: "2021–2026 · Giáo dục",
  },
  {
    title: "Nghiên cứu pin thế hệ mới Việt – Nga",
    desc: "Phát triển vật liệu điện cực và công nghệ lưu trữ năng lượng hiệu suất cao.",
    image:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1000&q=80",
    meta: "2023–2027 · Vật liệu mới",
  },
  {
    title: "Hợp tác KHCN Biển & Hải dương",
    desc: "Nghiên cứu biển, dự báo khí hậu và phát triển kinh tế biển bền vững.",
    image:
      "https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=1000&q=80",
    meta: "2019–2024 · Môi trường",
  },
];

const PUBLICATIONS = [
  {
    kind: "Bài báo khoa học",
    title: "Deep learning for medical image classification in bilateral health",
    meta: "T. M. Đức và cộng sự · 2026",
  },
  {
    kind: "Tạp chí chuyên ngành",
    title: "Tạp chí Khoa học & Công nghệ song phương Việt – Nga",
    meta: "ISSN 2525-2518 · Xuất bản định kỳ",
  },
  {
    kind: "Sở hữu trí tuệ",
    title: "Vật liệu hấp phụ CO₂ tiên tiến từ khí thải công nghiệp",
    meta: "VN-2026-23456-B · Bằng độc quyền sáng chế",
  },
];

function SectionHeading({
  title,
  subtitle,
}: Readonly<{ title: string; subtitle?: string }>) {
  return (
    <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-serif text-3xl font-black tracking-tight text-[#081e46] sm:text-4xl">
          {title}
        </h2>
        {subtitle ? (
          <div className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-slate-600 sm:text-sm">
            <span className="inline-block h-0.5 w-5 rounded-full bg-red-600" />
            <span className="size-1.5 rounded-full bg-blue-600" />
            <span>{subtitle}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export function GuestEcosystemV2({
  isAuthenticated,
  workspaceHref,
}: Readonly<{ isAuthenticated: boolean; workspaceHref: string }>) {
  const { locale } = useLocale();
  const t = COPY[locale] ?? COPY.vi;
  const calls = CALLS_DATA[locale] ?? CALLS_DATA.vi;
  const footerCopy = HOME_COPY[locale] ?? HOME_COPY.vi;

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-900 font-sans">
      <GuestPublicNav
        active="ecosystem"
        isAuthenticated={isAuthenticated}
        workspaceHref={workspaceHref}
      />
      <main>
        {/* ═══════════ HERO BANNER SECTION ═══════════ */}
        <section className="relative isolate flex min-h-[440px] items-center overflow-hidden border-b border-blue-100 bg-[#edf5fc] px-4 py-16 text-slate-950 sm:min-h-[500px] sm:px-6 lg:min-h-[560px] lg:px-8 lg:py-20">
          <div className="absolute inset-0 -z-10">
            <Image
              src="/images/ecosystem-hero-bg.jpg"
              alt="Ecosystem Background"
              fill
              priority
              sizes="100vw"
              className="object-cover object-right md:object-center"
            />
          </div>
          <div className="mx-auto w-full max-w-[1460px]">
            <div className="max-w-xl text-left lg:max-w-2xl">
              <h1 className="text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl xl:text-6xl">
                {t.title}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg lg:text-xl">
                {t.intro}
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════ SECTION 1: CƠ HỘI HỢP TÁC (OPPORTUNITIES) ═══════════ */}
        <section
          id="opportunities"
          className="scroll-mt-28 px-4 py-14 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-[1460px]">
            <SectionHeading
              title={t.opportunities}
              subtitle={t.opportunitiesSubtitle}
            />
            {/* Full-width Spacious "Công bố & sự kiện" Container */}
            <div className="overflow-hidden rounded-3xl border border-blue-200/80 bg-white/95 p-6 shadow-xs transition-all duration-300 hover:border-blue-300 hover:shadow-md sm:p-9 lg:p-10">
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex items-center gap-3.5">
                  <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                    <span className="material-symbols-outlined text-3xl">
                      event_note
                    </span>
                  </span>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 sm:text-3xl">
                      {t.callsEvents}
                    </h3>
                    <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                      {locale === "ru"
                        ? "Актуальные научные мероприятия, симпозиумы и приём заявок"
                        : locale === "en"
                          ? "Upcoming scientific events, symposiums and open calls"
                          : "Các sự kiện khoa học, hội thảo quốc tế và đợt kêu gọi tài trợ mới nhất"}
                    </p>
                  </div>
                </div>

                <Link
                  href="/opportunities"
                  className="group/link inline-flex items-center gap-1.5 self-start rounded-xl border border-blue-200/80 bg-blue-50/60 px-4 py-2.5 text-xs font-bold text-blue-600 transition hover:bg-blue-600 hover:text-white sm:self-center sm:text-sm"
                >
                  <span>{t.viewAll}</span>
                  <span
                    className="transition-transform duration-200 group-hover/link:translate-x-1"
                    aria-hidden="true"
                  >
                    →
                  </span>
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {calls.map((item) => (
                  <article
                    key={item.title}
                    className="group/item flex flex-col gap-4 py-6 transition-colors duration-150 hover:bg-blue-50/30 sm:flex-row sm:items-center sm:justify-between sm:rounded-2xl sm:px-4"
                  >
                    {/* Date Left Column */}
                    <div className="flex items-center gap-3 sm:w-28 sm:flex-col sm:items-start sm:gap-0.5">
                      <span className="text-3xl font-black leading-none tracking-tight text-blue-600 sm:text-4xl">
                        {item.day}
                      </span>
                      <div className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        {item.month}
                        <span className="block font-medium text-slate-400">
                          {item.year}
                        </span>
                      </div>
                    </div>

                    {/* Title & Metadata Center */}
                    <div className="flex-1 sm:px-6">
                      <span
                        className={`text-[11px] font-extrabold uppercase tracking-wider ${item.tagClass}`}
                      >
                        {item.tag}
                      </span>
                      <h4 className="mt-1 text-base font-bold leading-snug text-slate-900 transition-colors duration-150 group-hover/item:text-blue-600 sm:text-lg">
                        {item.title}
                      </h4>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-slate-500 sm:text-sm">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-base text-slate-400">
                            location_on
                          </span>
                          <span>{item.location}</span>
                        </span>
                        <span className="text-slate-300">◇</span>
                        <span>{item.format}</span>
                      </div>
                    </div>

                    {/* Status Badge Right */}
                    <div className="shrink-0 sm:self-center">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold sm:text-sm ${item.badgeClass}`}
                      >
                        <span className="material-symbols-outlined text-base">
                          {item.icon}
                        </span>
                        <span>{item.status}</span>
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ SECTION 2: THÀNH VIÊN (MEMBERS) ═══════════ */}
        <section className="border-t border-blue-100 bg-[#f8fafd] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px]">
            <SectionHeading title={t.members} subtitle={t.membersSubtitle} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {EXPERTS.map((expert) => (
                <article
                  key={expert.name}
                  className="group flex flex-col justify-between rounded-2xl border border-blue-200/80 bg-white/95 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex size-13 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-700">
                        <span
                          className="material-symbols-outlined text-3xl"
                          aria-hidden="true"
                        >
                          person
                        </span>
                      </div>
                      <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-black text-blue-900">
                        {expert.flag}
                      </span>
                    </div>
                    <h3 className="mt-5 text-lg font-black text-slate-900 transition-colors duration-200 group-hover:text-blue-600 sm:text-xl">
                      {expert.name}
                    </h3>
                    <p className="mt-2 text-xs font-extrabold uppercase tracking-wide text-blue-600 sm:text-sm">
                      {expert.field}
                    </p>
                    <p className="mt-2 text-xs font-medium text-slate-500 sm:text-sm">
                      {expert.organization}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <Link
                      href="/experts"
                      className="group/link inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 transition hover:text-blue-800 sm:text-sm"
                    >
                      <span>{t.viewProfile}</span>
                      <span
                        className="transition-transform duration-200 group-hover/link:translate-x-1"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ SECTION 3: DỰ ÁN & KẾT QUẢ (PROJECTS) ═══════════ */}
        <section className="border-t border-blue-100 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px]">
            <SectionHeading title={t.projects} subtitle={t.projectsSubtitle} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PROJECTS.map((project) => (
                <article
                  key={project.title}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-blue-200/80 bg-white/95 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <div>
                      <div className="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                        {project.meta}
                      </div>
                      <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-blue-600 sm:text-lg">
                        {project.title}
                      </h3>
                      <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                        {project.desc}
                      </p>
                    </div>
                    <div className="mt-6 border-t border-slate-100 pt-4">
                      <Link
                        href="/opportunities"
                        className="group/link inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 transition hover:text-blue-800 sm:text-sm"
                      >
                        <span>{t.viewDetail}</span>
                        <span
                          className="transition-transform duration-200 group-hover/link:translate-x-1"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ SECTION 4: THƯ VIỆN TRI THỨC (LIBRARY) ═══════════ */}
        <section className="border-t border-blue-100 bg-[#f8fafd] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px]">
            <SectionHeading title={t.library} subtitle={t.librarySubtitle} />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PUBLICATIONS.map((item) => (
                <article
                  key={item.title}
                  className="group flex flex-col justify-between rounded-2xl border border-blue-200/80 bg-white/95 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div>
                    <div className="flex size-13 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
                      <span
                        className="material-symbols-outlined text-3xl"
                        aria-hidden="true"
                      >
                        menu_book
                      </span>
                    </div>
                    <p className="mt-5 text-[11px] font-extrabold uppercase tracking-wider text-blue-600">
                      {item.kind}
                    </p>
                    <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-blue-600 sm:text-lg">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-xs font-medium text-slate-500 sm:text-sm">
                      {item.meta}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-slate-100 pt-4">
                    <Link
                      href="/knowledge"
                      className="group/link inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 transition hover:text-blue-800 sm:text-sm"
                    >
                      <span>{t.viewDocument}</span>
                      <span
                        className="transition-transform duration-200 group-hover/link:translate-x-1"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <GuestPublicFooter copy={footerCopy} />
    </div>
  );
}

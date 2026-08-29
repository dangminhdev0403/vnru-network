"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { HOME_COPY } from "./GuestHomeV2";
import { GuestPublicFooter } from "./GuestPublicFooter";
import { GuestPublicNav } from "./GuestPublicNav";

type OpportunityTeaser = {
  id: string;
  category: string;
  title: string;
  meta: string;
  desc: string;
  url: string;
};

type ProjectTeaser = {
  id: string;
  category: string;
  title: string;
  partner: string;
  desc: string;
  url: string;
};

type KnowledgeTeaser = {
  id: string;
  type: string;
  title: string;
  author: string;
  institution: string;
  desc: string;
  url: string;
};

type EntityTeaser = {
  id: string;
  badge: string;
  name: string;
  city: string;
  desc: string;
  url: string;
};

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    intro: string;
    exploreDetail: string;
    gateways: {
      opportunities: { title: string; subtitle: string; href: string };
      directory: { title: string; subtitle: string; href: string };
      projects: { title: string; subtitle: string; href: string };
      library: { title: string; subtitle: string; href: string };
    };
    opportunitiesSection: {
      tag: string;
      title: string;
      subtitle: string;
      viewAllText: string;
      fundsTag: string;
    };
    projectsSection: {
      tag: string;
      title: string;
      subtitle: string;
      viewAllText: string;
    };
    librarySection: {
      tag: string;
      title: string;
      subtitle: string;
      viewAllText: string;
    };
    directorySection: {
      tag: string;
      title: string;
      subtitle: string;
      viewAllText: string;
    };
    joinCta: {
      title: string;
      desc: string;
      primaryButton: string;
      secondaryButton: string;
    };
  }
> = {
  vi: {
    eyebrow: "Mạng lưới Tri thức Nga – Việt",
    title: "Hệ sinh thái Hợp tác & Tri thức Nga – Việt",
    intro:
      "Cổng thông tin và kết nối chiến lược giữa cộng đồng khoa học công nghệ, viện nghiên cứu và trường đại học hai nước Việt Nam – Liên bang Nga.",
    exploreDetail: "Xem chi tiết",
    gateways: {
      opportunities: {
        title: "Cơ hội hợp tác",
        subtitle: "Học bổng, giải thưởng & tài trợ",
        href: "#opportunities",
      },
      directory: {
        title: "Chuyên gia & Tổ chức",
        subtitle: "Viện Hàn lâm & Đại học đối tác",
        href: "#network-directory",
      },
      projects: {
        title: "Dự án",
        subtitle: "Các chương trình hợp tác trọng điểm",
        href: "#projects",
      },
      library: {
        title: "Thư viện tri thức",
        subtitle: "Công trình chuyên khảo & nghiên cứu",
        href: "#knowledge-library",
      },
    },
    opportunitiesSection: {
      tag: "Tài trợ & Học bổng",
      title: "Cơ hội hợp tác",
      subtitle:
        "Các chương trình tài trợ nghiên cứu song phương và cuộc thi học thuật tuyển chọn",
      viewAllText: "Xem tất cả cơ hội",
      fundsTag: "Đối tác quỹ tài trợ chính thức",
    },
    projectsSection: {
      tag: "Hợp tác Trọng điểm",
      title: "Dự án tiêu biểu",
      subtitle:
        "Những sáng kiến biểu tượng trong khoa học, dịch thuật, giáo dục và giao lưu thế hệ trẻ",
      viewAllText: "Xem tất cả dự án",
    },
    librarySection: {
      tag: "Kho tàng Học thuật",
      title: "Thư viện tri thức",
      subtitle:
        "Công trình nghiên cứu khoa học chuyên sâu và báo cáo phân tích chiến lược",
      viewAllText: "Khám phá thư viện",
    },
    directorySection: {
      tag: "Đối tác Chiến lược",
      title: "Chuyên gia & Tổ chức",
      subtitle:
        "Mạng lưới viện hàn lâm, trường đại học hàng đầu và tổ chức đối tác song phương",
      viewAllText: "Xem danh bạ mạng lưới",
    },
    joinCta: {
      title: "Cùng Kiến tạo Mạng lưới Tri thức Nga – Việt",
      desc: "Tham gia kết nối với các viện nghiên cứu, trường đại học và nhà khoa học hàng đầu để cùng phát triển các dự án hợp tác song phương.",
      primaryButton: "Tham gia mạng lưới",
      secondaryButton: "Khám phá dự án",
    },
  },
  en: {
    eyebrow: "Russia–Vietnam Knowledge Network",
    title: "Russia–Vietnam Collaboration & Knowledge Ecosystem",
    intro:
      "A strategic collaborative gateway connecting scientific communities, research institutes, and universities across Vietnam and the Russian Federation.",
    exploreDetail: "Explore details",
    gateways: {
      opportunities: {
        title: "Opportunities",
        subtitle: "Grants, awards & funding channels",
        href: "#opportunities",
      },
      directory: {
        title: "Experts & Organizations",
        subtitle: "Academies of science & universities",
        href: "#network-directory",
      },
      projects: {
        title: "Projects",
        subtitle: "Flagship cooperation initiatives",
        href: "#projects",
      },
      library: {
        title: "Knowledge Library",
        subtitle: "Research monographs & publications",
        href: "#knowledge-library",
      },
    },
    opportunitiesSection: {
      tag: "Grants & Awards",
      title: "Active Opportunities",
      subtitle:
        "Bilateral research grants and premier scientific talent competitions",
      viewAllText: "View all opportunities",
      fundsTag: "Accredited foundation partners",
    },
    projectsSection: {
      tag: "Flagship Initiatives",
      title: "Featured Projects",
      subtitle:
        "Iconic bilateral initiatives across science, translation, education, and youth exchange",
      viewAllText: "View all projects",
    },
    librarySection: {
      tag: "Academic Repository",
      title: "Latest Knowledge",
      subtitle:
        "In-depth research monographs and strategic analytical assessments",
      viewAllText: "Explore library",
    },
    directorySection: {
      tag: "Strategic Partners",
      title: "Experts & Organizations",
      subtitle:
        "A network of premier academies of sciences, national universities, and partner bodies",
      viewAllText: "View network directory",
    },
    joinCta: {
      title: "Join the Russia–Vietnam Knowledge Network",
      desc: "Connect with leading universities, research institutes, and scholars to accelerate bilateral innovation and collaborative research.",
      primaryButton: "Join Network",
      secondaryButton: "Explore Projects",
    },
  },
  ru: {
    eyebrow: "Сеть знаний Россия – Вьетнам",
    title: "Экосистема сотрудничества и знаний Россия – Вьетнам",
    intro:
      "Стратегический портал взаимодействия между научным сообществом, исследовательскими институтами и университетами России и Вьетнама.",
    exploreDetail: "Подробнее",
    gateways: {
      opportunities: {
        title: "Возможности",
        subtitle: "Гранты, стипендии и конкурсы",
        href: "#opportunities",
      },
      directory: {
        title: "Эксперты и организации",
        subtitle: "Институты РАН и ведущие вузы",
        href: "#network-directory",
      },
      projects: {
        title: "Проекты",
        subtitle: "Флагманские программы сотрудничества",
        href: "#projects",
      },
      library: {
        title: "Библиотека знаний",
        subtitle: "Научные монографии и публикации",
        href: "#knowledge-library",
      },
    },
    opportunitiesSection: {
      tag: "Гранты и стипендии",
      title: "Гранты и возможности",
      subtitle:
        "Совместные исследовательские программы и академические конкурсы",
      viewAllText: "Все грантовые программы",
      fundsTag: "Партнерские научные фонды",
    },
    projectsSection: {
      tag: "Ключевые Программы",
      title: "Флагманские проекты",
      subtitle:
        "Символические инициативы в области науки, перевода, образования и молодежного диалога",
      viewAllText: "Все проекты",
    },
    librarySection: {
      tag: "Академическая База",
      title: "Библиотека знаний",
      subtitle:
        "Фундаментальные научные монографии и стратегические аналитические доклады",
      viewAllText: "Перейти в библиотеку",
    },
    directorySection: {
      tag: "Партнеры Сети",
      title: "Эксперты и организации",
      subtitle:
        "Сеть институтов Российской академии наук, ведущих университетов и партнерских фондов",
      viewAllText: "Каталог участников",
    },
    joinCta: {
      title: "Присоединяйтесь к сети знаний Россия – Вьетнам",
      desc: "Объединяйтесь с учеными, университетами и исследовательскими центрами для реализации совместных проектов.",
      primaryButton: "Вступить в сеть",
      secondaryButton: "Изучить проекты",
    },
  },
};

const OPPORTUNITIES_TEASERS: Record<Locale, OpportunityTeaser[]> = {
  vi: [
    {
      id: "studrussia",
      category: "Cuộc thi Toàn Nga",
      title: "Cuộc thi toàn Nga cho sinh viên quốc tế “StudRussia”",
      meta: "Hạn: 20/09/2026 • ĐH TUSUR",
      desc: "Giải thưởng danh giá tôn vinh tài năng sinh viên quốc tế tại Nga qua 7 hạng mục khoa học, lãnh đạo và sáng tạo.",
      url: "https://tusur.ru/ru/novosti-i-meropriyatiya/jizn-v-tusure/prosmotr/-/novost-inostrannyh-studentov-tusura-priglashayut-na-konkurs-studrussia",
    },
    {
      id: "vietnam-russia-joint",
      category: "Chương trình Song phương",
      title:
        "Tuyển chọn dự án nghiên cứu khoa học chung Việt – Nga (2025–2035)",
      meta: "Bộ KH&CN Việt Nam & Bộ KH&GDĐH LB Nga",
      desc: "Tài trợ nghiên cứu mũi nhọn song phương trong các lĩnh vực AI, công nghệ lượng tử, vũ trụ và nghiên cứu biển.",
      url: "/opportunities",
    },
    {
      id: "nafosted-rsf",
      category: "Tài trợ Đối ứng",
      title: "Chương trình Tiên phong NAFOSTED (Việt Nam) & RSF (Nga)",
      meta: "NAFOSTED & Quỹ Khoa học Nga (RSF)",
      desc: "Tài trợ đối ứng cho các nhóm nghiên cứu chung xuất sắc giữa viện/trường hai nước.",
      url: "/opportunities",
    },
  ],
  en: [
    {
      id: "studrussia",
      category: "All-Russian Competition",
      title: "All-Russian Competition for International Students “StudRussia”",
      meta: "Deadline: Sep 20, 2026 • TUSUR University",
      desc: "Prestigious contest honoring outstanding international students across 7 categories in science, leadership, and arts.",
      url: "https://tusur.ru/ru/novosti-i-meropriyatiya/jizn-v-tusure/prosmotr/-/novost-inostrannyh-studentov-tusura-priglashayut-na-konkurs-studrussia",
    },
    {
      id: "vietnam-russia-joint",
      category: "Bilateral Program",
      title: "Vietnam–Russia Joint Research Selection Program (2025–2035)",
      meta: "MOST Vietnam & Ministry of Science & Higher Education of Russia",
      desc: "Funding frontier research in AI, Quantum Technology, Space Science, and Marine Studies.",
      url: "/opportunities",
    },
    {
      id: "nafosted-rsf",
      category: "Joint Co-funding",
      title: "NAFOSTED (Vietnam) & RSF (Russia) Bilateral Research Program",
      meta: "NAFOSTED & Russian Science Foundation (RSF)",
      desc: "Strategic co-funding for collaborative research teams between Vietnamese and Russian institutions.",
      url: "/opportunities",
    },
  ],
  ru: [
    {
      id: "studrussia",
      category: "Всероссийский Конкурс",
      title: "Всероссийский конкурс для иностранных студентов «StudRussia»",
      meta: "Срок: 20.09.2026 • ТУСУР",
      desc: "Престижная премия поддержки талантливых иностранных студентов по 7 номинациям в науке и творчестве.",
      url: "https://tusur.ru/ru/novosti-i-meropriyatiya/jizn-v-tusure/prosmotr/-/novost-inostrannyh-studentov-tusura-priglashayut-na-konkurs-studrussia",
    },
    {
      id: "vietnam-russia-joint",
      category: "Двусторонняя Программа",
      title: "Отбор совместных научных проектов Россия – Вьетнам (2025–2035)",
      meta: "Минобрнауки России и Миннауки Вьетнама",
      desc: "Поддержка передовых исследований в области ИИ, квантовых технологий, космоса и океанологии.",
      url: "/opportunities",
    },
    {
      id: "nafosted-rsf",
      category: "Паритетное Финансирование",
      title: "Совместная программа РНФ (Россия) и NAFOSTED (Вьетнам)",
      meta: "РНФ и фонд NAFOSTED",
      desc: "Грантовое финансирование совместных исследовательских коллективов институтов и университетов двух стран.",
      url: "/opportunities",
    },
  ],
};

const PROJECT_TEASERS: Record<Locale, ProjectTeaser[]> = {
  vi: [
    {
      id: "khai-sang",
      category: "Chương trình Tiêu biểu",
      title: "Dự án “Khai sáng”",
      partner: "Quỹ Truyền thống và Hữu nghị",
      desc: "Chương trình học thuật chiến lược khuyến khích phong trào học tập, nghiên cứu khoa học và phát triển ngành Việt Nam học tại Nga cũng như Nga học tại Việt Nam.",
      url: "/projects",
    },
    {
      id: "mgimo-translation",
      category: "Dịch thuật & Học thuật",
      title: "Cuộc thi Dịch tiếng Việt chuyên nghiệp toàn Nga",
      partner: "Đại học Quan hệ Quốc tế Moskva (MGIMO)",
      desc: "Nâng cao năng lực biên - phiên dịch chính trị, kinh tế, xã hội song ngữ cho sinh viên và giới nghiên cứu trên toàn nước Nga.",
      url: "/projects",
    },
    {
      id: "iksa-vietnam-room",
      category: "Không gian Học thuật",
      title: "Phòng Việt Nam tại Viện IKSA (Viện Hàn lâm Khoa học Nga)",
      partner: "Viện Trung Quốc và Châu Á đương đại (РАН)",
      desc: "Không gian học thuật chuyên biệt thúc đẩy nghiên cứu Việt Nam học và tổ chức các diễn đàn khoa học chiến lược.",
      url: "/projects",
    },
  ],
  en: [
    {
      id: "khai-sang",
      category: "Flagship Initiative",
      title: "“Khai Sang” Project",
      partner: "Traditions and Friendship Foundation",
      desc: "Strategic flagship initiative fostering academic research, Vietnamese studies in Russia, and Russian studies in Vietnam.",
      url: "/projects",
    },
    {
      id: "mgimo-translation",
      category: "Translation & Scholarship",
      title: "All-Russian Professional Vietnamese Translation Competition",
      partner: "MGIMO University (Moscow)",
      desc: "Advancing socio-political translation competencies between Russian and Vietnamese across Russian universities.",
      url: "/projects",
    },
    {
      id: "iksa-vietnam-room",
      category: "Academic Space",
      title:
        "Vietnam Room at the Institute of China and Contemporary Asia (RAS)",
      partner: "Russian Academy of Sciences (Moscow)",
      desc: "Dedicated academic hub advancing Vietnamese studies, scholarly symposia, and bilateral research.",
      url: "/projects",
    },
  ],
  ru: [
    {
      id: "khai-sang",
      category: "Флагманская Программа",
      title: "Проект «Просвещение» (Khai Sáng)",
      partner: "Фонд «Традиции и дружба»",
      desc: "Стратегическая программа поддержки научно-исследовательской активности молодежи, развития вьетнамоведения в РФ и русистики во Вьетнаме.",
      url: "/projects",
    },
    {
      id: "mgimo-translation",
      category: "Перевод и Востоковедение",
      title:
        "Всероссийский конкурс профессионального перевода вьетнамского языка",
      partner: "МГИМО МИД России",
      desc: "Повышение компетенций студентов и востоковедов в области общественно-политического перевода между русским и вьетнамским языками.",
      url: "/projects",
    },
    {
      id: "iksa-vietnam-room",
      category: "Академическое Пространство",
      title: "Кабинет Вьетнама в ИКСА РАН",
      partner: "Институт Китая и современной Азии РАН",
      desc: "Специализированное пространство для исследований вьетнамоведения и проведения научных круглых столов.",
      url: "/projects",
    },
  ],
};

const KNOWLEDGE_TEASERS: Record<Locale, KnowledgeTeaser[]> = {
  vi: [
    {
      id: "lenchuk-monograph",
      type: "Chuyên khảo Khoa học",
      title:
        "Chuyển đổi kinh tế Nga trong bối cảnh xây dựng chủ quyền công nghệ",
      author: "E. B. Lenchuk (Chủ biên)",
      institution: "Viện Kinh tế, Viện Hàn lâm Khoa học Nga (РАН)",
      desc: "Công trình phân tích chiến lược hiện đại hóa công nghệ, đổi mới thay thế nhập khẩu và gia tăng đầu tư vào kinh tế tri thức.",
      url: "/knowledge",
    },
    {
      id: "vn-foreign-trade",
      type: "Sách Tra cứu Tổng hợp",
      title:
        "Kinh tế đối ngoại Việt Nam: Thành tựu, phương hướng và chính sách",
      author: "Nhóm chuyên gia RAS & ISAA MGU",
      institution: "Viện Hàn lâm Khoa học Nga & ĐHQG Moskva",
      desc: "Ấn phẩm tra cứu hệ thống hóa thành tựu và chính sách hội nhập kinh tế quốc tế sâu rộng của Việt Nam.",
      url: "/knowledge",
    },
  ],
  en: [
    {
      id: "lenchuk-monograph",
      type: "Research Monograph",
      title:
        "Transformation of the Russian Economy in the Context of Building Technological Sovereignty",
      author: "E. B. Lenchuk (Lead Editor)",
      institution: "Institute of Economics, Russian Academy of Sciences (RAS)",
      desc: "Strategic assessment on technological modernization, import substitution innovation, and knowledge economy capital investments.",
      url: "/knowledge",
    },
    {
      id: "vn-foreign-trade",
      type: "Reference Monograph",
      title: "Vietnam's Foreign Economic Relations: Achievements and Policies",
      author: "RAS & ISAA MSU Expert Group",
      institution: "Russian Academy of Sciences & Moscow State University",
      desc: "Comprehensive reference systematizing Vietnam's foreign economic integration and trade policy trajectory.",
      url: "/knowledge",
    },
  ],
  ru: [
    {
      id: "lenchuk-monograph",
      type: "Научная Монография",
      title:
        "Трансформация российской экономики в условиях формирования технологического суверенитета",
      author: "Е. Б. Ленчук (Главный редактор)",
      institution: "Институт экономики Российской академии наук (ИЭ РАН)",
      desc: "Фундаментальный труд по структурно-технологической модернизации, импортозамещению и инвестициям в экономику знаний.",
      url: "/knowledge",
    },
    {
      id: "vn-foreign-trade",
      type: "Справочное Издание",
      title: "Внешнеэкономическая деятельность Вьетнама: итоги и направления",
      author: "Коллектив экспертов ИКСА РАН и ИСАА МГУ",
      institution: "Российская академия наук и МГУ им. М. В. Ломоносова",
      desc: "Комплексное справочное издание, систематизирующее достижения внешнеэкономической интеграции Вьетнама.",
      url: "/knowledge",
    },
  ],
};

const ENTITY_TEASERS: Record<Locale, EntityTeaser[]> = {
  vi: [
    {
      id: "ras",
      badge: "Viện Hàn lâm",
      name: "Viện Hàn lâm Khoa học Nga (РАН / RAS)",
      city: "Moskva, LB Nga",
      desc: "Cơ quan khoa học hàn lâm cao nhất của Liên bang Nga với mạng lưới viện nghiên cứu trực thuộc chuyên sâu.",
      url: "/directory",
    },
    {
      id: "msu",
      badge: "Đại học Quốc gia",
      name: "Đại học Quốc gia Moskva (MGU Lomonosov)",
      city: "Moskva, LB Nga",
      desc: "Trường đại học danh tiếng số 1 nước Nga, trung tâm nghiên cứu khoa học tự nhiên và phương Đông học.",
      url: "/directory",
    },
    {
      id: "vnu",
      badge: "ĐHQG Việt Nam",
      name: "ĐHQG Hà Nội & ĐHQG TP. Hồ Chí Minh",
      city: "Hà Nội & TP.HCM, Việt Nam",
      desc: "Hai trung tâm đại học và nghiên cứu khoa học công nghệ đa ngành mũi nhọn hàng đầu tại Việt Nam.",
      url: "/directory",
    },
  ],
  en: [
    {
      id: "ras",
      badge: "Academy of Sciences",
      name: "Russian Academy of Sciences (RAS)",
      city: "Moscow, Russia",
      desc: "The supreme scientific organization of the Russian Federation coordinating fundamental and applied research.",
      url: "/directory",
    },
    {
      id: "msu",
      badge: "National Flagship",
      name: "Lomonosov Moscow State University (MSU)",
      city: "Moscow, Russia",
      desc: "Russia's premier university and academic powerhouse in physics, mathematics, and Oriental studies.",
      url: "/directory",
    },
    {
      id: "vnu",
      badge: "National University",
      name: "Vietnam National University (VNU)",
      city: "Hanoi & Ho Chi Minh City, Vietnam",
      desc: "Vietnam's two leading comprehensive scientific research and higher education universities.",
      url: "/directory",
    },
  ],
  ru: [
    {
      id: "ras",
      badge: "Академия наук",
      name: "Российская академия наук (РАН)",
      city: "Москва, Россия",
      desc: "Высшая научная организация РФ, координирующая фундаментальные и прикладные исследования.",
      url: "/directory",
    },
    {
      id: "msu",
      badge: "Национальный флагман",
      name: "МГУ имени М. В. Ломоносова",
      city: "Москва, Россия",
      desc: "Ведущий университет России, центр передовых естественных наук и востоковедения.",
      url: "/directory",
    },
    {
      id: "vnu",
      badge: "ВНУ Вьетнама",
      name: "Вьетнамский национальный университет (Ханой и Хошимин)",
      city: "Ханой и Хошимин, Вьетнам",
      desc: "Два ведущих национальных университета Вьетнама, партнеры академических центров РФ.",
      url: "/directory",
    },
  ],
};

const FUNDS_LIST = [
  { name: "NAFOSTED", country: "VN", url: "https://nafosted.gov.vn" },
  { name: "NATIF", country: "VN", url: "https://natif.vn" },
  { name: "VINIF", country: "VN", url: "https://vinif.org" },
  { name: "RSF (РНФ)", country: "RU", url: "https://rscf.ru/en/" },
  { name: "JINR Dubna", country: "RU/VN", url: "http://vietnam.jinr.ru" },
  { name: "Quỹ Gorchakov", country: "RU", url: "https://en.gorchakovfund.ru" },
  {
    name: "Quỹ Tổng thống PGF",
    country: "RU",
    url: "https://xn--80afcdbalict6afooklqi5m.xn--p1ai/",
  },
];

export function GuestEcosystemV2({
  isAuthenticated,
  workspaceHref,
}: Readonly<{ isAuthenticated: boolean; workspaceHref: string }>) {
  const { locale } = useLocale();
  const t = COPY[locale] ?? COPY.vi;
  const opps = OPPORTUNITIES_TEASERS[locale] ?? OPPORTUNITIES_TEASERS.vi;
  const projects = PROJECT_TEASERS[locale] ?? PROJECT_TEASERS.vi;
  const knowledge = KNOWLEDGE_TEASERS[locale] ?? KNOWLEDGE_TEASERS.vi;
  const entities = ENTITY_TEASERS[locale] ?? ENTITY_TEASERS.vi;
  const footerCopy = HOME_COPY[locale] ?? HOME_COPY.vi;

  return (
    <div className="min-h-screen bg-[#edf3f9] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      <GuestPublicNav
        active="ecosystem"
        isAuthenticated={isAuthenticated}
        workspaceHref={workspaceHref}
      />

      <main id="main-content">
        {/* ═══════════════════════════════════════════════════
            1. HERO SECTION WITH FROSTED GLASS SPLIT ARTWORK
            ═══════════════════════════════════════════════════ */}
        <section className="relative isolate min-h-[420px] overflow-hidden border-b border-blue-200/50 bg-[#eef4fb] px-4 py-12 sm:min-h-[460px] sm:px-6 sm:py-16 lg:min-h-[520px] lg:px-8 lg:py-20">
          {/* 3D Ecosystem Graphic: Desktop Only on Right Half */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] select-none lg:block xl:w-[50%]"
            aria-hidden="true"
          >
            <Image
              src="/images/ecosystem-hero-bg.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              unoptimized
              priority
              className="object-cover object-right brightness-[0.92] contrast-[0.98]"
            />
            {/* Subtle soft dark film overlay to prevent glare */}
            <div className="absolute inset-0 bg-slate-950/[0.05]" />
            {/* Left-edge smooth fade into the left text background */}
            <div className="absolute inset-y-0 left-0 w-36 bg-gradient-to-r from-[#eef4fb] via-[#eef4fb]/90 to-transparent xl:w-48" />
          </div>

          {/* Soft natural bottom gradient transition */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#edf3f9] to-transparent"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto flex min-h-[320px] w-full max-w-[1460px] flex-col justify-center">
            <div className="max-w-xl lg:max-w-[500px] xl:max-w-[560px] pl-2 sm:pl-4">
              <div className="inline-flex items-center gap-3 rounded-full bg-white/60 px-3.5 py-1.5 backdrop-blur-md border border-blue-200/60 shadow-2xs">
                <span className="size-2 rounded-full bg-blue-600 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 sm:text-sm">
                  {t.eyebrow}
                </span>
              </div>

              <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight text-[#071936] sm:text-4xl lg:text-5xl xl:text-[3.25rem] leading-[1.14]">
                {t.title}
              </h1>

              <p className="mt-4 text-base leading-relaxed text-slate-700 sm:text-lg sm:leading-8">
                {t.intro}
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            2. ACTIVE NETWORK OPPORTUNITIES (#opportunities)
            ═══════════════════════════════════════════════════ */}
        <section
          id="opportunities"
          className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-[1460px]">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-blue-200/60 pb-5 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {t.opportunitiesSection.tag}
                </span>
                <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#071936] sm:text-3xl">
                  {t.opportunitiesSection.title}
                </h2>
              </div>
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition"
              >
                <span>{t.opportunitiesSection.viewAllText}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* 3 Representative Opportunity Cards (Glassmorphism Blur) */}
            <div className="grid gap-6 md:grid-cols-3">
              {opps.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between rounded-2xl border border-white/70 bg-white/60 p-6 shadow-[0_4px_20px_-4px_rgba(0,30,80,0.05)] backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:bg-white/80 hover:shadow-md"
                >
                  <div>
                    <span className="rounded-lg bg-blue-100/70 px-2.5 py-1 text-[11px] font-bold text-blue-900">
                      {item.category}
                    </span>
                    <h3 className="mt-3 font-serif text-lg font-bold text-[#071936] leading-snug">
                      {item.title}
                    </h3>
                    <div className="mt-2 text-xs font-medium text-slate-500">
                      {item.meta}
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-200/50 pt-4">
                    <a
                      href={item.url}
                      target={
                        item.url.startsWith("http") ? "_blank" : undefined
                      }
                      rel={
                        item.url.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      <span>{t.exploreDetail}</span>
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {/* Compact Accredited Funds Badge Ribbon */}
            <div className="mt-8 rounded-2xl border border-white/70 bg-white/50 p-4 sm:p-5 backdrop-blur-md flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 shrink-0">
                🏛 {t.opportunitiesSection.fundsTag}:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {FUNDS_LIST.map((fund) => (
                  <a
                    key={fund.name}
                    href={fund.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-200/70 bg-white/60 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50/80 hover:text-blue-800 transition backdrop-blur-xs"
                  >
                    {fund.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            4. FEATURED PROJECTS (#projects)
            ═══════════════════════════════════════════════════ */}
        <section
          id="projects"
          className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 border-y border-blue-200/50 bg-[#e9f1f8]/60"
        >
          <div className="mx-auto max-w-[1460px]">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-blue-200/60 pb-5 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {t.projectsSection.tag}
                </span>
                <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#071936] sm:text-3xl">
                  {t.projectsSection.title}
                </h2>
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition"
              >
                <span>{t.projectsSection.viewAllText}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* 3 Representative Project Cards (Glassmorphism Blur) */}
            <div className="grid gap-6 md:grid-cols-3">
              {projects.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between rounded-2xl border border-white/70 bg-white/65 p-6 shadow-[0_4px_20px_-4px_rgba(0,30,80,0.05)] backdrop-blur-md transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:bg-white/85 hover:shadow-md"
                >
                  <div>
                    <span className="rounded-lg bg-blue-100/80 px-2.5 py-1 text-[11px] font-bold text-blue-900">
                      {item.category}
                    </span>
                    <h3 className="mt-3 font-serif text-lg font-bold text-[#071936] leading-snug">
                      {item.title}
                    </h3>
                    <div className="mt-1.5 text-xs font-medium text-blue-700">
                      {item.partner}
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-200/50 pt-4">
                    <Link
                      href={item.url}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      <span>{t.exploreDetail}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            5. LATEST KNOWLEDGE (#knowledge-library)
            ═══════════════════════════════════════════════════ */}
        <section
          id="knowledge-library"
          className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-[1460px]">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-blue-200/60 pb-5 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {t.librarySection.tag}
                </span>
                <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#071936] sm:text-3xl">
                  {t.librarySection.title}
                </h2>
              </div>
              <Link
                href="/knowledge"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition"
              >
                <span>{t.librarySection.viewAllText}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* 2 Representative Knowledge Publications (Glassmorphism Blur) */}
            <div className="grid gap-6 md:grid-cols-2">
              {knowledge.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between rounded-2xl border border-white/70 bg-white/60 p-6 shadow-[0_4px_20px_-4px_rgba(0,30,80,0.05)] backdrop-blur-md transition hover:border-blue-400 hover:bg-white/80"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-blue-100/80 px-2.5 py-0.5 text-[11px] font-bold text-blue-900">
                        {item.type}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {item.author}
                      </span>
                    </div>

                    <h3 className="mt-3 font-serif text-lg font-bold text-[#071936] leading-snug">
                      {item.title}
                    </h3>
                    <div className="mt-1.5 text-xs text-slate-500 font-medium">
                      {item.institution}
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-200/50 pt-4">
                    <Link
                      href={item.url}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      <span>{t.exploreDetail}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            6. EXPERTS & ORGANIZATIONS (#network-directory)
            ═══════════════════════════════════════════════════ */}
        <section
          id="network-directory"
          className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8 border-t border-blue-200/50 bg-[#e9f1f8]/60"
        >
          <div className="mx-auto max-w-[1460px]">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-blue-200/60 pb-5 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  {t.directorySection.tag}
                </span>
                <h2 className="mt-1 font-serif text-2xl font-bold tracking-tight text-[#071936] sm:text-3xl">
                  {t.directorySection.title}
                </h2>
              </div>
              <Link
                href="/directory"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-800 transition"
              >
                <span>{t.directorySection.viewAllText}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            {/* 3 Representative Institutional Partners (Glassmorphism Blur) */}
            <div className="grid gap-6 md:grid-cols-3">
              {entities.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col justify-between rounded-2xl border border-white/70 bg-white/65 p-6 shadow-[0_4px_20px_-4px_rgba(0,30,80,0.05)] backdrop-blur-md transition hover:border-blue-300 hover:bg-white/85"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-blue-100/80 px-2 py-0.5 text-[11px] font-bold text-blue-800">
                        {item.badge}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {item.city}
                      </span>
                    </div>
                    <h3 className="mt-3 font-serif text-base font-bold text-[#071936]">
                      {item.name}
                    </h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-5 border-t border-slate-200/50 pt-4">
                    <Link
                      href={item.url}
                      className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                    >
                      <span>{t.exploreDetail}</span>
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════
            7. JOIN NETWORK CTA SECTION
            ═══════════════════════════════════════════════════ */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-br from-[#071936] via-[#0c2b5e] to-blue-900 text-white">
          <div className="mx-auto max-w-[1460px] text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="font-serif text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                {t.joinCta.title}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-blue-100/90 leading-relaxed">
                {t.joinCta.desc}
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3.5">
                <Link
                  href="/register"
                  className="rounded-xl bg-blue-600 px-7 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-900/30 hover:bg-blue-500 transition duration-150"
                >
                  {t.joinCta.primaryButton}
                </Link>
                <Link
                  href="/projects"
                  className="rounded-xl border border-white/20 bg-white/10 px-7 py-3 text-xs sm:text-sm font-bold text-white hover:bg-white/20 transition duration-150"
                >
                  {t.joinCta.secondaryButton}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <GuestPublicFooter copy={footerCopy} />
    </div>
  );
}

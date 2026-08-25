"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { BrandMark } from "@/components/shared/BrandMark";
import { GuestExploreMedia } from "./GuestExploreMedia";
import { GuestPublicNav } from "./GuestPublicNav";

const HOME_COPY: Record<
  Locale,
  {
    eyebrow: string;
    title1: string;
    title2: string;
    title3: string;
    priorityLabel: string;
    subtitle: string;
    focusCards: {
      tag: string;
      title: string;
      desc: string;
    }[];
    metrics: string[];
    enterWorkspace: string;
    login: string;
    exploreCalls: string;
    onlineSystem: string;
    rightCard: {
      badge: string;
      title: string;
      items: {
        num: string;
        title: string;
        tag: string;
        desc: string;
      }[];
      cta: string;
    };
    ecosystem: {
      eyebrow: string;
      title: string;
      desc: string;
      cardCta: string;
      cards: {
        icon: string;
        title: string;
        desc: string;
        href: string;
        accent: string;
        badge: string;
        tone: string;
      }[];
    };
    events: {
      eyebrow: string;
      title: string;
      desc: string;
      viewAll: string;
      items: {
        date: string;
        month: string;
        kind: string;
        title: string;
        place: string;
        year: string;
        tone: string;
      }[];
    };
    stats: {
      val: string;
      lbl: string;
      col: string;
    }[];
    footer: {
      brandTitle: string;
      subtitle: string;
      desc: string;
      openDataBadge: string;
      navTitle: string;
      pillarsTitle: string;
      contactTitle: string;
      hanoiOffice: string;
      hanoiAddress: string;
      moscowOffice: string;
      moscowAddress: string;
      supportLabel: string;
      copyright: string;
      terms: string;
      privacy: string;
      ethics: string;
      openData: string;
      pillars: string[];
    };
  }
> = {
  vi: {
    eyebrow: "Cổng kết nối hợp tác song phương",
    title1: "Mạng lưới Tri thức",
    title2: "Khoa học – Công nghệ",
    title3: "Nga – Việt",
    priorityLabel: "Lĩnh vực ưu tiên:",
    subtitle:
      "Nền tảng kết nối trực tiếp các chuyên gia, viện nghiên cứu, trường đại học và cơ hội hợp tác KH&CN giữa Việt Nam và Liên bang Nga.",
    focusCards: [
      {
        tag: "Trọng điểm",
        title: "Đề tài 2026",
        desc: "AI, Vật liệu Nano & Biển sâu",
      },
      {
        tag: "Học thuật",
        title: "Đơn vị bảo trợ",
        desc: "Quỹ Truyền thống & Hữu nghị / VAST",
      },
      {
        tag: "Dữ liệu mở",
        title: "Cơ chế song phương",
        desc: "Đồng tài trợ đề tài & Lab dùng chung",
      },
    ],
    metrics: [
      "2 quốc gia",
      "500+ chuyên gia",
      "300+ dự án hợp tác",
      "20+ lĩnh vực",
    ],
    enterWorkspace: "Vào không gian làm việc →",
    login: "Đăng nhập →",
    exploreCalls: "Khám phá cơ hội hợp tác",
    onlineSystem: "Hệ thống trực tuyến 2026",
    rightCard: {
      badge: "Cổng thông tin Song phương",
      title:
        "Cầu nối trực tiếp giữa các viện nghiên cứu và trường đại học hàng đầu Việt Nam – Liên bang Nga.",
      items: [
        {
          num: "16",
          title: "Viện nghiên cứu & Đại học trọng điểm",
          tag: "Học thuật",
          desc: "Hợp tác trực tiếp giữa VAST, Viện Hàn lâm Khoa học Nga (RAS), ĐHQG Hà Nội, Bách Khoa và MISIS.",
        },
        {
          num: "500+",
          title: "Chuyên gia khoa học song phương",
          tag: "Chuyên gia",
          desc: "Đội ngũ giáo sư và nhà khoa học sẵn sàng kết nối, phản biện độc lập và đồng chủ trì đề tài.",
        },
        {
          num: "14",
          title: "Hướng nghiên cứu trọng điểm năm 2026",
          tag: "Nghiên cứu",
          desc: "Ưu tiên các lĩnh vực AI, Khoa học Biển, Vật liệu Nano, Năng lượng mới và Chuyển giao công nghệ.",
        },
      ],
      cta: "Khám phá cơ hội hợp tác ngay →",
    },
    ecosystem: {
      eyebrow: "Hệ sinh thái mạng lưới",
      title: "Khám phá hệ sinh thái của chúng tôi",
      desc: "Không gian tích hợp toàn diện các trụ cột tri thức, mạng lưới chuyên gia, chương trình đề tài và dữ liệu mở song phương.",
      cardCta: "Khám phá →",
      cards: [
        {
          icon: "↔",
          title: "Cơ hội hợp tác",
          desc: "Tìm kiếm và đề xuất các cơ hội hợp tác nghiên cứu, chuyển giao và đồng phát triển.",
          href: "/opportunities",
          accent: "bg-blue-600 text-white shadow-blue-500/20",
          badge: "Bilateral Calls",
          tone: "border-blue-200/90 hover:border-blue-400",
        },
        {
          icon: "◎",
          title: "Chuyên gia & Tổ chức",
          desc: "Kết nối với chuyên gia và tổ chức khoa học phù hợp theo lĩnh vực và năng lực.",
          href: "/experts",
          accent: "bg-indigo-600 text-white shadow-indigo-500/20",
          badge: "Verified Experts",
          tone: "border-indigo-200/90 hover:border-indigo-400",
        },
        {
          icon: "◈",
          title: "Dự án & Kết quả",
          desc: "Theo dõi các hướng nghiên cứu song phương, kết quả và mốc triển khai nổi bật.",
          href: "/opportunities",
          accent: "bg-emerald-600 text-white shadow-emerald-500/20",
          badge: "Joint Projects",
          tone: "border-emerald-200/90 hover:border-emerald-400",
        },
        {
          icon: "□",
          title: "Tri thức & Tài liệu",
          desc: "Khám phá kho tri thức, công bố và tài liệu nghiên cứu dùng chung trong mạng lưới.",
          href: "/knowledge",
          accent: "bg-amber-600 text-white shadow-amber-500/20",
          badge: "Open Science",
          tone: "border-amber-200/90 hover:border-amber-400",
        },
      ],
    },
    events: {
      eyebrow: "Sự kiện & Hội thảo",
      title: "Sự kiện nổi bật",
      desc: "Các diễn đàn học thuật, hội nghị khoa học và chương trình đào tạo phối hợp giữa hai nước.",
      viewAll: "Xem tất cả sự kiện →",
      items: [
        {
          date: "25",
          month: "THG 8",
          kind: "HỘI THẢO",
          title: "Hội thảo Khoa học & Công nghệ Nga – Việt 2026",
          place: "Hà Nội, Việt Nam",
          year: "Năm 2026",
          tone: "from-blue-700 via-blue-500 to-cyan-300",
        },
        {
          date: "10",
          month: "THG 9",
          kind: "HỘI NGHỊ",
          title: "Diễn đàn Hợp tác Đổi mới sáng tạo Việt Nam – Liên bang Nga",
          place: "TP. Hồ Chí Minh, Việt Nam",
          year: "Năm 2026",
          tone: "from-sky-700 via-blue-500 to-indigo-300",
        },
        {
          date: "18",
          month: "THG 9",
          kind: "ĐÀO TẠO",
          title: "Khóa đào tạo AI & Robotics ứng dụng trong nghiên cứu",
          place: "Online",
          year: "Năm 2026",
          tone: "from-indigo-700 via-blue-600 to-sky-300",
        },
      ],
    },
    stats: [
      { val: "500+", lbl: "Chuyên gia", col: "from-blue-600 to-indigo-600" },
      {
        val: "300+",
        lbl: "Dự án hợp tác",
        col: "from-emerald-600 to-teal-600",
      },
      {
        val: "20+",
        lbl: "Lĩnh vực trọng điểm",
        col: "from-purple-600 to-pink-600",
      },
      {
        val: "50+",
        lbl: "Tổ chức đối tác",
        col: "from-amber-600 to-orange-600",
      },
    ],
    footer: {
      brandTitle: "Mạng lưới Tri thức KH&CN",
      subtitle: "Nga – Việt",
      desc: "Cổng thông tin & điều phối hợp tác khoa học công nghệ độc lập giữa các viện nghiên cứu, trường đại học trọng điểm của Việt Nam và Liên bang Nga.",
      openDataBadge: "Cổng dữ liệu mở KH&CN 2026",
      navTitle: "Khám phá hệ sinh thái",
      pillarsTitle: "Hướng trọng điểm",
      contactTitle: "Điều phối & Liên hệ",
      hanoiOffice: "Văn phòng Điều phối Hà Nội:",
      hanoiAddress:
        "Viện Hàn lâm KH&CN Việt Nam (VAST), 18 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
      moscowOffice: "Quỹ Truyền thống và Hữu nghị:",
      moscowAddress:
        "125047, Moskva, Đường Tverskaya-Yamskaya số 1, Tòa nhà 30, Văn phòng 01B, Liên bang Nga",
      supportLabel: "Hỗ trợ kỹ thuật & kết nối đề tài:",
      copyright:
        "© 2026 Mạng lưới Tri thức Khoa học – Công nghệ Nga – Việt. Bảo lưu mọi quyền.",
      terms: "Điều khoản hợp tác",
      privacy: "Chính sách bảo mật",
      ethics: "Chuẩn mực đạo đức nghiên cứu",
      openData: "Dữ liệu mở song phương",
      pillars: [
        "Trí tuệ nhân tạo & Dữ liệu",
        "Khoa học Biển & Hải dương",
        "Vật liệu mới & Nano",
        "Năng lượng sạch & Nguyên tử",
        "Công nghệ sinh học biển",
      ],
    },
  },
  ru: {
    eyebrow: "Портал двустороннего научно-технологического сотрудничества",
    title1: "Интеллектуальная сеть",
    title2: "Наука и технологии",
    title3: "Россия – Вьетнам",
    priorityLabel: "Приоритетные направления:",
    subtitle:
      "Платформа прямого взаимодействия ведущих ученых, исследовательских институтов, университетов и научно-технологических проектов Вьетнама и Российской Федерации.",
    focusCards: [
      {
        tag: "Приоритет",
        title: "Проекты 2026",
        desc: "ИИ, наноматериалы и глубоководные исследования",
      },
      {
        tag: "Академия",
        title: "Организаторы",
        desc: "Фонд «Традиции и дружба» / ВАНТ",
      },
      {
        tag: "Открытые данные",
        title: "Двусторонний механизм",
        desc: "Совместные гранты и общие лаборатории",
      },
    ],
    metrics: [
      "2 страны",
      "500+ экспертов",
      "300+ совместных проектов",
      "20+ направлений",
    ],
    enterWorkspace: "В рабочее пространство →",
    login: "Войти →",
    exploreCalls: "Смотреть возможности сотрудничества",
    onlineSystem: "Система онлайн 2026",
    rightCard: {
      badge: "Двусторонний портал",
      title:
        "Прямой мост между ведущими институтами и университетами Вьетнама и Российской Федерации.",
      items: [
        {
          num: "16",
          title: "Ключевые институты и университеты",
          tag: "Академия",
          desc: "Прямое партнерство ВАНТ, РАН, ВНУ Ханой, ХПИ и НИТУ МИСИС.",
        },
        {
          num: "500+",
          title: "Двустороннее научное сообщество",
          tag: "Эксперты",
          desc: "Профессора и ученые, готовые к рецензированию, независимой экспертизе и руководству проектами.",
        },
        {
          num: "14",
          title: "Приоритетные направления 2026",
          tag: "Исследования",
          desc: "Фокус на ИИ, морских науках, наноматериалах, чистой энергетике и трансфере технологий.",
        },
      ],
      cta: "Узнать о возможностях сотрудничества →",
    },
    ecosystem: {
      eyebrow: "Экосистема сети",
      title: "Изучите нашу экосистему",
      desc: "Единое пространство академических знаний, экспертной сети, целевых программ и открытых научных данных.",
      cardCta: "Подробнее →",
      cards: [
        {
          icon: "↔",
          title: "Сотрудничество",
          desc: "Поиск и подача совместных заявок на гранты, исследования и трансфер технологий.",
          href: "/opportunities",
          accent: "bg-blue-600 text-white shadow-blue-500/20",
          badge: "Bilateral Calls",
          tone: "border-blue-200/90 hover:border-blue-400",
        },
        {
          icon: "◎",
          title: "Эксперты и организации",
          desc: "Прямой контакт с учеными, лабораториями и исследовательскими центрами по компетенциям.",
          href: "/experts",
          accent: "bg-indigo-600 text-white shadow-indigo-500/20",
          badge: "Verified Experts",
          tone: "border-indigo-200/90 hover:border-indigo-400",
        },
        {
          icon: "◈",
          title: "Проекты и результаты",
          desc: "Мониторинг совместных проектов, публикаций и результатов внедрения.",
          href: "/opportunities",
          accent: "bg-emerald-600 text-white shadow-emerald-500/20",
          badge: "Joint Projects",
          tone: "border-emerald-200/90 hover:border-emerald-400",
        },
        {
          icon: "□",
          title: "База знаний и публикации",
          desc: "Открытый доступ к публикациям, отчетам и совместным научным ресурсам сети.",
          href: "/knowledge",
          accent: "bg-amber-600 text-white shadow-amber-500/20",
          badge: "Open Science",
          tone: "border-amber-200/90 hover:border-amber-400",
        },
      ],
    },
    events: {
      eyebrow: "События и семинары",
      title: "Ключевые события",
      desc: "Академические форумы, научные конференции и программы стажировок Россия – Вьетнам.",
      viewAll: "Все события →",
      items: [
        {
          date: "25",
          month: "АВГ",
          kind: "СЕМИНАР",
          title: "Научно-технологический семинар Россия – Вьетнам 2026",
          place: "Ханой, Вьетнам",
          year: "2026 год",
          tone: "from-blue-700 via-blue-500 to-cyan-300",
        },
        {
          date: "10",
          month: "СЕН",
          kind: "ФОРУМ",
          title: "Форум инновационного сотрудничества Вьетнам – Россия",
          place: "Хошимин, Вьетнам",
          year: "2026 год",
          tone: "from-sky-700 via-blue-500 to-indigo-300",
        },
        {
          date: "18",
          month: "СЕН",
          kind: "КУРС",
          title: "Курс по применению ИИ и робототехники в исследованиях",
          place: "Онлайн",
          year: "2026 год",
          tone: "from-indigo-700 via-blue-600 to-sky-300",
        },
      ],
    },
    stats: [
      { val: "500+", lbl: "Экспертов", col: "from-blue-600 to-indigo-600" },
      {
        val: "300+",
        lbl: "Совместных проектов",
        col: "from-emerald-600 to-teal-600",
      },
      { val: "20+", lbl: "Направлений", col: "from-purple-600 to-pink-600" },
      { val: "50+", lbl: "Организаций", col: "from-amber-600 to-orange-600" },
    ],
    footer: {
      brandTitle: "РОССИЙСКО-ВЬЕТНАМСКАЯ ИНТЕЛЛЕКТУАЛЬНАЯ СЕТЬ",
      subtitle: "Россия – Вьетнам",
      desc: "Независимый портал координации научно-технологического сотрудничества между ведущими институтами и университетами Вьетнама и Российской Федерации.",
      openDataBadge: "Портал открытых данных НТИ 2026",
      navTitle: "Экосистема сети",
      pillarsTitle: "Ключевые направления",
      contactTitle: "Координация и контакты",
      hanoiOffice: "Координационный офис в Ханое:",
      hanoiAddress:
        "Вьетнамская академия наук и технологий (ВАНТ), ул. Хоанг Куок Вьет, 18, Ханой",
      moscowOffice: "Фонд «Традиции и дружба»:",
      moscowAddress:
        "125047, Москва, 1-я Тверская-Ямская улица, д.30, к. 01Б, Российская Федерация",
      supportLabel: "Техническая поддержка и сотрудничество:",
      copyright:
        "© 2026 Российско-вьетнамская интеллектуальная сеть. Все права защищены.",
      terms: "Условия сотрудничества",
      privacy: "Политика конфиденциальности",
      ethics: "Научная этика",
      openData: "Открытые данные",
      pillars: [
        "Искусственный интеллект и Big Data",
        "Морские науки и океанология",
        "Новые наноматериалы",
        "Чистая энергетика и атом",
        "Морские биотехнологии",
      ],
    },
  },
  en: {
    eyebrow: "Bilateral S&T Collaboration Portal",
    title1: "Knowledge Network",
    title2: "Science & Technology",
    title3: "Russia – Vietnam",
    priorityLabel: "Priority Areas:",
    subtitle:
      "Direct collaboration platform connecting leading experts, research institutes, universities, and S&T initiatives between Vietnam and the Russian Federation.",
    focusCards: [
      {
        tag: "Priority",
        title: "Calls 2026",
        desc: "AI, Nanomaterials & Deep Sea",
      },
      {
        tag: "Academic",
        title: "Sponsors",
        desc: "Traditions & Friendship Foundation / VAST",
      },
      {
        tag: "Open Data",
        title: "Bilateral Mode",
        desc: "Joint Grants & Shared Research Labs",
      },
    ],
    metrics: [
      "2 nations",
      "500+ verified experts",
      "300+ joint projects",
      "20+ priority fields",
    ],
    enterWorkspace: "Enter Workspace →",
    login: "Sign in →",
    exploreCalls: "Explore Opportunities",
    onlineSystem: "Online System 2026",
    rightCard: {
      badge: "Bilateral Portal",
      title:
        "Direct bridge between leading research institutes and top universities of Vietnam and Russia.",
      items: [
        {
          num: "16",
          title: "Key Research Institutes & Universities",
          tag: "Academic",
          desc: "Direct partnership between VAST, Russian Academy of Sciences (RAS), VNU Hanoi, HUST, and NUST MISIS.",
        },
        {
          num: "500+",
          title: "Bilateral Scientific Community",
          tag: "Experts",
          desc: "Professors and researchers ready for peer review, independent appraisal, and joint leadership.",
        },
        {
          num: "14",
          title: "Strategic Research Pillars 2026",
          tag: "Research",
          desc: "Focusing on AI, Marine Sciences, Nanomaterials, Clean Energy, and Technology Transfer.",
        },
      ],
      cta: "Explore Opportunities Now →",
    },
    ecosystem: {
      eyebrow: "Network Ecosystem",
      title: "Explore Our Ecosystem",
      desc: "Comprehensive platform integrating knowledge assets, expert networks, joint research calls, and open bilateral data.",
      cardCta: "Explore →",
      cards: [
        {
          icon: "↔",
          title: "Collaboration",
          desc: "Discover and propose joint research, commercialization, and bilateral R&D projects.",
          href: "/opportunities",
          accent: "bg-blue-600 text-white shadow-blue-500/20",
          badge: "Bilateral Calls",
          tone: "border-blue-200/90 hover:border-blue-400",
        },
        {
          icon: "◎",
          title: "Experts & Organizations",
          desc: "Connect directly with qualified researchers and institutes matching your domain and competencies.",
          href: "/experts",
          accent: "bg-indigo-600 text-white shadow-indigo-500/20",
          badge: "Verified Experts",
          tone: "border-indigo-200/90 hover:border-indigo-400",
        },
        {
          icon: "◈",
          title: "Projects & Outcomes",
          desc: "Track active bilateral research, milestones, publications, and commercial outcomes.",
          href: "/opportunities",
          accent: "bg-emerald-600 text-white shadow-emerald-500/20",
          badge: "Joint Projects",
          tone: "border-emerald-200/90 hover:border-emerald-400",
        },
        {
          icon: "□",
          title: "Knowledge & Papers",
          desc: "Access shared scientific publications, technical reports, and open bilateral repositories.",
          href: "/knowledge",
          accent: "bg-amber-600 text-white shadow-amber-500/20",
          badge: "Open Science",
          tone: "border-amber-200/90 hover:border-amber-400",
        },
      ],
    },
    events: {
      eyebrow: "Events & Conferences",
      title: "Featured Events",
      desc: "Academic forums, scientific summits, and joint training programs between Russia and Vietnam.",
      viewAll: "View All Events →",
      items: [
        {
          date: "25",
          month: "AUG",
          kind: "WORKSHOP",
          title: "Russia – Vietnam Science & Technology Workshop 2026",
          place: "Hanoi, Vietnam",
          year: "2026",
          tone: "from-blue-700 via-blue-500 to-cyan-300",
        },
        {
          date: "10",
          month: "SEP",
          kind: "SUMMIT",
          title: "Vietnam – Russian Federation Innovation Summit",
          place: "Ho Chi Minh City, Vietnam",
          year: "2026",
          tone: "from-sky-700 via-blue-500 to-indigo-300",
        },
        {
          date: "18",
          month: "SEP",
          kind: "TRAINING",
          title: "AI & Robotics in Scientific Research Training Program",
          place: "Online",
          year: "2026",
          tone: "from-indigo-700 via-blue-600 to-sky-300",
        },
      ],
    },
    stats: [
      {
        val: "500+",
        lbl: "Verified Experts",
        col: "from-blue-600 to-indigo-600",
      },
      {
        val: "300+",
        lbl: "Joint Projects",
        col: "from-emerald-600 to-teal-600",
      },
      {
        val: "20+",
        lbl: "Strategic Pillars",
        col: "from-purple-600 to-pink-600",
      },
      {
        val: "50+",
        lbl: "Partner Institutions",
        col: "from-amber-600 to-orange-600",
      },
    ],
    footer: {
      brandTitle: "S&T Knowledge Network",
      subtitle: "Russia – Vietnam",
      desc: "Independent portal for coordinating science and technology cooperation between leading institutes and universities of Vietnam and the Russian Federation.",
      openDataBadge: "Open S&T Data Portal 2026",
      navTitle: "Explore Ecosystem",
      pillarsTitle: "Strategic Focus",
      contactTitle: "Coordination & Contacts",
      hanoiOffice: "Hanoi Coordination Office:",
      hanoiAddress:
        "Vietnam Academy of Science and Technology (VAST), 18 Hoang Quoc Viet, Cau Giay, Hanoi",
      moscowOffice: "Traditions & Friendship Foundation:",
      moscowAddress:
        "125047, Moscow, 1st Tverskaya-Yamskaya St., Bldg 30, Office 01B, Russian Federation",
      supportLabel: "Technical Support & Inquiries:",
      copyright:
        "© 2026 Russia – Vietnam Science & Technology Knowledge Network. All rights reserved.",
      terms: "Terms of Collaboration",
      privacy: "Privacy Policy",
      ethics: "Research Ethics",
      openData: "Open Bilateral Data",
      pillars: [
        "Artificial Intelligence & Data",
        "Marine Sciences & Ocean",
        "Advanced Nanomaterials",
        "Clean & Nuclear Energy",
        "Marine Biotechnology",
      ],
    },
  },
};

const PRIMARY_DISCIPLINE: Record<Locale, string> = {
  vi: "Khoa học",
  ru: "Наука",
  en: "Science",
};

export function GuestHomeV2({
  isAuthenticated,
  workspaceHref,
}: Readonly<{ isAuthenticated: boolean; workspaceHref: string }>) {
  const { locale } = useLocale();
  const t = HOME_COPY[locale] ?? HOME_COPY.vi;

  return (
    <div className="min-h-screen bg-[#ebf4ff] text-slate-950 font-sans">
      <GuestPublicNav
        active="home"
        isAuthenticated={isAuthenticated}
        workspaceHref={workspaceHref}
      />

      <main>
        <section className="relative isolate min-h-[620px] overflow-hidden border-b border-sky-300/60 bg-[#b9d8eb] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <Image
            src="/brand/vnru-network-banner-2026.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="pointer-events-none -z-20 object-cover object-[68%_center] brightness-[0.95] saturate-[0.96] contrast-[0.96]"
          />
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(211,232,246,.94)_0%,rgba(180,216,238,.82)_56%,rgba(147,198,230,.68)_100%)] sm:bg-[linear-gradient(90deg,rgba(216,235,248,.94)_0%,rgba(190,220,240,.82)_44%,rgba(139,195,229,.38)_72%,rgba(76,157,211,.08)_100%)] lg:bg-[linear-gradient(90deg,rgba(216,235,248,.94)_0%,rgba(190,220,240,.82)_31%,rgba(139,195,229,.38)_48%,rgba(76,157,211,.08)_62%,rgba(48,126,186,0)_72%)]"
            aria-hidden="true"
          />

          <div className="mx-auto flex min-h-[492px] max-w-[1280px] items-center">
            <div className="w-full max-w-[760px]">
              <div className="flex items-center gap-3 text-sm font-semibold text-[#174F82] sm:text-base">
                <span className="h-px w-9 bg-[#E25555]" aria-hidden="true" />
                <span>{t.eyebrow}</span>
              </div>

              <h1 className="mt-7 overflow-visible py-1 font-serif text-[40px] font-bold leading-[1.16] tracking-[-0.025em] text-[#0B2742] sm:text-[50px] lg:text-[58px] xl:text-[62px]">
                <span className="block">{t.title1}</span>
                <span className="mt-1 block pb-1.5 text-[#1769B0]">
                  {t.title2}
                </span>
                <span className="mt-1 block text-[#0B2742]">{t.title3}</span>
              </h1>

              <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-l-2 border-[#E25555] pl-4 text-base sm:text-lg">
                <span className="font-semibold text-[#405a73]">
                  {t.priorityLabel}
                </span>
                <strong className="font-bold text-[#174a8b]">
                  {PRIMARY_DISCIPLINE[locale]}
                </strong>
              </div>

              <p className="mt-7 max-w-[680px] text-base font-medium leading-[1.65] text-[#17324f] sm:text-lg lg:text-[19px]">
                {t.subtitle}
              </p>
            </div>
          </div>
        </section>

        <GuestExploreMedia />

        <section id="about" className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px] rounded-[32px] border border-blue-200/90 bg-gradient-to-b from-blue-100/70 via-sky-50/80 to-blue-50/60 p-6 shadow-[0_22px_70px_-40px_rgba(37,99,235,.28)] sm:p-9">
            <div className="flex items-end justify-between gap-4">
              <div className="max-w-3xl">
                <p className="text-xs sm:text-[13px] font-black uppercase tracking-[0.14em] text-blue-700">
                  {t.ecosystem.eyebrow}
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-slate-950">
                  {t.ecosystem.title}
                </h2>
                <p className="mt-3 text-lg sm:text-xl md:text-[20px] font-normal leading-relaxed text-slate-700">
                  {t.ecosystem.desc}
                </p>
              </div>
              <div className="hidden gap-2.5 sm:flex">
                <button
                  type="button"
                  className="grid size-9 place-items-center rounded-full border border-blue-200 bg-white/90 text-lg font-bold text-blue-700 shadow-xs transition hover:bg-white"
                  aria-label="Trang trước"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="grid size-9 place-items-center rounded-full border border-blue-200 bg-white/90 text-lg font-bold text-blue-700 shadow-xs transition hover:bg-white"
                  aria-label="Trang sau"
                >
                  ›
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {t.ecosystem.cards.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group block h-full rounded-2xl border ${item.tone} bg-white/90 p-6 shadow-[0_14px_35px_-30px_rgba(37,99,235,.35)] transition duration-300 hover:-translate-y-1.5 hover:bg-white hover:shadow-[0_20px_45px_-28px_rgba(37,99,235,.5)]`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`grid size-12 place-items-center rounded-xl ${item.accent} text-2xl font-black shadow-sm`}
                    >
                      {item.icon}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg sm:text-xl font-bold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-base sm:text-[17px] leading-relaxed text-slate-700 font-normal">
                    {item.desc}
                  </p>
                  <span className="mt-5 inline-flex text-sm sm:text-base font-extrabold text-blue-600 transition group-hover:translate-x-1">
                    {t.ecosystem.cardCta}
                  </span>
                </Link>
              ))}
            </div>

            <div
              id="events"
              className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"
            >
              <div>
                <p className="text-xs sm:text-[13px] font-black uppercase tracking-[0.14em] text-blue-700">
                  {t.events.eyebrow}
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
                  {t.events.title}
                </h2>
                <p className="mt-2 text-lg sm:text-xl font-normal leading-relaxed text-slate-700">
                  {t.events.desc}
                </p>
              </div>
              <Link
                href="/#events"
                className="text-sm sm:text-base font-bold text-blue-700 transition hover:text-blue-900"
              >
                {t.events.viewAll}
              </Link>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {t.events.items.map((event) => (
                <article
                  key={event.title}
                  className="overflow-hidden rounded-2xl border border-blue-200/80 bg-white/95 shadow-[0_14px_38px_-30px_rgba(37,99,235,.35)] transition duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div
                    className={`relative h-32 bg-gradient-to-br ${event.tone}`}
                  >
                    <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_30%,white_0_2px,transparent_3px),radial-gradient(circle_at_70%_60%,white_0_1px,transparent_2px)] [background-size:34px_34px]" />
                    <div className="absolute left-4 top-4 rounded-xl bg-white px-3 py-2 text-center shadow-xs">
                      <strong className="block text-xl sm:text-2xl font-black leading-none text-blue-700">
                        {event.date}
                      </strong>
                      <small className="mt-1 block text-[9px] sm:text-[10px] font-bold uppercase text-slate-500">
                        {event.month}
                      </small>
                    </div>
                    <span className="absolute bottom-3 left-4 rounded-full bg-blue-700/90 px-3 py-1 text-[9px] sm:text-[10px] font-black tracking-wider text-white">
                      {event.kind}
                    </span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold leading-snug text-slate-950">
                      {event.title}
                    </h3>
                    <p className="mt-3 text-base font-medium text-slate-700">
                      ◎ {event.place}
                    </p>
                    <p className="mt-1.5 text-sm font-medium text-slate-500">
                      ◷ {event.year}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-8 grid gap-4 rounded-2xl border border-blue-200/90 bg-blue-100/70 p-5 sm:grid-cols-2 xl:grid-cols-4">
              {t.stats.map(({ val, lbl, col }) => (
                <div
                  key={lbl}
                  className="flex items-center gap-3.5 rounded-xl bg-white/95 p-4.5 shadow-xs transition hover:shadow-sm"
                >
                  <span
                    className={`grid size-12 place-items-center rounded-xl bg-gradient-to-br ${col} text-xl font-black text-white shadow-xs`}
                  >
                    ✓
                  </span>
                  <span>
                    <strong className="block text-2xl sm:text-3xl font-black text-slate-950">
                      {val}
                    </strong>
                    <small className="text-base font-semibold text-[#405a73]">
                      {lbl}
                    </small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer
        id="news"
        className="border-t border-blue-200/90 bg-[#e3eefc] pt-14 pb-10 text-slate-700"
      >
        <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Link
                href="/"
                className="inline-flex items-center gap-3.5"
                aria-label="Mạng lưới Tri thức Khoa học - Công nghệ Nga - Việt"
              >
                <BrandMark className="size-11 shadow-xs" />
                <span>
                  <strong className="block text-base sm:text-lg font-black tracking-tight text-slate-950">
                    {t.footer.brandTitle}
                  </strong>
                  <small className="block text-xs font-extrabold tracking-wider text-slate-600 uppercase">
                    {t.footer.subtitle}
                  </small>
                </span>
              </Link>
              <p className="mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-slate-600">
                {t.footer.desc}
              </p>
              <div className="mt-5 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white/90 px-3 py-1 text-xs font-bold text-blue-800 shadow-xs">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  {t.footer.openDataBadge}
                </span>
              </div>
            </div>

            <div className="lg:col-span-3">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-950">
                {t.footer.navTitle}
              </h4>
              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-semibold text-slate-600">
                <li>
                  <Link
                    href="/opportunities"
                    className="transition hover:text-blue-700 hover:underline"
                  >
                    {t.ecosystem.cards[0].title}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/experts"
                    className="transition hover:text-blue-700 hover:underline"
                  >
                    {t.ecosystem.cards[1].title}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/knowledge"
                    className="transition hover:text-blue-700 hover:underline"
                  >
                    {t.ecosystem.cards[3].title}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#about"
                    className="transition hover:text-blue-700 hover:underline"
                  >
                    {t.ecosystem.title}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#events"
                    className="transition hover:text-blue-700 hover:underline"
                  >
                    {t.events.title}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-2">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-950">
                {t.footer.pillarsTitle}
              </h4>
              <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-semibold text-slate-600">
                {t.footer.pillars.map((pillar) => (
                  <li key={pillar}>
                    <span className="text-slate-700">{pillar}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3">
              <h4 className="text-sm font-black uppercase tracking-wider text-slate-950">
                {t.footer.contactTitle}
              </h4>
              <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-600">
                <div>
                  <strong className="block font-bold text-slate-900">
                    {t.footer.hanoiOffice}
                  </strong>
                  <span>{t.footer.hanoiAddress}</span>
                </div>
                <div>
                  <strong className="block font-bold text-slate-900">
                    {t.footer.moscowOffice}
                  </strong>
                  <span>{t.footer.moscowAddress}</span>
                </div>
                <div className="pt-1">
                  <span className="block font-medium">
                    {t.footer.supportLabel}
                  </span>
                  <a
                    href="mailto:info@fonddruzhba.ru"
                    className="font-bold text-blue-700 transition hover:underline"
                  >
                    info@fonddruzhba.ru
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-blue-200/80 pt-8 text-xs sm:text-sm font-medium text-slate-600 md:flex-row">
            <p>{t.footer.copyright}</p>
            <div className="flex flex-wrap gap-5 font-semibold text-slate-600">
              <Link href="/#about" className="hover:text-blue-700">
                {t.footer.terms}
              </Link>
              <Link href="/#about" className="hover:text-blue-700">
                {t.footer.privacy}
              </Link>
              <Link href="/#about" className="hover:text-blue-700">
                {t.footer.ethics}
              </Link>
              <Link href="/#about" className="hover:text-blue-700">
                {t.footer.openData}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

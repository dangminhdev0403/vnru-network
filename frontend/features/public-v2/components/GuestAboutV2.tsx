"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { HOME_COPY } from "./GuestHomeV2";
import { GuestPublicFooter } from "./GuestPublicFooter";
import { GuestPublicNav } from "./GuestPublicNav";
import { Reveal } from "@/components/shared/Reveal";

type AboutSection = {
  title: string;
  intro?: string;
  items: string[];
};

const BOARD_MEMBERS = [
  {
    name: "Nguyễn Quốc Hùng",
    image: "/images/board/nguyen-quoc-hung.webp",
    contacts: [
      { label: "Điện thoại", href: "tel:+79856905856", icon: "phone" },
      {
        label: "Telegram",
        href: "https://t.me/+79856905856",
        icon: "telegram",
      },
    ],
  },
  {
    name: "Trần Đức Tùng",
    image: "/images/board/tran-duc-tung.webp",
    contacts: [
      { label: "Điện thoại", href: "tel:+79996676240", icon: "phone" },
      {
        label: "Telegram",
        href: "https://t.me/+79996676240",
        icon: "telegram",
      },
      {
        label: "WhatsApp",
        href: "https://wa.me/79996676240",
        icon: "whatsapp",
      },
    ],
  },
] as const;

const PARTNER_COPY: Record<Locale, { title: string; ru: string; vi: string }> =
  {
    vi: {
      title: "Các đối tác mong muốn tham gia Mạng lưới",
      ru: "Về phía Nga",
      vi: "Về phía Việt Nam",
    },
    en: {
      title: "Partners Wishing to Join the Network",
      ru: "Russian Partners",
      vi: "Vietnamese Partners",
    },
    ru: {
      title: "Партнёры, желающие вступить в Сеть",
      ru: "С российской стороны",
      vi: "С вьетнамской стороны",
    },
  };

const PARTNERS = [
  // ══════════════════ VỀ PHÍA NGA (12 ĐỐI TÁC ACTIVE) ══════════════════
  {
    name: "Tổ chức tư vấn khoa học giáo dục Kolaboratoria (Колаборатория / Co-laboratoria)",
    shortName: "Co-laboratoria",
    logo: "co-laboratoria",
    url: "https://co-laboratoria.ru/",
    country: "ru",
  },
  {
    name: "Đại học công nghệ quản lý và kinh tế Saint Petersburg (СПбУТУиЭ)",
    shortName: "СПбУТУиЭ",
    logo: "spbume",
    url: "https://www.spbume.ru/",
    country: "ru",
  },
  {
    name: "Đại học Viễn thông Quốc gia Saint Petersburg mang tên MA Bonch-Bruevich (СПбГУТ)",
    shortName: "СПбГУТ",
    logo: "sut",
    url: "https://www.sut.ru/",
    country: "ru",
  },
  {
    name: "Đại học kỹ thuật điện quốc gia Saint Petersburg (ЛЭТИ - СПбГЭТУ)",
    shortName: "ЛЭТИ",
    logo: "leti",
    url: "https://etu.ru/",
    country: "ru",
  },
  {
    name: "Đại học kinh tế Nga Plekhanov (РЭУ им. Г.В. Пleханова)",
    shortName: "РЭУ им. Г.В. Плеханова",
    logo: "plekhanov",
    url: "https://рэу.рф/",
    country: "ru",
  },
  {
    name: "Đại học quốc gia Saint Petersburg (СПбГУ)",
    shortName: "СПбГУ",
    logo: "spbu",
    url: "https://spbu.ru/",
    country: "ru",
  },
  {
    name: "Đại học bách khoa Perm (Пермский Политех - ПНИПУ)",
    shortName: "Пермский Политех",
    logo: "perm-polytech",
    url: "https://pstu.ru/",
    country: "ru",
  },
  {
    name: "Đại học nhân văn quốc gia Nga (РГГУ)",
    shortName: "РГГУ",
    logo: "rsuh",
    url: "https://www.rsuh.ru/",
    country: "ru",
  },
  {
    name: "Đại học sư phạm quốc gia Nga mang tên Herzen (РГПУ им. А. И. Герцена)",
    shortName: "РГПУ им. А. И. Герцена",
    logo: "herzen",
    url: "https://www.herzen.spb.ru/",
    country: "ru",
  },
  {
    name: "Đại học khí tượng thủy văn Saint Petersburg (РГГМУ)",
    shortName: "РГГМУ",
    logo: "rshu",
    url: "https://www.rshu.ru/",
    country: "ru",
  },
  {
    name: "Trường kinh tế Moskva, Đại học quốc gia Moskva (МШЭ МГУ)",
    shortName: "МШЭ МГУ",
    logo: "mse-msu",
    url: "https://mse-msu.ru/",
    country: "ru",
  },
  {
    name: "Đại học kinh tế quốc gia Saint Petersburg (СПбГЭУ)",
    shortName: "СПбГЭУ",
    logo: "unecon",
    url: "https://unecon.ru/",
    country: "ru",
  },

  // ══════════════════ VỀ PHÍA VIỆT NAM (3 ĐỐI TÁC ACTIVE) ══════════════════
  {
    name: "Đại học Quốc gia Hà Nội",
    shortName: "VNU",
    logo: "vnu",
    url: "http://vnu.edu.vn/",
    country: "vi",
  },
  {
    name: "Học viện Công nghệ Bưu chính Viễn thông",
    shortName: "PTIT",
    logo: "ptit",
    url: "https://ptit.edu.vn/",
    country: "vi",
  },
  {
    name: "Đại học Kinh tế - Kỹ thuật Công nghiệp",
    shortName: "UNETI",
    logo: "uneti",
    url: "https://uneti.edu.vn/",
    country: "vi",
  },

  // ══════════════════ ĐỐI TÁC TẠM ẨN (PRESERVED / COMMENTED OUT) ══════════════════
  /*
  {
    name: "Học viện Tổng thống, khu vực Tây Bắc (Северо-Западный институт управления РАНХиГС)",
    shortName: "СЗИУ РАНХиГС",
    logo: "ranepa-northwest",
    url: "https://sziu.ranepa.ru/",
    country: "ru",
  },
  {
    name: "Московский Политех",
    logo: "mospolytech",
    url: "https://mospolytech.ru/",
    country: "ru",
  },
  {
    name: "ЦЭМИ РАН",
    logo: "cemi-ran",
    url: "https://www.cemi.rssi.ru/",
    country: "ru",
  },

  {
    name: "ИЭ РАН",
    logo: "inecon-ran",
    url: "https://inecon.org/",
    country: "ru",
  },
  {
    name: "Финуниверситет",
    logo: "financial-university",
    url: "https://www.fa.ru/",
    country: "ru",
  },
  {
    name: "РУДН",
    logo: "rudn",
    url: "https://www.rudn.ru/",
    country: "ru",
  },
  {
    name: "РУТ МИИТ",
    logo: "rut-miit",
    url: "https://rut-miit.ru/",
    country: "ru",
  },
  {
    name: "ИГХТУ",
    logo: "isuct",
    url: "https://www.isuct.ru/",
    country: "ru",
  },
  {
    name: "УрГЭУ",
    logo: "usue",
    url: "https://www.usue.ru/",
    country: "ru",
  },
  {
    name: "МПГУ",
    logo: "mpgu",
    url: "https://mpgu.su/",
    country: "ru",
  },
  {
    name: "МГЛУ",
    logo: "mslu",
    url: "https://linguanet.ru/",
    country: "ru",
  },

  */
] as const;

type OperationMechanism = {
  title: string;
  subtitle: string;
  founder: {
    title: string;
    subtitle: string;
    items: [string, string];
    regCodeLabel: string;
    regCode: string;
  };
  arrow1: string;
  mechanism: {
    title: string;
    badge: string;
    subtitle: string;
  };
  arrow2: string;
  partner: {
    title: string;
    items: [string, string];
  };
  legalBasis: {
    title: string;
    subtitle: string;
  };
  principlesTitle: string;
  principles: {
    title: string;
    desc: string;
  }[];
};

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    alternateTitle: string;
    heroTitleLine1: string;
    heroTitleLine2: string;
    heroMetadata: string[];
    heroNav: {
      mechanism: string;
      partners: string;
    };
    intro: string;
    overviewTitle: string;
    overview: string;
    highlights: { icon: string; title: string; description: string }[];
    missionTitle: string;
    missionSubtitle: string;
    missionCtaText: string;
    missionCtaButton: string;
    sections: AboutSection[];
    operationTitle: string;
    operationItems: string[];
    operationMechanism: OperationMechanism;
    boardTitle: string;
    boardRoles: string[];
    contactLabel: string;
    ctaTitle: string;
    ctaDescription: string;
    cta: string;
  }
> = {
  vi: {
    eyebrow: "Về chúng tôi",
    title: "Kết nối tri thức, kiến tạo tương lai",
    alternateTitle: "Hợp tác bền vững, cùng mở tương lai",
    heroTitleLine1: "Mạng lưới Tri thức",
    heroTitleLine2: "Nga – Việt",
    heroMetadata: ["Khoa học", "Công nghệ", "Tri thức", "Hợp tác"],
    heroNav: {
      mechanism: "Cơ chế vận hành",
      partners: "26+ Đối tác",
    },
    intro:
      "Mạng lưới Tri thức Việt Nam - Liên bang Nga là nền tảng kết nối hiện đại và bền vững. Chúng tôi thúc đẩy hợp tác chuyên sâu giữa giới trí thức, viện, trường và doanh nghiệp hai nước nhằm đón đầu kỷ nguyên khoa học công nghệ mới.",
    overviewTitle: "Mạng lưới Tri thức Việt Nam - Liên bang Nga",
    overview:
      "Mạng lưới Tri thức Việt Nam - Liên bang Nga là nền tảng kết nối hiện đại và bền vững. Chúng tôi thúc đẩy hợp tác chuyên sâu giữa giới trí thức, viện, trường và doanh nghiệp hai nước nhằm đón đầu kỷ nguyên khoa học công nghệ mới.",
    highlights: [
      {
        icon: "hub",
        title: "Động lực chiến lược",
        description:
          "Hiện thực hóa định hướng đổi mới sáng tạo theo Nghị quyết 57-NQ/TW, tạo nền tảng cho hợp tác trí thức bền vững.",
      },
      {
        icon: "groups",
        title: "Thời điểm vàng",
        description:
          "Đồng hành cùng sự kiện “Năm Khoa học và Giáo dục Việt - Nga 2026”, mở ra giai đoạn hợp tác sâu rộng và hiệu quả.",
      },
      {
        icon: "education",
        title: "Tầm nhìn dài hạn",
        description:
          "Tối ưu hóa tiềm năng hợp tác khoa học lâu dài giữa hai quốc gia, kiến tạo giá trị tri thức và công nghệ cho tương lai.",
      },
    ],
    missionTitle: "Sứ mệnh",
    missionSubtitle:
      "Kết nối tri thức – Hợp tác toàn diện – Phát triển bền vững",
    missionCtaText: "Cùng kiến tạo tri thức – Cùng phát triển tương lai",
    missionCtaButton: "Tham gia mạng lưới ngay",
    sections: [
      {
        title: "Mục tiêu cốt lõi",
        items: [
          "Kết nối trí thức: Quy tụ các nhà khoa học, chuyên gia hàng đầu hai nước.",
          "Thúc đẩy nghiên cứu: Triển khai dự án chung và chuyển giao công nghệ cao.",
          "Phát triển nhân lực: Hỗ trợ trao đổi học thuật, đào tạo và học bổng.",
          "Thương mại hóa: Gắn kết viện trường với doanh nghiệp để ứng dụng thực tiễn.",
          "Nâng tầm đối ngoại: Thắt chặt quan hệ Đối tác chiến lược toàn diện Việt - Nga.",
        ],
      },
      {
        title: "Hình thức hoạt động",
        items: [
          "Kết nối cộng đồng: Duy trì tương tác thường xuyên qua Portal trực tuyến.",
          "Hội nghị chuyên sâu: Tổ chức Diễn đàn Tri thức Việt - Nga thường niên luân phiên.",
          "Hợp tác nghiên cứu: Thành lập các nhóm nghiên cứu chung liên quốc gia.",
          "Nghiên cứu đặt hàng: Triển khai dự án theo yêu cầu của nhà nước và doanh nghiệp.",
        ],
      },
      {
        title: "Đối tác chiến lược",
        intro: "Quỹ chủ trương hợp tác không giới hạn với ba nhóm đối tác:",
        items: [
          "Tổ chức KH-CN: Viện nghiên cứu, viện hàn lâm, trung tâm nghiên cứu.",
          "Cơ sở giáo dục: Các trường đại học, học viện của hai nước.",
          "Khối doanh nghiệp: Đơn vị công nghệ có nhu cầu R&D hoặc chuyển giao.",
        ],
      },
      {
        title: "Lĩnh vực ưu tiên",
        items: [
          "Vật liệu mới & Công nghệ cao.",
          "Trí tuệ nhân tạo (AI) & Chuyển đổi số.",
          "Năng lượng & Công nghệ môi trường.",
          "Công nghệ sinh học & Y dược.",
          "Khai khoáng & Luyện kim.",
          "Các ngành khoa học xã hội và nhân văn khác.",
        ],
      },
    ],
    operationTitle: "Cơ chế vận hành",
    operationItems: [
      "Chủ thể duy nhất: Sáng lập, sở hữu và vận hành bởi Quỹ Truyền thống và Hữu nghị (tổ chức phi thương mại, pháp nhân đăng ký tại Bộ Tư pháp Nga, mã số 1207700294020).",
      "Mô hình hợp tác: Là chương trình điều phối trung tâm, không phải pháp nhân độc lập.",
      "Hình thức tham gia: Đối tác ký Thỏa thuận hợp tác song phương trực tiếp với Quỹ.",
    ],
    operationMechanism: {
      title: "Cơ chế vận hành",
      subtitle:
        "Mô hình hợp tác điều phối trung tâm, không pháp nhân độc lập và tham gia theo hình thức ký Thỏa thuận.",
      founder: {
        title: "Quỹ Truyền thống và Hữu nghị",
        subtitle: "(tổ chức phi thương mại)",
        items: [
          "Chủ thể duy nhất sáng lập, sở hữu và vận hành cơ chế.",
          "Đăng ký tại Bộ Tư pháp Nga.",
        ],
        regCodeLabel: "Mã số đăng ký:",
        regCode: "1207700294020",
      },
      arrow1: "Sáng lập và vận hành",
      mechanism: {
        title: "Cơ chế vận hành",
        badge: "Điều phối trung tâm",
        subtitle: "Không phải pháp nhân độc lập",
      },
      arrow2: "Tham gia bằng Thỏa thuận",
      partner: {
        title: "Đối tác ký Thỏa thuận hợp tác",
        items: [
          "Tham gia thông qua ký Thỏa thuận hợp tác.",
          "Hợp tác song phương trực tiếp với Quỹ.",
        ],
      },
      legalBasis: {
        title: "Thỏa thuận hợp tác",
        subtitle: "(Cơ sở pháp lý)",
      },
      principlesTitle: "Nguyên tắc cốt lõi",
      principles: [
        {
          title: "Điều phối tập trung",
          desc: "Đảm bảo thống nhất và hiệu quả",
        },
        {
          title: "Không pháp nhân độc lập",
          desc: "Tối ưu tính linh hoạt và hợp tác",
        },
        {
          title: "Hợp tác trực tiếp",
          desc: "Minh bạch, rõ ràng, bền vững",
        },
      ],
    },
    boardTitle: "Ban Điều hành",
    boardRoles: ["Chủ tịch Hội đồng điều phối", "Giám đốc kỹ thuật Mạng lưới"],
    contactLabel: "Liên hệ",
    ctaTitle: "Đồng hành cùng Mạng lưới Tri thức Nga – Việt",
    ctaDescription:
      "Kết nối viện nghiên cứu, trường đại học, doanh nghiệp công nghệ cao và các nhà khoa học để cùng kiến tạo những giá trị hợp tác song phương bền vững.",
    cta: "Đăng ký tham gia ngay",
  },
  en: {
    eyebrow: "About us",
    title: "Connecting knowledge, shaping the future",
    alternateTitle: "Building partnerships, shaping the future",
    heroTitleLine1: "Knowledge Network",
    heroTitleLine2: "Vietnam – Russian Federation",
    heroMetadata: ["Science", "Technology", "Knowledge", "Cooperation"],
    heroNav: {
      mechanism: "Operating Model",
      partners: "26+ Partner Institutions",
    },
    intro:
      "The Vietnam - Russian Federation Knowledge Network is a modern, sustainable connection platform. We advance in-depth cooperation among intellectuals, institutes, universities and businesses in both countries to meet the new era of science and technology.",
    overviewTitle: "Vietnam - Russian Federation Knowledge Network",
    overview:
      "The Vietnam - Russian Federation Knowledge Network is a modern, sustainable connection platform. We advance in-depth cooperation among intellectuals, institutes, universities and businesses in both countries to meet the new era of science and technology.",
    highlights: [
      {
        icon: "hub",
        title: "Strategic driver",
        description:
          "Realizing the innovation direction set by Resolution 57-NQ/TW, creating a solid foundation for sustainable cooperation.",
      },
      {
        icon: "groups",
        title: "A pivotal moment",
        description:
          "Supporting the Vietnam - Russia Year of Science and Education 2026, opening a phase of deep and effective cooperation.",
      },
      {
        icon: "education",
        title: "Long-term vision",
        description:
          "Unlocking the full potential of longstanding scientific cooperation, creating knowledge and technology value for the future.",
      },
    ],
    missionTitle: "Mission",
    missionSubtitle:
      "Connecting knowledge – Comprehensive cooperation – Sustainable development",
    missionCtaText: "Co-creating knowledge – Co-developing the future",
    missionCtaButton: "Join the network now",
    sections: [
      {
        title: "Core objectives",
        items: [
          "Connect knowledge: Bring together leading scientists and experts from both countries.",
          "Advance research: Implement joint projects and high-technology transfer.",
          "Develop talent: Support academic exchange, training and scholarships.",
          "Commercialize research: Link institutes and universities with businesses for practical application.",
          "Strengthen foreign relations: Deepen the Vietnam - Russia Comprehensive Strategic Partnership.",
        ],
      },
      {
        title: "Modes of operation",
        items: [
          "Community connection: Maintain regular interaction through the online Portal.",
          "Specialized conferences: Hold the annual Vietnam - Russia Knowledge Forum alternately in both countries.",
          "Research cooperation: Establish joint cross-border research groups.",
          "Commissioned research: Deliver projects requested by governments and businesses.",
        ],
      },
      {
        title: "Strategic partners",
        intro:
          "The Foundation pursues unrestricted cooperation with three partner groups:",
        items: [
          "Science and technology organizations: Research institutes, academies and research centers.",
          "Educational institutions: Universities and academies in both countries.",
          "Businesses: Technology organizations seeking R&D or technology transfer.",
        ],
      },
      {
        title: "Priority fields",
        items: [
          "Advanced materials & high technology.",
          "Artificial intelligence (AI) & digital transformation.",
          "Energy & environmental technology.",
          "Biotechnology & medicine.",
          "Mining & metallurgy.",
          "Other social sciences and humanities.",
        ],
      },
    ],
    operationTitle: "Operating model",
    operationItems: [
      "Sole operator: Founded, owned and operated by the Tradition and Friendship Foundation (a non-profit legal entity registered with the Russian Ministry of Justice, registration number 1207700294020).",
      "Cooperation model: A centrally coordinated program, not an independent legal entity.",
      "Participation: Partners sign bilateral cooperation agreements directly with the Foundation.",
    ],
    operationMechanism: {
      title: "Operating model",
      subtitle:
        "A centrally coordinated cooperation model without an independent legal entity, structured through bilateral Agreements.",
      founder: {
        title: "Tradition and Friendship Foundation",
        subtitle: "(non-profit organization)",
        items: [
          "Sole entity that founded, owns and operates the mechanism.",
          "Registered with the Ministry of Justice of the Russian Federation.",
        ],
        regCodeLabel: "Registration number:",
        regCode: "1207700294020",
      },
      arrow1: "Founded and operated",
      mechanism: {
        title: "Operating model",
        badge: "Central coordination",
        subtitle: "Not an independent legal entity",
      },
      arrow2: "Participation by Agreement",
      partner: {
        title: "Partner signing Cooperation Agreement",
        items: [
          "Participates by signing a Cooperation Agreement.",
          "Direct bilateral cooperation with the Foundation.",
        ],
      },
      legalBasis: {
        title: "Cooperation Agreement",
        subtitle: "(Legal Basis)",
      },
      principlesTitle: "Core Principles",
      principles: [
        {
          title: "Central coordination",
          desc: "Ensures unity and operational efficiency",
        },
        {
          title: "No independent legal entity",
          desc: "Optimizes agility and open cooperation",
        },
        {
          title: "Direct cooperation",
          desc: "Transparent, clear, and sustainable",
        },
      ],
    },
    boardTitle: "Executive Board",
    boardRoles: [
      "Chair of the Coordination Council",
      "Network Technical Director",
    ],
    contactLabel: "Contact",
    ctaTitle: "Partner with the Russia – Vietnam Knowledge Network",
    ctaDescription:
      "Connecting research institutes, universities, high-tech enterprises, and scientists to forge sustainable bilateral cooperation.",
    cta: "Register to join now",
  },
  ru: {
    eyebrow: "О нас",
    title: "Соединяем знания, создаём будущее",
    alternateTitle: "Объединяем идеи, создаём будущее",
    heroTitleLine1: "РОССИЙСКО-ВЬЕТНАМСКАЯ ИНТЕЛЛЕКТУАЛЬНАЯ СЕТЬ",
    heroTitleLine2: "",
    heroMetadata: ["Наука", "Технологии", "Знания", "Сотрудничество"],
    heroNav: {
      mechanism: "Механизм работы",
      partners: "26+ Партнеров",
    },
    intro:
      "РОССИЙСКО-ВЬЕТНАМСКАЯ ИНТЕЛЛЕКТУАЛЬНАЯ СЕТЬ — это современная и устойчивая платформа взаимодействия. Мы развиваем углублённое сотрудничество интеллектуального сообщества, институтов, университетов и предприятий двух стран, отвечая на вызовы новой научно-технологической эпохи.",
    overviewTitle: "РОССИЙСКО-ВЬЕТНАМСКАЯ ИНТЕЛЛЕКТУАЛЬНАЯ СЕТЬ",
    overview:
      "РОССИЙСКО-ВЬЕТНАМСКАЯ ИНТЕЛЛЕКТУАЛЬНАЯ СЕТЬ — это современная и устойчивая платформа взаимодействия. Мы развиваем углублённое сотрудничество интеллектуального сообщества, институтов, университетов и предприятий двух стран, отвечая на вызовы новой научно-технологической эпохи.",
    highlights: [
      {
        icon: "hub",
        title: "Стратегический импульс",
        description:
          "Реализация курса на инновационное развитие в соответствии с Резолюцией 57-NQ/TW, формирование фундамента для долгосрочного сотрудничества.",
      },
      {
        icon: "groups",
        title: "Благоприятный момент",
        description:
          "Содействие проведению Года науки и образования Вьетнама и России — 2026.",
      },
      {
        icon: "education",
        title: "Долгосрочное видение",
        description:
          "Раскрытие потенциала многолетнего научного сотрудничества, создание ценности знаний и технологий для будущего.",
      },
    ],
    missionTitle: "Миссия",
    missionSubtitle:
      "Объединение знаний — Всестороннее партнёрство — Устойчивое развитие",
    missionCtaText: "Вместе создаём знания — Вместе строим будущее",
    missionCtaButton: "Присоединиться к Сети",
    sections: [
      {
        title: "Ключевые цели",
        items: [
          "Объединение знаний: Привлечение ведущих учёных и экспертов двух стран.",
          "Развитие исследований: Реализация совместных проектов и трансфер высоких технологий.",
          "Развитие кадров: Поддержка академических обменов, обучения и стипендиальных программ.",
          "Коммерциализация: Связь институтов и университетов с бизнесом для практического внедрения разработок.",
          "Укрепление внешних связей: Развитие всеобъемлющего стратегического партнёрства России и Вьетнама.",
        ],
      },
      {
        title: "Формы деятельности",
        items: [
          "Связь сообщества: Регулярное взаимодействие через онлайн-портал.",
          "Профильные конференции: Ежегодное проведение Форума знаний Россия — Вьетнам поочерёдно в двух странах.",
          "Исследовательское сотрудничество: Создание совместных международных исследовательских групп.",
          "Заказные исследования: Реализация проектов по запросу государства и бизнеса.",
        ],
      },
      {
        title: "Стратегические партнёры",
        intro:
          "Фонд нацелен на открытое сотрудничество с тремя группами партнёров:",
        items: [
          "Научно-технологические организации: НИИ, академии и исследовательские центры.",
          "Образовательные учреждения: Университеты и академии двух стран.",
          "Бизнес-сектор: Технологические компании с потребностями в R&D и трансфере технологий.",
        ],
      },
      {
        title: "Приоритетные направления",
        items: [
          "Новые материалы и высокие технологии.",
          "Искусственный интеллект (ИИ) и цифровая трансформация.",
          "Энергетика и экологические технологии.",
          "Биотехнологии, медицина и фармацевтика.",
          "Горнодобывающая промышленность и металлургия.",
          "Гуманитарные и общественные науки.",
        ],
      },
    ],
    operationTitle: "Модель функционирования",
    operationItems: [
      "Единственный субъект: Создана, принадлежит и управляется Фондом «Традиции и дружба» (некоммерческая организация, зарегистрированная в Минюсте РФ, ОГРН 1207700294020).",
      "Модель сотрудничества: Централизованно координируемая программа, не является отдельным юридическим лицом.",
      "Форма участия: Партнёры заключают двусторонние соглашения о сотрудничестве напрямую с Фондом.",
    ],
    operationMechanism: {
      title: "Модель функционирования",
      subtitle:
        "Централизованно координируемая модель сотрудничества без создания отдельного юрлица с участием на основе Соглашений.",
      founder: {
        title: "Фонд «Традиции и дружба»",
        subtitle: "(некоммерческая организация)",
        items: [
          "Единственный субъект, создавший, владеющий и управляющий механизмом.",
          "Зарегистрирован в Министерстве юстиции РФ.",
        ],
        regCodeLabel: "Регистрационный номер:",
        regCode: "1207700294020",
      },
      arrow1: "Создание и управление",
      mechanism: {
        title: "Модель функционирования",
        badge: "Центральная координация",
        subtitle: "Без отдельного юридического лица",
      },
      arrow2: "Участие на основе Соглашения",
      partner: {
        title: "Партнёр по Соглашению о сотрудничестве",
        items: [
          "Участие на основе подписания Соглашения о сотрудничестве.",
          "Прямое двустороннее взаимодействие с Фондом.",
        ],
      },
      legalBasis: {
        title: "Соглашение о сотрудничестве",
        subtitle: "(Правовая основа)",
      },
      principlesTitle: "Ключевые принципы",
      principles: [
        {
          title: "Центральная координация",
          desc: "Единство действий и высокая эффективность",
        },
        {
          title: "Без отдельного юрлица",
          desc: "Гибкость и открытость к партнёрству",
        },
        {
          title: "Прямое сотрудничество",
          desc: "Прозрачность, ясность и долгосрочность",
        },
      ],
    },
    boardTitle: "Правление",
    boardRoles: [
      "Председатель Координационного совета",
      "Технический директор Сети",
    ],
    contactLabel: "Контакты",
    ctaTitle: "Партнёрство с Сетью знаний Россия – Вьетнам",
    ctaDescription:
      "Объединение исследовательских институтов, университетов, предприятий и учёных для устойчивого двустороннего сотрудничества.",
    cta: "Подать заявку на участие",
  },
};

function BoardContactIcon({ icon }: Readonly<{ icon: string }>) {
  if (icon === "telegram") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5 text-[#229ED9]"
        aria-hidden="true"
      >
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
      </svg>
    );
  }
  if (icon === "whatsapp") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5 text-[#25D366]"
        aria-hidden="true"
      >
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29z" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 text-blue-700"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 1 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

const ECOSYSTEM_ORB_IMAGES: Record<string, string> = {
  handshake: "/images/ecosystem-icons/opportunities.webp",
  agreement: "/images/ecosystem-icons/opportunities.webp",
  groups: "/images/ecosystem-icons/members.webp",
  users: "/images/ecosystem-icons/members.webp",
  members: "/images/ecosystem-icons/members.webp",
  insights: "/images/ecosystem-icons/projects.webp",
  chart_up: "/images/ecosystem-icons/projects.webp",
  projects: "/images/ecosystem-icons/projects.webp",
  menu_book: "/images/ecosystem-icons/knowledge.webp",
  library: "/images/ecosystem-icons/knowledge.webp",
  book_open: "/images/ecosystem-icons/knowledge.webp",
  knowledge: "/images/ecosystem-icons/knowledge.webp",
};

type AboutTabId = "overview" | "ecosystem" | "board" | "partners";

const TAB_LABELS: Record<Locale, Record<AboutTabId, string>> = {
  vi: {
    overview: "Giới thiệu chung",
    ecosystem: "Hệ sinh thái",
    board: "Ban Điều hành",
    partners: "Đối tác",
  },
  ru: {
    overview: "Общие сведения",
    ecosystem: "Экосистема",
    board: "Правление",
    partners: "Партнёры",
  },
  en: {
    overview: "General Overview",
    ecosystem: "Ecosystem",
    board: "Board of Directors",
    partners: "Partners",
  },
};

const SECTION_OFFSETS: Record<AboutTabId, number> = {
  overview: 150,
  ecosystem: 150,
  board: 152,
  partners: 150,
};

const SECTION_IDS: Record<AboutTabId, string> = {
  overview: "about-overview",
  ecosystem: "about-ecosystem",
  board: "board",
  partners: "participating-partners",
};

function customSmoothScroll(
  targetY: number,
  duration = 850,
  onComplete?: () => void,
) {
  if (typeof window === "undefined") return;
  const startY = window.pageYOffset || document.documentElement.scrollTop;
  const diff = targetY - startY;
  if (Math.abs(diff) < 3) {
    onComplete?.();
    return;
  }

  const root = document.documentElement;
  const prevScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  document.body.style.scrollBehavior = "auto";

  const startTime = performance.now();

  // Quintic ease-in-out for ultra smooth, cinematic gliding animation
  function easeInOutQuint(t: number): number {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
  }

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutQuint(progress);

    window.scrollTo(0, Math.round(startY + diff * eased));

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      root.style.scrollBehavior = prevScrollBehavior;
      document.body.style.scrollBehavior = "";
      onComplete?.();
    }
  }

  requestAnimationFrame(step);
}

export function GuestAboutV2() {
  const { locale } = useLocale();
  const t = COPY[locale] ?? COPY.vi;
  const homeCopy = HOME_COPY[locale] ?? HOME_COPY.vi;
  const [activeSection, setActiveSection] = useState<AboutTabId>("overview");
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const sectionIds: { id: string; tab: AboutTabId }[] = [
      { id: "about-overview", tab: "overview" },
      { id: "about-ecosystem", tab: "ecosystem" },
      { id: "board", tab: "board" },
      { id: "participating-partners", tab: "partners" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          const matched = sectionIds.find(
            (s) => s.id === visibleEntries[0].target.id,
          );
          if (matched) {
            setActiveSection(matched.tab);
          }
        }
      },
      {
        rootMargin: "-130px 0px -50% 0px",
        threshold: [0, 0.1, 0.25],
      },
    );

    sectionIds.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const scrollToSection = (targetId: string, tabId: AboutTabId) => {
    setActiveSection(tabId);
    isScrollingRef.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    if (tabId === "overview") {
      const targetPosition = 0;
      const distance = Math.abs(targetPosition - window.pageYOffset);
      const duration = Math.min(Math.max(Math.sqrt(distance) * 28, 650), 950);

      customSmoothScroll(targetPosition, duration, () => {
        isScrollingRef.current = false;
      });

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, duration + 80);

      window.history.replaceState(null, "", `#about-overview`);
      return;
    }

    const el = document.getElementById(targetId);
    if (el) {
      const navOffset = SECTION_OFFSETS[tabId] ?? 110;
      const targetPosition = Math.max(
        0,
        el.getBoundingClientRect().top + window.pageYOffset - navOffset,
      );
      const distance = Math.abs(targetPosition - window.pageYOffset);

      // Adaptive duration: 700ms to 1050ms for luxurious smooth glide
      const duration = Math.min(Math.max(Math.sqrt(distance) * 28, 700), 1050);
      customSmoothScroll(targetPosition, duration, () => {
        isScrollingRef.current = false;
      });

      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, duration + 80);

      window.history.replaceState(null, "", `#${targetId}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-950 font-sans">
      <GuestPublicNav active="about" />

      {/* ═══════════ STICKY SUB-TABS BAR ═══════════ */}
      <nav
        className="sticky top-[74px] z-40 border-b border-blue-200/70 bg-[#f0f4f9]/90 pt-2.5 pb-2.5 sm:pt-3 sm:pb-0 backdrop-blur-md transition-all duration-200"
        aria-label="About navigation"
      >
        <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-8">
          <div className="sm:hidden">
            <button
              type="button"
              aria-expanded={aboutMenuOpen}
              aria-controls="about-mobile-menu"
              onClick={() => setAboutMenuOpen((open) => !open)}
              className="flex min-h-10 w-full items-center justify-between rounded-xl border border-blue-200 bg-white px-3.5 text-left text-sm font-bold text-[#082352] shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
            >
              {TAB_LABELS[locale]?.[activeSection] ??
                TAB_LABELS.vi[activeSection]}
              <span aria-hidden="true">⌄</span>
            </button>
            {aboutMenuOpen && (
              <div
                id="about-mobile-menu"
                className="mt-2 overflow-hidden rounded-xl border border-blue-200 bg-white shadow-sm"
              >
                {(["overview", "ecosystem", "board", "partners"] as const).map(
                  (tabId) => (
                    <button
                      key={tabId}
                      type="button"
                      aria-current={
                        activeSection === tabId ? "page" : undefined
                      }
                      onClick={() => {
                        setAboutMenuOpen(false);
                        scrollToSection(SECTION_IDS[tabId], tabId);
                      }}
                      className={`block min-h-10 w-full border-b border-blue-100 px-4 py-2.5 text-left text-sm font-bold last:border-0 ${
                        activeSection === tabId
                          ? "bg-blue-600 text-white"
                          : "text-slate-700 hover:bg-blue-50"
                      }`}
                    >
                      {TAB_LABELS[locale]?.[tabId] ?? TAB_LABELS.vi[tabId]}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          <div className="mx-auto hidden w-max items-center gap-1 rounded-xl border border-blue-200/80 bg-white/95 p-1 shadow-xs sm:flex">
            {(["overview", "ecosystem", "board", "partners"] as const).map(
              (tabId) => {
                const isActive = activeSection === tabId;
                return (
                  <button
                    key={tabId}
                    type="button"
                    onClick={() => scrollToSection(SECTION_IDS[tabId], tabId)}
                    className={`relative inline-flex min-h-9 items-center gap-2 rounded-lg px-4 py-1.5 text-sm font-bold whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${
                      isActive
                        ? "text-white"
                        : "text-slate-700 hover:bg-blue-50/70 hover:text-blue-900"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="about-tab-indicator"
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 35,
                        }}
                        className="absolute inset-0 rounded-lg bg-blue-600 shadow-xs shadow-blue-600/20"
                      />
                    )}
                    <span
                      className={`relative z-10 size-1.5 rounded-full ${
                        isActive ? "bg-white" : "bg-slate-300"
                      }`}
                      aria-hidden="true"
                    />
                    <span className="relative z-10">
                      {TAB_LABELS[locale]?.[tabId] ?? TAB_LABELS.vi[tabId]}
                    </span>
                  </button>
                );
              },
            )}
          </div>
        </div>
      </nav>

      <main>
        <div
          id="about-overview"
          className="mx-auto max-w-[1460px] scroll-mt-32 px-4 pt-3 pb-5 sm:px-6 sm:pt-4 lg:px-8"
        >
          <article className="rounded-2xl border border-blue-100/80 bg-white px-5 py-6 shadow-xs sm:px-8 sm:py-8 lg:px-10">
            {/* ═══════════ HEADER ═══════════ */}
            <div className="mb-2 text-center sm:mb-3">
              <h1 className="font-serif text-xl font-bold tracking-tight text-[#082352] sm:text-2xl">
                {t.eyebrow}
              </h1>
            </div>

            <div
              className="my-3 h-px w-full bg-slate-200/80 sm:my-4"
              aria-hidden="true"
            />

            {/* ═══════════ 1. GIỚI THIỆU CHUNG (OVERVIEW) ═══════════ */}
            <div className="space-y-5 text-xs leading-normal text-slate-700 sm:space-y-6 sm:text-sm sm:leading-relaxed">
              <section id="about-intro">
                <h2 className="font-serif text-base font-bold text-[#082352] sm:text-lg">
                  {t.overviewTitle}
                </h2>
                <p className="mt-2 text-xs leading-normal sm:text-sm sm:leading-relaxed">
                  {t.overview}
                </p>
              </section>

              <section id="mission">
                <h2 className="font-serif text-base font-bold text-[#082352] sm:text-lg">
                  {t.missionTitle}
                </h2>
                <p className="mt-2 text-xs leading-normal sm:text-sm sm:leading-relaxed">
                  {t.missionSubtitle}
                </p>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-normal sm:text-sm sm:leading-relaxed">
                  {t.highlights.map((item) => (
                    <li key={item.title}>
                      <strong className="font-bold text-slate-900">
                        {item.title}:
                      </strong>{" "}
                      {item.description}
                    </li>
                  ))}
                </ul>
              </section>

              {t.sections.map((section, index) => (
                <section key={section.title} id={`about-section-${index}`}>
                  <h2 className="font-serif text-base font-bold text-[#082352] sm:text-lg">
                    {section.title}
                  </h2>
                  {section.intro ? (
                    <p className="mt-2 text-xs leading-normal sm:text-sm sm:leading-relaxed">
                      {section.intro}
                    </p>
                  ) : null}
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-xs leading-normal sm:text-sm sm:leading-relaxed">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              ))}

              <div
                className="my-4 h-px w-full bg-slate-200/80 sm:my-5"
                aria-hidden="true"
              />

              {/* ═══════════ CƠ CHẾ VẬN HÀNH ═══════════ */}
              <section id="operating-mechanism" className="scroll-mt-32">
                <h2 className="font-serif text-base font-bold text-[#082352] sm:text-lg">
                  {t.operationTitle}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">
                    <span
                      className="size-2 rounded-full bg-blue-600"
                      aria-hidden="true"
                    />
                    ОГРН / Mã số đăng ký: 1207700294020
                  </span>
                </div>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs leading-normal sm:text-sm sm:leading-relaxed">
                  {t.operationItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>
          </article>
        </div>

        {/* ═══════════ 2. HỆ SINH THÁI (ECOSYSTEM) ═══════════ */}
        <section
          id="about-ecosystem"
          className="scroll-mt-36 pt-4 pb-6 sm:pt-6 sm:pb-8"
        >
          <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-8">
            <div className="mb-4 flex flex-col items-center justify-between gap-2 sm:mb-5 sm:flex-row">
              <div className="inline-flex items-center gap-2">
                <span className="h-1 w-6 rounded-full bg-blue-600" />
                <h2 className="font-serif text-lg font-bold tracking-tight text-[#082352] sm:text-xl">
                  {homeCopy.ecosystem.eyebrow}
                </h2>
              </div>
              <Link
                href="/ecosystem"
                className="group/link inline-flex items-center gap-1 text-xs font-bold text-blue-600 transition hover:text-blue-800 sm:text-sm"
              >
                <span>{homeCopy.ecosystem.cardCta}</span>
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {homeCopy.ecosystem.cards.map((card) => {
                const iconSrc =
                  ECOSYSTEM_ORB_IMAGES[card.icon] ??
                  "/images/ecosystem-icons/opportunities.webp";
                return (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="group flex flex-col justify-between rounded-2xl border border-blue-200/80 bg-white/95 p-5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                  >
                    <div>
                      <div className="flex items-center">
                        <div className="relative flex size-14 items-center justify-center sm:size-16">
                          <Image
                            src={iconSrc}
                            alt=""
                            width={64}
                            height={64}
                            unoptimized
                            className="size-full object-contain drop-shadow-[0_4px_12px_rgba(37,99,235,0.18)] transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      </div>

                      <h3 className="mt-4 text-sm font-bold uppercase tracking-tight text-slate-900 transition-colors duration-200 group-hover:text-blue-600 sm:text-base">
                        {card.title}
                      </h3>

                      <span className="mt-2 block h-0.5 w-5 rounded-full bg-blue-600" />

                      <p className="mt-2.5 line-clamp-3 text-xs leading-relaxed text-slate-600">
                        {card.desc}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-1 text-[11px] font-bold text-blue-600 transition group-hover:text-blue-800">
                      <span>{homeCopy.ecosystem.cardCta}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════ 3. BAN ĐIỀU HÀNH (BOARD MEMBERS) ═══════════ */}
        <section id="board" className="scroll-mt-36 pt-4 pb-8 sm:pt-6 sm:pb-10">
          <Reveal y={10} className="mx-auto mb-4 max-w-4xl text-center sm:mb-5">
            <h2 className="font-serif text-lg font-bold tracking-tight text-[#082352] sm:text-xl">
              {t.boardTitle}
            </h2>
          </Reveal>
          <div className="mx-auto grid max-w-5xl gap-5 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
            {BOARD_MEMBERS.map((member, index) => (
              <Reveal key={member.name} y={12} delay={index * 0.05}>
                <article className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-blue-200 bg-white/95 p-5 shadow-sm backdrop-blur-xs transition duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none sm:p-6">
                  <div>
                    {/* 1. Name at the top */}
                    <h3 className="font-serif text-lg font-bold tracking-tight text-[#082352] sm:text-xl">
                      {member.name}
                    </h3>

                    {/* 2. Role / Position Badge */}
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-100/80 px-3 py-1 text-xs font-bold text-blue-800">
                        <span
                          className="size-1.5 rounded-full bg-blue-600"
                          aria-hidden="true"
                        />
                        {t.boardRoles[index]}
                      </span>
                    </div>

                    {/* 3. Clean divider */}
                    <div
                      className="my-4 h-px w-full bg-slate-200"
                      aria-hidden="true"
                    />

                    {/* 4. Avatar & Contact Channels */}
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-slate-100 shadow-xs ring-2 ring-blue-50 sm:size-20">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          sizes="80px"
                          className="object-cover object-top"
                        />
                      </div>

                      <div className="flex flex-1 flex-col">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          {t.contactLabel}:
                        </span>
                        <div className="mt-2 flex flex-wrap items-center gap-2.5">
                          {member.contacts.map((contact) => (
                            <a
                              key={contact.label}
                              href={contact.href}
                              target={
                                contact.href.startsWith("http")
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                contact.href.startsWith("http")
                                  ? "noopener noreferrer"
                                  : undefined
                              }
                              aria-label={`${contact.label}: ${member.name}`}
                              title={contact.label}
                              className="grid size-10 place-items-center rounded-xl border border-blue-200 bg-blue-50/80 text-blue-700 shadow-2xs transition hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 motion-reduce:transform-none motion-reduce:transition-none sm:size-11"
                            >
                              <BoardContactIcon icon={contact.icon} />
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ═══════════ CTA BANNER ═══════════ */}
        <section className="px-4 pb-8 sm:px-6 lg:px-8 lg:pb-10">
          <div className="relative mx-auto flex max-w-[1460px] flex-col items-start justify-between gap-6 overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-white via-blue-50/70 to-blue-100/50 p-6 text-slate-900 shadow-lg shadow-blue-900/5 sm:p-8 lg:flex-row lg:items-center lg:p-10">
            <div
              className="pointer-events-none absolute -bottom-10 -right-10 size-80 rounded-full bg-blue-400/15 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-3xl">
              <h2 className="font-serif text-xl font-bold leading-snug tracking-tight text-[#071936] sm:text-2xl lg:text-3xl">
                {t.ctaTitle}
              </h2>
              <p className="mt-3 text-xs font-normal leading-relaxed text-slate-600 sm:text-sm lg:text-base">
                {t.ctaDescription}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs font-bold text-slate-700">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200/80 bg-white/90 px-3 py-1.5 text-blue-900 shadow-2xs">
                  <span
                    className="size-1.5 rounded-full bg-blue-600"
                    aria-hidden="true"
                  />
                  Viện Hàn lâm, Trường ĐH & Doanh nghiệp
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200/80 bg-white/90 px-3 py-1.5 text-blue-900 shadow-2xs">
                  <span
                    className="size-1.5 rounded-full bg-blue-600"
                    aria-hidden="true"
                  />
                  Thỏa thuận song phương trực tiếp
                </span>
              </div>
            </div>

            <div className="relative z-10 shrink-0">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition duration-150 hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:text-base"
              >
                <span>{t.cta}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════ 4. ĐỐI TÁC ═══════════ */}
        <section
          id="participating-partners"
          className="scroll-mt-32 border-t border-blue-100 bg-[#edf5ff] px-4 pt-6 pb-12 sm:px-6 sm:pt-8 sm:pb-14 lg:px-8 lg:pt-8 lg:pb-16"
        >
          <div className="mx-auto max-w-[1460px]">
            <div className="mb-4 text-center sm:mb-6">
              <h2 className="font-serif text-xl font-bold tracking-tight text-[#082352] sm:text-2xl">
                {PARTNER_COPY[locale].title}
              </h2>
            </div>
            {(["ru", "vi"] as const).map((country) => (
              <div key={country} className="mt-6 sm:mt-8">
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-1 w-5 rounded-full bg-blue-600" />
                  <h3 className="font-serif text-base font-bold text-[#082352] sm:text-lg">
                    {PARTNER_COPY[locale][country]}
                  </h3>
                </div>
                <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {PARTNERS.filter(
                    (partner) => partner.country === country,
                  ).map((partner) => (
                    <li key={partner.url}>
                      <a
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={partner.name}
                        title={partner.name}
                        className="group flex min-h-36 items-center justify-center rounded-3xl border border-blue-100 bg-white p-5 shadow-xs transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 motion-reduce:transform-none motion-reduce:transition-none"
                      >
                        <Image
                          src={`/images/partners/${partner.logo}.webp`}
                          alt={partner.name}
                          width={180}
                          height={100}
                          className="max-h-24 w-auto object-contain transition duration-200 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <GuestPublicFooter copy={homeCopy} />
    </div>
  );
}

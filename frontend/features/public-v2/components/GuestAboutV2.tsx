"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { HOME_COPY } from "./GuestHomeV2";
import { GuestPublicFooter } from "./GuestPublicFooter";
import { GuestPublicNav } from "./GuestPublicNav";

type AboutSection = {
  title: string;
  intro?: string;
  items: string[];
};

const BOARD_MEMBERS = [
  {
    name: "TS Nguyễn Quốc Hùng",
    image: "/images/board/nguyen-quoc-hung.webp",
    contact: "+798****5856",
  },
  {
    name: "Trần Đức Tùng",
    image: "/images/board/tran-duc-tung.webp",
    contact: "+799****6240",
  },
] as const;

const PARTNER_COPY: Record<Locale, { title: string; ru: string; vi: string }> =
  {
    vi: { title: "Tổ chức mong muốn tham gia", ru: "Liên bang Nga", vi: "Việt Nam" },
    en: {
      title: "Prospective participating organizations",
      ru: "Russian Federation",
      vi: "Vietnam",
    },
    ru: {
      title: "Организации, заинтересованные в участии",
      ru: "Российская Федерация",
      vi: "Вьетнам",
    },
  };

const PARTNERS = [
  {
    name: "Московский Политех",
    logo: "mospolytech",
    url: "https://mospolytech.ru/",
    country: "ru",
  },
  {
    name: "СПбУТУиЭ",
    logo: "spbume",
    url: "https://www.spbume.ru/",
    country: "ru",
  },
  {
    name: "ЦЭМИ РАН",
    logo: "cemi-ran",
    url: "https://www.cemi.rssi.ru/",
    country: "ru",
  },
  { name: "СПбГУТ", logo: "sut", url: "https://www.sut.ru/", country: "ru" },
  {
    name: "СЗИУ РАНХиГС",
    logo: "ranepa-northwest",
    url: "https://sziu.ranepa.ru/",
    country: "ru",
  },
  {
    name: "ИЭ РАН",
    logo: "inecon-ran",
    url: "https://inecon.org/",
    country: "ru",
  },
  { name: "ЛЭТИ", logo: "leti", url: "https://etu.ru/", country: "ru" },
  {
    name: "РЭУ им. Г.В. Плеханова",
    logo: "plekhanov",
    url: "https://рэу.рф/",
    country: "ru",
  },
  { name: "СПбГУ", logo: "spbu", url: "https://spbu.ru/", country: "ru" },
  {
    name: "Финуниверситет",
    logo: "financial-university",
    url: "https://www.fa.ru/",
    country: "ru",
  },
  { name: "РУДН", logo: "rudn", url: "https://www.rudn.ru/", country: "ru" },
  {
    name: "Пермский Политех",
    logo: "perm-polytech",
    url: "https://pstu.ru/",
    country: "ru",
  },
  { name: "РГГУ", logo: "rsuh", url: "https://www.rsuh.ru/", country: "ru" },
  {
    name: "РУТ МИИТ",
    logo: "rut-miit",
    url: "https://rut-miit.ru/",
    country: "ru",
  },
  {
    name: "РГПУ им. А. И. Герцена",
    logo: "herzen",
    url: "https://www.herzen.spb.ru/",
    country: "ru",
  },
  { name: "РГГМУ", logo: "rshu", url: "https://www.rshu.ru/", country: "ru" },
  { name: "ИГХТУ", logo: "isuct", url: "https://www.isuct.ru/", country: "ru" },
  {
    name: "МШЭ МГУ",
    logo: "mse-msu",
    url: "https://mse-msu.ru/",
    country: "ru",
  },
  { name: "УрГЭУ", logo: "usue", url: "https://www.usue.ru/", country: "ru" },
  { name: "СПбГЭУ", logo: "unecon", url: "https://unecon.ru/", country: "ru" },
  { name: "МПГУ", logo: "mpgu", url: "https://mpgu.su/", country: "ru" },
  { name: "МГЛУ", logo: "mslu", url: "https://linguanet.ru/", country: "ru" },
  {
    name: "Co-laboratoria",
    logo: "co-laboratoria",
    url: "https://co-laboratoria.ru/",
    country: "ru",
  },
  {
    name: "Đại học Quốc gia Hà Nội",
    logo: "vnu",
    url: "http://vnu.edu.vn/",
    country: "vi",
  },
  {
    name: "Học viện Công nghệ Bưu chính Viễn thông",
    logo: "ptit",
    url: "https://ptit.edu.vn/",
    country: "vi",
  },
  {
    name: "Đại học Kinh tế - Kỹ thuật Công nghiệp",
    logo: "uneti",
    url: "https://uneti.edu.vn/",
    country: "vi",
  },
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
    heroTitleLine2: "Việt Nam – Liên bang Nga",
    heroMetadata: ["Khoa học", "Công nghệ", "Tri thức", "Hợp tác"],
    heroNav: {
      mechanism: "Cơ chế vận hành",
      partners: "26+ Đối tác tham gia",
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
    heroTitleLine1: "Сеть знаний",
    heroTitleLine2: "Вьетнам — Российская Федерация",
    heroMetadata: ["Наука", "Технологии", "Знания", "Сотрудничество"],
    heroNav: {
      mechanism: "Механизм работы",
      partners: "26+ Партнеров",
    },
    intro:
      "Сеть знаний Вьетнам — Российская Федерация — это современная и устойчивая платформа взаимодействия. Мы развиваем углублённое сотрудничество интеллектуального сообщества, институтов, университетов и предприятий двух стран, отвечая на вызовы новой научно-технологической эпохи.",
    overviewTitle: "Сеть знаний Вьетнам — Российская Федерация",
    overview:
      "Сеть знаний Вьетнам — Российская Федерация — это современная и устойчивая платформа взаимодействия. Мы развиваем углублённое сотрудничество интеллектуального сообщества, институтов, университетов и предприятий двух стран, отвечая на вызовы новой научно-технологической эпохи.",
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

const MISSION_CARD_CONFIGS = [
  {
    number: "01",
    numColor: "text-blue-300",
    checkBg: "bg-blue-600 text-white",
  },
  {
    number: "02",
    numColor: "text-amber-300",
    checkBg: "bg-amber-500 text-white",
  },
  {
    number: "03",
    numColor: "text-teal-300",
    checkBg: "bg-teal-600 text-white",
  },
  {
    number: "04",
    numColor: "text-purple-300",
    checkBg: "bg-purple-600 text-white",
  },
] as const;

function renderItemText(item: string) {
  const colonIndex = item.indexOf(":");
  if (colonIndex > 0) {
    const kicker = item.slice(0, colonIndex + 1);
    const rest = item.slice(colonIndex + 1);
    return (
      <span className="text-lg leading-relaxed text-slate-800 sm:text-xl sm:leading-8">
        <strong className="font-extrabold text-slate-950">{kicker}</strong>
        <span className="font-medium text-slate-700">{rest}</span>
      </span>
    );
  }
  return (
    <span className="text-lg font-medium leading-relaxed text-slate-800 sm:text-xl sm:leading-8">
      {item}
    </span>
  );
}

function MissionAndCoreOperations({
  title,
  subtitle,
  sections,
  ctaText,
  ctaButton,
}: Readonly<{
  title: string;
  subtitle: string;
  sections: AboutSection[];
  ctaText: string;
  ctaButton: string;
}>) {
  return (
    <section
      id="mission-and-operations"
      className="scroll-mt-24 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-sans text-3xl font-black tracking-tight text-[#082352] sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="mt-3 text-lg font-semibold text-slate-600 sm:text-xl lg:text-2xl">
          {subtitle}
        </p>
        <div
          className="mx-auto mt-6 h-px w-full max-w-xl bg-slate-200"
          aria-hidden="true"
        />
      </div>

      <div className="mt-14 grid gap-8 md:grid-cols-2">
        {sections.map((section, index) => {
          const config = MISSION_CARD_CONFIGS[index] ?? MISSION_CARD_CONFIGS[0];
          return (
            <article
              key={section.title}
              className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-blue-100/90 bg-white p-8 shadow-[0_16px_40px_-28px_rgba(15,56,110,.2)] transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none sm:p-10"
            >
              <div>
                <div className="flex items-center gap-4 sm:gap-5">
                  <span
                    className={`font-sans text-5xl font-black tracking-tight sm:text-6xl ${config.numColor}`}
                  >
                    {config.number}
                  </span>
                  <div>
                    <h3 className="font-sans text-2xl font-black tracking-tight text-[#082352] sm:text-3xl lg:text-4xl">
                      {section.title}
                    </h3>
                  </div>
                </div>

                <div
                  className="my-6 h-px w-full bg-slate-100"
                  aria-hidden="true"
                />

                {section.intro ? (
                  <p className="mb-6 text-lg font-semibold leading-relaxed text-slate-700 sm:text-xl">
                    {section.intro}
                  </p>
                ) : null}

                <ul className="mt-7 space-y-4">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-3.5">
                      <span
                        className={`mt-1.5 grid size-5 shrink-0 place-items-center rounded-full ${config.checkBg} shadow-2xs sm:size-5.5`}
                      >
                        <svg
                          viewBox="0 0 16 16"
                          fill="currentColor"
                          className="size-3"
                          aria-hidden="true"
                        >
                          <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                        </svg>
                      </span>
                      {renderItemText(item)}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>

      {/* Bottom Mission CTA */}
      <div className="mt-14 flex flex-col items-center justify-center gap-5 text-center">
        <div className="inline-flex items-center gap-2.5 text-lg font-bold text-blue-700 sm:text-xl lg:text-2xl">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-6 shrink-0"
            aria-hidden="true"
          >
            <circle cx="8" cy="8" r="2.4" />
            <circle cx="16" cy="8.5" r="2.1" />
            <path d="M3.5 19c.35-3.3 1.95-5.1 4.5-5.1s4.15 1.8 4.5 5.1M13.15 14.2c.75-.45 1.7-.65 2.85-.65 2.35 0 3.85 1.55 4.2 4.45" />
          </svg>
          <span>{ctaText}</span>
        </div>
        <Link
          href="/register"
          className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-blue-600 px-9 text-lg font-extrabold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:text-xl"
        >
          {ctaButton} →
        </Link>
      </div>
    </section>
  );
}

function PrincipleIcon({ index }: Readonly<{ index: number }>) {
  if (index === 0) {
    return (
      <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-xl border border-blue-200/80 bg-blue-50 text-blue-600 shadow-xs">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="4" r="1.75" />
          <circle cx="20" cy="12" r="1.75" />
          <circle cx="12" cy="20" r="1.75" />
          <circle cx="4" cy="12" r="1.75" />
          <path d="M12 5.75v3.25M18.25 12H15M12 18.25V15M5.75 12H9" />
        </svg>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-xl border border-indigo-200/80 bg-indigo-50 text-indigo-600 shadow-xs">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4"
          aria-hidden="true"
        >
          <path d="M12 2 2 7l10 5 10-5-10-5Z" />
          <path d="m2 17 10 5 10-5" />
          <path d="m2 12 10 5 10-5" />
        </svg>
      </div>
    );
  }
  return (
    <div className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-xl border border-emerald-200/80 bg-emerald-50 text-emerald-600 shadow-xs">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4"
        aria-hidden="true"
      >
        <path d="m11 17 2 2a1 1 0 0 0 1.4 0l3.6-3.6a1 1 0 0 0 0-1.4l-2.6-2.6M14 6l-2-2a1 1 0 0 0-1.4 0L7 7.6a1 1 0 0 0 0 1.4l2.6 2.6M18 10l2.5 2.5a1 1 0 0 1 0 1.4L17 17.5M6 14 3.5 11.5a1 1 0 0 1 0-1.4L7 6.5M10.5 13.5l3-3" />
      </svg>
    </div>
  );
}

function OperatingMechanismDiagram({
  data,
}: Readonly<{
  data: OperationMechanism;
}>) {
  return (
    <section id="operating-mechanism" className="scroll-mt-24 pb-16 lg:pb-24">
      {/* Header */}
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="font-sans text-3xl font-black tracking-tight text-[#082352] sm:text-4xl lg:text-5xl">
          {data.title}
        </h2>
        <p className="mx-auto mt-3 max-w-3xl text-lg font-semibold leading-relaxed text-slate-600 sm:text-xl lg:text-2xl">
          {data.subtitle}
        </p>
      </div>

      {/* Main Infographic / Diagram Container */}
      <div className="relative mt-12 overflow-hidden rounded-3xl border border-blue-100/90 bg-[#f8fbff] p-6 shadow-[0_20px_50px_-30px_rgba(20,60,130,0.12)] sm:p-8 lg:p-12">
        <NetworkMesh className="pointer-events-none absolute -left-12 -top-10 h-40 w-72 text-blue-400/20" />
        <NetworkMesh className="pointer-events-none absolute -bottom-12 -right-12 h-44 w-80 rotate-180 text-blue-400/20" />

        {/* 3 Core Cards with Relational Arrows */}
        <div className="relative z-10 grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:gap-4 xl:gap-6">
          {/* 1. Founder Card */}
          <div className="flex flex-col items-center rounded-3xl border border-blue-200/80 bg-white p-7 text-center shadow-sm transition hover:shadow-md sm:p-8">
            <div className="mb-4 grid size-16 place-items-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600 shadow-sm sm:size-18">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-8 sm:size-9"
                aria-hidden="true"
              >
                <path d="M3 21h18M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M12 3 2 8h20Z" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-black leading-tight text-[#082352] sm:text-3xl">
              {data.founder.title}
            </h3>
            <p className="mt-1 text-base font-semibold text-slate-500 sm:text-lg">
              {data.founder.subtitle}
            </p>

            <div className="mt-6 flex w-full flex-1 flex-col justify-between rounded-2xl border border-blue-100/90 bg-[#f4f8fe] p-5 text-left sm:p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="mt-1 size-5 shrink-0 text-blue-600"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-base font-medium leading-relaxed text-slate-800 sm:text-lg">
                    {data.founder.items[0]}
                  </span>
                </div>

                <div className="border-t border-dashed border-blue-200/90 pt-3.5">
                  <div className="flex items-start gap-3">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="mt-1 size-5 shrink-0 text-blue-600"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-base font-medium leading-relaxed text-slate-800 sm:text-lg">
                      {data.founder.items[1]}
                    </span>
                  </div>
                </div>

                <div className="border-t border-dashed border-blue-200/90 pt-3.5">
                  <div className="flex items-start gap-3">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="mt-1 size-5 shrink-0 text-blue-600"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <span className="block text-sm font-bold text-slate-600 sm:text-base">
                        {data.founder.regCodeLabel}
                      </span>
                      <span className="mt-0.5 block font-mono text-xl font-black tracking-wide text-blue-700 sm:text-2xl">
                        {data.founder.regCode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow 1: Sáng lập và vận hành */}
          <div className="flex flex-col items-center justify-center py-2 lg:py-0">
            <span className="mb-2 max-w-[140px] text-center text-sm font-extrabold text-slate-800 sm:text-base">
              {data.arrow1}
            </span>
            <div className="hidden lg:block">
              <svg
                width="64"
                height="20"
                viewBox="0 0 64 20"
                fill="none"
                className="text-blue-600"
                aria-hidden="true"
              >
                <path
                  d="M0 10h56M48 2l8 8-8 8"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="lg:hidden">
              <svg
                width="20"
                height="36"
                viewBox="0 0 20 36"
                fill="none"
                className="text-blue-600"
                aria-hidden="true"
              >
                <path
                  d="M10 0v28M2 20l8 8 8-8"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* 2. Center Card: Operating Mechanism */}
          <div className="flex flex-col items-center justify-between rounded-3xl border-2 border-blue-300 bg-white p-7 text-center shadow-[0_12px_36px_-14px_rgba(37,99,235,0.22)] transition hover:shadow-lg sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 grid size-16 place-items-center rounded-2xl border border-blue-200 bg-blue-50 text-blue-600 shadow-sm sm:size-18">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-8 sm:size-9"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="18" r="3" />
                  <path d="M12 9v3M12 12l-4.5 3.5M12 12l4.5 3.5M9 18h6" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl font-black leading-tight text-[#082352] sm:text-3xl">
                {data.mechanism.title}
              </h3>
            </div>

            <div className="my-6 w-full text-center">
              <div className="rounded-2xl border border-blue-200 bg-blue-50/90 px-5 py-3.5 shadow-inner">
                <span className="block text-lg font-black tracking-tight text-blue-700 sm:text-xl">
                  {data.mechanism.badge}
                </span>
              </div>
            </div>

            <p className="text-center text-base font-semibold text-slate-700 sm:text-lg">
              {data.mechanism.subtitle}
            </p>
          </div>

          {/* Arrow 2: Tham gia bằng Thỏa thuận */}
          <div className="flex flex-col items-center justify-center py-2 lg:py-0">
            <span className="mb-2 max-w-[140px] text-center text-sm font-extrabold text-slate-800 sm:text-base">
              {data.arrow2}
            </span>
            <div className="hidden lg:block">
              <svg
                width="64"
                height="20"
                viewBox="0 0 64 20"
                fill="none"
                className="text-emerald-600"
                aria-hidden="true"
              >
                <path
                  d="M0 10h56M48 2l8 8-8 8"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="lg:hidden">
              <svg
                width="20"
                height="36"
                viewBox="0 0 20 36"
                fill="none"
                className="text-emerald-600"
                aria-hidden="true"
              >
                <path
                  d="M10 0v28M2 20l8 8 8-8"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* 3. Partner Card */}
          <div className="flex flex-col items-center rounded-3xl border border-emerald-200/80 bg-white p-7 text-center shadow-sm transition hover:shadow-md sm:p-8">
            <div className="mb-4 grid size-16 place-items-center rounded-2xl border border-emerald-100 bg-emerald-50 text-emerald-600 shadow-sm sm:size-18">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-8 sm:size-9"
                aria-hidden="true"
              >
                <path d="m11 17 2 2a1 1 0 0 0 1.4 0l3.6-3.6a1 1 0 0 0 0-1.4l-2.6-2.6M14 6l-2-2a1 1 0 0 0-1.4 0L7 7.6a1 1 0 0 0 0 1.4l2.6 2.6M18 10l2.5 2.5a1 1 0 0 1 0 1.4L17 17.5M6 14 3.5 11.5a1 1 0 0 1 0-1.4L7 6.5M10.5 13.5l3-3" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl font-black leading-tight text-[#082352] sm:text-3xl">
              {data.partner.title}
            </h3>
            <div className="mt-1 h-6" aria-hidden="true" />

            <div className="mt-6 flex w-full flex-1 flex-col justify-start rounded-2xl border border-emerald-100/90 bg-[#f4fdf8] p-5 text-left sm:p-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="mt-1 size-5 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-base font-medium leading-relaxed text-slate-800 sm:text-lg">
                    {data.partner.items[0]}
                  </span>
                </div>

                <div className="border-t border-dashed border-emerald-200/90 pt-3.5">
                  <div className="flex items-start gap-3">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="mt-1 size-5 shrink-0 text-emerald-600"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-base font-medium leading-relaxed text-slate-800 sm:text-lg">
                      {data.partner.items[1]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Foundation Connector Area */}
        <div className="relative mt-10 flex flex-col items-center">
          <div className="h-10 w-px border-l-2 border-dashed border-blue-400" />

          <div className="relative z-10 flex items-center gap-4 rounded-2xl border-2 border-blue-200/90 bg-white px-7 py-4 shadow-sm">
            <div className="grid size-12 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-600 sm:size-14">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-7"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <path d="M9 15a3 3 0 0 0 3 3 3 3 0 0 0 3-3v-2.5L12 11l-3 1.5Z" />
              </svg>
            </div>
            <div className="text-left">
              <span className="block text-lg font-black leading-snug text-[#082352] sm:text-xl">
                {data.legalBasis.title}
              </span>
              <span className="block text-sm font-bold text-blue-600 sm:text-base">
                {data.legalBasis.subtitle}
              </span>
            </div>
          </div>

          {/* Desktop SVG dashed lines pointing up to Founder & Partner cards */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-0 hidden -translate-y-1/2 lg:block">
            <svg
              viewBox="0 0 1000 80"
              fill="none"
              className="h-20 w-full text-blue-500"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Left connector to card 1 */}
              <path
                d="M 340 40 L 150 40 L 150 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeDasharray="4 4"
              />
              <polygon points="150,4 145,14 155,14" fill="currentColor" />

              {/* Right connector to card 3 */}
              <path
                d="M 660 40 L 850 40 L 850 12"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeDasharray="4 4"
              />
              <polygon points="850,4 845,14 855,14" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Bottom Core Principles Bar */}
        <div className="mt-12 flex flex-col gap-6 rounded-3xl border border-blue-100/90 bg-white p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center lg:gap-8 lg:p-9">
          <div className="flex shrink-0 items-center gap-4 lg:border-r lg:border-slate-200 lg:pr-8">
            <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-blue-600 text-white shadow-md">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-7"
                aria-hidden="true"
              >
                <path d="M12 3v18M6 7h12M6 7l-3 6h6L6 7Zm12 0-3 6h6l-3-6ZM4 21h16" />
              </svg>
            </div>
            <h4 className="font-serif text-xl font-black text-[#082352] sm:text-2xl">
              {data.principlesTitle}
            </h4>
          </div>

          <div className="grid flex-1 gap-5 sm:grid-cols-3 lg:gap-8">
            {data.principles.map((principle, index) => (
              <div key={principle.title} className="flex items-start gap-3.5">
                <PrincipleIcon index={index} />
                <div>
                  <h5 className="text-base font-extrabold text-slate-900 sm:text-lg md:text-xl">
                    {principle.title}
                  </h5>
                  <p className="mt-1 text-sm font-medium text-slate-700 sm:text-base">
                    {principle.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
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
        {/* LIGHT INSTITUTIONAL VIETNAM-RUSSIA HERO */}
        <section className="relative isolate min-h-[580px] overflow-hidden bg-white text-slate-900 sm:min-h-[640px] lg:min-h-[700px]">
          {/* Full-color High-Resolution Vietnam-Russia Network Artwork */}
          <Image
            src="/images/about-light-hero-v2.png"
            alt=""
            fill
            sizes="100vw"
            unoptimized
            className="pointer-events-none select-none object-cover object-[80%_center] lg:object-right"
            priority
            aria-hidden="true"
          />

          {/* Soft natural bottom gradient transition */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#f6f9fe] to-transparent"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto flex min-h-[580px] max-w-[1460px] flex-col justify-center px-4 py-16 sm:min-h-[640px] sm:px-6 lg:min-h-[700px] lg:px-8 lg:py-24">
            <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl pl-2 sm:pl-4">
              {/* Eyebrow with horizontal line */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold uppercase tracking-wider text-blue-600 sm:text-base">
                  {t.eyebrow}
                </span>
                <div
                  className="h-0.5 w-12 rounded-full bg-blue-400/80"
                  aria-hidden="true"
                />
              </div>

              {/* Main Heading (Editorial Typography, 2 Lines) */}
              <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-[#071936] sm:text-5xl lg:text-6xl xl:text-[3.8rem] leading-[1.12]">
                <span className="block">{t.heroTitleLine1}</span>
                <span className="mt-1 block">{t.heroTitleLine2}</span>
              </h1>

              {/* Description */}
              <p className="mt-5 max-w-2xl text-base font-normal leading-relaxed text-slate-700 sm:text-lg sm:leading-8">
                {t.intro}
              </p>

              {/* Metadata row */}
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-bold tracking-wider text-blue-900 uppercase sm:text-sm">
                {t.heroMetadata.map((item, idx) => (
                  <span key={item} className="flex items-center gap-3">
                    <span>{item}</span>
                    {idx < t.heroMetadata.length - 1 ? (
                      <span
                        className="font-bold text-blue-400"
                        aria-hidden="true"
                      >
                        •
                      </span>
                    ) : null}
                  </span>
                ))}
              </div>

              {/* 3 Action Buttons / Cards in Hero */}
              <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-3.5">
                <a
                  href="#operating-mechanism"
                  className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition duration-150 hover:-translate-y-0.5 hover:bg-blue-700 sm:px-5 sm:py-3.5 sm:text-base"
                >
                  <span className="grid size-7 place-items-center rounded-xl bg-blue-500/80 text-white sm:size-8">
                    <svg
                      className="size-4.5 sm:size-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                  </span>
                  <span>{t.heroNav.mechanism}</span>
                </a>

                <a
                  href="#board"
                  className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-white/95 px-4 py-3 text-sm font-bold text-[#071936] shadow-2xs backdrop-blur-md transition duration-150 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:text-blue-700 sm:px-5 sm:py-3.5 sm:text-base"
                >
                  <span className="grid size-7 place-items-center rounded-xl bg-blue-50 text-blue-600 sm:size-8">
                    <svg
                      className="size-4.5 sm:size-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </span>
                  <span>{t.boardTitle}</span>
                </a>

                <a
                  href="#participating-partners"
                  className="inline-flex items-center gap-2 rounded-2xl border border-blue-200 bg-white/95 px-4 py-3 text-sm font-bold text-[#071936] shadow-2xs backdrop-blur-md transition duration-150 hover:-translate-y-0.5 hover:border-blue-300 hover:bg-white hover:text-blue-700 sm:px-5 sm:py-3.5 sm:text-base"
                >
                  <span className="grid size-7 place-items-center rounded-xl bg-blue-50 text-blue-600 sm:size-8">
                    <svg
                      className="size-4.5 sm:size-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                      <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                      <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                      <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                    </svg>
                  </span>
                  <div className="flex flex-col text-left leading-tight">
                    <span className="font-extrabold text-blue-700">26+</span>
                    <span className="text-xs text-slate-700 sm:text-sm">
                      {PARTNER_COPY[locale].title}
                    </span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-8">
          <div>
            <div className="min-w-0">
              {/* 3 STRATEGIC HIGHLIGHTS CARDS (CONNECTED CONTAINER AS IN MOCKUP) */}
              <section
                id="about-overview"
                className="scroll-mt-24 pt-8 pb-16 lg:pt-10 lg:pb-24"
              >
                <div className="relative overflow-hidden rounded-3xl border border-blue-200/90 bg-white/95 p-8 shadow-xl shadow-blue-900/5 backdrop-blur-md sm:p-10 lg:p-12">
                  <ul className="relative grid gap-8 lg:grid-cols-3 lg:divide-x lg:divide-blue-100/90">
                    {t.highlights.map((item) => (
                      <li
                        key={item.title}
                        className="flex flex-col justify-between first:pl-0 lg:px-8 last:pr-0"
                      >
                        <div>
                          <h2 className="font-serif text-2xl font-bold text-[#071936] sm:text-3xl">
                            {item.title}
                          </h2>
                          <p className="mt-4 text-base font-normal leading-relaxed text-slate-600 sm:text-lg sm:leading-8">
                            {item.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              <MissionAndCoreOperations
                title={t.missionTitle}
                subtitle={t.missionSubtitle}
                sections={t.sections}
                ctaText={t.missionCtaText}
                ctaButton={t.missionCtaButton}
              />

              <OperatingMechanismDiagram data={t.operationMechanism} />

              <section id="board" className="py-16 lg:py-24">
                <div className="mx-auto max-w-4xl text-center">
                  <h2 className="font-sans text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                    {t.boardTitle}
                  </h2>
                </div>
                <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2">
                  {BOARD_MEMBERS.map((member, index) => (
                    <article
                      key={member.name}
                      className="relative flex flex-col justify-between overflow-hidden rounded-3xl border border-blue-200 bg-white/95 p-8 shadow-lg shadow-blue-950/5 backdrop-blur-xs transition duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none sm:p-9"
                    >
                      <div>
                        {/* 1. Name at the top */}
                        <h3 className="font-serif text-3xl font-black tracking-tight text-[#082352] sm:text-4xl">
                          {member.name}
                        </h3>

                        {/* 2. Role / Position Badge */}
                        <div className="mt-3">
                          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/80 px-4 py-1.5 text-xs font-extrabold text-blue-800 sm:text-sm">
                            <span
                              className="size-2 rounded-full bg-blue-600"
                              aria-hidden="true"
                            />
                            {t.boardRoles[index]}
                          </span>
                        </div>

                        {/* 3. Clean divider */}
                        <div
                          className="my-6 h-px w-full bg-slate-200"
                          aria-hidden="true"
                        />

                        {/* 4. Avatar & Contact Channels */}
                        <div className="flex items-center gap-6 sm:gap-7">
                          <div className="relative size-24 shrink-0 overflow-hidden rounded-full border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-slate-100 shadow-md ring-4 ring-blue-50 sm:size-28">
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              sizes="112px"
                              className="object-cover object-top"
                            />
                          </div>

                          <div className="flex flex-1 flex-col">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-500 sm:text-sm">
                              {t.contactLabel}:
                            </span>
                            <p className="mt-2.5 text-base font-bold text-slate-700">
                              {member.contact}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>

        <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="relative mx-auto flex max-w-[1460px] flex-col items-start justify-between gap-8 overflow-hidden rounded-3xl border-2 border-blue-200/90 bg-gradient-to-br from-white via-blue-50/70 to-blue-100/50 p-8 text-slate-900 shadow-xl shadow-blue-900/5 sm:p-12 lg:flex-row lg:items-center lg:p-14">
            {/* Subtle Decorative Ambient Glow */}
            <div
              className="pointer-events-none absolute -bottom-10 -right-10 size-80 rounded-full bg-blue-400/15 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-3xl">
              <h2 className="font-serif text-3xl font-black leading-tight tracking-tight text-[#071936] sm:text-4xl lg:text-5xl">
                {t.ctaTitle}
              </h2>
              <p className="mt-4 text-base font-normal leading-relaxed text-slate-600 sm:text-lg lg:text-xl">
                {t.ctaDescription}
              </p>

              {/* Institutional highlights */}
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-700 sm:text-sm">
                <span className="inline-flex items-center gap-2 rounded-xl border border-blue-200/80 bg-white/90 px-3.5 py-2 text-blue-900 shadow-2xs">
                  <span
                    className="size-1.5 rounded-full bg-blue-600"
                    aria-hidden="true"
                  />
                  Viện Hàn lâm, Trường ĐH & Doanh nghiệp
                </span>
                <span className="inline-flex items-center gap-2 rounded-xl border border-blue-200/80 bg-white/90 px-3.5 py-2 text-blue-900 shadow-2xs">
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
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-blue-600 px-8 py-4.5 text-base font-black text-white shadow-lg shadow-blue-600/25 transition duration-150 hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:text-lg"
              >
                <span>{t.cta}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section
          id="participating-partners"
          className="border-t border-blue-100 bg-[#edf5ff] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="mx-auto max-w-[1460px]">
            <h2 className="font-sans text-center text-3xl font-black tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
              {PARTNER_COPY[locale].title}
            </h2>
            {(["ru", "vi"] as const).map((country) => (
              <div key={country} className="mt-12">
                <h3 className="text-xl font-black text-slate-950 sm:text-2xl">
                  {PARTNER_COPY[locale][country]}
                </h3>
                <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {PARTNERS.filter(
                    (partner) => partner.country === country,
                  ).map((partner) => (
                    <li key={partner.url}>
                      <a
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={partner.name}
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

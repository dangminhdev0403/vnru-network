"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { newsArticleHref, OFFICIAL_NEWS } from "../data/official-news";
import { GuestPublicFooter } from "./GuestPublicFooter";
import { GuestPublicNav } from "./GuestPublicNav";

const HERO_BANNERS = [
  {
    id: "banner-1",
    src: "/brand/vnru-network-banner-2026.png",
    alt: "Mạng lưới tri thức Nga - Việt",
    objectPosition: "object-[68%_center]",
  },
  {
    id: "banner-2",
    src: "/brand/vnru-hero-slide-2.jpg",
    alt: "Biểu tượng Moskva và Hà Nội kết nối công nghệ",
    objectPosition: "object-center",
  },
  {
    id: "banner-3",
    src: "/brand/vnru-hero-slide-3.jpg",
    alt: "Quốc kỳ và công trình biểu tượng song phương Nga - Việt",
    objectPosition: "object-center",
  },
] as const;

const DEFAULT_FALLBACK_IMAGES = [
  "/images/news/article-1.webp",
  "/images/news/article-5.webp",
  "/images/news/article-6.webp",
  "/images/news/article-4.webp",
  "/images/news/article-7.webp",
  "/images/home-bilateral-gateway.jpg",
];

function formatTitle(title: string): string {
  if (!title) return "";
  const letters = title.replace(/[^a-zA-ZÀ-ỹ]/g, "");
  const uppercaseLetters = title.replace(/[^A-ZÀ-Ỹ]/g, "");
  if (letters.length > 5 && uppercaseLetters.length / letters.length > 0.7) {
    const lower = title.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
  return title;
}

export const HOME_COPY: Record<
  Locale,
  {
    eyebrow: string;
    titleMain: string;
    country1: string;
    hyphen: string;
    country2: string;
    title1: string;
    title2: string;
    title3: string;
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
    news: {
      title: string;
      viewAll: string;
      items: {
        id: number;
        category: string;
        categoryTone: string;
        title: string;
        date: string;
        image: string;
      }[];
    };
    ecosystem: {
      eyebrow: string;
      title: string;
      cardCta: string;
      cards: {
        icon: string;
        title: string;
        desc: string;
        href: string;
        tone: "blue" | "emerald" | "purple" | "amber";
      }[];
    };
    events: {
      eyebrow: string;
      title: string;
      viewAll: string;
      tabUpcoming: string;
      tabPast: string;
      registerBtn: string;
      items: {
        id: number;
        date: string;
        month: string;
        year: string;
        kind: string;
        title: string;
        place: string;
        time: string;
        image: string;
        isPast?: boolean;
      }[];
    };
    stats: {
      val: string | number;
      lbl: string;
      icon: string;
      tone: "blue" | "cyan" | "emerald" | "purple" | "amber";
    }[];
    bilateralGateway: {
      title: string;
      subtitle: string;
      foundationBadge: string;
      foundationName: string;
      foundationDesc: string;
      foundationHighlights: string[];
      learnMoreBtn: string;
      partnersBtn: string;
      pillars: {
        num: string;
        title: string;
        desc: string;
        icon: string;
      }[];
    };
    contactSection: {
      title: string;
      subtitle: string;
      infoTitle: string;
      infoDesc: string;
      coordinatorLabel: string;
      coordinatorValue: string;
      addressLabel: string;
      addressValue: string;
      supportLabel: string;
      supportValue: string;
      responseCommitment: string;
      formTitle: string;
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      messageLabel: string;
      messagePlaceholder: string;
      sendBtn: string;
      privacyNote: string;
      sentSuccess: string;
    };
    footer: {
      brandTitle: string;
      subtitle: string;
      desc: string;
      navTitle: string;
      pillarsTitle: string;
      contactTitle: string;
      hanoiOffice: string;
      hanoiAddress: string;
      moscowOffice: string;
      moscowAddress: string;
      supportLabel: string;
      nameLabel: string;
      emailLabel: string;
      messageLabel: string;
      sendLabel: string;
      mailClientHint: string;
      emailSubject: string;
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
    titleMain: "Mạng lưới tri thức",
    country1: "Nga",
    hyphen: "-",
    country2: "Việt",
    title1: "Mạng lưới Tri thức Nga – Việt",
    title2: "",
    title3: "",
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
    news: {
      title: "Tin tức",
      viewAll: "Xem tất cả tin tức →",
      items: [
        {
          id: 1,
          category: "HỢP TÁC",
          categoryTone: "bg-blue-600/90 text-white",
          title:
            "Diễn đàn hợp tác giáo dục Việt – Nga 2026: Mở rộng cơ hội kết nối",
          date: "12/05/2026",
          image:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 2,
          category: "GIÁO DỤC",
          categoryTone: "bg-emerald-600/90 text-white",
          title: "Ký kết thỏa thuận hợp tác giữa các trường đại học hàng đầu",
          date: "09/05/2026",
          image:
            "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 3,
          category: "KHOA HỌC",
          categoryTone: "bg-purple-600/90 text-white",
          title:
            "Dự án nghiên cứu chung về công nghệ vật liệu mới giữa VN và RU",
          date: "06/05/2026",
          image:
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 4,
          category: "VĂN HÓA",
          categoryTone: "bg-amber-600/90 text-white",
          title:
            "Ngày văn hóa Nga tại Việt Nam 2026: Kết nối di sản, lan tỏa hữu nghị",
          date: "02/05/2026",
          image:
            "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    ecosystem: {
      eyebrow: "Hệ sinh thái",
      title: "LIÊN KẾT TRI THỨC VIỆT – NGA",
      cardCta: "Khám phá →",
      cards: [
        {
          icon: "handshake",
          title: "Cơ hội hợp tác",
          desc: "Kết nối doanh nghiệp, tổ chức và cá nhân tìm kiếm cơ hội hợp tác bền vững.",
          href: "/opportunities",
          tone: "blue",
        },
        {
          icon: "groups",
          title: "Thành viên",
          desc: "Mạng lưới thành viên rộng khắp Việt Nam và Liên bang Nga, cùng chung tầm nhìn.",
          href: "/experts",
          tone: "emerald",
        },
        {
          icon: "insights",
          title: "Dự án & Kết quả",
          desc: "Các dự án nổi bật và những kết quả hợp tác đã đạt được giữa hai quốc gia.",
          href: "/opportunities",
          tone: "purple",
        },
        {
          icon: "menu_book",
          title: "Thư viện tri thức",
          desc: "Kho tri thức phong phú về nghiên cứu, báo cáo và tài liệu chuyên ngành.",
          href: "/knowledge",
          tone: "amber",
        },
      ],
    },
    events: {
      eyebrow: "Sự kiện",
      title: "Sự kiện",
      viewAll: "Xem tất cả sự kiện →",
      tabUpcoming: "Sắp diễn ra",
      tabPast: "Đã tổ chức",
      registerBtn: "Đăng ký tham gia",
      items: [
        {
          id: 1,
          date: "25",
          month: "THÁNG 8",
          year: "2026",
          kind: "HỘI THẢO",
          title: "Hội thảo hợp tác khoa học & công nghệ Việt – Nga 2026",
          place: "Hà Nội, Việt Nam",
          time: "08:30 - 17:00",
          image:
            "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
          isPast: false,
        },
        {
          id: 2,
          date: "10",
          month: "THÁNG 9",
          year: "2026",
          kind: "DIỄN ĐÀN",
          title: "Diễn đàn Doanh nghiệp Việt – Nga: Kết nối & Phát triển",
          place: "Moskva, Nga",
          time: "10:00 - 18:00",
          image:
            "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=800&q=80",
          isPast: false,
        },
        {
          id: 3,
          date: "20",
          month: "THÁNG 9",
          year: "2026",
          kind: "HỘI THẢO",
          title: "Trí tuệ nhân tạo và chuyển đổi số trong hợp tác VN – RU",
          place: "TP. Hồ Chí Minh, Việt Nam",
          time: "09:00 - 16:30",
          image:
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
          isPast: false,
        },
        {
          id: 4,
          date: "15",
          month: "THÁNG 5",
          year: "2026",
          kind: "TỌA ĐÀM",
          title: "Tọa đàm Chuyển giao công nghệ sinh học và vật liệu mới",
          place: "Hà Nội, Việt Nam",
          time: "14:00 - 17:30",
          image:
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
          isPast: true,
        },
        {
          id: 5,
          date: "20",
          month: "THÁNG 4",
          year: "2026",
          kind: "DIỄN ĐÀN",
          title: "Diễn đàn Nhà khoa học trẻ Việt – Nga lần thứ IV",
          place: "Moskva, Nga",
          time: "09:00 - 17:00",
          image:
            "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
          isPast: true,
        },
        {
          id: 6,
          date: "10",
          month: "THÁNG 3",
          year: "2026",
          kind: "HỘI NGHỊ",
          title: "Hội nghị Năng lượng sạch và Vật liệu tiên tiến song phương",
          place: "Đà Nẵng, Việt Nam",
          time: "08:30 - 16:00",
          image:
            "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
          isPast: true,
        },
      ],
    },
    stats: [
      {
        val: "2",
        lbl: "Quốc gia",
        icon: "public",
        tone: "blue",
      },
      {
        val: "500+",
        lbl: "Chuyên gia & Nhà khoa học",
        icon: "groups",
        tone: "cyan",
      },
      {
        val: "300+",
        lbl: "Dự án hợp tác song phương",
        icon: "hub",
        tone: "emerald",
      },
      {
        val: "20+",
        lbl: "Lĩnh vực nghiên cứu trọng điểm",
        icon: "science",
        tone: "purple",
      },
      {
        val: "50+",
        lbl: "Viện nghiên cứu & Trường đại học",
        icon: "account_balance",
        tone: "amber",
      },
    ],
    bilateralGateway: {
      title: "Cổng kết nối Hợp tác Song phương",
      subtitle:
        "Nền tảng liên kết chiến lược giữa giới trí thức, các viện hàn lâm, trường đại học trọng điểm và doanh nghiệp công nghệ cao của Liên bang Nga và Việt Nam.",
      foundationBadge: "Đơn vị sáng lập & Điều phối",
      foundationName: "Quỹ Truyền thống và Hữu nghị",
      foundationDesc:
        "Tổ chức phi thương mại đăng ký tại Bộ Tư pháp Liên bang Nga (Mã số: 1207700294020), trực tiếp sáng lập, sở hữu và điều phối trung tâm toàn bộ Mạng lưới tri thức Nga – Việt.",
      foundationHighlights: [
        "Hiện thực hóa định hướng đổi mới sáng tạo theo Nghị quyết 57-NQ/TW",
        "Đồng hành sự kiện trọng thể Năm Khoa học và Giáo dục Việt - Nga 2026",
        "Mô hình ký Thỏa thuận song phương trực tiếp, linh hoạt và minh bạch",
      ],
      learnMoreBtn: "Tìm hiểu về Mạng lưới",
      partnersBtn: "26+ Đối tác tham gia",
      pillars: [
        {
          num: "01",
          title: "Kết nối Trí thức & Viện trường",
          desc: "Quy tụ hơn 500+ giáo sư, tiến sĩ và nhà khoa học hàng đầu từ các viện hàn lâm, viện nghiên cứu và trường đại học hai nước.",
          icon: "groups",
        },
        {
          num: "02",
          title: "Đồng nghiên cứu & Chuyển giao R&D",
          desc: "Triển khai các dự án khoa học công nghệ mũi nhọn: AI, Vật liệu mới, Công nghệ sinh học, Năng lượng và Y dược tiên tiến.",
          icon: "hub",
        },
        {
          num: "03",
          title: "Thương mại hóa & Gắn kết Doanh nghiệp",
          desc: "Đưa kết quả nghiên cứu vào ứng dụng thực tiễn, làm cầu nối gắn kết chặt chẽ viện trường với khối doanh nghiệp công nghệ cao.",
          icon: "public",
        },
        {
          num: "04",
          title: "Đào tạo & Trao đổi Học thuật",
          desc: "Hỗ trợ học bổng, chương trình trao đổi giảng viên, nhà nghiên cứu và tổ chức Diễn đàn Tri thức Nga – Việt thường niên luân phiên.",
          icon: "education",
        },
      ],
    },
    contactSection: {
      title: "Kết nối với chúng tôi",
      subtitle:
        "Chúng tôi luôn sẵn sàng kết nối, hợp tác và đồng hành cùng cộng đồng khoa học Nga – Việt.",
      infoTitle: "Thông tin Mạng lưới",
      infoDesc:
        "Mạng lưới tri thức Nga – Việt được điều phối bởi Quỹ Truyền thống và Hữu nghị, kết nối các viện nghiên cứu, trường đại học và chuyên gia để thúc đẩy hợp tác khoa học – công nghệ, đổi mới sáng tạo và chuyển giao tri thức.",
      coordinatorLabel: "Đơn vị điều phối",
      coordinatorValue: "Quỹ Truyền thống và Hữu nghị",
      addressLabel: "Địa chỉ",
      addressValue:
        "125047, Moskva, Đường Tverskaya-Yamskaya số 1, Tòa nhà 30, Văn phòng 01B, Liên bang Nga",
      supportLabel: "Email",
      supportValue: "info@fonddruzhba.ru",
      responseCommitment:
        "Chúng tôi cam kết phản hồi trong vòng 01-02 ngày làm việc.",
      formTitle: "Gửi liên hệ",
      nameLabel: "Họ và tên *",
      namePlaceholder: "Nhập họ và tên của bạn",
      emailLabel: "Email *",
      emailPlaceholder: "Nhập email của bạn",
      messageLabel: "Nội dung liên hệ *",
      messagePlaceholder: "Nhập nội dung bạn muốn liên hệ...",
      sendBtn: "Gửi liên hệ",
      privacyNote:
        "Thông tin của bạn được bảo mật và chỉ sử dụng cho mục đích liên hệ.",
      sentSuccess: "Đã gửi thông tin liên hệ thành công!",
    },
    footer: {
      brandTitle: "Mạng lưới tri thức Nga - Việt",
      subtitle: "",
      desc: "Cổng thông tin & điều phối hợp tác khoa học công nghệ độc lập giữa các viện nghiên cứu, trường đại học trọng điểm của Việt Nam và Liên bang Nga.",
      navTitle: "Khám phá hệ sinh thái",
      pillarsTitle: "Hướng trọng điểm",
      contactTitle: "Điều phối & Liên hệ",
      hanoiOffice: "Văn phòng Điều phối Hà Nội:",
      hanoiAddress:
        "Viện Hàn lâm KH & CN Việt Nam (VAST), 18 Hoàng Quốc Việt, Cầu Giấy, Hà Nội",
      moscowOffice: "Quỹ Truyền thống và Hữu nghị:",
      moscowAddress:
        "125047, Moskva, Đường Tverskaya-Yamskaya số 1, Tòa nhà 30, Văn phòng 01B, Liên bang Nga",
      supportLabel: "Email:",
      nameLabel: "Họ và tên",
      emailLabel: "Email",
      messageLabel: "Nội dung liên hệ",
      sendLabel: "Gửi liên hệ",
      mailClientHint: "Nút gửi sẽ mở ứng dụng email trên thiết bị của bạn.",
      emailSubject: "Liên hệ từ Mạng lưới RU-VN",
      copyright: "© 2026 Mạng lưới tri thức Nga - Việt. Bảo lưu mọi quyền.",
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
    eyebrow: "Портал двустороннего сотрудничества",
    titleMain: "РОССИЙСКО-ВЬЕТНАМСКАЯ ИНТЕЛЛЕКТУАЛЬНАЯ СЕТЬ",
    country1: "",
    hyphen: "",
    country2: "",
    title1: "РОССИЙСКО-ВЬЕТНАМСКАЯ",
    title2: "ИНТЕЛЛЕКТУАЛЬНАЯ СЕТЬ",
    title3: "",
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
          title: "Направления исследований 2026",
          tag: "Наука",
          desc: "Приоритет ИИ, морские науки, наноматериалы, чистая энергетика и трансфер технологий.",
        },
      ],
      cta: "Смотреть возможности сотрудничества →",
    },
    news: {
      title: "Новости",
      viewAll: "Все новости →",
      items: [
        {
          id: 1,
          category: "Сотрудничество",
          categoryTone: "bg-blue-600/90 text-white",
          title:
            "Форум образовательного сотрудничества Россия – Вьетнам 2026: Новые горизонты",
          date: "12/05/2026",
          image:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 2,
          category: "Образование",
          categoryTone: "bg-emerald-600/90 text-white",
          title:
            "Подписание соглашений о сотрудничестве между ведущими университетами",
          date: "09/05/2026",
          image:
            "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 3,
          category: "Наука",
          categoryTone: "bg-purple-600/90 text-white",
          title:
            "Совместный исследовательский проект по новым материалам РФ и ВР",
          date: "06/05/2026",
          image:
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 4,
          category: "Культура",
          categoryTone: "bg-amber-600/90 text-white",
          title:
            "Дни российской культуры во Вьетнаме 2026: Диалог наследия и дружбы",
          date: "02/05/2026",
          image:
            "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    ecosystem: {
      eyebrow: "Экосистема",
      title: "Научно-образовательный мост Россия – Вьетнам",
      cardCta: "Исследовать →",
      cards: [
        {
          icon: "handshake",
          title: "Возможности сотрудничества",
          desc: "Связь предприятий, организаций и ученых для долгосрочного партнерства.",
          href: "/opportunities",
          tone: "blue",
        },
        {
          icon: "groups",
          title: "Участники",
          desc: "Широкая сеть участников по всему Вьетнаму и России с единым видением.",
          href: "/experts",
          tone: "emerald",
        },
        {
          icon: "insights",
          title: "Проекты и результаты",
          desc: "Ключевые проекты и достигнутые результаты совместной работы.",
          href: "/opportunities",
          tone: "purple",
        },
        {
          icon: "menu_book",
          title: "Библиотека знаний",
          desc: "Богатая база знаний: исследования, отчеты и профильные материалы.",
          href: "/knowledge",
          tone: "amber",
        },
      ],
    },
    events: {
      eyebrow: "События",
      title: "События",
      viewAll: "Все события →",
      tabUpcoming: "Предстоящие",
      tabPast: "Прошедшие",
      registerBtn: "Зарегистрироваться",
      items: [
        {
          id: 1,
          date: "25",
          month: "АВГУСТА",
          year: "2026",
          kind: "СИМПОЗИУМ",
          title:
            "Симпозиум по научно-технологическому сотрудничеству Вьетнам – Россия 2026",
          place: "Ханой, Вьетнам",
          time: "08:30 - 17:00",
          image:
            "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
          isPast: false,
        },
        {
          id: 2,
          date: "10",
          month: "СЕНТЯБРЯ",
          year: "2026",
          kind: "ФОРУМ",
          title: "Бизнес-форум Вьетнам – Россия: Партнерство и развитие",
          place: "Москва, Россия",
          time: "10:00 - 18:00",
          image:
            "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=800&q=80",
          isPast: false,
        },
        {
          id: 3,
          date: "20",
          month: "СЕНТЯБРЯ",
          year: "2026",
          kind: "СИМПОЗИУМ",
          title:
            "Искусственный интеллект и цифровая трансформация в сотрудничестве VN – RU",
          place: "Хошимин, Вьетнам",
          time: "09:00 - 16:30",
          image:
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
          isPast: false,
        },
        {
          id: 4,
          date: "15",
          month: "МАЯ",
          year: "2026",
          kind: "КРУГЛЫЙ СТОЛ",
          title: "Круглый стол по трансферу биотехнологий и новых материалов",
          place: "Ханой, Вьетнам",
          time: "14:00 - 17:30",
          image:
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
          isPast: true,
        },
        {
          id: 5,
          date: "20",
          month: "АПРЕЛЯ",
          year: "2026",
          kind: "ФОРУМ",
          title: "IV Форум молодых ученых Россия – Вьетнам",
          place: "Москва, Россия",
          time: "09:00 - 17:00",
          image:
            "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
          isPast: true,
        },
        {
          id: 6,
          date: "10",
          month: "МАРТА",
          year: "2026",
          kind: "КОНФЕРЕНЦИЯ",
          title: "Двусторонняя конференция по чистой энергетике и материалам",
          place: "Дананг, Вьетнам",
          time: "08:30 - 16:00",
          image:
            "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
          isPast: true,
        },
      ],
    },
    stats: [
      {
        val: "2",
        lbl: "Страны",
        icon: "public",
        tone: "blue",
      },
      {
        val: "500+",
        lbl: "Ученых и экспертов",
        icon: "groups",
        tone: "cyan",
      },
      {
        val: "300+",
        lbl: "Совместных проектов",
        icon: "hub",
        tone: "emerald",
      },
      {
        val: "20+",
        lbl: "Приоритетных направлений",
        icon: "science",
        tone: "purple",
      },
      {
        val: "50+",
        lbl: "Институтов и университетов",
        icon: "account_balance",
        tone: "amber",
      },
    ],
    bilateralGateway: {
      title: "Шлюз двустороннего сотрудничества",
      subtitle:
        "Стратегическая платформа взаимодействия академического сообщества, ведущих институтов, университетов и высокотехнологичных предприятий России и Вьетнама.",
      foundationBadge: "Учредитель и координатор",
      foundationName: "Фонд «Традиции и дружба»",
      foundationDesc:
        "Некоммерческая организация, зарегистрированная в Минюсте РФ (ОГРН: 1207700294020), выступающая единственным учредителем и центральным координационным органом РОССИЙСКО-ВЬЕТНАМСКАЯ ИНТЕЛЛЕКТУАЛЬНАЯ СЕТЬ.",
      foundationHighlights: [
        "Реализация курса на инновации и высокие технологии (Резолюция 57-NQ/TW)",
        "Поддержка ключевого события — Года науки и образования Россия — Вьетнам 2026",
        "Модель прямого двустороннего сотрудничества на основе соглашений",
      ],
      learnMoreBtn: "О Сети знаний",
      partnersBtn: "26+ Партнёрских организаций",
      pillars: [
        {
          num: "01",
          title: "Объединение учёных и вузов",
          desc: "Привлечение более 500 ведущих учёных, профессоров и экспертов из академических институтов и университетов двух стран.",
          icon: "groups",
        },
        {
          num: "02",
          title: "Совместные НИОКР и трансфер",
          desc: "Реализация ключевых проектов в области ИИ, новых материалов, биотехнологий, энергетики и передовой медицины.",
          icon: "hub",
        },
        {
          num: "03",
          title: "Связь с индустрией и бизнесом",
          desc: "Коммерциализация результатов исследований и практическое внедрение передовых технологий в промышленность.",
          icon: "public",
        },
        {
          num: "04",
          title: "Образование и академический обмен",
          desc: "Поддержка стипендий, программ обмена и регулярное проведение Российско-Вьетнамского форума знаний.",
          icon: "education",
        },
      ],
    },
    contactSection: {
      title: "Связь и контакты",
      subtitle:
        "Мы всегда готовы к диалогу, партнерству и поддержке научно-технологического сообщества России и Вьетнама.",
      infoTitle: "О сети",
      infoDesc:
        "РОССИЙСКО-ВЬЕТНАМСКАЯ ИНТЕЛЛЕКТУАЛЬНАЯ СЕТЬ координируется Фондом «Традиции и дружба», объединяя институты, университеты и ученых для развития науки, инноваций и трансфера знаний.",
      coordinatorLabel: "Координатор",
      coordinatorValue: "Фонд «Традиции и дружба»",
      addressLabel: "Адрес",
      addressValue:
        "125047, Москва, 1-я Тверская-Ямская улица, д.30, к. 01Б, Российская Федерация",
      supportLabel: "Email",
      supportValue: "info@fonddruzhba.ru",
      responseCommitment:
        "Мы ответим на ваше обращение в течение 1–2 рабочих дней.",
      formTitle: "Отправить запрос",
      nameLabel: "ФИО *",
      namePlaceholder: "Введите ваше имя",
      emailLabel: "Email *",
      emailPlaceholder: "Введите ваш email",
      messageLabel: "Сообщение *",
      messagePlaceholder: "Введите текст вашего обращения...",
      sendBtn: "Отправить сообщение",
      privacyNote:
        "Ваши данные защищены и используются исключительно для связи.",
      sentSuccess: "Ваше сообщение успешно отправлено!",
    },
    footer: {
      brandTitle: "РОССИЙСКО-ВЬЕТНАМСКАЯ ИНТЕЛЛЕКТУАЛЬНАЯ СЕТЬ",
      subtitle: "",
      desc: "Независимый портал координации научно-технологического сотрудничества между ведущими институтами и университетами Вьетнама и Российской Федерации.",
      navTitle: "Экосистема сети",
      pillarsTitle: "Ключевые направления",
      contactTitle: "Координация и контакты",
      hanoiOffice: "Координационный офис в Ханое:",
      hanoiAddress:
        "Вьетнамская академия наук и технологий (ВАНТ), ул. Хоанг Куок Вьет, 18, Ханой",
      moscowOffice: "Фонд «Традиции и дружба»:",
      moscowAddress:
        "125047, Москва, 1-я Тверская-Ямская улица, д.30, к. 01Б, Российская Федерация",
      supportLabel: "Email:",
      nameLabel: "Имя и фамилия",
      emailLabel: "Электронная почта",
      messageLabel: "Сообщение",
      sendLabel: "Отправить",
      mailClientHint: "Кнопка откроет почтовое приложение на вашем устройстве.",
      emailSubject: "Обращение из сети RU-VN",
      copyright:
        "© 2026 РОССИЙСКО-ВЬЕТНАМСКАЯ ИНТЕЛЛЕКТУАЛЬНАЯ СЕТЬ. Все права защищены.",
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
    eyebrow: "Bilateral Cooperation Gateway",
    titleMain: "Knowledge Network",
    country1: "Russia",
    hyphen: "-",
    country2: "Vietnam",
    title1: "Science & Technology",
    title2: "Knowledge Network",
    title3: "Russia – Vietnam",
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
        desc: "Joint Funding & Shared Labs",
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
    news: {
      title: "News",
      viewAll: "View all news →",
      items: [
        {
          id: 1,
          category: "COLLABORATION",
          categoryTone: "bg-blue-600/90 text-white",
          title:
            "Vietnam – Russia Education Forum 2026: Expanding Partnerships",
          date: "12/05/2026",
          image:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 2,
          category: "EDUCATION",
          categoryTone: "bg-emerald-600/90 text-white",
          title: "Cooperation Agreements Signed Between Leading Universities",
          date: "09/05/2026",
          image:
            "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 3,
          category: "SCIENCE",
          categoryTone: "bg-purple-600/90 text-white",
          title:
            "Joint Research Project on Advanced Materials Between VN and RU",
          date: "06/05/2026",
          image:
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 4,
          category: "CULTURE",
          categoryTone: "bg-amber-600/90 text-white",
          title:
            "Russian Culture Day in Vietnam 2026: Heritage & Enduring Friendship",
          date: "02/05/2026",
          image:
            "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
        },
      ],
    },
    ecosystem: {
      eyebrow: "Ecosystem",
      title: "VIETNAM – RUSSIA KNOWLEDGE NETWORK",
      cardCta: "Explore →",
      cards: [
        {
          icon: "handshake",
          title: "Collaboration Opportunities",
          desc: "Connecting businesses, institutions, and researchers for sustainable partnership.",
          href: "/opportunities",
          tone: "blue",
        },
        {
          icon: "groups",
          title: "Members",
          desc: "Broad network of verified members across Vietnam and the Russian Federation.",
          href: "/experts",
          tone: "emerald",
        },
        {
          icon: "insights",
          title: "Projects & Outcomes",
          desc: "Featured research projects and high-impact bilateral milestones.",
          href: "/opportunities",
          tone: "purple",
        },
        {
          icon: "menu_book",
          title: "Knowledge Library",
          desc: "Rich repository of research publications, technical reports, and datasets.",
          href: "/knowledge",
          tone: "amber",
        },
      ],
    },
    events: {
      eyebrow: "Events",
      title: "Events",
      viewAll: "View all events →",
      tabUpcoming: "Upcoming",
      tabPast: "Past Events",
      registerBtn: "Register now",
      items: [
        {
          id: 1,
          date: "25",
          month: "AUG",
          year: "2026",
          kind: "SYMPOSIUM",
          title: "Vietnam – Russia Science & Technology Symposium 2026",
          place: "Hanoi, Vietnam",
          time: "08:30 - 17:00",
          image:
            "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
          isPast: false,
        },
        {
          id: 2,
          date: "10",
          month: "SEP",
          year: "2026",
          kind: "FORUM",
          title: "Vietnam – Russia Business Forum: Connection & Growth",
          place: "Moscow, Russia",
          time: "10:00 - 18:00",
          image:
            "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=800&q=80",
          isPast: false,
        },
        {
          id: 3,
          date: "20",
          month: "SEP",
          year: "2026",
          kind: "SYMPOSIUM",
          title:
            "Artificial Intelligence and Digital Transformation in VN – RU",
          place: "Ho Chi Minh City, Vietnam",
          time: "09:00 - 16:30",
          image:
            "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
          isPast: false,
        },
        {
          id: 4,
          date: "15",
          month: "MAY",
          year: "2026",
          kind: "ROUNDTABLE",
          title: "Roundtable on Biotechnology and Advanced Materials Transfer",
          place: "Hanoi, Vietnam",
          time: "14:00 - 17:30",
          image:
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
          isPast: true,
        },
        {
          id: 5,
          date: "20",
          month: "APR",
          year: "2026",
          kind: "FORUM",
          title: "4th Vietnam – Russia Young Scientists Forum",
          place: "Moscow, Russia",
          time: "09:00 - 17:00",
          image:
            "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
          isPast: true,
        },
        {
          id: 6,
          date: "10",
          month: "MAR",
          year: "2026",
          kind: "CONFERENCE",
          title: "Bilateral Conference on Clean Energy and Advanced Materials",
          place: "Da Nang, Vietnam",
          time: "08:30 - 16:00",
          image:
            "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80",
          isPast: true,
        },
      ],
    },
    stats: [
      {
        val: "2",
        lbl: "Countries",
        icon: "public",
        tone: "blue",
      },
      {
        val: "500+",
        lbl: "Scientists & Experts",
        icon: "groups",
        tone: "cyan",
      },
      {
        val: "300+",
        lbl: "Joint Research Projects",
        icon: "hub",
        tone: "emerald",
      },
      {
        val: "20+",
        lbl: "Strategic Research Pillars",
        icon: "science",
        tone: "purple",
      },
      {
        val: "50+",
        lbl: "Partner Institutes & Universities",
        icon: "account_balance",
        tone: "amber",
      },
    ],
    bilateralGateway: {
      title: "Bilateral Cooperation Gateway",
      subtitle:
        "Strategic connection platform uniting intellectuals, leading academies, top universities, and high-tech enterprises of the Russian Federation and Vietnam.",
      foundationBadge: "Founding & Coordinating Entity",
      foundationName: "Tradition and Friendship Foundation",
      foundationDesc:
        "Non-profit organization registered with the Ministry of Justice of the Russian Federation (Reg. No. 1207700294020), serving as the sole founder, owner, and central coordinator of the Russia – Vietnam Knowledge Network.",
      foundationHighlights: [
        "Advancing innovation & high-tech priorities under Resolution 57-NQ/TW",
        "Supporting the landmark Vietnam - Russia Year of Science & Education 2026",
        "Direct bilateral cooperation model: transparent, agile, and sustainable",
      ],
      learnMoreBtn: "About the Network",
      partnersBtn: "26+ Partner Institutions",
      pillars: [
        {
          num: "01",
          title: "Academic & Scholar Network",
          desc: "Bringing together 500+ leading scientists, professors, and experts from renowned academies and universities of both countries.",
          icon: "groups",
        },
        {
          num: "02",
          title: "Joint R&D & Tech Transfer",
          desc: "Executing breakthrough projects in AI, advanced materials, biotechnology, clean energy, and medicine.",
          icon: "hub",
        },
        {
          num: "03",
          title: "Enterprise & Practical Application",
          desc: "Commercializing research outcomes and bridging academia with tech industry leaders in both nations.",
          icon: "public",
        },
        {
          num: "04",
          title: "Education & Academic Exchange",
          desc: "Supporting scholarships, researcher exchanges, and the annual bilateral Russia - Vietnam Knowledge Forum.",
          icon: "education",
        },
      ],
    },
    contactSection: {
      title: "Connect & Inquiries",
      subtitle:
        "We are always open to collaboration, partnership, and joint scientific initiatives between Russia and Vietnam.",
      infoTitle: "About the Network",
      infoDesc:
        "The Russia – Vietnam Knowledge Network is coordinated by the Traditions & Friendship Foundation, connecting institutes, universities, and researchers to foster bilateral R&D, innovation, and knowledge transfer.",
      coordinatorLabel: "Coordinating Body",
      coordinatorValue: "Traditions & Friendship Foundation",
      addressLabel: "Address",
      addressValue:
        "125047, Moscow, 1st Tverskaya-Yamskaya St., Bldg 30, Office 01B, Russian Federation",
      supportLabel: "Email",
      supportValue: "info@fonddruzhba.ru",
      responseCommitment: "We commit to responding within 1–2 business days.",
      formTitle: "Send Inquiry",
      nameLabel: "Full Name *",
      namePlaceholder: "Enter your full name",
      emailLabel: "Email *",
      emailPlaceholder: "Enter your email address",
      messageLabel: "Message *",
      messagePlaceholder: "Enter your message or inquiry...",
      sendBtn: "Send Message",
      privacyNote:
        "Your information is secure and strictly used for communication purposes.",
      sentSuccess: "Your inquiry has been sent successfully!",
    },
    footer: {
      brandTitle: "Russia - Vietnam Knowledge Network",
      subtitle: "",
      desc: "Independent portal for coordinating science and technology cooperation between leading institutes and universities of Vietnam and the Russian Federation.",
      navTitle: "Explore Ecosystem",
      pillarsTitle: "Strategic Focus",
      contactTitle: "Coordination & Contacts",
      hanoiOffice: "Hanoi Coordination Office:",
      hanoiAddress:
        "Vietnam Academy of Science and Technology (VAST), 18 Hoang Quoc Viet, Cau Giay, Hanoi",
      moscowOffice: "Traditions & Friendship Foundation:",
      moscowAddress:
        "125047, Moscow, 1st Tverskaya-Yamskaya St., Bldg 30, Office 01B, Russian Federation",
      supportLabel: "Email:",
      nameLabel: "Full name",
      emailLabel: "Email",
      messageLabel: "Message",
      sendLabel: "Send inquiry",
      mailClientHint: "The send button opens your device's email app.",
      emailSubject: "RU-VN Network inquiry",
      copyright:
        "© 2026 Russia - Vietnam Knowledge Network. All rights reserved.",
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

type NetworkStat = (typeof HOME_COPY)[Locale]["stats"][number];

const NETWORK_TONE_STYLES = {
  blue: {
    glow: "drop-shadow-[0_16px_22px_rgba(30,100,235,0.3)]",
    accent: "#2d8cff",
    faceStart: "#3db6ff",
    faceEnd: "#1554db",
  },
  cyan: {
    glow: "drop-shadow-[0_16px_22px_rgba(8,168,198,0.3)]",
    accent: "#17c5dd",
    faceStart: "#31dce8",
    faceEnd: "#0794b6",
  },
  emerald: {
    glow: "drop-shadow-[0_16px_22px_rgba(18,174,98,0.3)]",
    accent: "#32d486",
    faceStart: "#5ce49a",
    faceEnd: "#159f5b",
  },
  purple: {
    glow: "drop-shadow-[0_16px_22px_rgba(112,66,218,0.3)]",
    accent: "#8c62f5",
    faceStart: "#a97bff",
    faceEnd: "#6438d0",
  },
  amber: {
    glow: "drop-shadow-[0_16px_22px_rgba(238,139,19,0.3)]",
    accent: "#ffae2d",
    faceStart: "#ffc64d",
    faceEnd: "#ec7f16",
  },
} as const;

const NETWORK_ROUNDED_PENTAGON_PATH =
  "M 8 -80 L 72 -34 Q 82 -27 79 -16 L 55 61 Q 52 72 41 72 L -41 72 Q -52 72 -55 61 L -79 -16 Q -82 -27 -72 -34 L -8 -80 Q 0 -86 8 -80 Z";

const NETWORK_DESKTOP_NODES = [
  {
    connector: [600, 175, 600, 237],
    center: [600, 100],
    rotation: 180,
    scale: 0.9,
    content: [535, 40, 130, 122],
  },
  {
    connector: [431, 316, 493, 316],
    center: [346, 316],
    rotation: 90,
    scale: 1.02,
    content: [269, 242, 154, 148],
  },
  {
    connector: [769, 316, 707, 316],
    center: [854, 316],
    rotation: -90,
    scale: 1.02,
    content: [777, 242, 154, 148],
  },
  {
    connector: [478.3, 475, 532, 444],
    center: [405, 517],
    rotation: 60,
    scale: 1.02,
    content: [328, 442, 154, 148],
  },
  {
    connector: [721.7, 475, 668, 444],
    center: [795, 517],
    rotation: -60,
    scale: 1.02,
    content: [718, 442, 154, 148],
  },
] as const;

export function NetworkIconGlyph({
  icon,
  className = "size-7",
}: Readonly<{ icon: string; className?: string }>) {
  const shared = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (icon === "public") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="8.25" {...shared} />
        <path
          d="M3.9 9.25h16.2M3.9 14.75h16.2M12 3.75c2.1 2.3 3.15 5.05 3.15 8.25S14.1 17.95 12 20.25C9.9 17.95 8.85 15.2 8.85 12S9.9 6.05 12 3.75Z"
          {...shared}
        />
      </svg>
    );
  }

  if (icon === "groups") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <circle cx="8" cy="8" r="2.4" {...shared} />
        <circle cx="16" cy="8.5" r="2.1" {...shared} />
        <path
          d="M3.5 19c.35-3.3 1.95-5.1 4.5-5.1s4.15 1.8 4.5 5.1M13.15 14.2c.75-.45 1.7-.65 2.85-.65 2.35 0 3.85 1.55 4.2 4.45"
          {...shared}
        />
      </svg>
    );
  }

  if (icon === "hub") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="2.2" {...shared} />
        <circle cx="12" cy="4" r="1.75" {...shared} />
        <circle cx="20" cy="12" r="1.75" {...shared} />
        <circle cx="12" cy="20" r="1.75" {...shared} />
        <circle cx="4" cy="12" r="1.75" {...shared} />
        <path
          d="M12 5.75v4.05M18.25 12H14.2M12 14.2v4.05M9.8 12H5.75"
          {...shared}
        />
      </svg>
    );
  }

  if (icon === "science") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          d="M9 3.75h6M10 3.75v5.1l-5.2 8.7a1.8 1.8 0 0 0 1.55 2.7h11.3a1.8 1.8 0 0 0 1.55-2.7L14 8.85v-5.1M7.75 14.6h8.5"
          {...shared}
        />
      </svg>
    );
  }

  if (icon === "account_balance") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          d="m3.5 9 8.5-4.5L20.5 9H3.5ZM5.25 19.5h13.5M6.5 10.5V17M10.2 10.5V17M13.8 10.5V17M17.5 10.5V17"
          {...shared}
        />
      </svg>
    );
  }

  if (icon === "network") {
    return (
      <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path
          d="m12 3.25 7 4.1v9.3l-7 4.1-7-4.1v-9.3l7-4.1Zm0 0v17.5M5 7.35l14 9.3M19 7.35 5 16.65"
          {...shared}
        />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="m3.5 9 8.5-4.5L20.5 9 12 13.5 3.5 9ZM7 11.25v4.5c2.8 2 7.2 2 10 0v-4.5M20.5 9v5"
        {...shared}
      />
    </svg>
  );
}

export function EcosystemOrbIcon({
  icon,
}: {
  icon: string;
}) {
  return (
    <div className="relative flex size-18 items-center justify-center sm:size-20">
      {/* Outer Orbiting Constellation Ring with Satellite Dots */}
      <svg
        className="absolute inset-0 size-full text-blue-500/40"
        viewBox="0 0 80 80"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="40"
          cy="40"
          r="36"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 6"
          opacity="0.65"
        />
        {/* Orbital Satellite Dots */}
        <circle cx="40" cy="4" r="2.5" fill="#2563eb" />
        <circle cx="76" cy="40" r="1.8" fill="#38bdf8" />
        <circle cx="10" cy="58" r="2" fill="#2563eb" />
      </svg>

      {/* Inner Glowing Disc */}
      <div className="relative flex size-14 items-center justify-center rounded-full border border-blue-200/90 bg-gradient-to-b from-blue-50 via-white to-blue-100/50 shadow-[0_4px_16px_-4px_rgba(37,99,235,0.2)] transition-all duration-300 group-hover:scale-105 group-hover:border-blue-400 group-hover:shadow-[0_8px_24px_-4px_rgba(37,99,235,0.3)] sm:size-16">
        {icon === "handshake" || icon === "agreement" ? (
          <svg
            viewBox="0 0 24 24"
            className="size-7 text-blue-600 transition-transform duration-300 group-hover:scale-110 sm:size-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Left sleeve / cuff */}
            <path d="M2 13.5l4.5-4.5 2 2-3.5 3.5a1 1 0 0 1-1.4 0L2 13.5z" />
            {/* Right sleeve / cuff */}
            <path d="M22 10.5l-4.5 4.5-2-2 3.5-3.5a1 1 0 0 1 1.4 0l1.6 1z" />
            {/* Handshake clasp */}
            <path d="M8.5 11l3 3a1 1 0 0 0 1.4 0l4.1-4.1a1 1 0 0 0 0-1.4l-1.5-1.5a1 1 0 0 0-1.4 0l-3.6 3.6" />
            <path d="M10 12.5l2 2a1 1 0 0 0 1.4 0l2.6-2.6" />
            <path d="M7 14.5l1.5 1.5a1 1 0 0 0 1.4 0l2.6-2.6" />
          </svg>
        ) : icon === "groups" || icon === "users" || icon === "members" ? (
          <svg
            viewBox="0 0 24 24"
            className="size-7 text-blue-600 transition-transform duration-300 group-hover:scale-110 sm:size-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Center Leader */}
            <circle cx="12" cy="7" r="3.2" />
            <path d="M6.5 19v-1a5.5 5.5 0 0 1 11 0v1" />
            {/* Left User */}
            <circle cx="5" cy="9.5" r="2.2" />
            <path d="M2 19v-.7a4 4 0 0 1 3.5-3.8" />
            {/* Right User */}
            <circle cx="19" cy="9.5" r="2.2" />
            <path d="M22 19v-.7a4 4 0 0 0-3.5-3.8" />
          </svg>
        ) : icon === "insights" || icon === "chart_up" || icon === "projects" ? (
          <svg
            viewBox="0 0 24 24"
            className="size-7 text-blue-600 transition-transform duration-300 group-hover:scale-110 sm:size-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* 4 Vertical Bars */}
            <rect x="3" y="16" width="3" height="5" rx="0.75" />
            <rect x="8" y="13" width="3" height="8" rx="0.75" />
            <rect x="13" y="10" width="3" height="11" rx="0.75" />
            <rect x="18" y="7" width="3" height="14" rx="0.75" />
            {/* Upward Trend Line */}
            <path d="M3.5 13.5l4-4 4.5 3.5 7.5-7.5" />
            <polyline points="15.5 5.5 19.5 5.5 19.5 9.5" />
            <circle cx="3.5" cy="13.5" r="0.9" fill="currentColor" />
            <circle cx="7.5" cy="9.5" r="0.9" fill="currentColor" />
            <circle cx="12" cy="13" r="0.9" fill="currentColor" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="size-7 text-blue-600 transition-transform duration-300 group-hover:scale-110 sm:size-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            {/* Open Book Pages */}
            <path d="M3 4.5C6 4.5 9 6 12 7.5C15 6 18 4.5 21 4.5V18.5C18 18.5 15 20 12 21.5C9 20 6 18.5 3 18.5V4.5Z" />
            <line x1="12" y1="7.5" x2="12" y2="21.5" />
            {/* Bookmark ribbon on left page */}
            <path d="M6 4.5v5l1.5-1 1.5 1v-5" fill="currentColor" opacity="0.15" />
            <path d="M6 4.5v5l1.5-1 1.5 1v-5" />
            {/* Text lines on right page */}
            <line x1="14" y1="9" x2="18.5" y2="9" />
            <line x1="14" y1="12.5" x2="18.5" y2="12.5" />
            <line x1="14" y1="16" x2="17" y2="16" />
          </svg>
        )}
      </div>
    </div>
  );
}

function NetworkStatsInfographic({
  stats,
  titleMain,
  country1,
  hyphen,
  country2,
  sectionTitle,
}: Readonly<{
  stats: readonly NetworkStat[];
  titleMain: string;
  country1: string;
  hyphen: string;
  country2: string;
  sectionTitle?: string;
}>) {
  const accessibleLabel = `${titleMain} ${country1} ${hyphen} ${country2}`;

  return (
    <section
      id="ecosystem"
      className="scroll-mt-36 px-4 pt-2 pb-12 sm:px-6 sm:pb-16 lg:px-8 xl:scroll-mt-28"
      aria-labelledby="network-stats-heading"
    >
      <div className="mx-auto max-w-5xl">
        {sectionTitle ? (
          <div className="mb-8 flex flex-col items-center justify-center text-center sm:mb-10">
            <div className="inline-flex items-center gap-2">
              <span className="h-1 w-8 rounded-full bg-blue-600" />
              <h2
                id="network-stats-heading"
                className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl"
              >
                {sectionTitle}
              </h2>
              <span className="h-1 w-8 rounded-full bg-blue-600" />
            </div>
          </div>
        ) : (
          <h2 id="network-stats-heading" className="sr-only">
            {accessibleLabel}
          </h2>
        )}
        <ul className="sr-only">
          {stats.map((stat) => (
            <li key={stat.lbl}>
              {stat.val} {stat.lbl}
            </li>
          ))}
        </ul>

        <div className="relative mx-auto w-full max-w-5xl overflow-x-auto sm:overflow-x-visible">
          <div
            className="relative aspect-[1200/675] w-full min-w-[580px] sm:min-w-0"
            aria-hidden="true"
          >
            <svg viewBox="0 0 1200 675" className="block size-full select-none">
              <defs>
                <path
                  id="network-rounded-pentagon"
                  d={NETWORK_ROUNDED_PENTAGON_PATH}
                />
                <linearGradient
                  id="network-face-blue"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0" stopColor="#3db6ff" />
                  <stop offset="0.55" stopColor="#2379f2" />
                  <stop offset="1" stopColor="#1554db" />
                </linearGradient>
                <linearGradient
                  id="network-face-cyan"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0" stopColor="#31dce8" />
                  <stop offset="0.55" stopColor="#15b9d0" />
                  <stop offset="1" stopColor="#0794b6" />
                </linearGradient>
                <linearGradient
                  id="network-face-emerald"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0" stopColor="#5ce49a" />
                  <stop offset="0.55" stopColor="#2bc778" />
                  <stop offset="1" stopColor="#159f5b" />
                </linearGradient>
                <linearGradient
                  id="network-face-purple"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0" stopColor="#a97bff" />
                  <stop offset="0.55" stopColor="#8154ed" />
                  <stop offset="1" stopColor="#6438d0" />
                </linearGradient>
                <linearGradient
                  id="network-face-amber"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0" stopColor="#ffc64d" />
                  <stop offset="0.55" stopColor="#f5a225" />
                  <stop offset="1" stopColor="#ec7f16" />
                </linearGradient>
                <linearGradient
                  id="network-core-face"
                  x1="0"
                  y1="0"
                  x2="1"
                  y2="1"
                >
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="0.62" stopColor="#f8fbff" />
                  <stop offset="1" stopColor="#e8eef8" />
                </linearGradient>
                <filter
                  id="network-node-shadow"
                  x="-35%"
                  y="-35%"
                  width="170%"
                  height="190%"
                >
                  <feDropShadow
                    dx="0"
                    dy="10"
                    stdDeviation="11"
                    floodColor="#1f63e9"
                    floodOpacity="0.24"
                  />
                  <feDropShadow
                    dx="0"
                    dy="0"
                    stdDeviation="5"
                    floodColor="#ffffff"
                    floodOpacity="0.9"
                  />
                </filter>
                <filter
                  id="network-core-shadow"
                  x="-35%"
                  y="-35%"
                  width="170%"
                  height="190%"
                >
                  <feDropShadow
                    dx="0"
                    dy="18"
                    stdDeviation="18"
                    floodColor="#1f63e9"
                    floodOpacity="0.28"
                  />
                </filter>
                <filter
                  id="network-connector-glow"
                  x="-40%"
                  y="-80%"
                  width="180%"
                  height="260%"
                >
                  <feGaussianBlur stdDeviation="4" />
                </filter>
              </defs>

              <g fill="none" strokeLinecap="round">
                <ellipse
                  cx="600"
                  cy="346"
                  rx="236"
                  ry="224"
                  stroke="#93c5fd"
                  strokeOpacity="0.5"
                  strokeWidth="1.6"
                />
                <ellipse
                  cx="600"
                  cy="346"
                  rx="274"
                  ry="258"
                  stroke="#bfdbfe"
                  strokeOpacity="0.4"
                  strokeWidth="1.2"
                />
                <ellipse
                  cx="600"
                  cy="346"
                  rx="206"
                  ry="195"
                  stroke="#3b82f6"
                  strokeDasharray="3 8"
                  strokeOpacity="0.45"
                  strokeWidth="2"
                />
              </g>

              {NETWORK_DESKTOP_NODES.map((node, index) => {
                const stat = stats[index];
                if (!stat) return null;

                return (
                  <g key={`connector-${stat.lbl}`}>
                    <line
                      x1={node.connector[0]}
                      y1={node.connector[1]}
                      x2={node.connector[2]}
                      y2={node.connector[3]}
                      stroke="#ffffff"
                      strokeOpacity="0.44"
                      strokeWidth="24"
                      strokeLinecap="round"
                      filter="url(#network-connector-glow)"
                    />
                    <line
                      x1={node.connector[0]}
                      y1={node.connector[1]}
                      x2={node.connector[2]}
                      y2={node.connector[3]}
                      stroke="#ffffff"
                      strokeWidth="14"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}

              {stats.map((stat, index) => {
                const node = NETWORK_DESKTOP_NODES[index];
                if (!node) return null;

                return (
                  <g key={stat.lbl}>
                    <g
                      transform={`translate(${node.center[0]} ${node.center[1]}) rotate(${node.rotation}) scale(${node.scale})`}
                    >
                      <use
                        href="#network-rounded-pentagon"
                        fill={`url(#network-face-${stat.tone})`}
                        stroke="#ffffff"
                        strokeWidth="6"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                        filter="url(#network-node-shadow)"
                      />
                    </g>
                    <foreignObject
                      x={node.content[0]}
                      y={node.content[1]}
                      width={node.content[2]}
                      height={node.content[3]}
                    >
                      <div className="flex size-full flex-col items-center justify-center px-2 text-center text-white drop-shadow-sm">
                        <NetworkIconGlyph icon={stat.icon} className="size-6" />
                        <strong className="mt-1 text-[30px] font-black leading-none tracking-[-0.04em]">
                          {stat.val}
                        </strong>
                        <span className="mt-1.5 max-w-[126px] text-[14px] font-bold leading-[1.16] text-white/95">
                          {stat.lbl}
                        </span>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}

              {NETWORK_DESKTOP_NODES.map((node, index) => {
                const stat = stats[index];
                if (!stat) return null;
                const styles = NETWORK_TONE_STYLES[stat.tone];

                return (
                  <g key={`${stat.lbl}-endpoint`}>
                    <circle
                      cx={node.connector[0]}
                      cy={node.connector[1]}
                      r="9"
                      fill="#ffffff"
                      fillOpacity="0.96"
                      stroke="#ffffff"
                      strokeWidth="3"
                    />
                    <circle
                      cx={node.connector[0]}
                      cy={node.connector[1]}
                      r="3.5"
                      fill={styles.accent}
                    />
                  </g>
                );
              })}
              <g transform="translate(600 350)">
                <use
                  href="#network-rounded-pentagon"
                  fill="url(#network-core-face)"
                  stroke="#ffffff"
                  strokeWidth="14"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  transform="scale(1.36)"
                  filter="url(#network-core-shadow)"
                />
                <use
                  href="#network-rounded-pentagon"
                  fill="url(#network-core-face)"
                  stroke="#4f91f5"
                  strokeWidth="4"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                  transform="scale(1.36)"
                />
              </g>
              <foreignObject x="505" y="276" width="190" height="150">
                <div className="flex size-full flex-col items-center justify-center px-4 text-center">
                  <NetworkIconGlyph
                    icon="network"
                    className="size-8 text-[#2676ee]"
                  />
                  <h2 className="mt-2 font-serif text-[19px] font-bold leading-tight text-[#0a2450]">
                    {titleMain}
                  </h2>
                  <p className="mt-1 text-[27px] font-black leading-none tracking-[-0.035em] text-[#071a33]">
                    {country1} <span className="text-[#2d7ef1]">{hyphen}</span>{" "}
                    {country2}
                  </p>
                </div>
              </foreignObject>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

export function GuestHomeV2({
  isAuthenticated,
  workspaceHref,
}: Readonly<{ isAuthenticated: boolean; workspaceHref: string }>) {
  const { locale } = useLocale();
  const t = HOME_COPY[locale] ?? HOME_COPY.vi;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide((previous) => (previous + 1) % HERO_BANNERS.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-900 font-sans">
      <GuestPublicNav
        active="home"
        isAuthenticated={isAuthenticated}
        workspaceHref={workspaceHref}
      />

      <main>
        {/* ═══════════ HERO BANNER SECTION ═══════════ */}
        <section className="relative isolate min-h-[560px] overflow-hidden border-b border-blue-100 bg-white sm:min-h-[620px]">
          {HERO_BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 -z-20 transition-opacity duration-700 ease-in-out ${
                index === currentSlide
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <Image
                src={banner.src}
                alt={banner.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className={`pointer-events-none object-cover brightness-[0.82] saturate-[0.88] ${banner.objectPosition}`}
              />
            </div>
          ))}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 -z-10 w-full bg-[linear-gradient(90deg,rgba(3,10,24,0.66)_0%,rgba(3,10,24,0.50)_48%,rgba(3,10,24,0.16)_76%,transparent_100%)] sm:w-[78%] lg:w-[68%]"
            aria-hidden="true"
          />
          <div className="mx-auto flex min-h-[560px] max-w-[1460px] items-center px-4 py-12 sm:min-h-[620px] sm:px-6 sm:py-16 lg:px-8">
            <div className="mr-auto w-full max-w-[760px] text-left">
              <div className="mb-5 inline-flex max-w-full items-center gap-2.5 rounded-full border-[2.5px] border-amber-400/90 bg-black/20 px-4 py-2 text-[15px] font-black text-amber-300 sm:mb-6 sm:px-5 sm:text-[17px]">
                <span
                  className="size-2.5 shrink-0 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.9)]"
                  aria-hidden="true"
                />
                <span>{t.eyebrow}</span>
              </div>

              <h1
                aria-label={`${t.titleMain} ${t.country1} ${t.hyphen} ${t.country2}`}
                className="overflow-visible font-sans font-black leading-[1.15] text-slate-300 drop-shadow-[0_3px_12px_rgba(0,0,0,0.38)]"
              >
                {locale === "ru" ? (
                  <>
                    <span className="block bg-gradient-to-r from-white via-blue-300 to-red-500 bg-clip-text text-3xl text-transparent sm:text-5xl lg:text-[62px]">
                      РОССИЙСКО-
                    </span>
                    <span className="block bg-gradient-to-r from-red-500 via-red-400 to-amber-300 bg-clip-text text-3xl text-transparent sm:text-5xl lg:text-[62px]">
                      ВЬЕТНАМСКАЯ
                    </span>
                    <span className="block text-3xl sm:text-5xl lg:text-[62px]">
                      ИНТЕЛЛЕКТУАЛЬНАЯ
                    </span>
                    <span className="block text-3xl sm:text-5xl lg:text-[62px]">
                      СЕТЬ
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block text-3xl sm:text-5xl lg:text-[62px]">
                      {t.titleMain}
                    </span>
                    <span className="flex w-fit items-center justify-start gap-x-3 overflow-visible pb-2 pt-0 text-5xl leading-[1.15] sm:gap-x-6 sm:text-[80px] lg:text-[104px]">
                      <span className="inline-block bg-gradient-to-b from-slate-200 via-blue-300 to-blue-600 bg-clip-text pb-2 pt-0 leading-[1.25] text-transparent">
                        {t.country1}
                      </span>
                      <span className="bg-gradient-to-r from-blue-400 to-red-400 bg-clip-text font-medium text-transparent">
                        {t.hyphen}
                      </span>
                      <span className="inline-block bg-gradient-to-b from-slate-200 via-red-300 to-red-600 bg-clip-text pb-2 pt-0 leading-[1.25] text-transparent">
                        {t.country2}
                      </span>
                    </span>
                  </>
                )}
              </h1>
            </div>
          </div>
        </section>

        {/* ═══════════ SECTION 1: TIN TỨC (NEWS) ═══════════ */}
        <section id="news" className="px-4 pt-10 pb-4 sm:px-6 sm:pt-12 lg:px-8">
          <div className="mx-auto max-w-[1460px]">
            {/* Section Header */}
            <div className="relative mb-6 flex flex-col items-center justify-between gap-4 sm:mb-7 sm:flex-row">
              <div className="inline-flex items-center gap-2.5">
                <span className="h-1 w-7 rounded-full bg-blue-600" />
                <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  {t.news.title}
                </h2>
              </div>
              <Link
                href="/news"
                className="group/link inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 transition hover:text-blue-800"
              >
                <span>{t.news.viewAll}</span>
              </Link>
            </div>

            {/* News Cards Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {OFFICIAL_NEWS.slice(0, 4).map((item, index) => {
                const imgSrc =
                  item.image ||
                  DEFAULT_FALLBACK_IMAGES[
                    index % DEFAULT_FALLBACK_IMAGES.length
                  ];
                return (
                  <Link
                    key={item.id}
                    href={newsArticleHref(item)}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-blue-200/80 bg-white/95 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      <Image
                        src={imgSrc}
                        alt={item.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                      <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-blue-600 sm:text-base">
                        {formatTitle(item.title)}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══════════ SECTION 2: HỆ SINH THÁI (ECOSYSTEM) ═══════════ */}
        <section id="ecosystem" className="px-4 pt-6 pb-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px]">
            {/* Section Header */}
            <div className="relative mb-6 flex flex-col items-center justify-between gap-4 sm:mb-7 sm:flex-row">
              <div className="inline-flex items-center gap-2.5">
                <span className="h-1 w-7 rounded-full bg-blue-600" />
                <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  {t.ecosystem.eyebrow}
                </h2>
              </div>
              <Link
                href="/ecosystem"
                className="group/link inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 transition hover:text-blue-800"
              >
                <span>{t.ecosystem.cardCta}</span>
              </Link>
            </div>

            {/* 4 Ecosystem Cards Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {t.ecosystem.cards.map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="group flex flex-col justify-between rounded-2xl border border-blue-200/80 bg-white/95 p-6 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                >
                  <div>
                    {/* Top: Circular Orbiting Icon Orb */}
                    <div className="flex items-center">
                      <EcosystemOrbIcon icon={card.icon} />
                    </div>

                    {/* Title */}
                    <h3 className="mt-5 text-base font-bold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-blue-600">
                      {card.title}
                    </h3>

                    {/* Blue Accent Bar */}
                    <span className="mt-2.5 block h-0.5 w-6 rounded-full bg-blue-600" />

                    {/* Description */}
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                      {card.desc}
                    </p>
                  </div>

                  {/* Bottom CTA Link */}
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-blue-600 transition group-hover:text-blue-800">
                    <span>{t.ecosystem.cardCta}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ SECTION 3: SỰ KIỆN (EVENTS) ═══════════ */}
        <section id="events" className="px-4 pt-6 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px]">
            {/* Section Header */}
            <div className="relative mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="inline-flex items-center gap-2.5">
                <span className="h-1 w-7 rounded-full bg-blue-600" />
                <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                  {t.events.title}
                </h2>
              </div>
              <Link
                href="/news?type=EVENT"
                className="group/link inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 transition hover:text-blue-800"
              >
                <span>{t.events.viewAll}</span>
              </Link>
            </div>

            {/* Event articles */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {OFFICIAL_NEWS.filter((item) => item.contentType === "EVENT").map(
                (item, index) => {
                  const imgSrc =
                    item.image ||
                    DEFAULT_FALLBACK_IMAGES[
                      index % DEFAULT_FALLBACK_IMAGES.length
                    ];
                  return (
                    <Link
                      key={item.id}
                      href={newsArticleHref(item)}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-blue-200/80 bg-white/95 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                        <Image
                          src={imgSrc}
                          alt={item.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-blue-600 sm:text-base">
                          {formatTitle(item.title)}
                        </h3>
                      </div>
                    </Link>
                  );
                },
              )}
            </div>
          </div>
        </section>

        {/* ═══════════ SECTION 4: NHỮNG CON SỐ (SƠ ĐỒ NGŨ GIÁC) ═══════════ */}
        <NetworkStatsInfographic
          stats={t.stats}
          titleMain={t.titleMain}
          country1={t.country1}
          hyphen={t.hyphen}
          country2={t.country2}
        />
      </main>

      <GuestPublicFooter copy={t} />
    </div>
  );
}

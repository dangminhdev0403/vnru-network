"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { OFFICIAL_NEWS } from "../data/official-news";
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
      title: "TIN TỨC",
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
      eyebrow: "HỆ SINH THÁI",
      title: "LIÊN KẾT TRI THỨC VIỆT – NGA",
      cardCta: "Khám phá →",
      cards: [
        {
          icon: "handshake",
          title: "CƠ HỘI HỢP TÁC",
          desc: "Kết nối doanh nghiệp, tổ chức và cá nhân tìm kiếm cơ hội hợp tác bền vững.",
          href: "/opportunities",
          tone: "blue",
        },
        {
          icon: "groups",
          title: "THÀNH VIÊN",
          desc: "Mạng lưới thành viên rộng khắp Việt Nam và Liên bang Nga, cùng chung tầm nhìn.",
          href: "/experts",
          tone: "emerald",
        },
        {
          icon: "insights",
          title: "DỰ ÁN & KẾT QUẢ",
          desc: "Các dự án nổi bật và những kết quả hợp tác đã đạt được giữa hai quốc gia.",
          href: "/opportunities",
          tone: "purple",
        },
        {
          icon: "menu_book",
          title: "THƯ VIỆN TRI THỨC",
          desc: "Kho tri thức phong phú về nghiên cứu, báo cáo và tài liệu chuyên ngành.",
          href: "/knowledge",
          tone: "amber",
        },
      ],
    },
    events: {
      eyebrow: "SỰ KIỆN",
      title: "SỰ KIỆN",
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
      title: "Kết nối & Liên hệ",
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
    titleMain: "Сеть знаний",
    country1: "Россия",
    hyphen: "–",
    country2: "Вьетнам",
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
      title: "НОВОСТИ",
      viewAll: "Все новости →",
      items: [
        {
          id: 1,
          category: "СОТРУДНИЧЕСТВО",
          categoryTone: "bg-blue-600/90 text-white",
          title:
            "Форум образовательного сотрудничества Россия – Вьетнам 2026: Расширение связей",
          date: "12/05/2026",
          image:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 2,
          category: "ОБРАЗОВАНИЕ",
          categoryTone: "bg-emerald-600/90 text-white",
          title:
            "Подписание соглашений о сотрудничестве между ведущими университетами",
          date: "09/05/2026",
          image:
            "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 3,
          category: "НАУКА",
          categoryTone: "bg-purple-600/90 text-white",
          title:
            "Совместный исследовательский проект по новым материалам РФ и ВР",
          date: "06/05/2026",
          image:
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        },
        {
          id: 4,
          category: "КУЛЬТУРА",
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
      eyebrow: "ЭКОСИСТЕМА",
      title: "НАУЧНО-ОБРАЗОВАТЕЛЬНЫЙ МОСТ РОССИЯ – ВЬЕТНАМ",
      cardCta: "Исследовать →",
      cards: [
        {
          icon: "handshake",
          title: "ВОЗМОЖНОСТИ СОТРУДНИЧЕСТВА",
          desc: "Связь предприятий, организаций и ученых для долгосрочного партнерства.",
          href: "/opportunities",
          tone: "blue",
        },
        {
          icon: "groups",
          title: "УЧАСТНИКИ",
          desc: "Широкая сеть участников по всему Вьетнаму и России с единым видением.",
          href: "/experts",
          tone: "emerald",
        },
        {
          icon: "insights",
          title: "ПРОЕКТЫ И РЕЗУЛЬТАТЫ",
          desc: "Ключевые проекты и достигнутые результаты совместной работы.",
          href: "/opportunities",
          tone: "purple",
        },
        {
          icon: "menu_book",
          title: "БИБЛИОТЕКА ЗНАНИЙ",
          desc: "Богатая база знаний: исследования, отчеты и профильные материалы.",
          href: "/knowledge",
          tone: "amber",
        },
      ],
    },
    events: {
      eyebrow: "СОБЫТИЯ",
      title: "СОБЫТИЯ",
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
        "Некоммерческая организация, зарегистрированная в Минюсте РФ (ОГРН: 1207700294020), выступающая единственным учредителем и центральным координационным органом Сети знаний Россия – Вьетнам.",
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
        "Сеть знаний Россия – Вьетнам координируется Фондом «Традиции и дружба», объединяя институты, университеты и ученых для развития науки, инноваций и трансфера знаний.",
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
      brandTitle: "Сеть знаний Россия – Вьетнам",
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
      copyright: "© 2026 Сеть знаний Россия – Вьетнам. Все права защищены.",
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
      title: "NEWS",
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
      eyebrow: "ECOSYSTEM",
      title: "VIETNAM – RUSSIA KNOWLEDGE NETWORK",
      cardCta: "Explore →",
      cards: [
        {
          icon: "handshake",
          title: "COLLABORATION OPPORTUNITIES",
          desc: "Connecting businesses, institutions, and researchers for sustainable partnership.",
          href: "/opportunities",
          tone: "blue",
        },
        {
          icon: "groups",
          title: "MEMBERS",
          desc: "Broad network of verified members across Vietnam and the Russian Federation.",
          href: "/experts",
          tone: "emerald",
        },
        {
          icon: "insights",
          title: "PROJECTS & OUTCOMES",
          desc: "Featured research projects and high-impact bilateral milestones.",
          href: "/opportunities",
          tone: "purple",
        },
        {
          icon: "menu_book",
          title: "KNOWLEDGE LIBRARY",
          desc: "Rich repository of research publications, technical reports, and datasets.",
          href: "/knowledge",
          tone: "amber",
        },
      ],
    },
    events: {
      eyebrow: "EVENTS",
      title: "EVENTS",
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
              </h1>
            </div>
          </div>
        </section>

        {/* ═══════════ SECTION 1: TIN TỨC (NEWS) ═══════════ */}
        <section id="news" className="px-4 pt-14 pb-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px]">
            {/* Section Header */}
            <div className="relative mb-8 flex flex-col items-center justify-between gap-4 sm:mb-10 sm:flex-row">
              <div className="inline-flex items-center gap-2.5">
                <span className="h-1 w-8 rounded-full bg-blue-600" />
                <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                  {t.news.title}
                </h2>
              </div>
              <Link
                href="/news"
                className="group/link inline-flex items-center gap-1.5 text-sm font-bold text-blue-600 transition hover:text-blue-800 sm:text-base"
              >
                <span>{t.news.viewAll}</span>
              </Link>
            </div>

            {/* News Cards Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {OFFICIAL_NEWS.slice(0, 4).map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-blue-200/80 bg-white/95 shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                    <h3 className="line-clamp-2 text-base font-bold leading-snug text-slate-900 transition-colors duration-200 group-hover:text-blue-600 sm:text-lg">
                      {item.title}
                    </h3>
                    <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <span
                        className="material-symbols-outlined text-sm text-slate-400"
                        aria-hidden="true"
                      >
                        calendar_today
                      </span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          id="ecosystem"
          className="scroll-mt-24 border-y border-blue-100 bg-white px-4 py-14 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-[1460px]">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {t.ecosystem.title}
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {t.ecosystem.cards.map((card) => (
                <Link
                  key={card.title}
                  href={card.href.replace("/opportunities", "/ecosystem#opportunities").replace("/experts", "/ecosystem#members").replace("/knowledge", "/ecosystem#knowledge-library")}
                  className="rounded-2xl border border-blue-100 bg-blue-50/60 p-6 transition hover:-translate-y-1 hover:border-blue-300 hover:bg-white motion-reduce:transform-none motion-reduce:transition-none"
                >
                  <h3 className="text-xl font-black text-slate-950">{card.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{card.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════ SECTION 2: SỰ KIỆN (EVENTS) ═══════════ */}
        <section id="events" className="scroll-mt-24 px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px] rounded-3xl border border-dashed border-blue-200 bg-blue-50/70 p-8 sm:p-10">
            <h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
              {t.events.title}
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              {locale === "ru"
                ? "Официальная информация о предстоящих событиях обновляется."
                : locale === "en"
                  ? "Official upcoming event information is being updated."
                  : "Thông tin sự kiện sắp tới chính thức đang được cập nhật."}
            </p>
          </div>
        </section>
      </main>

      <GuestPublicFooter copy={t} />
    </div>
  );
}

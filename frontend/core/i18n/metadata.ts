import "server-only";

import type { Metadata } from "next";
import { cookies } from "next/headers";
import {
  LOCALE_COOKIE_NAME,
  sanitizeLocale,
} from "@/features/auth/server";

type Locale = ReturnType<typeof sanitizeLocale>;
type LocalizedMetadata = Readonly<Record<Locale, Metadata>>;

export const PORTAL_NAME: Readonly<Record<Locale, string>> = {
  vi: "Mạng lưới tri thức Nga - Việt",
  en: "Russia-Vietnam Knowledge Network",
  ru: "Российско-вьетнамская сеть знаний",
};

const ROUTE_METADATA = {
  root: {
    vi: {
      title: PORTAL_NAME.vi,
      description:
        "Cổng thông tin tri thức và hợp tác Việt Nam - Liên bang Nga.",
    },
    en: {
      title: PORTAL_NAME.en,
      description:
        "Independent Vietnam-Russia knowledge and collaboration portal.",
    },
    ru: {
      title: PORTAL_NAME.ru,
      description:
        "Независимый портал знаний и сотрудничества России и Вьетнама.",
    },
  },
  login: {
    vi: {
      title: `Đăng nhập | ${PORTAL_NAME.vi}`,
      description: "Đăng nhập vào cổng thành viên của mạng lưới.",
    },
    en: {
      title: `Sign in | ${PORTAL_NAME.en}`,
      description: "Sign in to the network member portal.",
    },
    ru: {
      title: `Вход | ${PORTAL_NAME.ru}`,
      description: "Вход на портал участников сети.",
    },
  },
  about: {
    vi: {
      title: `Về chúng tôi | ${PORTAL_NAME.vi}`,
      description:
        "Mạng lưới kết nối giới trí thức, viện, trường và doanh nghiệp Việt Nam và Liên bang Nga.",
    },
    en: {
      title: `About | ${PORTAL_NAME.en}`,
      description:
        "The network connects researchers, institutes, universities, and businesses in Vietnam and Russia.",
    },
    ru: {
      title: `О сети | ${PORTAL_NAME.ru}`,
      description:
        "Сеть объединяет исследователей, институты, университеты и предприятия России и Вьетнама.",
    },
  },
  contact: {
    vi: {
      title: `Liên hệ & Hợp tác | ${PORTAL_NAME.vi}`,
      description:
        "Cổng kết nối hợp tác khoa học, công nghệ và giáo dục giữa Việt Nam và Liên bang Nga.",
    },
    en: {
      title: `Contact & Cooperation | ${PORTAL_NAME.en}`,
      description:
        "A gateway for science, technology, and education cooperation between Vietnam and Russia.",
    },
    ru: {
      title: `Контакты и сотрудничество | ${PORTAL_NAME.ru}`,
      description:
        "Портал сотрудничества России и Вьетнама в области науки, технологий и образования.",
    },
  },
  ecosystem: {
    vi: {
      title: `Hệ sinh thái | ${PORTAL_NAME.vi}`,
      description:
        "Chương trình khoa học, dự án và thư viện tri thức song phương Việt Nam - Liên bang Nga.",
    },
    en: {
      title: `Ecosystem | ${PORTAL_NAME.en}`,
      description:
        "Bilateral science programmes, projects, and knowledge resources from Vietnam and Russia.",
    },
    ru: {
      title: `Экосистема | ${PORTAL_NAME.ru}`,
      description:
        "Двусторонние научные программы, проекты и ресурсы знаний России и Вьетнама.",
    },
  },
  experts: {
    vi: { title: `Mạng lưới chuyên gia | ${PORTAL_NAME.vi}` },
    en: { title: `Expert network | ${PORTAL_NAME.en}` },
    ru: { title: `Сеть экспертов | ${PORTAL_NAME.ru}` },
  },
  knowledge: {
    vi: { title: `Tri thức | ${PORTAL_NAME.vi}` },
    en: { title: `Knowledge | ${PORTAL_NAME.en}` },
    ru: { title: `База знаний | ${PORTAL_NAME.ru}` },
  },
  opportunities: {
    vi: { title: `Cơ hội hợp tác | ${PORTAL_NAME.vi}` },
    en: { title: `Collaboration opportunities | ${PORTAL_NAME.en}` },
    ru: { title: `Возможности сотрудничества | ${PORTAL_NAME.ru}` },
  },
  workspace: {
    vi: {
      title: `Không gian thành viên | ${PORTAL_NAME.vi}`,
      description:
        "Tin tức, tri thức, chuyên gia và thông tin tuyển chọn đề tài dành cho thành viên mạng lưới.",
    },
    en: {
      title: `Member workspace | ${PORTAL_NAME.en}`,
      description:
        "News, knowledge, experts, and research calls for network members.",
    },
    ru: {
      title: `Рабочее пространство участника | ${PORTAL_NAME.ru}`,
      description:
        "Новости, знания, эксперты и конкурсы исследовательских проектов для участников сети.",
    },
  },
  newsAdmin: {
    vi: { title: `Quản lý tin tức | ${PORTAL_NAME.vi}` },
    en: { title: `News management | ${PORTAL_NAME.en}` },
    ru: { title: `Управление новостями | ${PORTAL_NAME.ru}` },
  },
  notFound: {
    vi: {
      title: `404 - Trang không tìm thấy | ${PORTAL_NAME.vi}`,
      description: "Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.",
    },
    en: {
      title: `404 - Page not found | ${PORTAL_NAME.en}`,
      description: "The page you requested does not exist or has moved.",
    },
    ru: {
      title: `404 - Страница не найдена | ${PORTAL_NAME.ru}`,
      description: "Запрошенная страница не существует или была перемещена.",
    },
  },
} satisfies Record<string, LocalizedMetadata>;

export async function getRouteMetadata(
  route: keyof typeof ROUTE_METADATA,
): Promise<Metadata> {
  const locale = sanitizeLocale(
    (await cookies()).get(LOCALE_COOKIE_NAME)?.value,
  );
  return ROUTE_METADATA[route][locale];
}

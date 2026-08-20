import type { PublicPublication } from "@/features/knowledge/types";

export type { PublicPublication };
export type { DiscoverySuccess, DiscoveryError, DiscoveryResult } from "@/features/knowledge/types";

/** Detail adds abstract to the public summary shape. */
export type PublicPublicationDetail = PublicPublication & { abstract: string | null };

export type DetailResult =
  | { status: "success"; item: PublicPublicationDetail }
  | { status: "not_found" }
  | { status: "error"; kind: "integration"; message: string };

/** Feature-local trilingual labels. No i18n framework needed for this surface. */
export const labels = {
  vi: {
    pageTitle: "Kho tri thức",
    pageDesc: "Khám phá các công bố khoa học, bằng sáng chế và tài liệu nghiên cứu.",
    search: "Tìm kiếm",
    searchPlaceholder: "Tìm kiếm công bố...",
    country: "Quốc gia",
    organization: "Tổ chức",
    topic: "Chủ đề",
    language: "Ngôn ngữ",
    year: "Năm",
    loadMore: "Tải thêm",
    noResults: "Không có công bố phù hợp.",
    errorLoading: "Không thể tải danh sách công bố.",
    retry: "Thử lại",
    backToList: "← Quay lại danh sách",
    abstract: "Tóm tắt",
    authors: "Tác giả",
    topics: "Chủ đề",
    details: "Chi tiết công bố",
    notFound: "Không tìm thấy công bố.",
    errorDetail: "Không thể tải chi tiết công bố.",
    filterAll: "Tất cả",
  },
  en: {
    pageTitle: "Knowledge Repository",
    pageDesc: "Explore scientific publications, patents and research documents.",
    search: "Search",
    searchPlaceholder: "Search publications...",
    country: "Country",
    organization: "Organization",
    topic: "Topic",
    language: "Language",
    year: "Year",
    loadMore: "Load more",
    noResults: "No publications found.",
    errorLoading: "Unable to load publications.",
    retry: "Retry",
    backToList: "← Back to list",
    abstract: "Abstract",
    authors: "Authors",
    topics: "Topics",
    details: "Publication details",
    notFound: "Publication not found.",
    errorDetail: "Unable to load publication details.",
    filterAll: "All",
  },
  ru: {
    pageTitle: "Репозиторий знаний",
    pageDesc: "Научные публикации, патенты и исследовательские документы.",
    search: "Поиск",
    searchPlaceholder: "Поиск публикаций...",
    country: "Страна",
    organization: "Организация",
    topic: "Тема",
    language: "Язык",
    year: "Год",
    loadMore: "Загрузить ещё",
    noResults: "Публикации не найдены.",
    errorLoading: "Не удалось загрузить публикации.",
    retry: "Повторить",
    backToList: "← Назад к списку",
    abstract: "Аннотация",
    authors: "Авторы",
    topics: "Темы",
    details: "Детали публикации",
    notFound: "Публикация не найдена.",
    errorDetail: "Не удалось загрузить данные публикации.",
    filterAll: "Все",
  },
} as const;

export type Labels = { [K in keyof (typeof labels)["en"]]: string };
export type Locale = keyof typeof labels;

export function getLabels(lang?: string): Labels {
  if (lang && lang in labels) return labels[lang as Locale];
  return labels.en;
}

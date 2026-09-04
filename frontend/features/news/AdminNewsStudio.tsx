"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { confirmAction, showSuccess, showError } from "@/lib/alerts";
import { z } from "zod";
import { newsResource } from "./resource";
import { useLocale } from "@/core/i18n/locale";
import {
  localizeReactNode,
  localizeText,
} from "@/core/i18n/localize-react-node";
import { ADMIN_NEWS_TRANSLATIONS } from "./admin-news-translations";
import { ContentOverviewDashboard } from "./ContentOverviewDashboard";
import { AnimatedNumber } from "./AnimatedNumber";
import type {
  NewsArticle,
  NewsInput,
  NewsLocale,
  NewsContentType,
  AdminNewsListItem,
  AdminNewsListFilters,
} from "./repository";

const newsFormSchema = z.object({
  category: z.string().min(1, "Vui lòng chọn danh mục bài viết"),
  title: z
    .string()
    .trim()
    .min(3, "Tiêu đề bài viết cần ít nhất 3 ký tự")
    .max(300, "Tiêu đề không được vượt quá 300 ký tự"),
  summary: z
    .string()
    .trim()
    .min(5, "Tóm tắt bài viết cần ít nhất 5 ký tự")
    .max(1000, "Tóm tắt không được vượt quá 1000 ký tự"),
  content: z.string().trim().min(10, "Nội dung bài viết cần ít nhất 10 ký tự"),
});

declare global {
  interface Window {
    Translator?: {
      create(input: {
        sourceLanguage: "vi";
        targetLanguage: "ru";
      }): Promise<{ translate(text: string): Promise<string> }>;
    };
  }
}

const news = newsResource.bind(undefined);
const locales: NewsLocale[] = ["VI", "EN", "RU"];
const localeNames: Record<NewsLocale, string> = {
  VI: "Tiếng Việt",
  EN: "English",
  RU: "Русский",
};
const editorPlaceholders: Record<NewsLocale, { image: string; text: string }> =
  {
    VI: { image: "Hình ảnh", text: "văn bản" },
    EN: { image: "Image", text: "text" },
    RU: { image: "Изображение", text: "текст" },
  };
const empty = () => ({ title: "", summary: "", content: "", actionLabel: "" });
const initial: NewsInput = {
  category: "science-technology",
  contentType: "ARTICLE",
  actionUrl: null,
  actionClosesAt: null,
  sourceUrls: [],
  translations: { VI: empty(), EN: empty(), RU: empty() },
};

const contentTypes: Record<NewsContentType, string> = {
  ARTICLE: "Tin tức",
  EVENT: "Sự kiện",
  ANNOUNCEMENT: "Công bố",
  PROJECT: "Dự án",
  OPPORTUNITY: "Cơ hội",
  KNOWLEDGE: "Tri thức",
  PUBLICATION: "Ấn phẩm",
};

const categories: Record<string, string> = {
  "science-technology": "Khoa học - Công nghệ",
  "economy-society": "Kinh tế - Xã hội",
  education: "Giáo dục",
  cooperation: "Hợp tác",
};
const knowledgeCategories: Record<string, string> = {
  "knowledge-article": "Bài báo",
  "knowledge-journal": "Tạp chí",
  "knowledge-invention": "Sáng chế",
};
const allCategories = { ...categories, ...knowledgeCategories };

const dateTimeValue = (value?: string | null) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";

const hasTranslationInput = (
  translation: NewsInput["translations"][NewsLocale],
) =>
  [
    translation.title,
    translation.summary,
    translation.content,
    translation.actionLabel,
  ].some((value) => value?.trim());

const payload = (form: NewsInput): NewsInput => {
  const submittedLocales = locales.filter((item) =>
    hasTranslationInput(form.translations[item]),
  );
  return {
    ...form,
    actionUrl: form.actionUrl?.trim() || null,
    actionClosesAt: form.actionClosesAt
      ? new Date(form.actionClosesAt).toISOString()
      : null,
    sourceUrls:
      form.sourceUrls?.map((value) => value.trim()).filter(Boolean) ?? [],
    translations: Object.fromEntries(
      locales
        .filter((item) => submittedLocales.includes(item))
        .map((item) => {
          const translation = form.translations[item];
          return [
            item,
            {
              title: translation.title,
              summary: translation.summary,
              content: translation.content,
              actionLabel: translation.actionLabel?.trim() || null,
            },
          ];
        }),
    ) as NewsInput["translations"],
  };
};

const VIEW_CONFIG: Record<string, { title: string; subtitle: string }> = {
  featured: {
    title: "Tin nổi bật",
    subtitle:
      "Quản lý danh sách các bài viết, sự kiện được ghim nổi bật trên cổng thông tin.",
  },
  ANNOUNCEMENT: {
    title: "Công bố & Thông báo",
    subtitle:
      "Quản lý các thông báo tuyển sinh, chương trình và công bố học thuật chính thức.",
  },
  EVENT: {
    title: "Sự kiện & Hoạt động",
    subtitle:
      "Quản lý các hội thảo, diễn đàn thanh niên, triển lãm khoa học công nghệ.",
  },
  PROJECT: {
    title: "Dự án Khoa học - Công nghệ",
    subtitle:
      "Quản lý các dự án hợp tác nghiên cứu song phương và phát triển công nghệ.",
  },
  OPPORTUNITY: {
    title: "Cơ hội & Học bổng",
    subtitle:
      "Quản lý các chương trình tài trợ nghiên cứu, học bổng và cơ hội trao đổi quốc tế.",
  },
  KNOWLEDGE: {
    title: "Quản lý tri thức",
    subtitle: "Quản lý và cập nhật nội dung trong thư viện tri thức.",
  },
  ARTICLE: {
    title: "Quản lý tin tức",
    subtitle: "Quản lý và cập nhật toàn bộ bài viết, tin tức trên hệ thống.",
  },
};

function formatDate(isoString?: string | null) {
  if (!isoString) return { date: "--/--/----", time: "--:--" };
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return { date: "--/--/----", time: "--:--" };
  return {
    date: `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`,
    time: `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
  };
}

export function AdminNewsStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const uiLocale = useLocale((state) => state.locale);
  const listLocale = uiLocale.toUpperCase() as NewsLocale;
  const view = searchParams.get("view");
  const requestedContentType = searchParams.get("type");
  const [selectedId, setSelectedId] = useState<string>();
  const [form, setForm] = useState<NewsInput>(() => ({
    ...initial,
    category:
      requestedContentType === "KNOWLEDGE"
        ? "knowledge-article"
        : initial.category,
    contentType:
      requestedContentType && requestedContentType in contentTypes
        ? (requestedContentType as NewsContentType)
        : "ARTICLE",
  }));
  const [featured, setFeatured] = useState(false);
  const [locale, setLocale] = useState<NewsLocale>("RU");
  const [query, setQuery] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [previousView, setPreviousView] = useState(view);
  const [pendingCoverFile, setPendingCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [contentTab, setContentTab] = useState<"write" | "preview">("write");
  const [pendingInlineImages, setPendingInlineImages] = useState<
    Array<{ url: string; file: File }>
  >([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "published" | "draft" | "featured"
  >("all");
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<
    "date" | "title" | "category" | "status" | "featured"
  >("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [tableDensity, setTableDensity] = useState<"comfortable" | "compact">(
    "comfortable",
  );
  const [isBatchProcessing, setIsBatchProcessing] = useState(false);

  const [prevFilterKey, setPrevFilterKey] = useState("");
  const currentFilterKey = `${view}_${categoryFilter}_${statusFilter}_${query}_${pageSize}`;
  if (currentFilterKey !== prevFilterKey) {
    setPrevFilterKey(currentFilterKey);
    setCurrentPage(1);
    setSelectedRowIds(new Set());
  }

  if (view !== previousView) {
    setPreviousView(view);
    setCategoryFilter("ALL");
    setStatusFilter("all");
    setSelectedId(undefined);
    setSelectedRowIds(new Set());
    setPendingCoverFile(null);
    setCoverPreviewUrl(null);
    setFieldErrors({});
    if (view === "new") {
      setForm({
        ...initial,
        category:
          requestedContentType === "KNOWLEDGE"
            ? "knowledge-article"
            : initial.category,
        contentType:
          requestedContentType && requestedContentType in contentTypes
            ? (requestedContentType as NewsContentType)
            : "ARTICLE",
      });
      setFeatured(false);
      setLocale("RU");
    }
  }

  const queryFilters: AdminNewsListFilters = useMemo(() => {
    const contentView = view === "all" ? "ARTICLE" : view;
    const filters: AdminNewsListFilters = {
      locale: listLocale,
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    };
    if (
      [
        "ANNOUNCEMENT",
        "EVENT",
        "PROJECT",
        "OPPORTUNITY",
        "KNOWLEDGE",
        "ARTICLE",
        "PUBLICATION",
      ].includes(contentView ?? "")
    ) {
      filters.contentType = contentView as NewsContentType;
    }

    if (categoryFilter !== "ALL") {
      filters.category = categoryFilter;
    }
    if (view === "featured" || statusFilter === "featured") {
      filters.featured = true;
    }
    if (statusFilter === "published") {
      filters.published = true;
    }
    if (statusFilter === "draft") {
      filters.published = false;
    }

    if (query.trim()) {
      filters.query = query.trim();
    }
    return filters;
  }, [
    pageSize,
    currentPage,
    view,
    categoryFilter,
    statusFilter,
    query,
    listLocale,
  ]);

  const list = useQuery(news.queries.list.options(queryFilters));

  const detail = useQuery({
    ...news.queries.detail.options(selectedId ?? ""),
    enabled: Boolean(selectedId),
  });

  const [syncedDetailKey, setSyncedDetailKey] = useState<string | null>(null);
  const currentDetailKey =
    detail.data && selectedId ? `${selectedId}_${detail.data.updatedAt}` : null;
  if (detail.data && selectedId && currentDetailKey !== syncedDetailKey) {
    setSyncedDetailKey(currentDetailKey);
    const article = detail.data;
    setFeatured(article.isFeatured);
    setPendingCoverFile(null);
    setCoverPreviewUrl(article.coverImageUrl);
    setFieldErrors({});
    setForm({
      category: article.category,
      contentType: article.contentType,
      actionUrl: article.actionUrl,
      actionClosesAt: dateTimeValue(article.actionClosesAt),
      sourceUrls: article.sourceUrls,
      coverImageUrl: article.coverImageUrl,
      translations: Object.fromEntries(
        locales.map((item) => [
          item,
          article.translations.find((value) => value.locale === item) ??
            empty(),
        ]),
      ) as NewsInput["translations"],
    });
  }

  const create = useMutation(
    news.mutations.create.options({
      onSuccess: ({ client, data, cache }) => {
        cache.queries.list.invalidateAll(client);
        setSelectedId(data.id);
        showSuccess(t("Tạo thành công"), t("Đã tạo nội dung mới."));
      },
      onError: () => {
        showError(t("Không thể tạo mới"), t("Đã xảy ra lỗi khi tạo mới"));
      },
    }),
  );

  const update = useMutation(
    news.mutations.update.options({
      onSuccess: ({ client, cache }) => {
        cache.queries.list.invalidateAll(client);
        showSuccess(
          t("Đã lưu chỉnh sửa"),
          t("Nội dung đã được cập nhật thành công."),
        );
      },
      onError: () => {
        showError(t("Không thể lưu"), t("Đã xảy ra lỗi khi lưu"));
      },
    }),
  );

  const deleteArticle = useMutation(
    news.mutations.delete.options({
      onSuccess: ({ client, cache }) => {
        cache.queries.list.invalidateAll(client);
        setSelectedId(undefined);
        showSuccess(t("Đã xóa"), t("Nội dung đã được xóa khỏi hệ thống."));
      },
      onError: () => {
        showError(t("Không thể xóa"), t("Đã xảy ra lỗi khi xóa"));
      },
    }),
  );
  const upload = useMutation(news.mutations.upload.options());

  const articles = useMemo(() => {
    const rawArticles = list.data?.items ?? [];
    let filtered = rawArticles;
    if (view === "featured") {
      filtered = rawArticles.filter((a) => a.isFeatured);
    }
    const sorted = [...filtered].sort((a, b) => {
      let result = 0;
      if (sortField === "date") {
        const dateA = new Date(a.publishedAt || a.updatedAt).getTime();
        const dateB = new Date(b.publishedAt || b.updatedAt).getTime();
        result = dateA - dateB;
      } else if (sortField === "title") {
        const titleA = a.translations[0]?.title || a.id;
        const titleB = b.translations[0]?.title || b.id;
        result = titleA.localeCompare(titleB, "vi");
      } else if (sortField === "category") {
        const catA = allCategories[a.category] || a.category;
        const catB = allCategories[b.category] || b.category;
        result = catA.localeCompare(catB, "vi");
      } else if (sortField === "status") {
        const pubA = a.publishedAt ? 1 : 0;
        const pubB = b.publishedAt ? 1 : 0;
        result = pubA - pubB;
      } else if (sortField === "featured") {
        const featA = a.isFeatured ? 1 : 0;
        const featB = b.isFeatured ? 1 : 0;
        result = featA - featB;
      }
      return sortOrder === "asc" ? result : -result;
    });
    return sorted;
  }, [list.data?.items, view, sortField, sortOrder]);

  const totalCount = list.data?.total ?? 0;
  const systemTotal = list.data?.counts?.total ?? totalCount;
  const isSearchActive = Boolean(
    query.trim() ||
    (categoryFilter && categoryFilter !== "ALL") ||
    statusFilter !== "all",
  );
  const counts = {
    total: systemTotal,
    published: list.data?.counts?.published ?? 0,
    featured: list.data?.counts?.featured ?? 0,
  };

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder(field === "title" || field === "category" ? "asc" : "desc");
    }
  };

  const handleBatchPublish = async () => {
    const ids = Array.from(selectedRowIds);
    if (ids.length === 0) return;
    setIsBatchProcessing(true);
    try {
      const now = new Date().toISOString();
      await Promise.all(
        ids.map((id) =>
          update.mutateAsync({ id, input: { publishedAt: now } }),
        ),
      );
      setSelectedRowIds(new Set());
      showSuccess(
        t("Thành công"),
        t(`Đã xuất bản ${ids.length} bài viết thành công.`),
      );
    } catch {
      showError(t("Lỗi"), t("Không thể xuất bản một số bài viết được chọn."));
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const handleBatchUnpublish = async () => {
    const ids = Array.from(selectedRowIds);
    if (ids.length === 0) return;
    setIsBatchProcessing(true);
    try {
      await Promise.all(
        ids.map((id) =>
          update.mutateAsync({ id, input: { publishedAt: null } }),
        ),
      );
      setSelectedRowIds(new Set());
      showSuccess(
        t("Thành công"),
        t(`Đã ẩn ${ids.length} bài viết thành công.`),
      );
    } catch {
      showError(t("Lỗi"), t("Không thể ẩn một số bài viết được chọn."));
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const handleBatchFeature = async (featureState: boolean) => {
    const ids = Array.from(selectedRowIds);
    if (ids.length === 0) return;
    setIsBatchProcessing(true);
    try {
      await Promise.all(
        ids.map((id) =>
          update.mutateAsync({ id, input: { isFeatured: featureState } }),
        ),
      );
      setSelectedRowIds(new Set());
      showSuccess(
        t("Thành công"),
        featureState
          ? t(`Đã ghim nổi bật ${ids.length} bài viết.`)
          : t(`Đã bỏ ghim nổi bật ${ids.length} bài viết.`),
      );
    } catch {
      showError(
        t("Lỗi"),
        t("Không thể cập nhật trạng thái nổi bật cho các bài viết."),
      );
    } finally {
      setIsBatchProcessing(false);
    }
  };

  const handleBatchDelete = async () => {
    const ids = Array.from(selectedRowIds);
    if (ids.length === 0) return;
    const confirmation = await confirmAction({
      title: t(`Xóa ${ids.length} bài viết đã chọn?`),
      text: t(
        "Các bài viết và toàn bộ bản dịch sẽ bị xóa vĩnh viễn khỏi hệ thống.",
      ),
      confirmButtonText: t("Xóa tất cả"),
      isDestructive: true,
    });
    if (confirmation.isConfirmed) {
      setIsBatchProcessing(true);
      try {
        await Promise.all(ids.map((id) => deleteArticle.mutateAsync(id)));
        setSelectedRowIds(new Set());
        showSuccess(
          t("Đã xóa"),
          t(`Đã xóa ${ids.length} bài viết thành công.`),
        );
      } catch {
        showError(t("Lỗi"), t("Không thể xóa một số bài viết được chọn."));
      } finally {
        setIsBatchProcessing(false);
      }
    }
  };

  const exportToCSV = () => {
    const targetList =
      selectedRowIds.size > 0
        ? articles.filter((a) => selectedRowIds.has(a.id))
        : articles;
    if (targetList.length === 0) return;

    const headers = [
      "ID",
      "Tiêu đề",
      "Loại hình",
      "Danh mục",
      "Trạng thái",
      "Tin nổi bật",
      "Ngày cập nhật",
      "Độ phủ ngôn ngữ",
    ];
    const rows = targetList.map((a) => {
      const title = (a.translations[0]?.title || a.id).replace(/"/g, '""');
      const type = a.contentType;
      const cat = (allCategories[a.category] || a.category).replace(/"/g, '""');
      const status = a.publishedAt ? "Đã xuất bản" : "Bản nháp";
      const feat = a.isFeatured ? "Nổi bật" : "Thường";
      const date = a.publishedAt || a.updatedAt;
      const trs = a.translations.map((tr) => tr.locale).join("; ");
      return `"${a.id}","${title}","${type}","${cat}","${status}","${feat}","${date}","${trs}"`;
    });

    const csvContent = "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `vnru_content_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const translation = form.translations[locale];
  const showOverview = !view;
  const showList = Boolean(view && view !== "new" && !selectedId);
  const showSummary = showList;
  const showEditor = view === "new" || Boolean(selectedId);
  const navContentType =
    view && view in contentTypes
      ? (view as NewsContentType)
      : requestedContentType && requestedContentType in contentTypes
        ? (requestedContentType as NewsContentType)
        : "ARTICLE";
  const activeCategories =
    (showEditor ? form.contentType : navContentType) === "KNOWLEDGE"
      ? knowledgeCategories
      : categories;
  const listHref =
    navContentType === "KNOWLEDGE"
      ? "/workspace/news?view=KNOWLEDGE"
      : "/workspace/news";
  const t = (value: string) =>
    localizeText(value, uiLocale, ADMIN_NEWS_TRANSLATIONS);
  const error = [
    list.error,
    create.error,
    update.error,
    deleteArticle.error,
    upload.error,
  ].find(Boolean) as Error | undefined;

  const currentViewMeta =
    view && VIEW_CONFIG[view]
      ? VIEW_CONFIG[view]
      : {
          title: "Quản lý tin tức",
          subtitle: "Quản lý, biên tập và xuất bản nội dung đa ngôn ngữ.",
        };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const validateForm = () => {
    const errors: Record<string, string> = {};
    let invalidLocale: NewsLocale | undefined;
    const submittedLocales = locales.filter((item) =>
      hasTranslationInput(form.translations[item]),
    );
    const validationLocales = submittedLocales.length
      ? submittedLocales
      : [locale];

    for (const item of validationLocales) {
      const translation = form.translations[item] || empty();
      const result = newsFormSchema.safeParse({
        category: form.category,
        title: translation.title,
        summary: translation.summary,
        content: translation.content,
      });
      if (!result.success && !invalidLocale) {
        invalidLocale = item;
        for (const issue of result.error.issues) {
          const field = issue.path[0] as string;
          if (!errors[field]) errors[field] = issue.message;
        }
      }
    }

    if (invalidLocale) setLocale(invalidLocale);
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const reset = () => {
    pendingInlineImages.forEach((image) => URL.revokeObjectURL(image.url));
    setPendingInlineImages([]);
    setSelectedId(undefined);
    setPendingCoverFile(null);
    setCoverPreviewUrl(null);
    setFieldErrors({});
    setForm({
      ...initial,
      category:
        navContentType === "KNOWLEDGE" ? "knowledge-article" : initial.category,
      contentType: navContentType,
    });
    setFeatured(false);
    setLocale("RU");
    router.push(`/workspace/news?view=new&type=${navContentType}`);
  };

  const handleCoverFileChange = (file: File) => {
    if (coverPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    setPendingCoverFile(file);
    const objectUrl = URL.createObjectURL(file);
    setCoverPreviewUrl(objectUrl);
    if (fieldErrors.coverImageUrl) {
      setFieldErrors((prev) => ({ ...prev, coverImageUrl: "" }));
    }
  };

  const handleRemoveCover = () => {
    if (coverPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    setPendingCoverFile(null);
    setCoverPreviewUrl(null);
    setForm((current) => ({ ...current, coverImageUrl: null }));
  };

  const open = (article: AdminNewsListItem | NewsArticle) => {
    setSelectedId(article.id);
    setFeatured(article.isFeatured);
    setLocale("RU");
    setFieldErrors({});
  };

  const setTranslation = (patch: Partial<typeof translation>) =>
    setForm({
      ...form,
      translations: {
        ...form.translations,
        [locale]: { ...translation, ...patch },
      },
    });

  const addInlineImage = (file: File, start?: number, end?: number) => {
    const url = URL.createObjectURL(file);
    const content = translation.content || "";
    const imageMarkdown = `\n![${editorPlaceholders[locale].image}](${url})\n`;
    setPendingInlineImages((current) => [...current, { url, file }]);
    setTranslation({
      content:
        start === undefined
          ? content + imageMarkdown
          : content.slice(0, start) +
            imageMarkdown +
            content.slice(end ?? start),
    });
  };

  const handleContentPaste = (
    event: React.ClipboardEvent<HTMLTextAreaElement>,
  ) => {
    const imageFile = Array.from(event.clipboardData?.items ?? [])
      .find((item) => item.type.startsWith("image/"))
      ?.getAsFile();
    if (!imageFile) return;
    event.preventDefault();
    addInlineImage(
      imageFile,
      event.currentTarget.selectionStart,
      event.currentTarget.selectionEnd,
    );
  };

  const handleContentDrop = (event: React.DragEvent<HTMLTextAreaElement>) => {
    const imageFile = Array.from(event.dataTransfer.files).find((file) =>
      file.type.startsWith("image/"),
    );
    if (!imageFile) return;
    event.preventDefault();
    addInlineImage(imageFile);
  };

  const insertMarkdownSnippet = (before: string, after: string = "") => {
    const textarea = document.getElementById(
      "news-content-textarea",
    ) as HTMLTextAreaElement | null;
    if (!textarea) {
      setTranslation({ content: (translation.content || "") + before + after });
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const placeholder = editorPlaceholders[locale].text;
    const replacement = before + (selected || placeholder) + after;
    const newContent =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);
    setTranslation({ content: newContent });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start +
          before.length +
          (selected ? selected.length : placeholder.length),
      );
    }, 0);
  };

  const handleInlineImageSelect = (file: File) => addInlineImage(file);

  const uploadPendingInlineImages = async (input: NewsInput) => {
    const referencedImages = pendingInlineImages.filter((image) =>
      Object.values(input.translations).some((translation) =>
        translation?.content.includes(image.url),
      ),
    );
    if (!referencedImages.length) return input;
    const replacements = new Map(
      await Promise.all(
        referencedImages.map(
          async (image) =>
            [image.url, (await upload.mutateAsync(image.file)).url] as const,
        ),
      ),
    );
    return {
      ...input,
      translations: Object.fromEntries(
        Object.entries(input.translations).map(([item, translation]) => [
          item,
          {
            ...translation,
            content: pendingInlineImages.reduce(
              (content, image) =>
                content.replaceAll(image.url, replacements.get(image.url)!),
              translation.content,
            ),
          },
        ]),
      ) as NewsInput["translations"],
    };
  };

  const translateVietnameseToRussian = async () => {
    const Translator = window.Translator;
    if (!Translator) {
      showError(
        t("Không thể dịch tự động"),
        t("Trình duyệt chưa hỗ trợ API dịch tự động."),
      );
      return;
    }
    setIsTranslating(true);
    try {
      const translator = await Translator.create({
        sourceLanguage: "vi",
        targetLanguage: "ru",
      });
      const source = form.translations.VI;
      const [title, summary, content, actionLabel] = await Promise.all([
        translator.translate(source.title),
        translator.translate(source.summary),
        translator.translate(source.content),
        translator.translate(source.actionLabel ?? ""),
      ]);
      setForm((current) => ({
        ...current,
        translations: {
          ...current.translations,
          RU: { title, summary, content, actionLabel },
        },
      }));
      showSuccess(
        t("Đã dịch sang tiếng Nga"),
        t("Nội dung bản dịch tiếng Nga đã được điền tự động."),
      );
    } catch {
      showError(
        t("Không thể dịch tự động"),
        t("Đã xảy ra lỗi trong quá trình dịch thuật tự động."),
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const renderTableContent = () => {
    const allOnPageSelected =
      articles.length > 0 && articles.every((a) => selectedRowIds.has(a.id));
    const isSomeOnPageSelected =
      articles.some((a) => selectedRowIds.has(a.id)) && !allOnPageSelected;

    return (
      <div className="overflow-x-auto">
        {/* ═══════════════ FLOATING BATCH ACTION BAR ═══════════════ */}
        {selectedRowIds.size > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-200 bg-blue-50/95 px-5 py-2.5 backdrop-blur-xs transition-all">
            <div className="flex items-center gap-2.5 text-xs font-bold text-blue-900">
              <span className="grid size-6 place-items-center rounded-full bg-blue-600 text-xs font-black text-white shadow-2xs">
                {selectedRowIds.size}
              </span>
              <span>
                {t("Đã chọn")} {selectedRowIds.size} {t("bài viết đã chọn")}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isBatchProcessing}
                onClick={handleBatchPublish}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 py-1 text-xs font-bold text-emerald-700 shadow-2xs transition hover:bg-emerald-50 active:scale-95 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base leading-none">
                  visibility
                </span>
                <span>{t("Xuất bản hàng loạt")}</span>
              </button>
              <button
                type="button"
                disabled={isBatchProcessing}
                onClick={handleBatchUnpublish}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-amber-300 bg-white px-3 py-1 text-xs font-bold text-amber-700 shadow-2xs transition hover:bg-amber-50 active:scale-95 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base leading-none">
                  visibility_off
                </span>
                <span>{t("Ẩn hàng loạt")}</span>
              </button>
              <button
                type="button"
                disabled={isBatchProcessing}
                onClick={() => handleBatchFeature(true)}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-indigo-300 bg-white px-3 py-1 text-xs font-bold text-indigo-700 shadow-2xs transition hover:bg-indigo-50 active:scale-95 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base leading-none text-amber-500">
                  star
                </span>
                <span>{t("Ghim nổi bật")}</span>
              </button>
              <button
                type="button"
                disabled={isBatchProcessing}
                onClick={() => handleBatchFeature(false)}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 active:scale-95 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base leading-none text-slate-400">
                  star_border
                </span>
                <span>{t("Bỏ ghim nổi bật")}</span>
              </button>
              <button
                type="button"
                disabled={isBatchProcessing}
                onClick={handleBatchDelete}
                className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-1 text-xs font-bold text-rose-700 shadow-2xs transition hover:bg-rose-50 active:scale-95 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-base leading-none">
                  delete
                </span>
                <span>{t("Xóa hàng loạt")}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedRowIds(new Set())}
                className="inline-flex min-h-8 items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-500 transition hover:bg-blue-100/60 hover:text-slate-800"
              >
                <span className="material-symbols-outlined text-base leading-none">
                  close
                </span>
                <span>{t("Bỏ chọn")}</span>
              </button>
            </div>
          </div>
        ) : null}

        <table className="w-full min-w-[960px] table-fixed border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10 border-b border-slate-200/90 bg-slate-50/95 backdrop-blur-xs text-xs font-semibold uppercase tracking-wider text-slate-500">
            <tr>
              {/* Checkbox Column */}
              <th scope="col" className="w-12 px-4 py-3.5 text-center">
                <input
                  type="checkbox"
                  aria-label={t("Chọn tất cả bài viết")}
                  checked={allOnPageSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isSomeOnPageSelected;
                  }}
                  onChange={(e) => {
                    const next = new Set(selectedRowIds);
                    if (e.target.checked) {
                      articles.forEach((a) => next.add(a.id));
                    } else {
                      articles.forEach((a) => next.delete(a.id));
                    }
                    setSelectedRowIds(next);
                  }}
                  className="size-4.5 rounded border-slate-300 text-blue-600 transition focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                />
              </th>

              {/* Title & Date Column (Sortable) */}
              <th scope="col" className="w-[38%] px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSort("title")}
                    className="group inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider text-slate-600 hover:text-blue-700 transition"
                  >
                    <span>{t("Bài viết / Nội dung")}</span>
                    <span
                      className={`material-symbols-outlined text-base transition ${
                        sortField === "title"
                          ? "text-blue-600"
                          : "text-slate-300 group-hover:text-slate-500"
                      }`}
                    >
                      {sortField === "title"
                        ? sortOrder === "asc"
                          ? "arrow_upward"
                          : "arrow_downward"
                        : "unfold_more"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSort("date")}
                    title={t("Sắp xếp theo thời gian")}
                    className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold transition ${
                      sortField === "date"
                        ? "bg-blue-100 text-blue-700"
                        : "text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">
                      schedule
                    </span>
                    <span>
                      {sortField === "date"
                        ? sortOrder === "desc"
                          ? t("Mới nhất")
                          : t("Cũ nhất")
                        : t("Thời gian")}
                    </span>
                  </button>
                </div>
              </th>

              {/* Category Column (Sortable) */}
              <th
                scope="col"
                className="w-44 px-4 py-3.5 text-center whitespace-nowrap"
              >
                <button
                  type="button"
                  onClick={() => handleSort("category")}
                  className="group inline-flex items-center justify-center gap-1.5 font-semibold uppercase tracking-wider text-slate-600 hover:text-blue-700 transition"
                >
                  <span>{t("Danh mục")}</span>
                  <span
                    className={`material-symbols-outlined text-base transition ${
                      sortField === "category"
                        ? "text-blue-600"
                        : "text-slate-300 group-hover:text-slate-500"
                    }`}
                  >
                    {sortField === "category"
                      ? sortOrder === "asc"
                        ? "arrow_upward"
                        : "arrow_downward"
                      : "unfold_more"}
                  </span>
                </button>
              </th>

              {/* Status Column (Sortable) */}
              <th
                scope="col"
                className="w-36 px-4 py-3.5 text-center whitespace-nowrap"
              >
                <button
                  type="button"
                  onClick={() => handleSort("status")}
                  className="group inline-flex items-center justify-center gap-1.5 font-semibold uppercase tracking-wider text-slate-600 hover:text-blue-700 transition"
                >
                  <span>{t("Trạng thái")}</span>
                  <span
                    className={`material-symbols-outlined text-base transition ${
                      sortField === "status"
                        ? "text-blue-600"
                        : "text-slate-300 group-hover:text-slate-500"
                    }`}
                  >
                    {sortField === "status"
                      ? sortOrder === "asc"
                        ? "arrow_upward"
                        : "arrow_downward"
                      : "unfold_more"}
                  </span>
                </button>
              </th>

              {/* Featured Column (Sortable) */}
              <th
                scope="col"
                className="w-32 px-4 py-3.5 whitespace-nowrap text-center"
              >
                <button
                  type="button"
                  onClick={() => handleSort("featured")}
                  className="group inline-flex items-center justify-center gap-1.5 font-semibold uppercase tracking-wider text-slate-600 hover:text-blue-700 transition"
                >
                  <span>{t("Tin nổi bật")}</span>
                  <span
                    className={`material-symbols-outlined text-base transition ${
                      sortField === "featured"
                        ? "text-blue-600"
                        : "text-slate-300 group-hover:text-slate-500"
                    }`}
                  >
                    {sortField === "featured"
                      ? sortOrder === "asc"
                        ? "arrow_upward"
                        : "arrow_downward"
                      : "unfold_more"}
                  </span>
                </button>
              </th>

              {/* Actions Column */}
              <th
                scope="col"
                className="w-48 px-4 py-3.5 text-center whitespace-nowrap"
              >
                {t("Thao tác")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Skeleton Loading Rows */}
            {list.isLoading
              ? Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-4 py-3 text-center align-middle">
                      <div className="mx-auto size-4.5 rounded bg-slate-200" />
                    </td>
                    <td className="px-5 py-3 align-middle">
                      <div className="space-y-1.5 max-w-md">
                        <div className="h-4 w-3/4 rounded bg-slate-200" />
                        <div className="h-3 w-36 rounded bg-slate-200" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center align-middle">
                      <div className="mx-auto h-6 w-24 rounded bg-slate-200" />
                    </td>
                    <td className="px-4 py-3 text-center align-middle">
                      <div className="mx-auto h-6 w-20 rounded bg-slate-200" />
                    </td>
                    <td className="px-4 py-3 text-center align-middle">
                      <div className="mx-auto h-6 w-16 rounded bg-slate-200" />
                    </td>
                    <td className="px-4 py-3 text-center align-middle">
                      <div className="mx-auto h-8 w-28 rounded bg-slate-200" />
                    </td>
                  </tr>
                ))
              : null}

            {list.isError ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-red-50 text-red-600">
                    <span className="material-symbols-outlined text-2xl">
                      error
                    </span>
                  </div>
                  <p className="mt-3 text-base font-semibold text-red-800">
                    {t("Không thể tải danh sách nội dung")}
                  </p>
                  <p className="mt-1 text-xs text-red-600">
                    {t("Đã xảy ra lỗi khi kết nối máy chủ.")}
                  </p>
                </td>
              </tr>
            ) : null}

            {!list.isLoading && !list.isError && articles.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                    <span className="material-symbols-outlined text-2xl">
                      feed
                    </span>
                  </div>
                  <p className="mt-3 text-base font-semibold text-slate-800">
                    {t("Chưa có nội dung phù hợp")}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {t("Hãy thử thay đổi từ khóa hoặc bộ lọc tìm kiếm.")}
                  </p>
                </td>
              </tr>
            ) : null}

            {!list.isLoading &&
              !list.isError &&
              articles.map((article) => {
                const title = article.translations[0]?.title || article.id;
                const dateInfo = formatDate(
                  article.publishedAt || article.updatedAt,
                );
                const isSelected = selectedRowIds.has(article.id);

                return (
                  <tr
                    key={article.id}
                    className={`group transition hover:bg-slate-50/80 ${
                      isSelected
                        ? "bg-blue-50/50"
                        : selectedId === article.id
                          ? "bg-blue-50/25"
                          : ""
                    }`}
                  >
                    {/* Checkbox Cell */}
                    <td
                      className={`px-4 text-center align-middle ${
                        tableDensity === "compact" ? "py-2" : "py-3"
                      }`}
                    >
                      <input
                        type="checkbox"
                        aria-label={`${t("Chọn bài viết")}: ${title}`}
                        checked={isSelected}
                        onChange={(e) => {
                          const next = new Set(selectedRowIds);
                          if (e.target.checked) {
                            next.add(article.id);
                          } else {
                            next.delete(article.id);
                          }
                          setSelectedRowIds(next);
                        }}
                        className="size-4.5 rounded border-slate-300 text-blue-600 transition focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
                      />
                    </td>

                    {/* Content / Article Cell (Clean Enterprise Format) */}
                    <td
                      className={`px-5 align-middle ${
                        tableDensity === "compact" ? "py-2" : "py-3"
                      }`}
                    >
                      <div className="flex flex-col justify-center gap-1 min-w-0 max-w-xl">
                        <button
                          data-no-localize
                          type="button"
                          onClick={() => open(article)}
                          title={title}
                          className={`block text-left font-semibold text-slate-900 leading-snug transition hover:text-blue-600 line-clamp-1 truncate break-words focus-visible:outline-2 focus-visible:outline-blue-600 ${
                            tableDensity === "compact" ? "text-xs" : "text-sm"
                          }`}
                        >
                          {title}
                        </button>

                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="font-medium text-slate-500">
                            {dateInfo.date}
                          </span>
                          <span className="text-slate-300">•</span>
                          {/* Multilingual Status Badges (VI, RU, EN) */}
                          <div
                            className="flex items-center gap-1"
                            title={t("Độ phủ dịch thuật")}
                          >
                            {locales.map((loc) => {
                              const hasTranslation = article.translations.some(
                                (tr) => tr.locale === loc && tr.title?.trim(),
                              );
                              return (
                                <span
                                  key={loc}
                                  className={`rounded px-1.5 py-0.2 text-[10px] font-bold tracking-wider ${
                                    hasTranslation
                                      ? "bg-blue-100/90 text-blue-700"
                                      : "border border-dashed border-slate-300 text-slate-300"
                                  }`}
                                  title={
                                    hasTranslation
                                      ? `${loc}: ${t("Đã dịch")}`
                                      : `${loc}: ${t("Chưa có")}`
                                  }
                                >
                                  {loc}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category Cell */}
                    <td
                      className={`px-4 text-center align-middle whitespace-nowrap ${
                        tableDensity === "compact" ? "py-2" : "py-3"
                      }`}
                    >
                      <span className="inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {allCategories[article.category] || article.category}
                      </span>
                    </td>

                    {/* Status Cell */}
                    <td
                      className={`px-4 text-center align-middle whitespace-nowrap ${
                        tableDensity === "compact" ? "py-2" : "py-3"
                      }`}
                    >
                      {article.publishedAt ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          {t("Đã xuất bản")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                          <span className="size-1.5 rounded-full bg-amber-500" />
                          {t("Bản nháp")}
                        </span>
                      )}
                    </td>

                    {/* Featured Toggle Cell */}
                    <td
                      className={`px-4 align-middle whitespace-nowrap text-center ${
                        tableDensity === "compact" ? "py-2" : "py-3"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          update.mutate({
                            id: article.id,
                            input: { isFeatured: !article.isFeatured },
                          });
                        }}
                        title={
                          article.isFeatured
                            ? t("Bỏ đánh dấu nổi bật")
                            : t("Đánh dấu tin nổi bật")
                        }
                        aria-label={
                          article.isFeatured
                            ? t("Bỏ đánh dấu nổi bật")
                            : t("Đánh dấu tin nổi bật")
                        }
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold transition active:scale-95 ${
                          article.isFeatured
                            ? "border border-amber-300 bg-amber-50 text-amber-800 shadow-2xs hover:bg-amber-100"
                            : "border border-slate-200 bg-white text-slate-400 hover:border-amber-300 hover:text-amber-600"
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm leading-none text-amber-500">
                          {article.isFeatured ? "star" : "star_outline"}
                        </span>
                        <span>
                          {article.isFeatured ? t("Nổi bật") : t("Thường")}
                        </span>
                      </button>
                    </td>

                    {/* Action Buttons Cell */}
                    <td
                      className={`px-4 align-middle text-center whitespace-nowrap ${
                        tableDensity === "compact" ? "py-2" : "py-3"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          disabled={update.isPending}
                          onClick={() =>
                            update.mutate({
                              id: article.id,
                              input: {
                                publishedAt: article.publishedAt
                                  ? null
                                  : new Date().toISOString(),
                              },
                            })
                          }
                          title={article.publishedAt ? "Ẩn tin" : "Hiện tin"}
                          aria-label={`${article.publishedAt ? "Ẩn tin" : "Hiện tin"} ${title}`}
                          className="inline-flex min-h-9 min-w-18 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-600 shadow-2xs transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-base leading-none">
                            {article.publishedAt
                              ? "visibility_off"
                              : "visibility"}
                          </span>
                          <span>
                            {article.publishedAt ? "Ẩn tin" : "Hiện tin"}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => open(article)}
                          title={t("Chỉnh sửa")}
                          aria-label={`${t("Chỉnh sửa")} ${title}`}
                          className="grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-2xs transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-600"
                        >
                          <span className="material-symbols-outlined text-base leading-none">
                            edit
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const confirmation = await confirmAction({
                              title: t("Xóa?"),
                              text: t(
                                "Bài viết và toàn bộ bản dịch sẽ bị xóa vĩnh viễn.",
                              ),
                              confirmButtonText: t("Xóa"),
                              isDestructive: true,
                            });
                            if (confirmation.isConfirmed) {
                              deleteArticle.mutate(article.id);
                            }
                          }}
                          title={t("Xóa bài viết")}
                          aria-label={`${t("Xóa bài viết")} ${title}`}
                          className="grid size-9 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-2xs transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 active:scale-95 focus-visible:outline-2 focus-visible:outline-rose-600"
                        >
                          <span className="material-symbols-outlined text-base leading-none">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPaginationFooter = () => (
    <div className="flex flex-col items-center justify-between gap-3.5 border-t border-slate-200/80 bg-slate-50/50 px-4 py-3 text-xs text-slate-600 sm:flex-row sm:px-6">
      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <span>Hiển thị</span>
        <select
          aria-label="Số dòng mỗi trang"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="rounded-lg border border-slate-200 bg-white px-2 py-1 font-semibold text-slate-700 outline-none focus:outline-none"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>dòng / trang</span>
      </div>

      {/* Current Page Summary & Controls */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="font-medium text-slate-500">
          {totalCount > 0
            ? `${(currentPage - 1) * pageSize + 1} - ${Math.min(currentPage * pageSize, totalCount)} của ${totalCount}`
            : "0 của 0"}
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="inline-flex min-h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-sm">
              chevron_left
            </span>
            <span>Trước</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(0, 5)
            .map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className={`grid size-8 place-items-center rounded-lg font-medium ${
                  currentPage === pageNumber
                    ? "bg-blue-600 font-bold text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {pageNumber}
              </button>
            ))}

          {totalPages > 5 ? (
            <>
              <span className="px-1 text-slate-400">…</span>
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                className={`grid size-8 place-items-center rounded-lg font-medium ${
                  currentPage === totalPages
                    ? "bg-blue-600 font-bold text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {totalPages}
              </button>
            </>
          ) : null}

          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="inline-flex min-h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-40"
          >
            <span>Tiếp</span>
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return localizeReactNode(
    <div className="mx-auto max-w-[1700px] px-4 py-6 sm:px-6 lg:px-8">
      {/* ═══════════════ HEADER BAR OR BACK BUTTON ═══════════════ */}
      {showEditor ? (
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setSelectedId(undefined);
              router.push(listHref);
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-blue-600 active:scale-95"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            <span>{t("Quay lại danh sách")}</span>
          </button>
        </div>
      ) : !showOverview ? (
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
              Trung tâm nội dung
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {currentViewMeta.title}
            </h1>
            <p className="mt-1 text-sm font-normal text-slate-500">
              {currentViewMeta.subtitle}
            </p>
          </div>
          {!showOverview ? (
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <span className="material-symbols-outlined text-lg leading-none font-bold">
                add
              </span>
              <span>{t("Tạo nội dung mới")}</span>
            </button>
          ) : null}
        </header>
      ) : null}

      {/* ═══════════════ REAL SUMMARY CARDS ═══════════════ */}
      {showSummary ? (
        <section
          aria-label="Tổng quan nội dung"
          className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-3"
        >
          <motion.button
            type="button"
            onClick={() => setStatusFilter("all")}
            aria-pressed={statusFilter === "all"}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className={`flex min-h-[88px] items-center gap-3.5 rounded-2xl border bg-white/95 p-4 text-left shadow-xs transition hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${statusFilter === "all" ? "border-blue-400 ring-2 ring-blue-100" : "border-slate-200/90"}`}
          >
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 shadow-2xs">
              <span className="material-symbols-outlined text-2xl">
                description
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                {isSearchActive ? "Kết quả tìm kiếm" : "Tổng bài viết"}
              </span>
              <div className="mt-0.5 flex items-baseline gap-2">
                <strong className="block text-2xl font-extrabold tracking-tight text-slate-900">
                  <AnimatedNumber value={counts.total} duration={1200} />
                </strong>
                {isSearchActive && systemTotal > totalCount ? (
                  <span className="text-xs font-medium text-slate-400">
                    / {systemTotal} tổng số
                  </span>
                ) : null}
              </div>
            </div>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setStatusFilter("published")}
            aria-pressed={statusFilter === "published"}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className={`flex min-h-[88px] items-center gap-3.5 rounded-2xl border bg-white/95 p-4 text-left shadow-xs transition hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${statusFilter === "published" ? "border-emerald-400 ring-2 ring-emerald-100" : "border-slate-200/90"}`}
          >
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600 shadow-2xs">
              <span className="material-symbols-outlined text-2xl">
                check_circle
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Đã xuất bản
              </span>
              <strong className="mt-0.5 block text-2xl font-extrabold tracking-tight text-slate-900">
                <AnimatedNumber value={counts.published} duration={1200} />
              </strong>
            </div>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setStatusFilter("featured")}
            aria-pressed={statusFilter === "featured"}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className={`flex min-h-[88px] items-center gap-3.5 rounded-2xl border bg-white/95 p-4 text-left shadow-xs transition hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 ${statusFilter === "featured" ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200/90"}`}
          >
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600 shadow-2xs">
              <span className="material-symbols-outlined text-2xl">star</span>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Tin nổi bật
              </span>
              <strong className="mt-0.5 block text-2xl font-extrabold tracking-tight text-slate-900">
                <AnimatedNumber value={counts.featured ?? 0} duration={1200} />
              </strong>
            </div>
          </motion.button>
        </section>
      ) : null}

      {showOverview ? (
        <ContentOverviewDashboard
          onSelectArticle={(article) => open(article)}
          onResetForNew={reset}
        />
      ) : null}

      {/* ═══════════════ SEARCH & FILTER TOOLBAR, DATA GRID & PAGINATION ═══════════════ */}
      {!showEditor && !showOverview ? (
        <>
          <section
            aria-label="Thanh tìm kiếm và bộ lọc"
            className="mb-5 space-y-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-xs"
          >
            {/* Top Toolbar Row: Status Tabs + Density Switcher + Export CSV */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              {/* Quick Status Segmented Tabs */}
              <div
                role="tablist"
                aria-label={t("Lọc trạng thái")}
                className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100/90 p-1 border border-slate-200/70"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === "all"}
                  onClick={() => setStatusFilter("all")}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                    statusFilter === "all"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span>{t("Tất cả")}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      statusFilter === "all"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-200/80 text-slate-600"
                    }`}
                  >
                    {counts.total}
                  </span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === "published"}
                  onClick={() => setStatusFilter("published")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                    statusFilter === "published"
                      ? "bg-white text-emerald-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span>{t("Đã xuất bản")}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      statusFilter === "published"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200/80 text-slate-600"
                    }`}
                  >
                    {counts.published}
                  </span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === "draft"}
                  onClick={() => setStatusFilter("draft")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                    statusFilter === "draft"
                      ? "bg-white text-amber-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="size-1.5 rounded-full bg-amber-500" />
                  <span>{t("Bản nháp")}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      statusFilter === "draft"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-200/80 text-slate-600"
                    }`}
                  >
                    {Math.max(0, counts.total - counts.published)}
                  </span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === "featured"}
                  onClick={() => setStatusFilter("featured")}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition active:scale-95 ${
                    statusFilter === "featured"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm leading-none text-amber-500">
                    star
                  </span>
                  <span>{t("Tin nổi bật")}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      statusFilter === "featured"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-slate-200/80 text-slate-600"
                    }`}
                  >
                    {counts.featured}
                  </span>
                </button>
              </div>

              {/* Utility Tools: Density Toggle + Export CSV */}
              <div className="flex items-center gap-2">
                {/* Density Switcher */}
                <div
                  className="flex items-center rounded-xl border border-slate-200 bg-slate-50/80 p-0.5 text-slate-600"
                  title={t("Mật độ")}
                >
                  <button
                    type="button"
                    onClick={() => setTableDensity("comfortable")}
                    title={t("Thư thái")}
                    aria-label={t("Thư thái")}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      tableDensity === "comfortable"
                        ? "bg-white text-blue-700 shadow-2xs font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      view_headline
                    </span>
                    <span className="hidden sm:inline">{t("Thư thái")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTableDensity("compact")}
                    title={t("Gọn gàng")}
                    aria-label={t("Gọn gàng")}
                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                      tableDensity === "compact"
                        ? "bg-white text-blue-700 shadow-2xs font-bold"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    <span className="material-symbols-outlined text-base">
                      density_medium
                    </span>
                    <span className="hidden sm:inline">{t("Gọn gàng")}</span>
                  </button>
                </div>

                {/* Export CSV Button */}
                <button
                  type="button"
                  onClick={exportToCSV}
                  title={t("Xuất CSV")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <span className="material-symbols-outlined text-base text-slate-500">
                    download
                  </span>
                  <span>{t("Xuất CSV")}</span>
                </button>
              </div>
            </div>

            {/* Bottom Toolbar Row: Search Bar + Category Dropdown + Reset */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Search Bar */}
              <div className="relative flex h-11 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/10">
                <span className="material-symbols-outlined shrink-0 text-xl text-slate-400">
                  search
                </span>
                <input
                  type="search"
                  aria-label={t("Tìm bài viết")}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("Tìm theo tiêu đề hoặc nội dung bài viết...")}
                  className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label={t("Xóa từ khóa tìm kiếm")}
                    className="grid size-6 place-items-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition active:scale-95"
                  >
                    <span className="material-symbols-outlined text-base">
                      close
                    </span>
                  </button>
                ) : null}
              </div>

              {/* Category Filter Dropdown */}
              <div className="relative min-w-[200px] rounded-xl border border-slate-200 bg-white transition hover:border-slate-300">
                <select
                  aria-label={t("Lọc danh mục")}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-11 w-full cursor-pointer appearance-none bg-transparent py-2 pl-3.5 pr-9 text-xs font-semibold text-slate-700 outline-none focus:outline-none hover:bg-slate-50/50 rounded-xl"
                >
                  <option value="ALL">{t("Tất cả danh mục")}</option>
                  {Object.entries(activeCategories).map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-lg text-slate-400"
                >
                  expand_more
                </span>
              </div>

              {/* Reset Active Filters Button */}
              {isSearchActive ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategoryFilter("ALL");
                    setStatusFilter("all");
                  }}
                  className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/60 px-3.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100/80 active:scale-95 focus-visible:outline-2 focus-visible:outline-rose-500"
                  title={t("Đặt lại tất cả bộ lọc")}
                >
                  <span className="material-symbols-outlined text-base">
                    filter_alt_off
                  </span>
                  <span>{t("Đặt lại")}</span>
                </button>
              ) : null}
            </div>

            {/* Active search filter indicator chips */}
            {isSearchActive ? (
              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2.5 text-xs text-slate-500">
                <span className="font-medium text-slate-400">
                  {t("Đang lọc theo:")}
                </span>
                {query.trim() ? (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    <span className="truncate max-w-[280px]">
                      {t("Từ khóa:")} &ldquo;{query}&rdquo;
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      aria-label={t("Xóa từ khóa tìm kiếm")}
                      className="hover:text-blue-900"
                    >
                      <span className="material-symbols-outlined text-sm leading-none">
                        close
                      </span>
                    </button>
                  </span>
                ) : null}
                {categoryFilter !== "ALL" ? (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                    <span>
                      {allCategories[categoryFilter] || categoryFilter}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCategoryFilter("ALL")}
                      aria-label={t("Xóa bộ lọc danh mục")}
                      className="hover:text-indigo-900"
                    >
                      <span className="material-symbols-outlined text-sm leading-none">
                        close
                      </span>
                    </button>
                  </span>
                ) : null}
                {statusFilter !== "all" ? (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    <span>
                      {statusFilter === "published"
                        ? t("Đã xuất bản")
                        : statusFilter === "draft"
                          ? t("Bản nháp")
                          : t("Tin nổi bật")}
                    </span>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("all")}
                      aria-label={t("Xóa bộ lọc trạng thái")}
                      className="hover:text-emerald-900"
                    >
                      <span className="material-symbols-outlined text-sm leading-none">
                        close
                      </span>
                    </button>
                  </span>
                ) : null}
                <span className="ml-auto text-xs font-medium text-slate-400">
                  {totalCount > 0
                    ? `${t("Tìm thấy")} ${totalCount} ${t("kết quả")}`
                    : t("Không có kết quả")}
                </span>
              </div>
            ) : null}
          </section>

          {/* ═══════════════ CORE NEWS LIST & PAGINATION (UNIFIED CARD) ═══════════════ */}
          {showList ? (
            <section
              aria-label="Danh sách bài viết"
              className="mb-8 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm"
            >
              {renderTableContent()}
              {renderPaginationFooter()}
            </section>
          ) : null}
        </>
      ) : null}

      {showEditor ? (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (!validateForm()) {
              return;
            }

            const actionTitle = selectedId
              ? t("Lưu chỉnh sửa?")
              : t("Tạo nội dung mới?");

            const confirmation = await confirmAction({
              title: actionTitle,
              confirmButtonText: t(selectedId ? "Lưu chỉnh sửa" : "Tạo mới"),
              icon: "question",
            });

            if (!confirmation.isConfirmed) return;

            try {
              const [coverImageUrl, contentInput] = await Promise.all([
                pendingCoverFile
                  ? upload.mutateAsync(pendingCoverFile).then(({ url }) => url)
                  : Promise.resolve(form.coverImageUrl),
                uploadPendingInlineImages(
                  payload({ ...form, isFeatured: featured }),
                ),
              ]);
              const input = { ...contentInput, coverImageUrl };
              if (selectedId) {
                await update.mutateAsync({ id: selectedId, input });
              } else {
                await create.mutateAsync(input);
              }
              setForm({
                ...form,
                coverImageUrl,
                translations: {
                  ...form.translations,
                  ...contentInput.translations,
                },
              });
              setPendingCoverFile(null);
              setCoverPreviewUrl(coverImageUrl ?? null);
              pendingInlineImages.forEach((image) =>
                URL.revokeObjectURL(image.url),
              );
              setPendingInlineImages([]);
            } catch {
              showError(t("Không thể lưu"), t("Thất bại khi lưu nội dung"));
            }
          }}
          className="mb-8 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-lg"
        >
          <div className="flex flex-col gap-3 border-b border-slate-200/80 bg-slate-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {selectedId ? (
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  ĐANG BIÊN TẬP
                </p>
              ) : null}
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                {selectedId ? t("Chỉnh sửa nội dung") : t("Tạo nội dung")}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedId(undefined);
                  router.push(listHref);
                }}
                className="grid size-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition shadow-2xs"
                title="Đóng trình soạn thảo"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-7">
            {detail.isFetching ? (
              <p className="mb-4 text-sm text-slate-600">
                Đang đồng bộ chi tiết…
              </p>
            ) : null}
            {error ? (
              <p
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800"
              >
                {t("Yêu cầu không thể hoàn tất. Vui lòng thử lại.")}
              </p>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-bold text-slate-800">
                Danh mục
                <select
                  value={form.category}
                  onChange={(event) => {
                    setForm({ ...form, category: event.target.value });
                    if (fieldErrors.category) {
                      setFieldErrors((prev) => ({ ...prev, category: "" }));
                    }
                  }}
                  className={`mt-2 min-h-11 w-full rounded-xl border ${
                    fieldErrors.category
                      ? "border-red-400 bg-red-50/30"
                      : "border-slate-300 bg-white"
                  } px-3 font-normal outline-none focus:outline-none focus:border-blue-500 transition`}
                >
                  {Object.entries(activeCategories).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                {fieldErrors.category ? (
                  <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600">
                    <span className="material-symbols-outlined text-sm">
                      error
                    </span>
                    {fieldErrors.category}
                  </p>
                ) : null}
              </label>

              {/* Đặt làm tin nổi bật */}
              <div className="flex flex-col justify-end">
                <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 transition hover:border-amber-300 hover:bg-amber-50/30">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(event) => setFeatured(event.target.checked)}
                    className="size-4 rounded border-slate-300 text-blue-600 focus:ring-0"
                  />
                  <div>
                    <span className="block text-xs sm:text-sm font-bold text-slate-800">
                      Đặt làm tin nổi bật
                    </span>
                    <span className="block text-[11px] text-slate-500">
                      Ưu tiên hiển thị tại tiêu điểm trang chủ và đầu danh sách
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Hình ảnh đại diện bài viết (Cover/Featured Image with Preview) */}
            {(() => {
              const displayUrl = coverPreviewUrl || form.coverImageUrl;
              return (
                <div
                  className={`mt-5 rounded-2xl border ${
                    fieldErrors.coverImageUrl
                      ? "border-red-300 bg-red-50/20"
                      : "border-slate-200 bg-slate-50/50"
                  } p-4 sm:p-5`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <label className="block text-sm font-bold text-slate-900">
                        Hình ảnh đại diện bài viết
                      </label>
                      <p className="mt-0.5 text-xs text-slate-500">
                        Định dạng hỗ trợ: JPG, PNG, WEBP, tối đa 20 MB. Ảnh hiển
                        thị tại tiêu điểm trang chủ và đầu bài viết.
                      </p>
                    </div>
                    {displayUrl ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        <span className="material-symbols-outlined text-sm">
                          check_circle
                        </span>
                        {pendingCoverFile ? "Xem trước ảnh mới" : "Đã có ảnh"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                        <span className="material-symbols-outlined text-sm">
                          info
                        </span>
                        Cần ảnh đại diện
                      </span>
                    )}
                  </div>

                  {fieldErrors.coverImageUrl ? (
                    <p className="mt-2.5 flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 p-2 text-xs font-semibold text-red-600">
                      <span className="material-symbols-outlined text-sm">
                        error
                      </span>
                      {fieldErrors.coverImageUrl}
                    </p>
                  ) : null}

                  {displayUrl ? (
                    <div className="mt-3.5 flex flex-col items-start gap-4 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center">
                      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-100 shadow-xs sm:w-48">
                        <img
                          src={displayUrl}
                          alt="Hình ảnh đại diện bài viết"
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between self-stretch py-1">
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            {pendingCoverFile
                              ? `Xem trước: ${pendingCoverFile.name} (${(pendingCoverFile.size / 1024).toFixed(0)} KB)`
                              : "Ảnh đại diện hiện tại"}
                          </p>
                          <p className="mt-1 max-w-md truncate text-xs text-slate-400">
                            {pendingCoverFile
                              ? "Ảnh chưa tải lên máy chủ, sẽ tự động lưu khi bạn tạo mới hoặc lưu chỉnh sửa."
                              : form.coverImageUrl}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 active:scale-95">
                            <span className="material-symbols-outlined text-base text-slate-500">
                              cached
                            </span>
                            <span>Thay đổi ảnh</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp"
                              className="sr-only"
                              onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) handleCoverFileChange(file);
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            onClick={handleRemoveCover}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50/50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100/70 active:scale-95"
                          >
                            <span className="material-symbols-outlined text-base">
                              delete
                            </span>
                            <span>Xóa ảnh</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3.5">
                      <label className="flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white p-4 transition hover:border-blue-400 hover:bg-blue-50/20">
                        <div className="mb-1.5 grid size-10 place-items-center rounded-full bg-blue-50 text-blue-600">
                          <span className="material-symbols-outlined text-2xl">
                            add_photo_alternate
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          Bấm vào đây để chọn hình ảnh xem trước
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          PNG, JPG hoặc WEBP (tối đa 5MB)
                        </p>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (file) handleCoverFileChange(file);
                          }}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Language Switcher for Editor */}
            <div
              className="mt-6 flex flex-wrap items-center gap-2"
              role="tablist"
              aria-label="Ngôn ngữ bài viết"
            >
              {locales.map((item) => {
                const isSelected = locale === item;
                return (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => setLocale(item)}
                    className={`relative min-h-10 rounded-xl px-4 text-xs font-bold transition-colors ${
                      isSelected
                        ? "text-white"
                        : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {isSelected && (
                      <motion.span
                        layoutId="news-locale-tab-indicator"
                        transition={{
                          type: "spring",
                          stiffness: 450,
                          damping: 35,
                        }}
                        className="absolute inset-0 rounded-xl bg-blue-600 shadow-xs"
                      />
                    )}
                    <span className="relative z-10">{localeNames[item]}</span>
                  </button>
                );
              })}
            </div>

            {/* Translation Fields */}
            <fieldset className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
              <legend className="px-2 text-sm font-black text-slate-950">
                Nội dung · {localeNames[locale]}
              </legend>
              <label className="block text-sm font-bold text-slate-800">
                Tiêu đề
                <input
                  value={translation.title}
                  onChange={(event) => {
                    setTranslation({ title: event.target.value });
                    if (fieldErrors.title) {
                      setFieldErrors((prev) => ({ ...prev, title: "" }));
                    }
                  }}
                  className={`mt-2 min-h-11 w-full rounded-xl border ${
                    fieldErrors.title
                      ? "border-red-400 bg-red-50/30"
                      : "border-slate-300"
                  } px-3 font-normal outline-none focus:outline-none focus:border-blue-500 transition`}
                />
                {fieldErrors.title ? (
                  <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600">
                    <span className="material-symbols-outlined text-sm">
                      error
                    </span>
                    {fieldErrors.title}
                  </p>
                ) : null}
              </label>
              <label className="mt-4 block text-sm font-bold text-slate-800">
                Tóm tắt
                <textarea
                  value={translation.summary}
                  onChange={(event) => {
                    setTranslation({ summary: event.target.value });
                    if (fieldErrors.summary) {
                      setFieldErrors((prev) => ({ ...prev, summary: "" }));
                    }
                  }}
                  className={`mt-2 min-h-24 w-full rounded-xl border ${
                    fieldErrors.summary
                      ? "border-red-400 bg-red-50/30"
                      : "border-slate-300"
                  } p-3 font-normal leading-relaxed outline-none focus:outline-none focus:border-blue-500 transition`}
                />
                {fieldErrors.summary ? (
                  <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-600">
                    <span className="material-symbols-outlined text-sm">
                      error
                    </span>
                    {fieldErrors.summary}
                  </p>
                ) : null}
              </label>
              <div className="mt-5">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <label
                    htmlFor="news-content-textarea"
                    className="text-sm font-bold text-slate-800"
                  >
                    Nội dung bài viết
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setContentTab(
                        contentTab === "preview" ? "write" : "preview",
                      )
                    }
                    aria-pressed={contentTab === "preview"}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-base font-semibold text-slate-700 transition-colors hover:border-blue-300 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {contentTab === "preview"
                        ? "visibility_off"
                        : "visibility"}
                    </span>
                    <span>{contentTab === "preview" ? "Ẩn" : "Hiện"}</span>
                  </button>
                </div>

                {contentTab === "write" ? (
                  <div
                    className={`overflow-hidden rounded-xl border ${
                      fieldErrors.content
                        ? "border-red-400 bg-red-50/10"
                        : "border-slate-300 bg-white"
                    } shadow-2xs transition focus-within:border-blue-500`}
                  >
                    {/* Markdown Formatting Toolbar */}
                    <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50/80 px-3 py-1.5">
                      <label
                        title="Chèn hình ảnh vào bài viết"
                        className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 transition hover:bg-blue-100 active:scale-95"
                      >
                        <span className="material-symbols-outlined text-base">
                          add_photo_alternate
                        </span>
                        <span>Chèn ảnh</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleInlineImageSelect(file);
                            e.target.value = "";
                          }}
                          className="sr-only"
                        />
                      </label>
                      <div className="mx-1 h-4 w-px bg-slate-300" />
                      <button
                        type="button"
                        title="In đậm (**văn bản**)"
                        onClick={() => insertMarkdownSnippet("**", "**")}
                        className="grid size-7 place-items-center rounded-md text-xs font-bold text-slate-700 hover:bg-slate-200"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        title="In nghiêng (*văn bản*)"
                        onClick={() => insertMarkdownSnippet("*", "*")}
                        className="grid size-7 place-items-center rounded-md font-serif text-xs italic text-slate-700 hover:bg-slate-200"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        title="Tiêu đề mục (### Tiêu đề)"
                        onClick={() => insertMarkdownSnippet("\n### ", "\n")}
                        className="grid size-7 place-items-center rounded-md text-xs font-bold text-slate-700 hover:bg-slate-200"
                      >
                        H
                      </button>
                      <button
                        type="button"
                        title="Danh sách (- Mục)"
                        onClick={() => insertMarkdownSnippet("\n- ", "")}
                        className="grid size-7 place-items-center rounded-md text-slate-700 hover:bg-slate-200"
                      >
                        <span className="material-symbols-outlined text-base">
                          format_list_bulleted
                        </span>
                      </button>
                      <button
                        type="button"
                        title="Trích dẫn (> Trích dẫn)"
                        onClick={() => insertMarkdownSnippet("\n> ", "\n")}
                        className="grid size-7 place-items-center rounded-md text-slate-700 hover:bg-slate-200"
                      >
                        <span className="material-symbols-outlined text-base">
                          format_quote
                        </span>
                      </button>
                    </div>

                    <textarea
                      id="news-content-textarea"
                      value={translation.content}
                      onPaste={handleContentPaste}
                      onDrop={handleContentDrop}
                      onChange={(event) => {
                        setTranslation({ content: event.target.value });
                        if (fieldErrors.content) {
                          setFieldErrors((prev) => ({ ...prev, content: "" }));
                        }
                      }}
                      placeholder="Nhập nội dung bài viết... Bạn có thể nhấn Ctrl + V để dán ảnh trực tiếp từ clipboard (ảnh chụp màn hình) hoặc kéo thả file ảnh vào đây."
                      className="min-h-72 w-full resize-y p-3 font-normal leading-relaxed text-slate-900 placeholder:text-slate-400 outline-none transition focus:outline-none"
                    />

                    <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-3 py-1.5 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-blue-500">
                          info
                        </span>
                        Dán ảnh trực tiếp bằng{" "}
                        <strong className="font-semibold text-slate-700">
                          Ctrl + V
                        </strong>{" "}
                        hoặc kéo thả file ảnh vào ô soạn thảo.
                      </span>
                      <span>{(translation.content || "").length} ký tự</span>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-72 rounded-xl border border-slate-200 bg-slate-50/30 p-5">
                    {translation.content.trim() ? (
                      <div
                        data-no-localize
                        className="space-y-4 text-sm leading-relaxed text-slate-800 sm:text-base"
                      >
                        {translation.content
                          .split(/\n{2,}/)
                          .filter(Boolean)
                          .map((paragraph, index) => {
                            const imgMatch = paragraph.match(
                              /^!\[(.*?)\]\((.*?)\)$/,
                            );
                            if (imgMatch) {
                              const alt = imgMatch[1];
                              const src = imgMatch[2];
                              return (
                                <figure
                                  key={`preview-img-${index}`}
                                  className="my-4"
                                >
                                  <img
                                    src={src}
                                    alt={alt || t("Ảnh minh họa")}
                                    className="max-h-96 w-full rounded-xl border border-slate-200 object-cover shadow-xs"
                                  />
                                  {alt &&
                                  !Object.values(editorPlaceholders).some(
                                    (placeholder) => placeholder.image === alt,
                                  ) ? (
                                    <figcaption className="mt-1.5 text-center text-xs italic text-slate-500">
                                      {alt}
                                    </figcaption>
                                  ) : null}
                                </figure>
                              );
                            }
                            if (paragraph.startsWith("### ")) {
                              return (
                                <h3
                                  key={`preview-h3-${index}`}
                                  className="mt-4 text-lg font-bold text-slate-900"
                                >
                                  {paragraph.replace(/^###\s+/, "")}
                                </h3>
                              );
                            }
                            if (paragraph.startsWith("> ")) {
                              return (
                                <blockquote
                                  key={`preview-quote-${index}`}
                                  className="rounded-r-lg border-l-4 border-blue-500 bg-blue-50/40 py-2 pl-3 italic text-slate-600"
                                >
                                  {paragraph.replace(/^>\s+/, "")}
                                </blockquote>
                              );
                            }
                            return (
                              <p
                                key={`preview-p-${index}`}
                                className="whitespace-pre-line"
                              >
                                {paragraph}
                              </p>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="grid place-items-center py-12 text-center text-slate-400">
                        <span className="material-symbols-outlined mb-2 text-4xl text-slate-300">
                          article
                        </span>
                        <p className="text-sm">Chưa có nội dung để xem trước</p>
                      </div>
                    )}
                  </div>
                )}
                {fieldErrors.content ? (
                  <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-red-600">
                    <span className="material-symbols-outlined text-sm">
                      error
                    </span>
                    {fieldErrors.content}
                  </p>
                ) : null}
              </div>
            </fieldset>

            {/* Form Actions Footer Bar */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3.5 border-t border-slate-200 bg-slate-50/80 -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 p-5 sm:p-6 rounded-b-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(undefined);
                    router.push(listHref);
                  }}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95 transition"
                >
                  <span className="material-symbols-outlined text-base">
                    arrow_back
                  </span>
                  <span>Hủy bỏ</span>
                </button>
                {selectedId && view !== "new" ? (
                  <button
                    type="button"
                    disabled={deleteArticle.isPending}
                    onClick={async () => {
                      const confirmation = await confirmAction({
                        title: t("Xóa nội dung?"),
                        text: t("Không thể hoàn tác sau khi xóa."),
                        confirmButtonText: t("Xóa"),
                        isDestructive: true,
                        icon: "warning",
                      });
                      if (confirmation.isConfirmed) {
                        deleteArticle.mutate(selectedId);
                      }
                    }}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/60 px-3.5 text-xs font-bold text-red-700 shadow-xs hover:bg-red-100 disabled:opacity-50 active:scale-95 transition"
                  >
                    <span className="material-symbols-outlined text-base">
                      delete
                    </span>
                    <span>
                      {deleteArticle.isPending ? "Đang xóa..." : "Xóa"}
                    </span>
                  </button>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="submit"
                  disabled={
                    create.isPending || update.isPending || upload.isPending
                  }
                  className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-6 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 transition"
                >
                  <span className="material-symbols-outlined text-lg">
                    save
                  </span>
                  <span>
                    {upload.isPending
                      ? "Đang tải ảnh..."
                      : create.isPending || update.isPending
                        ? "Đang lưu..."
                        : selectedId
                          ? "Lưu chỉnh sửa"
                          : "Tạo nội dung mới"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : null}
    </div>,
    uiLocale,
    ADMIN_NEWS_TRANSLATIONS,
  );
}

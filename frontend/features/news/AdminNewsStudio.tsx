"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { confirmAction, showSuccess, showError } from "@/lib/alerts";
import { z } from "zod";
import { newsResource } from "./resource";
import { useLocale } from "@/core/i18n/locale";
import { localizeReactNode } from "@/core/i18n/localize-react-node";
import { ADMIN_NEWS_TRANSLATIONS } from "./admin-news-translations";
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
  PUBLICATION: "Ấn phẩm",
};

const categories: Record<string, string> = {
  "science-technology": "Khoa học - Công nghệ",
  "economy-society": "Kinh tế - Xã hội",
  education: "Giáo dục",
  cooperation: "Hợp tác",
};

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

function formatAuthor(author?: {
  id: string;
  firstName: string | null;
  lastName: string | null;
}) {
  if (!author) return { name: "Hệ thống", initial: "H" };
  const fullName = [author.firstName, author.lastName]
    .filter(Boolean)
    .join(" ");
  if (fullName) {
    return { name: fullName, initial: fullName.charAt(0).toUpperCase() };
  }
  return { name: `Tác giả ${author.id.slice(0, 6)}`, initial: "T" };
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
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<AdminNewsListItem | null>(
    null,
  );

  useEffect(() => {
    setCurrentPage(1);
    setSelectedRowIds([]);
  }, [view, categoryFilter, query, pageSize]);

  if (view !== previousView) {
    setPreviousView(view);
    setSelectedId(undefined);
    setPendingCoverFile(null);
    setCoverPreviewUrl(null);
    setFieldErrors({});
    if (view === "new") {
      setForm({
        ...initial,
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
        "ARTICLE",
        "PUBLICATION",
      ].includes(contentView ?? "")
    ) {
      filters.contentType = contentView as NewsContentType;
    }

    if (categoryFilter !== "ALL") {
      filters.category = categoryFilter;
    }
    if (view === "featured") {
      filters.featured = true;
    }
    if (query.trim()) {
      filters.query = query.trim();
    }
    return filters;
  }, [pageSize, currentPage, view, categoryFilter, query, listLocale]);

  const list = useQuery(news.queries.list.options(queryFilters));

  const detail = useQuery({
    ...news.queries.detail.options(selectedId ?? ""),
    enabled: Boolean(selectedId),
  });

  useEffect(() => {
    if (detail.data && selectedId) {
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
  }, [detail.data, selectedId]);

  const create = useMutation(
    news.mutations.create.options({
      onSuccess: ({ client, data, cache }) => {
        cache.queries.list.invalidateAll(client);
        setSelectedId(data.id);
        showSuccess(
          "Tạo thành công",
          `Đã tạo ${contentLabel.toLocaleLowerCase("vi")} mới.`,
        );
      },
      onError: (err: any) => {
        showError(
          "Không thể tạo mới",
          err instanceof Error ? err.message : "Đã xảy ra lỗi khi tạo mới",
        );
      },
    }),
  );

  const update = useMutation(
    news.mutations.update.options({
      onSuccess: ({ client, cache }) => {
        cache.queries.list.invalidateAll(client);
        showSuccess(
          "Đã lưu chỉnh sửa",
          "Nội dung đã được cập nhật thành công.",
        );
      },
      onError: (err: any) => {
        showError(
          "Không thể lưu",
          err instanceof Error ? err.message : "Đã xảy ra lỗi khi lưu",
        );
      },
    }),
  );

  const deleteArticle = useMutation(
    news.mutations.delete.options({
      onSuccess: ({ client, cache }) => {
        cache.queries.list.invalidateAll(client);
        setSelectedId(undefined);
        showSuccess("Đã xóa", "Nội dung đã được xóa khỏi hệ thống.");
      },
      onError: (err: any) => {
        showError(
          "Không thể xóa",
          err instanceof Error ? err.message : "Đã xảy ra lỗi khi xóa",
        );
      },
    }),
  );

  const upload = useMutation(news.mutations.upload.options());

  const rawArticles = list.data?.items ?? [];
  const articles = useMemo(() => {
    if (view === "featured") {
      return rawArticles.filter((a) => a.isFeatured);
    }
    return rawArticles;
  }, [rawArticles, view]);

  const totalCount = list.data?.total ?? 0;
  const counts = {
    total: totalCount,
    published: rawArticles.filter((a) => Boolean(a.publishedAt)).length,
    featured:
      list.data?.counts?.featured ??
      rawArticles.filter((a) => a.isFeatured).length,
  };

  const translation = form.translations[locale];
  const showOverview = !view;
  const showList = Boolean(view && view !== "new" && !selectedId);
  const showEditor = view === "new" || Boolean(selectedId);
  const navContentType =
    view && view in contentTypes
      ? (view as NewsContentType)
      : requestedContentType && requestedContentType in contentTypes
        ? (requestedContentType as NewsContentType)
        : "ARTICLE";
  const contentLabel =
    contentTypes[showEditor ? form.contentType : navContentType];
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
    setForm({ ...initial, contentType: navContentType });
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
    const imageMarkdown = `\n![Hình ảnh](${url})\n`;
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
    const replacement = before + (selected || "văn bản") + after;
    const newContent =
      textarea.value.substring(0, start) +
      replacement +
      textarea.value.substring(end);
    setTranslation({ content: newContent });
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + (selected ? selected.length : "văn bản".length),
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
        "Không thể dịch tự động",
        "Trình duyệt chưa hỗ trợ API dịch tự động.",
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
        "Đã dịch sang tiếng Nga",
        "Nội dung bản dịch tiếng Nga đã được điền tự động.",
      );
    } catch {
      showError(
        "Không thể dịch tự động",
        "Đã xảy ra lỗi trong quá trình dịch thuật tự động.",
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(articles.map((a) => a.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const renderTableContent = () => (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200/80 bg-slate-50/70 text-xs font-semibold text-slate-500">
            <th scope="col" className="w-12 px-4 py-3.5 text-center">
              <input
                type="checkbox"
                aria-label="Chọn tất cả bài viết"
                checked={
                  articles.length > 0 &&
                  selectedRowIds.length === articles.length
                }
                onChange={(e) => toggleSelectAll(e.target.checked)}
                className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th scope="col" className="px-4 py-3.5 w-[300px] max-w-[300px]">
              Bài viết / Nội dung
            </th>
            <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
              Trạng thái
            </th>
            <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
              Tin nổi bật
            </th>
            <th scope="col" className="px-4 py-3.5 whitespace-nowrap">
              Người tạo
            </th>
            <th
              scope="col"
              className="w-20 px-4 py-3.5 text-center whitespace-nowrap"
            >
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {list.isLoading ? (
            <tr>
              <td
                colSpan={6}
                className="p-12 text-center text-base text-slate-500"
              >
                <span className="material-symbols-outlined mr-2 animate-spin align-middle text-2xl text-blue-600">
                  progress_activity
                </span>
                Đang tải dữ liệu thực tế…
              </td>
            </tr>
          ) : null}

          {list.isError ? (
            <tr>
              <td colSpan={6} className="p-12 text-center">
                <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-red-50 text-red-600">
                  <span className="material-symbols-outlined text-2xl">
                    error
                  </span>
                </div>
                <p className="mt-3 text-base font-semibold text-red-800">
                  Không thể tải danh sách nội dung
                </p>
                <p className="mt-1 text-xs text-red-600">
                  {list.error?.message || "Đã xảy ra lỗi khi kết nối máy chủ."}
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
                  Chưa có nội dung phù hợp
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Hãy thử thay đổi từ khóa hoặc bộ lọc tìm kiếm.
                </p>
              </td>
            </tr>
          ) : null}

          {!list.isLoading &&
            !list.isError &&
            articles.map((article) => {
              const title = article.translations[0]?.title || article.id;
              const summary = article.translations[0]?.summary || "";
              const isSelected = selectedRowIds.includes(article.id);
              const authorInfo = formatAuthor(article.author);

              return (
                <tr
                  key={article.id}
                  className={`group transition hover:bg-slate-50/80 ${
                    selectedId === article.id
                      ? "bg-blue-50/40"
                      : isSelected
                        ? "bg-blue-50/20"
                        : ""
                  }`}
                >
                  <td className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      aria-label={`Chọn bài viết ${title}`}
                      checked={isSelected}
                      onChange={() => toggleSelectRow(article.id)}
                      className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>

                  <td className="px-4 py-4 w-[280px] max-w-[280px]">
                    <div className="flex items-start gap-2.5">
                      <div className="min-w-0 flex-1">
                        <button
                          data-no-localize
                          type="button"
                          onClick={() => open(article)}
                          title={title}
                          className="block w-full max-w-[250px] truncate text-left font-bold text-slate-900 transition hover:text-blue-600"
                        >
                          {title}
                        </button>
                        {summary ? (
                          <p
                            data-no-localize
                            className="mt-0.5 line-clamp-2 text-xs text-slate-500 leading-snug"
                          >
                            {summary}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    {article.publishedAt ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Đã xuất bản
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                        <span className="size-1.5 rounded-full bg-amber-500" />
                        Bản nháp
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    {article.isFeatured ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800 shadow-2xs">
                        <span className="material-symbols-outlined text-sm text-amber-500">
                          star
                        </span>
                        Nổi bật
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-300 pl-3">
                        —
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="grid size-7 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs">
                        {authorInfo.initial}
                      </div>
                      <span className="text-xs font-semibold text-slate-700">
                        {authorInfo.name}
                      </span>
                    </div>
                  </td>

                  <td className="relative w-20 px-4 py-4 text-center whitespace-nowrap">
                    <button
                      type="button"
                      aria-label="Tùy chọn thao tác"
                      onClick={() =>
                        setActionMenuId(
                          actionMenuId === article.id ? null : article.id,
                        )
                      }
                      className="grid size-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-xl">
                        more_vert
                      </span>
                    </button>

                    {actionMenuId === article.id ? (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setActionMenuId(null)}
                        />
                        <div className="absolute right-4 top-12 z-20 w-44 rounded-xl border border-slate-200 bg-white p-1.5 text-left text-xs font-medium shadow-lg">
                          <button
                            type="button"
                            onClick={() => {
                              setActionMenuId(null);
                              setPreviewItem(article);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-50"
                          >
                            <span className="material-symbols-outlined text-base">
                              visibility
                            </span>
                            <span>Xem trước</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setActionMenuId(null);
                              open(article);
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <span className="material-symbols-outlined text-base">
                              edit
                            </span>
                            <span>Chỉnh sửa</span>
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              setActionMenuId(null);
                              const confirmation = await confirmAction({
                                title: "Xóa bài viết?",
                                text: "Bài viết và toàn bộ bản dịch sẽ bị xóa vĩnh viễn.",
                                confirmButtonText: "Xóa",
                                isDestructive: true,
                              });
                              if (confirmation.isConfirmed) {
                                deleteArticle.mutate(article.id);
                              }
                            }}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-700 hover:bg-red-50"
                          >
                            <span className="material-symbols-outlined text-base">
                              delete
                            </span>
                            <span>Xóa bài viết</span>
                          </button>
                        </div>
                      </>
                    ) : null}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );

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
    (
      <div className="mx-auto max-w-[1700px] px-4 py-6 sm:px-6 lg:px-8">
      {/* ═══════════════ HEADER BAR OR BACK BUTTON ═══════════════ */}
      {showEditor ? (
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setSelectedId(undefined);
              router.push("/workspace/news");
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-blue-600 active:scale-95"
          >
            <span className="material-symbols-outlined text-base">
              arrow_back
            </span>
            <span>
              Quay lại danh sách {contentLabel.toLocaleLowerCase("vi")}
            </span>
          </button>
        </div>
      ) : (
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
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <span className="material-symbols-outlined text-lg leading-none font-bold">
              add
            </span>
            <span>Tạo {contentLabel.toLocaleLowerCase("vi")} mới</span>
          </button>
        </header>
      )}

      {/* ═══════════════ REAL SUMMARY CARDS ═══════════════ */}
      {showOverview ? (
        <section
          aria-label="Tổng quan nội dung"
          className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-3"
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.25 }}
            className="flex min-h-[84px] items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm"
          >
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
              <span className="material-symbols-outlined text-2xl">
                description
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">
                Tổng bài viết
              </span>
              <strong className="mt-0.5 block text-2xl font-bold text-slate-900">
                {counts.total}
              </strong>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.25, delay: 0.05 }}
            className="flex min-h-[84px] items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm"
          >
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <span className="material-symbols-outlined text-2xl">
                check_circle
              </span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">
                Đã xuất bản
              </span>
              <strong className="mt-0.5 block text-2xl font-bold text-slate-900">
                {counts.published}
              </strong>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="flex min-h-[84px] items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm"
          >
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-100/70 text-amber-600">
              <span className="material-symbols-outlined text-2xl">star</span>
            </div>
            <div>
              <span className="block text-xs font-medium text-slate-500">
                Tin nổi bật
              </span>
              <strong className="mt-0.5 block text-2xl font-bold text-slate-900">
                {counts.featured ?? 0}
              </strong>
            </div>
          </motion.div>
        </section>
      ) : null}

      {/* ═══════════════ SEARCH & FILTER TOOLBAR, DATA GRID & PAGINATION ═══════════════ */}
      {!showEditor ? (
        <>
          <section
            aria-label="Thanh tìm kiếm và bộ lọc"
            className="mb-6 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xs"
          >
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
              {/* Search Bar */}
              <div className="relative flex h-10 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/70 px-3 transition focus-within:border-blue-500">
                <span className="material-symbols-outlined shrink-0 text-lg text-slate-400">
                  search
                </span>
                <input
                  type="search"
                  aria-label="Tìm bài viết"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Tìm tiêu đề, tóm tắt bài viết..."
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Xóa từ khóa tìm kiếm"
                    className="grid size-5 place-items-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                  >
                    <span className="material-symbols-outlined text-sm">
                      close
                    </span>
                  </button>
                ) : null}
              </div>

              {/* Category Filter Dropdown */}
              <div className="relative min-w-[160px] rounded-xl border border-slate-200 bg-white transition hover:border-slate-300">
                <select
                  aria-label="Lọc danh mục"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-10 w-full cursor-pointer appearance-none bg-transparent py-2 pl-3.5 pr-8 text-xs font-semibold text-slate-700 outline-none focus:outline-none hover:bg-slate-50/50 rounded-xl"
                >
                  <option value="ALL">Tất cả danh mục</option>
                  {Object.entries(categories).map(([val, label]) => (
                    <option key={val} value={val}>
                      {label}
                    </option>
                  ))}
                </select>
                <span
                  aria-hidden="true"
                  className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-lg text-slate-400"
                >
                  expand_more
                </span>
              </div>

              {/* Reset Active Filters Button */}
              {query || categoryFilter !== "ALL" ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategoryFilter("ALL");
                  }}
                  className="inline-flex h-10 items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
                  title="Đặt lại tất cả bộ lọc"
                >
                  <span className="material-symbols-outlined text-base">
                    filter_alt_off
                  </span>
                  <span className="hidden sm:inline">Đặt lại</span>
                </button>
              ) : null}
            </div>
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
          ) : showOverview ? (
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

      {/* ═══════════════ READ-ONLY PREVIEW MODAL / PANEL ═══════════════ */}
      {previewItem ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                  {contentTypes[previewItem.contentType]}
                </span>
                <h3
                  data-no-localize
                  className="mt-2 text-xl font-bold text-slate-900"
                >
                  {previewItem.translations[0]?.title || previewItem.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-slate-600">
              <div>
                <strong className="block text-xs font-semibold text-slate-400 uppercase">
                  Tóm tắt
                </strong>
                <p
                  data-no-localize
                  className="mt-1 leading-relaxed text-slate-800"
                >
                  {previewItem.translations[0]?.summary || "Chưa có tóm tắt."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-3.5 text-xs">
                <div>
                  <span className="text-slate-400">Danh mục: </span>
                  <strong className="text-slate-800">
                    {categories[previewItem.category] ?? previewItem.category}
                  </strong>
                </div>

                <div>
                  <span className="text-slate-400">Người tạo: </span>
                  <strong className="text-slate-800">
                    {formatAuthor(previewItem.author).name}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">Cập nhật: </span>
                  <strong className="text-slate-800">
                    {formatDate(previewItem.updatedAt).date}
                  </strong>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  const target = previewItem;
                  setPreviewItem(null);
                  open(target);
                }}
                className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
              >
                <span className="material-symbols-outlined text-base">
                  edit
                </span>
                <span>Chỉnh sửa {contentLabel.toLocaleLowerCase("vi")}</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="min-h-9 rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ═══════════════ EDITOR VIEW / FORM (WHEN CREATING OR EDITING) ═══════════════ */}
      {showEditor ? (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (!validateForm()) {
              return;
            }

            const actionTitle = selectedId
              ? "Lưu chỉnh sửa?"
              : `Tạo ${contentLabel.toLocaleLowerCase("vi")} mới?`;

            const confirmation = await confirmAction({
              title: actionTitle,
              confirmButtonText: selectedId ? "Lưu chỉnh sửa" : "Tạo mới",
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
            } catch (error: unknown) {
              showError(
                "Không thể lưu",
                error instanceof Error
                  ? error.message
                  : "Thất bại khi lưu nội dung",
              );
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
                {selectedId ? "Chỉnh sửa" : "Tạo"}{" "}
                {contentLabel.toLocaleLowerCase("vi")}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedId(undefined);
                  router.push("/workspace/news");
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
                {error.message}
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
                  {Object.entries(categories).map(([value, label]) => (
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
                  <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
                    <button
                      type="button"
                      onClick={() => setContentTab("write")}
                      className={`relative inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                        contentTab === "write"
                          ? "text-blue-600"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {contentTab === "write" && (
                        <motion.span
                          layoutId="news-content-tab-pill"
                          transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 35,
                          }}
                          className="absolute inset-0 rounded-md bg-white shadow-xs"
                        />
                      )}
                      <span className="relative z-10 material-symbols-outlined text-sm">
                        edit_note
                      </span>
                      <span className="relative z-10">Soạn thảo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setContentTab("preview")}
                      className={`relative inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                        contentTab === "preview"
                          ? "text-blue-600"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {contentTab === "preview" && (
                        <motion.span
                          layoutId="news-content-tab-pill"
                          transition={{
                            type: "spring",
                            stiffness: 450,
                            damping: 35,
                          }}
                          className="absolute inset-0 rounded-md bg-white shadow-xs"
                        />
                      )}
                      <span className="relative z-10 material-symbols-outlined text-sm">
                        visibility
                      </span>
                      <span className="relative z-10">Xem trước</span>
                    </button>
                  </div>
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
                                    alt={alt || "Ảnh minh họa"}
                                    className="max-h-96 w-full rounded-xl border border-slate-200 object-cover shadow-xs"
                                  />
                                  {alt &&
                                  alt !== "Hình ảnh" &&
                                  alt !== "image" ? (
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
                    router.push("/workspace/news");
                  }}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95 transition"
                >
                  <span className="material-symbols-outlined text-base">
                    arrow_back
                  </span>
                  <span>Hủy bỏ</span>
                </button>
                {selectedId ? (
                  <button
                    type="button"
                    disabled={deleteArticle.isPending}
                    onClick={async () => {
                      const confirmation = await confirmAction({
                        title: "Xóa nội dung?",
                        text: "Không thể hoàn tác sau khi xóa.",
                        confirmButtonText: "Xóa",
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
                          : `Tạo ${contentLabel.toLocaleLowerCase("vi")} mới`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : null}
      </div>
    ),
    uiLocale,
    ADMIN_NEWS_TRANSLATIONS,
  );
}

"use client";

import { useLocale, type Locale } from "@/core/i18n/locale";
import { useState, useRef, type DragEvent } from "react";
import Link from "next/link";
import { showToast, confirmAction } from "@/lib/alerts";

interface AttachmentFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface RecentArticle {
  id: string;
  title: string;
  category: string;
  categoryKey: string;
  status: "pending" | "revision" | "approved" | "published";
  updatedAt: string;
}

const copy: Record<
  Locale,
  {
    kicker: string;
    title: string;
    description: string;
    infoNote: string;
    fieldTitle: string;
    titlePlaceholder: string;
    fieldCategory: string;
    selectCategory: string;
    fieldLanguage: string;
    selectLanguage: string;
    fieldSummary: string;
    summaryPlaceholder: string;
    fieldContent: string;
    contentPlaceholder: string;
    words: string;
    fieldKeywords: string;
    keywordsPlaceholder: string;
    keywordsHelp: string;
    fieldDocUrl: string;
    docUrlPlaceholder: string;
    docUrlHelp: string;
    fieldAttachments: string;
    dropzoneText: string;
    dropzoneSubtext: string;
    securityNote: string;
    btnDraft: string;
    btnPreview: string;
    btnSubmit: string;
    submitting: string;
    bannerNotice: string;
    guidelinesTitle: string;
    guidelines: Array<{ title: string; desc: string; icon: string }>;
    viewGuidelines: string;
    recentStatusTitle: string;
    viewAll: string;
    statusLegendTitle: string;
    needHelpTitle: string;
    needHelpDesc: string;
    contactSupport: string;
    categories: Record<string, string>;
    languages: Record<string, string>;
    statuses: Record<
      "pending" | "revision" | "approved" | "published",
      { label: string; desc: string }
    >;
    previewTitle: string;
    closePreview: string;
    successSubmit: string;
    successDraft: string;
  }
> = {
  vi: {
    kicker: "Quản lý nội dung & Xuất bản",
    title: "Tạo bài viết mới",
    description:
      "Chia sẻ tri thức, kết nối học thuật Việt – Nga. Bài viết của bạn sẽ được Ban biên tập xem xét trước khi xuất bản.",
    infoNote:
      "Thông tin bài viết sẽ được kiểm duyệt theo tiêu chuẩn công bố khoa học.",
    fieldTitle: "Tiêu đề",
    titlePlaceholder: "Nhập tiêu đề bài viết (tối đa 150 ký tự)",
    fieldCategory: "Danh mục",
    selectCategory: "Chọn danh mục phù hợp",
    fieldLanguage: "Ngôn ngữ",
    selectLanguage: "Chọn ngôn ngữ của bài viết",
    fieldSummary: "Tóm tắt",
    summaryPlaceholder:
      "Tóm tắt nội dung chính của bài viết (tối đa 300 ký tự)",
    fieldContent: "Nội dung",
    contentPlaceholder: "Nhập nội dung bài viết của bạn tại đây...",
    words: "từ",
    fieldKeywords: "Từ khóa",
    keywordsPlaceholder: "Nhập và nhấn Enter để thêm từ khóa",
    keywordsHelp: "Tối đa 8 từ khóa",
    fieldDocUrl: "Liên kết tài liệu (tùy chọn)",
    docUrlPlaceholder: "Nhập liên kết (DOI, URL, v.v.)",
    docUrlHelp: "Ví dụ: https://doi.org/10.xxxx/xxxxx",
    fieldAttachments: "Tệp đính kèm (tùy chọn)",
    dropzoneText: "Kéo & thả tệp vào đây hoặc bấm để chọn tệp",
    dropzoneSubtext:
      "Hỗ trợ: PDF, DOCX, PPTX, JPG, PNG (tối đa 20MB mỗi tệp). Tối đa 5 tệp.",
    securityNote:
      "Tệp đính kèm sẽ được kiểm tra an toàn và chỉ hiển thị sau khi bài viết được duyệt.",
    btnDraft: "Lưu nháp",
    btnPreview: "Xem trước",
    btnSubmit: "Gửi duyệt",
    submitting: "Đang gửi...",
    bannerNotice:
      "Bài viết của bạn sẽ được Ban biên tập xem xét trong 1–3 ngày làm việc. Kết quả sẽ được gửi qua Thông báo.",
    guidelinesTitle: "Hướng dẫn gửi bài",
    guidelines: [
      {
        title: "Nội dung chất lượng",
        desc: "Bài viết nên mang tính học thuật, cập nhật và có giá trị thực tiễn.",
        icon: "description",
      },
      {
        title: "Chọn danh mục phù hợp",
        desc: "Giúp người đọc dễ dàng tìm thấy bài viết của bạn.",
        icon: "category",
      },
      {
        title: "Đính kèm tài liệu liên quan",
        desc: "Ưu tiên định dạng PDF, hình ảnh rõ ràng, dung lượng tối đa 20MB.",
        icon: "attach_file",
      },
      {
        title: "Tuân thủ quy định",
        desc: "Không đăng nội dung vi phạm bản quyền, thuần phong mỹ tục và pháp luật.",
        icon: "verified_user",
      },
    ],
    viewGuidelines: "Xem quy định chi tiết →",
    recentStatusTitle: "Trạng thái bài gần đây",
    viewAll: "Xem tất cả",
    statusLegendTitle: "Chú thích trạng thái",
    needHelpTitle: "Cần hỗ trợ?",
    needHelpDesc: "Liên hệ ban quản trị để được hỗ trợ đăng tải nội dung.",
    contactSupport: "Gửi yêu cầu hỗ trợ →",
    categories: {
      science: "Khoa học & Công nghệ",
      innovation: "Hợp tác & Đổi mới sáng tạo",
      education: "Giáo dục & Đào tạo nhân lực",
      society: "Kinh tế - Xã hội & Văn hóa",
      health: "Y sinh & Sức khỏe",
      space: "Không gian & Vũ trụ",
    },
    languages: {
      vi: "Tiếng Việt (VI)",
      ru: "Tiếng Nga (RU)",
      en: "Tiếng Anh (EN)",
    },
    statuses: {
      pending: {
        label: "Chờ duyệt",
        desc: "Bài viết đang chờ Ban biên tập xem xét",
      },
      revision: {
        label: "Cần chỉnh sửa",
        desc: "Bài viết cần chỉnh sửa theo góp ý",
      },
      approved: {
        label: "Đã duyệt",
        desc: "Bài viết đã được duyệt, chờ xuất bản",
      },
      published: {
        label: "Đã xuất bản",
        desc: "Bài viết đã được công bố trên hệ thống",
      },
    },
    previewTitle: "Xem trước bài viết",
    closePreview: "Đóng",
    successSubmit:
      "Gửi bài viết duyệt thành công! Ban biên tập sẽ xem xét trong 1-3 ngày làm việc.",
    successDraft: "Đã lưu bản nháp bài viết thành công.",
  },
  en: {
    kicker: "Content Management & Publishing",
    title: "Create new article",
    description:
      "Share knowledge, bridge Vietnam - Russia academia. Your submission will be reviewed by the Editorial Board prior to publication.",
    infoNote:
      "Submissions are peer-reviewed according to academic publishing standards.",
    fieldTitle: "Title",
    titlePlaceholder: "Enter article title (max 150 characters)",
    fieldCategory: "Category",
    selectCategory: "Select relevant category",
    fieldLanguage: "Language",
    selectLanguage: "Select article language",
    fieldSummary: "Summary",
    summaryPlaceholder: "Summarize key points (max 300 characters)",
    fieldContent: "Content",
    contentPlaceholder: "Compose your article content here...",
    words: "words",
    fieldKeywords: "Keywords",
    keywordsPlaceholder: "Type and press Enter to add keywords",
    keywordsHelp: "Up to 8 keywords",
    fieldDocUrl: "Document Link (optional)",
    docUrlPlaceholder: "Enter link (DOI, URL, etc.)",
    docUrlHelp: "Example: https://doi.org/10.xxxx/xxxxx",
    fieldAttachments: "Attachments (optional)",
    dropzoneText: "Drag & drop files here or click to browse",
    dropzoneSubtext:
      "Supported: PDF, DOCX, PPTX, JPG, PNG (max 20MB per file). Up to 5 files.",
    securityNote:
      "Attachments are screened for security and become available once approved.",
    btnDraft: "Save draft",
    btnPreview: "Preview",
    btnSubmit: "Submit for review",
    submitting: "Submitting...",
    bannerNotice:
      "Your article will be reviewed within 1–3 business days. Results will be delivered via Notifications.",
    guidelinesTitle: "Publishing guidelines",
    guidelines: [
      {
        title: "High academic quality",
        desc: "Submissions should be rigorous, timely, and practically valuable.",
        icon: "description",
      },
      {
        title: "Accurate category",
        desc: "Helps target audience discover your contribution easily.",
        icon: "category",
      },
      {
        title: "Relevant attachments",
        desc: "Prefer high-resolution PDFs and figures, up to 20MB.",
        icon: "attach_file",
      },
      {
        title: "Compliance & ethics",
        desc: "Respect copyright, academic integrity, and scientific standards.",
        icon: "verified_user",
      },
    ],
    viewGuidelines: "View full guidelines →",
    recentStatusTitle: "Recent submission status",
    viewAll: "View all",
    statusLegendTitle: "Status legend",
    needHelpTitle: "Need assistance?",
    needHelpDesc: "Contact portal editorial team for support.",
    contactSupport: "Submit support inquiry →",
    categories: {
      science: "Science & Technology",
      innovation: "Collaboration & Innovation",
      education: "Education & Human Resources",
      society: "Socio-Economics & Culture",
      health: "Biomedicine & Healthcare",
      space: "Space & Aerospace",
    },
    languages: {
      vi: "Vietnamese (VI)",
      ru: "Russian (RU)",
      en: "English (EN)",
    },
    statuses: {
      pending: {
        label: "Pending review",
        desc: "Awaiting editorial board review",
      },
      revision: {
        label: "Needs revision",
        desc: "Requires adjustments per feedback",
      },
      approved: {
        label: "Approved",
        desc: "Approved, scheduled for publishing",
      },
      published: {
        label: "Published",
        desc: "Publicly visible on the network",
      },
    },
    previewTitle: "Article Preview",
    closePreview: "Close",
    successSubmit:
      "Article submitted successfully! Review will complete within 1-3 business days.",
    successDraft: "Draft saved successfully.",
  },
  ru: {
    kicker: "Управление контентом и публикациями",
    title: "Создание новой статьи",
    description:
      "Делитесь знаниями и развивайте российско-вьетнамское академическое сотрудничество. Публикация будет рассмотрена редакцией.",
    infoNote:
      "Материалы проходят проверку в соответствии со стандартами научных публикаций.",
    fieldTitle: "Заголовок",
    titlePlaceholder: "Введите заголовок статьи (до 150 символов)",
    fieldCategory: "Категория",
    selectCategory: "Выберите категорию",
    fieldLanguage: "Язык",
    selectLanguage: "Выберите язык публикации",
    fieldSummary: "Аннотация",
    summaryPlaceholder: "Краткое содержание статьи (до 300 символов)",
    fieldContent: "Содержание",
    contentPlaceholder: "Введите текст статьи здесь...",
    words: "слов",
    fieldKeywords: "Ключевые слова",
    keywordsPlaceholder: "Введите и нажмите Enter для добавления",
    keywordsHelp: "До 8 ключевых слов",
    fieldDocUrl: "Ссылка на документ (необязательно)",
    docUrlPlaceholder: "Введите DOI или URL",
    docUrlHelp: "Пример: https://doi.org/10.xxxx/xxxxx",
    fieldAttachments: "Вложения (необязательно)",
    dropzoneText: "Перетащите файлы сюда или нажмите для выбора",
    dropzoneSubtext:
      "Форматы: PDF, DOCX, PPTX, JPG, PNG (до 20 МБ на файл). До 5 файлов.",
    securityNote:
      "Все файлы проверяются на безопасность и становятся доступны после одобрения.",
    btnDraft: "Сохранить черновик",
    btnPreview: "Предпросмотр",
    btnSubmit: "Отправить на рассмотрение",
    submitting: "Отправка...",
    bannerNotice:
      "Статья будет рассмотрена редакцией в течение 1–3 рабочих дней. Уведомление придёт в личный кабинет.",
    guidelinesTitle: "Правила публикации",
    guidelines: [
      {
        title: "Качество содержания",
        desc: "Материалы должны иметь научную ценность и актуальность.",
        icon: "description",
      },
      {
        title: "Точная категория",
        desc: "Облегчает поиск и цитирование вашей работы.",
        icon: "category",
      },
      {
        title: "Необходимые вложения",
        desc: "Рекомендуется формат PDF с чёткими иллюстрациями до 20 МБ.",
        icon: "attach_file",
      },
      {
        title: "Соблюдение правил",
        desc: "Соблюдайте авторские права и научную этику.",
        icon: "verified_user",
      },
    ],
    viewGuidelines: "Подробные правила →",
    recentStatusTitle: "Статус недавних статей",
    viewAll: "Смотреть все",
    statusLegendTitle: "Обозначение статусов",
    needHelpTitle: "Нужна помощь?",
    needHelpDesc: "Свяжитесь с редакцией портала для консультации.",
    contactSupport: "Задать вопрос →",
    categories: {
      science: "Наука и технологии",
      innovation: "Сотрудничество и инновации",
      education: "Образование и кадры",
      society: "Экономика и культура",
      health: "Биомедицина и здравоохранение",
      space: "Космос и аэронавтика",
    },
    languages: {
      vi: "Вьетнамский (VI)",
      ru: "Русский (RU)",
      en: "Английский (EN)",
    },
    statuses: {
      pending: {
        label: "На рассмотрении",
        desc: "Ожидает проверки редакционной коллегией",
      },
      revision: {
        label: "Требует правок",
        desc: "Необходимо внести исправления",
      },
      approved: { label: "Одобрено", desc: "Статья утверждена к публикации" },
      published: { label: "Опубликовано", desc: "Материал открыт для доступа" },
    },
    previewTitle: "Предпросмотр статьи",
    closePreview: "Закрыть",
    successSubmit:
      "Статья успешно отправлена! Срок рассмотрения: 1–3 рабочих дня.",
    successDraft: "Черновик сохранён.",
  },
};

const INITIAL_ARTICLES: RecentArticle[] = [
  {
    id: "art-1",
    title: "Ứng dụng AI trong giảng dạy và nghiên cứu tiếng Nga",
    category: "Giáo dục & Đào tạo nhân lực",
    categoryKey: "education",
    status: "pending",
    updatedAt: "20/05/2026 10:32",
  },
  {
    id: "art-2",
    title:
      "Hợp tác nghiên cứu VAST và các viện nghiên cứu đối tác Liên bang Nga",
    category: "Khoa học & Công nghệ",
    categoryKey: "science",
    status: "revision",
    updatedAt: "18/05/2026 14:21",
  },
  {
    id: "art-3",
    title:
      "Giao lưu học thuật Việt – Nga qua chương trình nghiên cứu âm nhạc dân gian",
    category: "Kinh tế - Xã hội & Văn hóa",
    categoryKey: "society",
    status: "approved",
    updatedAt: "15/05/2026 09:15",
  },
  {
    id: "art-4",
    title: "Hướng dẫn đăng ký học bổng chính phủ Liên bang Nga 2026",
    category: "Giáo dục & Đào tạo nhân lực",
    categoryKey: "education",
    status: "published",
    updatedAt: "10/05/2026 16:45",
  },
];

export function ContentPublishStudio() {
  const { locale } = useLocale();
  const t = copy[locale] || copy.vi;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("science");
  const [language, setLanguage] = useState(locale);
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [keywords, setKeywords] = useState<string[]>([
    "Khoa học & Công nghệ",
    "Việt Nam - Nga",
  ]);
  const [keywordInput, setKeywordInput] = useState("");
  const [docUrl, setDocUrl] = useState("");
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [recentArticles, setRecentArticles] =
    useState<RecentArticle[]>(INITIAL_ARTICLES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Word count calculation
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // Keyword handling
  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = keywordInput.trim().replace(/^,+|,+$/g, "");
      if (val && !keywords.includes(val) && keywords.length < 8) {
        setKeywords([...keywords, val]);
        setKeywordInput("");
      }
    }
  };

  const handleRemoveKeyword = (tagToRemove: string) => {
    setKeywords(keywords.filter((k) => k !== tagToRemove));
  };

  // Attachments handling
  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const newFiles: AttachmentFile[] = Array.from(files).map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random()}`,
      name: f.name,
      size: f.size,
      type: f.type,
    }));
    setAttachments((prev) => [...prev, ...newFiles].slice(0, 5));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  // Editor toolbar actions
  const applyToolbarFormat = (prefix: string, suffix: string = "") => {
    const el = contentTextareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.substring(start, end);
    const replacement = `${prefix}${selected || "văn bản"}${suffix}`;
    const newContent =
      el.value.substring(0, start) + replacement + el.value.substring(end);
    setContent(newContent);
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected.length || 7),
      );
    }, 0);
  };

  // Save Draft
  const handleSaveDraft = () => {
    showToast({ title: t.successDraft, icon: "success" });
  };

  // Submit Article
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast({ title: t.titlePlaceholder, icon: "warning" });
      return;
    }
    if (!summary.trim()) {
      showToast({ title: t.summaryPlaceholder, icon: "warning" });
      return;
    }
    if (!content.trim()) {
      showToast({ title: t.contentPlaceholder, icon: "warning" });
      return;
    }

    const confirmed = await confirmAction({
      title: t.btnSubmit,
      text: t.bannerNotice,
      confirmButtonText: t.btnSubmit,
    });

    if (!confirmed.isConfirmed) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const newArticle: RecentArticle = {
        id: `art-${Date.now()}`,
        title: title.trim(),
        category: t.categories[category] || category,
        categoryKey: category,
        status: "pending",
        updatedAt: new Date().toLocaleString(
          locale === "ru" ? "ru-RU" : locale === "en" ? "en-US" : "vi-VN",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          },
        ),
      };
      setRecentArticles([newArticle, ...recentArticles]);
      setTitle("");
      setSummary("");
      setContent("");
      setAttachments([]);
      showToast({ title: t.successSubmit, icon: "success" });
    }, 600);
  };

  const getStatusBadge = (status: RecentArticle["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 ring-1 ring-inset ring-amber-600/20">
            <span className="size-1.5 rounded-full bg-amber-600" />
            {t.statuses.pending.label}
          </span>
        );
      case "revision":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-800 ring-1 ring-inset ring-rose-600/20">
            <span className="size-1.5 rounded-full bg-rose-600" />
            {t.statuses.revision.label}
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
            <span className="size-1.5 rounded-full bg-emerald-600" />
            {t.statuses.approved.label}
          </span>
        );
      case "published":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-800 ring-1 ring-inset ring-blue-600/20">
            <span className="size-1.5 rounded-full bg-blue-600" />
            {t.statuses.published.label}
          </span>
        );
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1520px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {/* Header Section */}
      <header className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-700">
              {t.kicker}
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {t.title}
            </h1>
            <p className="mt-1.5 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-600">
              {t.description}
            </p>
          </div>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 hover:text-blue-700"
          >
            <span className="material-symbols-outlined text-lg">feed</span>
            {locale === "vi"
              ? "Xem kho bài viết"
              : locale === "ru"
                ? "Все статьи"
                : "View published feed"}
          </Link>
        </div>
      </header>

      {/* Main 2-Column Responsive Grid */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
        {/* Left Column: Editor & Submission Form */}
        <section className="space-y-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-7"
          >
            {/* Title */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="article-title"
                  className="block text-sm font-bold text-slate-800"
                >
                  {t.fieldTitle} <span className="text-red-600">*</span>
                </label>
                <span
                  className={`text-xs font-semibold ${title.length > 150 ? "text-red-600" : "text-slate-400"}`}
                >
                  {title.length}/150
                </span>
              </div>
              <input
                id="article-title"
                type="text"
                maxLength={150}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.titlePlaceholder}
                className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 text-base font-medium text-slate-900 placeholder:text-slate-400 transition focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-700"
                required
              />
            </div>

            {/* Category & Language Row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="article-category"
                  className="block text-sm font-bold text-slate-800"
                >
                  {t.fieldCategory} <span className="text-red-600">*</span>
                </label>
                <select
                  id="article-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 text-sm sm:text-base font-medium text-slate-900 transition focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-700"
                >
                  {Object.entries(t.categories).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="article-language"
                  className="block text-sm font-bold text-slate-800"
                >
                  {t.fieldLanguage} <span className="text-red-600">*</span>
                </label>
                <select
                  id="article-language"
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value as "vi" | "en" | "ru")
                  }
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-3.5 text-sm sm:text-base font-medium text-slate-900 transition focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-700"
                >
                  {Object.entries(t.languages).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Summary */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="article-summary"
                  className="block text-sm font-bold text-slate-800"
                >
                  {t.fieldSummary} <span className="text-red-600">*</span>
                </label>
                <span
                  className={`text-xs font-semibold ${summary.length > 300 ? "text-red-600" : "text-slate-400"}`}
                >
                  {summary.length}/300
                </span>
              </div>
              <textarea
                id="article-summary"
                rows={3}
                maxLength={300}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder={t.summaryPlaceholder}
                className="mt-2 w-full resize-y rounded-xl border border-slate-300 bg-slate-50/50 p-4 text-sm sm:text-base leading-relaxed text-slate-900 placeholder:text-slate-400 transition focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-700"
                required
              />
            </div>

            {/* Rich Content Editor */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="article-content"
                  className="block text-sm font-bold text-slate-800"
                >
                  {t.fieldContent} <span className="text-red-600">*</span>
                </label>
                <span className="text-xs font-semibold text-slate-400">
                  {wordCount} {t.words}
                </span>
              </div>

              {/* Editor Toolbar */}
              <div className="mt-2 rounded-2xl border border-slate-300 bg-slate-50/60 overflow-hidden focus-within:border-blue-700 focus-within:ring-1 focus-within:ring-blue-700">
                <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-100/80 p-2 text-slate-700">
                  <button
                    type="button"
                    title="Heading 2"
                    onClick={() => applyToolbarFormat("\n## ", "\n")}
                    className="rounded-lg px-2.5 py-1 text-xs font-black hover:bg-white hover:text-blue-700"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    title="Heading 3"
                    onClick={() => applyToolbarFormat("\n### ", "\n")}
                    className="rounded-lg px-2.5 py-1 text-xs font-black hover:bg-white hover:text-blue-700"
                  >
                    H3
                  </button>
                  <span className="mx-1 h-5 w-px bg-slate-300" />
                  <button
                    type="button"
                    title="Bold (Ctrl+B)"
                    onClick={() => applyToolbarFormat("**", "**")}
                    className="grid size-8 place-items-center rounded-lg font-serif font-black hover:bg-white hover:text-blue-700"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    title="Italic (Ctrl+I)"
                    onClick={() => applyToolbarFormat("*", "*")}
                    className="grid size-8 place-items-center rounded-lg italic font-bold hover:bg-white hover:text-blue-700"
                  >
                    I
                  </button>
                  <button
                    type="button"
                    title="Underline"
                    onClick={() => applyToolbarFormat("<u>", "</u>")}
                    className="grid size-8 place-items-center rounded-lg underline font-bold hover:bg-white hover:text-blue-700"
                  >
                    U
                  </button>
                  <span className="mx-1 h-5 w-px bg-slate-300" />
                  <button
                    type="button"
                    title="Bullet List"
                    onClick={() => applyToolbarFormat("\n- ", "")}
                    className="grid size-8 place-items-center rounded-lg hover:bg-white hover:text-blue-700"
                  >
                    <span className="material-symbols-outlined text-lg">
                      format_list_bulleted
                    </span>
                  </button>
                  <button
                    type="button"
                    title="Numbered List"
                    onClick={() => applyToolbarFormat("\n1. ", "")}
                    className="grid size-8 place-items-center rounded-lg hover:bg-white hover:text-blue-700"
                  >
                    <span className="material-symbols-outlined text-lg">
                      format_list_numbered
                    </span>
                  </button>
                  <button
                    type="button"
                    title="Blockquote"
                    onClick={() => applyToolbarFormat("\n> ", "\n")}
                    className="grid size-8 place-items-center rounded-lg hover:bg-white hover:text-blue-700"
                  >
                    <span className="material-symbols-outlined text-lg">
                      format_quote
                    </span>
                  </button>
                  <button
                    type="button"
                    title="Insert Link"
                    onClick={() => applyToolbarFormat("[Tên liên kết](", ")")}
                    className="grid size-8 place-items-center rounded-lg hover:bg-white hover:text-blue-700"
                  >
                    <span className="material-symbols-outlined text-lg">
                      link
                    </span>
                  </button>
                  <button
                    type="button"
                    title="Insert Image"
                    onClick={() => applyToolbarFormat("![Mô tả ảnh](", ")")}
                    className="grid size-8 place-items-center rounded-lg hover:bg-white hover:text-blue-700"
                  >
                    <span className="material-symbols-outlined text-lg">
                      image
                    </span>
                  </button>
                  <button
                    type="button"
                    title="Insert Table"
                    onClick={() =>
                      applyToolbarFormat(
                        "\n| Cột 1 | Cột 2 |\n|---|---|\n| Giá trị 1 | Giá trị 2 |\n",
                      )
                    }
                    className="grid size-8 place-items-center rounded-lg hover:bg-white hover:text-blue-700"
                  >
                    <span className="material-symbols-outlined text-lg">
                      table_chart
                    </span>
                  </button>
                </div>

                <textarea
                  ref={contentTextareaRef}
                  id="article-content"
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t.contentPlaceholder}
                  className="w-full resize-y bg-white p-4 text-base font-normal leading-relaxed text-slate-900 placeholder:text-slate-400 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Keywords & Document URL */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="article-keywords"
                  className="block text-sm font-bold text-slate-800"
                >
                  {t.fieldKeywords} <span className="text-red-600">*</span>
                </label>
                <div className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-slate-50/50 p-2 transition focus-within:border-blue-700 focus-within:bg-white focus-within:ring-1 focus-within:ring-blue-700">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {keywords.map((kw) => (
                      <span
                        key={kw}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-100/90 px-2.5 py-1 text-xs font-bold text-blue-900"
                      >
                        {kw}
                        <button
                          type="button"
                          onClick={() => handleRemoveKeyword(kw)}
                          className="hover:text-red-700"
                          aria-label={`Xóa ${kw}`}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    {keywords.length < 8 && (
                      <input
                        id="article-keywords"
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={handleAddKeyword}
                        placeholder={
                          keywords.length === 0
                            ? t.keywordsPlaceholder
                            : "+ Thêm..."
                        }
                        className="min-w-28 flex-1 bg-transparent px-1 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
                      />
                    )}
                  </div>
                </div>
                <small className="mt-1 block text-xs text-slate-500">
                  {t.keywordsHelp}
                </small>
              </div>

              <div>
                <label
                  htmlFor="article-doc-url"
                  className="block text-sm font-bold text-slate-800"
                >
                  {t.fieldDocUrl}
                </label>
                <input
                  id="article-doc-url"
                  type="url"
                  value={docUrl}
                  onChange={(e) => setDocUrl(e.target.value)}
                  placeholder={t.docUrlPlaceholder}
                  className="mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-slate-50/50 px-4 text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 transition focus:border-blue-700 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-700"
                />
                <small className="mt-1 block text-xs text-slate-500">
                  {t.docUrlHelp}
                </small>
              </div>
            </div>

            {/* File Attachments Dropzone */}
            <div>
              <label className="block text-sm font-bold text-slate-800">
                {t.fieldAttachments}
              </label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 grid min-h-32 cursor-pointer place-items-center rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/40 p-6 text-center transition hover:border-blue-500 hover:bg-blue-50/80"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.pptx,.jpg,.png"
                  onChange={(e) => handleFilesSelected(e.target.files)}
                  className="hidden"
                />
                <div className="space-y-1.5">
                  <span className="material-symbols-outlined text-4xl text-blue-600">
                    cloud_upload
                  </span>
                  <p className="text-sm font-bold text-blue-950">
                    {t.dropzoneText}
                  </p>
                  <p className="text-xs text-slate-600">{t.dropzoneSubtext}</p>
                </div>
              </div>

              {/* Uploaded File List */}
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs sm:text-sm"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="material-symbols-outlined text-blue-600">
                          attachment
                        </span>
                        <span className="truncate font-semibold text-slate-900">
                          {file.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveAttachment(file.id);
                        }}
                        className="rounded-lg p-1 text-slate-400 transition hover:bg-red-50 hover:text-red-700"
                        aria-label="Xóa tệp"
                      >
                        <span className="material-symbols-outlined text-base">
                          delete
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500">
                <span className="material-symbols-outlined text-sm text-emerald-600">
                  lock
                </span>
                {t.securityNote}
              </p>
            </div>

            {/* Action Bar Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-5">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-sm sm:text-base font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 active:translate-y-px"
              >
                {t.btnDraft}
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPreviewOpen(true)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-5 text-sm sm:text-base font-bold text-blue-700 transition hover:bg-blue-100 active:translate-y-px"
                >
                  <span className="material-symbols-outlined text-lg">
                    visibility
                  </span>
                  {t.btnPreview}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-7 text-sm sm:text-base font-bold text-white shadow-[0_16px_34px_-16px_rgba(37,99,235,.9)] transition hover:bg-blue-800 active:translate-y-px disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-lg">
                    send
                  </span>
                  {isSubmitting ? t.submitting : t.btnSubmit}
                </button>
              </div>
            </div>
          </form>

          {/* Bottom Information Callout */}
          <div className="flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50/70 p-4 text-xs sm:text-sm leading-relaxed text-blue-950">
            <span className="material-symbols-outlined text-xl shrink-0 text-blue-600">
              info
            </span>
            <p>{t.bannerNotice}</p>
          </div>
        </section>

        {/* Right Column: Guidelines, Status & Info Cards */}
        <aside className="space-y-6">
          {/* Card 1: Submission Guidelines */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
              <span className="material-symbols-outlined text-2xl text-blue-600">
                menu_book
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900">
                {t.guidelinesTitle}
              </h2>
            </div>
            <ul className="mt-4 space-y-4">
              {t.guidelines.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-50 text-blue-700 text-sm">
                    <span className="material-symbols-outlined text-base">
                      {item.icon}
                    </span>
                  </span>
                  <div>
                    <strong className="block text-sm font-bold text-slate-900">
                      {item.title}
                    </strong>
                    <p className="mt-0.5 text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 pt-3 border-t border-slate-100">
              <Link
                href="/news"
                className="text-xs font-bold text-blue-700 hover:underline"
              >
                {t.viewGuidelines}
              </Link>
            </div>
          </div>

          {/* Card 2: Recent Submissions Status */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs">
            <div className="flex items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl text-blue-600">
                  history_edu
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {t.recentStatusTitle}
                </h2>
              </div>
              <span className="text-xs font-bold text-blue-700">
                {t.viewAll}
              </span>
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              {recentArticles.map((art) => (
                <div key={art.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-2">
                    <strong className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {art.title}
                    </strong>
                    <div className="shrink-0">{getStatusBadge(art.status)}</div>
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-slate-600">
                      {art.category}
                    </span>
                    <span>{art.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Status Legend */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6">
            <h3 className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">
              {t.statusLegendTitle}
            </h3>
            <ul className="mt-3 space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <span className="size-2 rounded-full bg-amber-500 shrink-0 mt-1" />
                <div>
                  <strong className="text-slate-800">
                    {t.statuses.pending.label}:
                  </strong>{" "}
                  {t.statuses.pending.desc}
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="size-2 rounded-full bg-rose-500 shrink-0 mt-1" />
                <div>
                  <strong className="text-slate-800">
                    {t.statuses.revision.label}:
                  </strong>{" "}
                  {t.statuses.revision.desc}
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="size-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
                <div>
                  <strong className="text-slate-800">
                    {t.statuses.approved.label}:
                  </strong>{" "}
                  {t.statuses.approved.desc}
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="size-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                <div>
                  <strong className="text-slate-800">
                    {t.statuses.published.label}:
                  </strong>{" "}
                  {t.statuses.published.desc}
                </div>
              </li>
            </ul>
          </div>

          {/* Card 4: Need Help Contact */}
          <div className="rounded-3xl border border-blue-200/90 bg-gradient-to-br from-blue-50 to-blue-100/50 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-white shadow-xs">
                <span className="material-symbols-outlined text-xl">
                  headset_mic
                </span>
              </span>
              <div>
                <strong className="block text-base font-black text-slate-950">
                  {t.needHelpTitle}
                </strong>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {t.needHelpDesc}
                </p>
                <Link
                  href="mailto:info@rvstin.com"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"
                >
                  {t.contactSupport}
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-blue-700">
                {t.categories[category] || category}
              </span>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label={t.closePreview}
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <article className="mt-6 space-y-4">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
                {title || t.titlePlaceholder}
              </h1>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>Ngôn ngữ: {t.languages[language] || language}</span>
                <span>•</span>
                <span>
                  {wordCount} {t.words}
                </span>
              </div>
              <blockquote className="rounded-2xl border-l-4 border-blue-600 bg-slate-50 p-4 text-sm font-medium italic text-slate-700">
                {summary || t.summaryPlaceholder}
              </blockquote>
              <div className="prose max-w-none text-base leading-relaxed text-slate-800 whitespace-pre-wrap">
                {content || t.contentPlaceholder}
              </div>
              {keywords.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                  <span className="text-xs font-bold text-slate-500">
                    Từ khóa:
                  </span>
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </article>

            <div className="mt-8 flex justify-end border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
              >
                {t.closePreview}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

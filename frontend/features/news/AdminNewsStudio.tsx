"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { showToast } from "@/lib/alerts";
import { newsResource } from "./resource";
import type { NewsArticle, NewsInput, NewsLocale } from "./repository";

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

const contentTypes = {
  ARTICLE: "Bài viết",
  EVENT: "Sự kiện",
  ANNOUNCEMENT: "Công bố",
  PROJECT: "Dự án",
  OPPORTUNITY: "Cơ hội",
  PUBLICATION: "Ấn phẩm",
} as const;

const dateTimeValue = (value?: string | null) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";
const payload = (form: NewsInput): NewsInput => ({
  ...form,
  actionUrl: form.actionUrl?.trim() || null,
  actionClosesAt: form.actionClosesAt
    ? new Date(form.actionClosesAt).toISOString()
    : null,
  sourceUrls:
    form.sourceUrls?.map((value) => value.trim()).filter(Boolean) ?? [],
  translations: Object.fromEntries(
    locales.map((item) => [
      item,
      {
        ...form.translations[item],
        actionLabel: form.translations[item].actionLabel?.trim() || null,
      },
    ]),
  ) as NewsInput["translations"],
});

const categories = {
  "science-technology": "Khoa học - Công nghệ",
  "economy-society": "Kinh tế - Xã hội",
  education: "Giáo dục",
  cooperation: "Hợp tác",
} as const;

export function AdminNewsStudio() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | undefined>();
  const [selectedId, setSelectedId] = useState<string>();
  const [form, setForm] = useState<NewsInput>(initial);
  const [featured, setFeatured] = useState(false);
  const [locale, setLocale] = useState<NewsLocale>("VI");
  const [query, setQuery] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [previousView, setPreviousView] = useState(view);
  if (view !== previousView) {
    setPreviousView(view);
    if (view === "new") {
      setSelectedId(undefined);
      setForm(initial);
      setFeatured(false);
      setLocale("VI");
    }
  }
  const list = useQuery(news.queries.list.options(status));
  const detail = useQuery({
    ...news.queries.detail.options(selectedId ?? ""),
    enabled: Boolean(selectedId),
  });
  const create = useMutation(
    news.mutations.create.options({
      onSuccess: ({ client, data, cache }) => {
        cache.queries.list.invalidateAll(client);
        setSelectedId(data.id);
        showToast({ title: "Đã tạo bản nháp", icon: "success" });
      },
    }),
  );
  const update = useMutation(
    news.mutations.update.options({
      onSuccess: ({ client, cache }) => {
        cache.queries.list.invalidateAll(client);
        showToast({ title: "Đã lưu thay đổi", icon: "success" });
      },
    }),
  );
  const upload = useMutation(
    news.mutations.upload.options({
      onSuccess: ({ data }) =>
        setForm((current) => ({ ...current, coverImageUrl: data.url })),
    }),
  );
  const publish = useMutation(
    news.mutations.publish.options({
      onSuccess: ({ client, cache }) => {
        cache.queries.list.invalidateAll(client);
        showToast({ title: "Đã xuất bản", icon: "success" });
      },
    }),
  );
  const unpublish = useMutation(
    news.mutations.unpublish.options({
      onSuccess: ({ client, cache }) => {
        cache.queries.list.invalidateAll(client);
        showToast({ title: "Đã gỡ xuất bản", icon: "success" });
      },
    }),
  );

  const articles = useMemo(
    () =>
      list.data?.filter((article) => {
        if (view === "featured" && !article.isFeatured) return false;
        if (
          ["ANNOUNCEMENT", "EVENT", "PROJECT", "OPPORTUNITY"].includes(
            view ?? "",
          ) && article.contentType !== view
        )
          return false;
        const text = [
          ...article.translations.map((item) => item.title),
        ]
          .join(" ")
          .toLocaleLowerCase();
        return text.includes(query.trim().toLocaleLowerCase());
      }) ?? [],
    [list.data, query, view],
  );
  const published =
    list.data?.filter((article) => article.status === "PUBLISHED").length ?? 0;
  const drafts =
    list.data?.filter((article) => article.status === "DRAFT").length ?? 0;
  const featuredCount =
    list.data?.filter((article) => article.isFeatured).length ?? 0;
  const translation = form.translations[locale];
  const error = [
    list.error,
    create.error,
    update.error,
    upload.error,
    publish.error,
    unpublish.error,
  ].find(Boolean) as Error | undefined;

  const reset = () => {
    setSelectedId(undefined);
    setForm(initial);
    setFeatured(false);
    setLocale("VI");
  };


  const open = (article: NewsArticle) => {
    setSelectedId(article.id);
    setFeatured(article.isFeatured);
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
  };

  const setTranslation = (patch: Partial<typeof translation>) =>
    setForm({
      ...form,
      translations: {
        ...form.translations,
        [locale]: { ...translation, ...patch },
      },
    });

  const translateVietnameseToRussian = async () => {
    const Translator = window.Translator;
    if (!Translator) {
      showToast({ title: "Trình duyệt chưa hỗ trợ dịch tự động", icon: "error" });
      return;
    }
    setIsTranslating(true);
    try {
      const translator = await Translator.create({
        sourceLanguage: "vi", targetLanguage: "ru",
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
      showToast({ title: "Đã dịch sang tiếng Nga", icon: "success" });
    } catch {
      showToast({ title: "Không thể dịch tự động", icon: "error" });
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1700px] px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-blue-700">
            Trung tâm nội dung
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Quản lý tin tức
          </h1>
          <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
            Soạn, biên tập và xuất bản nội dung VI / EN / RU từ một màn hình.
          </p>
        </div>
        <button
          type="button"
          onClick={reset}
          className="min-h-11 rounded-xl bg-blue-700 px-5 text-base font-bold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
        >
          + Viết bài mới
        </button>
      </header>

      <section
        aria-label="Tổng quan nội dung"
        className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          ["Tổng bài viết", list.data?.length ?? 0, "▤", "bg-blue-700"],
          ["Đã xuất bản", published, "✓", "bg-emerald-600"],
          ["Bản nháp", drafts, "✎", "bg-amber-500"],
          ["Tin nổi bật", featuredCount, "★", "bg-violet-600"],
        ].map(([label, value, icon, color]) => (
          <article
            key={label}
            className="flex min-h-24 items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <span
              aria-hidden="true"
              className={`grid size-12 shrink-0 place-items-center rounded-xl text-xl font-black text-white ${color}`}
            >
              {icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-600">{label}</p>
              <strong className="mt-1 block text-2xl font-black text-slate-950">
                {value}
              </strong>
            </div>
          </article>
        ))}
      </section>

      <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="self-start rounded-2xl border border-slate-200 bg-white shadow-sm xl:sticky xl:top-24">
          <div className="border-b border-slate-200 p-4">
            <h2 className="text-xl font-black text-slate-950">
              Danh sách bài viết
            </h2>
            <input
              aria-label="Tìm bài viết"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Tìm tiêu đề…"
              className="mt-4 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-base outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
            <select
              aria-label="Lọc trạng thái"
              value={status ?? ""}
              onChange={(event) =>
                setStatus((event.target.value || undefined) as typeof status)
              }
              className="mt-3 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-base outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="DRAFT">Bản nháp</option>
              <option value="PUBLISHED">Đã xuất bản</option>
            </select>
          </div>
          <div className="max-h-[720px] space-y-2 overflow-y-auto p-3">
            {list.isLoading ? (
              <p className="p-3 text-base text-slate-600">Đang tải nội dung…</p>
            ) : null}
            {!list.isLoading && !articles.length ? (
              <p className="rounded-xl bg-slate-50 p-4 text-base text-slate-600">
                Chưa có bài viết phù hợp.
              </p>
            ) : null}
            {articles.map((article) => (
              <button
                key={article.id}
                type="button"
                onClick={() => open(article)}
                className={`min-h-20 w-full rounded-xl border p-3 text-left transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 ${selectedId === article.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"}`}
              >
                <strong className="line-clamp-2 block text-base leading-6 text-slate-950">
                  {article.translations.find((item) => item.locale === "VI")
                    ?.title || article.id}
                </strong>
                <span
                  className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-sm font-bold ${article.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}
                >
                  {article.status === "PUBLISHED" ? "Đã xuất bản" : "Bản nháp"}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            const input = payload(form);
            if (selectedId) update.mutate({ id: selectedId, input });
            else create.mutate(input);
          }}
          className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-blue-700">
                {selectedId ? "ĐANG BIÊN TẬP" : "BẢN NHÁP MỚI"}
              </p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                {selectedId ? "Chỉnh sửa bài viết" : "Tạo bài viết"}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={create.isPending || update.isPending}
                className="min-h-11 rounded-xl border border-blue-300 px-4 text-base font-bold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
              >
                {selectedId ? "Lưu thay đổi" : "Lưu bản nháp"}
              </button>
              {selectedId ? (
                <button
                  type="button"
                  disabled={!form.coverImageUrl || publish.isPending}
                  onClick={() =>
                    publish.mutate({ id: selectedId, isFeatured: featured })
                  }
                  className="min-h-11 rounded-xl bg-blue-700 px-4 text-base font-bold text-white hover:bg-blue-800 disabled:opacity-50"
                >
                  Xuất bản
                </button>
              ) : null}
            </div>
          </div>

          <div className="p-5 sm:p-7">
            {detail.isFetching ? (
              <p className="mb-4 text-base text-slate-600">
                Đang đồng bộ chi tiết…
              </p>
            ) : null}
            {error ? (
              <p
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-base font-semibold text-red-800"
              >
                {error.message}
              </p>
            ) : null}

            <div className="grid gap-4 lg:grid-cols-2">
              <label className="text-base font-bold text-slate-800">
                Danh mục
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                  className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  {Object.entries(categories).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-base font-bold text-slate-800">
                Loại nội dung
                <select
                  value={form.contentType}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      contentType: event.target
                        .value as NewsInput["contentType"],
                    })
                  }
                  className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                >
                  {Object.entries(contentTypes).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-base font-bold text-slate-800">
                Hạn thao tác
                <input
                  type="datetime-local"
                  value={form.actionClosesAt ?? ""}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      actionClosesAt: event.target.value || null,
                    })
                  }
                  className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="text-base font-bold text-slate-800 lg:col-span-2">
                Nhãn thao tác
                <input
                  value={translation.actionLabel ?? ""}
                  onChange={(event) =>
                    setTranslation({ actionLabel: event.target.value })
                  }
                  placeholder="Ví dụ: Đăng ký tham dự"
                  className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="text-base font-bold text-slate-800 lg:col-span-2">
                Liên kết thao tác
                <input
                  type="url"
                  value={form.actionUrl ?? ""}
                  onChange={(event) =>
                    setForm({ ...form, actionUrl: event.target.value || null })
                  }
                  placeholder="https://…"
                  className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="text-base font-bold text-slate-800 lg:col-span-2">
                Nguồn tham khảo
                <textarea
                  value={form.sourceUrls?.join("\n") ?? ""}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      sourceUrls: event.target.value.split("\n"),
                    })
                  }
                  placeholder="Mỗi URL một dòng"
                  className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 p-3 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4">
              <label className="text-base font-bold text-slate-800">
                Ảnh cover
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) upload.mutate(file);
                  }}
                  className="mt-3 block min-h-11 w-full rounded-xl border border-slate-300 bg-white p-2 font-normal"
                />
              </label>
              <p
                className={`mt-2 break-all text-sm ${form.coverImageUrl ? "text-emerald-700" : "text-amber-800"}`}
              >
                {upload.isPending
                  ? "Đang tải ảnh…"
                  : form.coverImageUrl
                    ? "Ảnh cover đã sẵn sàng."
                    : "Cần ảnh cover trước khi xuất bản."}
              </p>
            </div>

            <div
              className="mt-6 flex flex-wrap gap-2"
              role="tablist"
              aria-label="Ngôn ngữ bài viết"
            >
              {locales.map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={locale === item}
                  onClick={() => setLocale(item)}
                  className={`min-h-11 rounded-xl px-4 text-base font-bold ${locale === item ? "bg-blue-700 text-white" : "border border-slate-300 text-slate-700 hover:bg-slate-50"}`}
                >
                  {localeNames[item]}
                </button>
              ))}
              {locale === "RU" ? (
                <button
                  type="button"
                  disabled={isTranslating}
                  onClick={translateVietnameseToRussian}
                  className="min-h-11 rounded-xl border border-blue-300 px-4 text-base font-bold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                >
                  {isTranslating ? "Đang dịch…" : "Dịch từ tiếng Việt"}
                </button>
              ) : null}
            </div>

            <fieldset className="mt-5 rounded-2xl border border-slate-200 p-4 sm:p-5">
              <legend className="px-2 text-base font-black text-slate-950">
                Nội dung · {localeNames[locale]}
              </legend>
              <label className="block text-base font-bold text-slate-800">
                Tiêu đề
                <input
                  required
                  value={translation.title}
                  onChange={(event) =>
                    setTranslation({ title: event.target.value })
                  }
                  className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="mt-4 block text-base font-bold text-slate-800">
                Tóm tắt
                <textarea
                  required
                  value={translation.summary}
                  onChange={(event) =>
                    setTranslation({ summary: event.target.value })
                  }
                  className="mt-2 min-h-28 w-full rounded-xl border border-slate-300 p-3 font-normal leading-7 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>
              <label className="mt-4 block text-base font-bold text-slate-800">
                Nội dung
                <textarea
                  required
                  value={translation.content}
                  onChange={(event) =>
                    setTranslation({ content: event.target.value })
                  }
                  className="mt-2 min-h-80 w-full rounded-xl border border-slate-300 p-3 font-normal leading-7 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </label>
            </fieldset>

            {selectedId ? (
              <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">
                <label className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-300 px-4 text-base font-semibold">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(event) => setFeatured(event.target.checked)}
                    className="size-5"
                  />
                  Đặt làm tin nổi bật
                </label>
                <button
                  type="button"
                  onClick={() => unpublish.mutate(selectedId)}
                  className="min-h-11 rounded-xl border border-red-300 px-4 text-base font-bold text-red-700 hover:bg-red-50"
                >
                  Gỡ xuất bản
                </button>
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}

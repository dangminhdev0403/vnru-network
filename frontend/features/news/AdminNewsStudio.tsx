"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { showToast } from "@/lib/alerts";
import { newsResource } from "./resource";
import type { NewsArticle, NewsInput, NewsLocale } from "./repository";

const news = newsResource.bind(undefined);
const locales: NewsLocale[] = ["VI", "EN", "RU"];
const empty = () => ({ title: "", summary: "", content: "" });
const initial: NewsInput = {
  slug: "",
  category: "science-technology",
  translations: { VI: empty(), EN: empty(), RU: empty() },
};

export function AdminNewsStudio() {
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | undefined>();
  const [selectedId, setSelectedId] = useState<string>();
  const [form, setForm] = useState<NewsInput>(initial);
  const [featured, setFeatured] = useState(false);
  const list = useQuery(news.queries.list.options(status));
  const detail = useQuery({ ...news.queries.detail.options(selectedId ?? ""), enabled: Boolean(selectedId) });
  const create = useMutation(news.mutations.create.options({ onSuccess: ({ client, data, cache }) => { cache.queries.list.invalidateAll(client); setSelectedId(data.id); showToast({ title: "Đã tạo bản nháp", icon: "success" }); } }));
  const update = useMutation(news.mutations.update.options({ onSuccess: ({ client, cache }) => { cache.queries.list.invalidateAll(client); showToast({ title: "Đã lưu thay đổi", icon: "success" }); } }));
  const upload = useMutation(news.mutations.upload.options({ onSuccess: ({ data }) => setForm((current) => ({ ...current, coverImageUrl: data.url })) }));
  const publish = useMutation(news.mutations.publish.options({ onSuccess: ({ client, cache }) => { cache.queries.list.invalidateAll(client); showToast({ title: "Đã xuất bản", icon: "success" }); } }));
  const unpublish = useMutation(news.mutations.unpublish.options({ onSuccess: ({ client, cache }) => { cache.queries.list.invalidateAll(client); showToast({ title: "Đã gỡ xuất bản", icon: "success" }); } }));

  const open = (article: NewsArticle) => {
    setSelectedId(article.id);
    setFeatured(article.isFeatured);
    setForm({
      slug: article.slug,
      category: article.category,
      coverImageUrl: article.coverImageUrl,
      translations: Object.fromEntries(locales.map((locale) => [locale, article.translations.find((item) => item.locale === locale) ?? empty()])) as NewsInput["translations"],
    });
  };
  const error = [list.error, create.error, update.error, upload.error, publish.error, unpublish.error].find(Boolean) as Error | undefined;

  return (
    <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:px-8">
      <aside className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-black text-slate-950">Quản lý tin tức</h1>
          <button type="button" onClick={() => { setSelectedId(undefined); setForm(initial); }} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-bold text-white">Tạo mới</button>
        </div>
        <select aria-label="Lọc trạng thái" value={status ?? ""} onChange={(event) => setStatus((event.target.value || undefined) as typeof status)} className="mt-4 min-h-11 w-full rounded-xl border border-slate-300 px-3">
          <option value="">Tất cả</option><option value="DRAFT">Bản nháp</option><option value="PUBLISHED">Đã xuất bản</option>
        </select>
        {list.isLoading ? <p className="mt-5 text-slate-600">Đang tải…</p> : null}
        {!list.isLoading && !list.data?.length ? <p className="mt-5 text-slate-600">Chưa có bài viết.</p> : null}
        <div className="mt-4 grid gap-2">
          {list.data?.map((article) => (
            <button key={article.id} type="button" onClick={() => open(article)} className={`rounded-xl border p-3 text-left ${selectedId === article.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-300"}`}>
              <strong className="line-clamp-2 block text-sm text-slate-950">{article.translations.find((item) => item.locale === "VI")?.title || article.slug}</strong>
              <span className="mt-2 block text-xs font-bold text-blue-700">{article.status}</span>
            </button>
          ))}
        </div>
      </aside>

      <form onSubmit={(event) => { event.preventDefault(); if (selectedId) update.mutate({ id: selectedId, input: form }); else create.mutate(form); }} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-xl font-black">{selectedId ? "Sửa bài viết" : "Tạo bản nháp"}</h2>
        {detail.isFetching ? <p className="mt-2 text-sm text-slate-500">Đang đồng bộ chi tiết…</p> : null}
        {error ? <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error.message}</p> : null}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-bold">Slug<input required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal" /></label>
          <label className="text-sm font-bold">Danh mục<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal"><option value="science-technology">Khoa học - Công nghệ</option><option value="economy-society">Kinh tế - Xã hội</option><option value="education">Giáo dục</option><option value="cooperation">Hợp tác</option></select></label>
        </div>
        <label className="mt-4 block text-sm font-bold">Ảnh cover<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) upload.mutate(file); }} className="mt-2 block min-h-11 w-full rounded-xl border border-slate-300 p-2 font-normal" /></label>
        {form.coverImageUrl ? <p className="mt-2 break-all text-sm text-blue-700">{form.coverImageUrl}</p> : <p className="mt-2 text-sm text-amber-700">Cần ảnh cover trước khi xuất bản.</p>}
        <div className="mt-6 grid gap-5">
          {locales.map((locale) => {
            const translation = form.translations[locale];
            const set = (patch: Partial<typeof translation>) => setForm({ ...form, translations: { ...form.translations, [locale]: { ...translation, ...patch } } });
            return <fieldset key={locale} className="rounded-2xl border border-slate-200 p-4"><legend className="px-2 font-black">{locale}</legend><label className="block text-sm font-bold">Tiêu đề<input required value={translation.title} onChange={(event) => set({ title: event.target.value })} className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 font-normal" /></label><label className="mt-3 block text-sm font-bold">Tóm tắt<textarea required value={translation.summary} onChange={(event) => set({ summary: event.target.value })} className="mt-2 min-h-24 w-full rounded-xl border border-slate-300 p-3 font-normal" /></label><label className="mt-3 block text-sm font-bold">Nội dung<textarea required value={translation.content} onChange={(event) => set({ content: event.target.value })} className="mt-2 min-h-64 w-full rounded-xl border border-slate-300 p-3 font-normal" /></label></fieldset>;
          })}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="submit" disabled={create.isPending || update.isPending} className="min-h-11 rounded-xl bg-blue-600 px-5 font-bold text-white disabled:opacity-50">{selectedId ? "Lưu thay đổi" : "Tạo bản nháp"}</button>
          {selectedId ? <><label className="flex min-h-11 items-center gap-2 rounded-xl border border-slate-300 px-4 font-semibold"><input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} />Nổi bật</label><button type="button" disabled={!form.coverImageUrl} onClick={() => publish.mutate({ id: selectedId, isFeatured: featured })} className="min-h-11 rounded-xl bg-emerald-600 px-5 font-bold text-white disabled:opacity-50">Xuất bản</button><button type="button" onClick={() => unpublish.mutate(selectedId)} className="min-h-11 rounded-xl border border-red-300 px-5 font-bold text-red-700">Gỡ xuất bản</button></> : null}
        </div>
      </form>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BrandMark } from "@/components/shared/BrandMark";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLocale } from "@/core/i18n/locale";

type Category = "all" | "science" | "international" | "innovation" | "education" | "society";
type FeedCategory = Exclude<Category, "all">;
type NewsItem = { title: string; summary: string; category: FeedCategory; time: string };

const TEXT = {
  vi: {
    brand: "Mạng lưới tri thức Nga - Việt", home: "Trang chủ", about: "Giới thiệu", explore: "Khám phá", login: "Đăng nhập",
    news: "Tin tức", lead: "Theo dõi những chuyển động mới nhất về khoa học, công nghệ, đổi mới sáng tạo và hợp tác tri thức Nga - Việt.",
    live: "Cập nhật liên tục", latest: "Tin mới nhất", featured: "Tin tức nổi bật", stream: "Dòng tin liên tục",
    streamLead: "Cập nhật liên tục những tin tức mới nhất từ các chuyên mục", search: "Tìm kiếm tin tức...", viewAll: "Xem tất cả",
    spotlight: "Tiêu điểm", allCategories: "Tất cả chuyên mục", newest: "Mới nhất", top: "Lên đầu", noResults: "Không tìm thấy bài viết phù hợp.",
    categories: { all: "Tất cả", science: "Khoa học - Công nghệ", international: "Hợp tác quốc tế", innovation: "Đổi mới sáng tạo", education: "Giáo dục - Nhân lực", society: "Kinh tế - Xã hội" },
  },
  en: {
    brand: "Russia - Vietnam Knowledge Network", home: "Home", about: "About", explore: "Explore", login: "Sign in",
    news: "News", lead: "Follow the latest developments in science, technology, innovation and Vietnam - Russia knowledge cooperation.",
    live: "Continuous updates", latest: "Latest news", featured: "Featured news", stream: "Continuous news",
    streamLead: "Continuously updated news from the network's key categories", search: "Search news...", viewAll: "View all",
    spotlight: "Spotlight", allCategories: "All categories", newest: "Newest", top: "Top", noResults: "No matching articles found.",
    categories: { all: "All", science: "Science - Technology", international: "International cooperation", innovation: "Innovation", education: "Education - Talent", society: "Economy - Society" },
  },
  ru: {
    brand: "Российско-вьетнамская сеть знаний", home: "Главная", about: "О сети", explore: "Обзор", login: "Войти",
    news: "Новости", lead: "Следите за последними новостями науки, технологий, инноваций и российско-вьетнамского сотрудничества.",
    live: "Постоянное обновление", latest: "Последние новости", featured: "Главные материалы", stream: "Лента новостей",
    streamLead: "Постоянно обновляемые новости по основным направлениям сети", search: "Поиск новостей...", viewAll: "Все материалы",
    spotlight: "Главное", allCategories: "Все категории", newest: "Сначала новые", top: "Наверх", noResults: "Подходящие материалы не найдены.",
    categories: { all: "Все", science: "Наука - Технологии", international: "Международное сотрудничество", innovation: "Инновации", education: "Образование - Кадры", society: "Экономика - Общество" },
  },
} as const;

const ITEMS: Record<FeedCategory, NewsItem[]> = {
  science: [
    { title: "Nga phát triển chip lượng tử thế hệ mới mạnh gấp 100 lần", summary: "Công nghệ mới mở rộng khả năng xử lý trong các hệ thống tính toán hiệu năng cao.", category: "science", time: "3 giờ trước" },
    { title: "Các nhà khoa học Việt Nam giải mã thành công gen lúa chịu hạn", summary: "Kết quả nghiên cứu góp phần tạo giống cây trồng thích ứng tốt hơn với biến đổi khí hậu.", category: "science", time: "5 giờ trước" },
    { title: "Nga phóng vệ tinh viễn thám mới hỗ trợ nghiên cứu khí hậu Trái Đất", summary: "Dữ liệu vệ tinh phục vụ giám sát môi trường và nghiên cứu khí hậu.", category: "science", time: "1 ngày trước" },
    { title: "Nghiên cứu chung về vật liệu mới cho năng lượng sạch", summary: "Các nhóm nghiên cứu hai nước phát triển vật liệu tiên tiến cho pin thế hệ mới.", category: "science", time: "4 giờ trước" },
  ],
  international: [
    { title: "Diễn đàn Khoa học và Công nghệ Việt - Nga 2025 tại Hà Nội", summary: "Các chuyên gia hai nước trao đổi về xu hướng và cơ hội hợp tác công nghệ cao.", category: "international", time: "1 ngày trước" },
    { title: "Việt Nam và Nga ký kết 5 thỏa thuận hợp tác trong lĩnh vực công nghệ cao", summary: "Các thỏa thuận tập trung vào nghiên cứu chung, đào tạo và chuyển giao công nghệ.", category: "international", time: "2 giờ trước" },
    { title: "Tăng cường kết nối doanh nghiệp Việt - Nga trong lĩnh vực công nghệ", summary: "Các hoạt động kết nối tiếp tục được mở rộng giữa hai nước.", category: "international", time: "8 giờ trước" },
    { title: "Mạng lưới đối tác nghiên cứu song phương được mở rộng trong năm 2026", summary: "Viện nghiên cứu và trường đại học tăng cường kết nối chuyên môn.", category: "international", time: "1 ngày trước" },
  ],
  innovation: [
    { title: "AI giúp mô phỏng vật liệu mới chính xác hơn gấp 10 lần", summary: "Mô hình mới rút ngắn thời gian thử nghiệm vật liệu tiên tiến.", category: "innovation", time: "2 ngày trước" },
    { title: "Trí tuệ nhân tạo: Cơ hội và thách thức trong kỷ nguyên mới", summary: "Các chuyên gia phân tích xu hướng AI và tác động đến nghiên cứu, giáo dục và sản xuất.", category: "innovation", time: "7 giờ trước" },
    { title: "Startup Việt góp mặt tại triển lãm công nghệ quốc tế ở Nga", summary: "Các dự án giới thiệu giải pháp AI, dữ liệu lớn và tự động hóa.", category: "innovation", time: "9 giờ trước" },
    { title: "Mô hình chuyển giao công nghệ từ phòng thí nghiệm tới doanh nghiệp tăng tốc", summary: "Các trung tâm đổi mới rút ngắn khoảng cách từ nghiên cứu tới ứng dụng.", category: "innovation", time: "2 ngày trước" },
  ],
  education: [
    { title: "Chương trình học bổng toàn phần cho sinh viên Việt Nam tại Nga", summary: "Nhiều cơ hội học tập dành cho các ngành khoa học, công nghệ và kỹ thuật.", category: "education", time: "6 giờ trước" },
    { title: "Bộ GD&ĐT Việt Nam và Nga ký kết chương trình đào tạo song bằng", summary: "Chương trình mở rộng cơ hội học tập và nghiên cứu cho sinh viên hai nước.", category: "education", time: "8 giờ trước" },
    { title: "Mở rộng đào tạo nhân lực chất lượng cao trong các ngành công nghệ mũi nhọn", summary: "Hai bên thúc đẩy trao đổi giảng viên và nghiên cứu sinh.", category: "education", time: "10 giờ trước" },
    { title: "Đại học hai nước hợp tác xây dựng giáo trình song ngữ về công nghệ", summary: "Giáo trình mới hỗ trợ trao đổi học thuật và đào tạo chuyên sâu.", category: "education", time: "2 ngày trước" },
  ],
  society: [
    { title: "Việt Nam đẩy mạnh hợp tác năng lượng sạch với Nga", summary: "Hai bên hướng tới các dự án năng lượng tái tạo và công nghệ xanh.", category: "society", time: "7 giờ trước" },
    { title: "Kinh tế số mở ra cơ hội hợp tác mới giữa các doanh nghiệp công nghệ", summary: "Doanh nghiệp tăng cường chia sẻ giải pháp số và kinh nghiệm triển khai.", category: "society", time: "5 giờ trước" },
    { title: "Ứng dụng công nghệ xanh hỗ trợ phát triển bền vững tại nhiều địa phương", summary: "Các mô hình mới tập trung vào tiết kiệm năng lượng và giảm phát thải.", category: "society", time: "8 giờ trước" },
    { title: "Chính sách mới thúc đẩy đổi mới sáng tạo trong khu vực công", summary: "Các cơ chế mới tạo điều kiện thử nghiệm giải pháp công nghệ.", category: "society", time: "1 ngày trước" },
  ],
};

const LATEST = [ITEMS.science[0], ITEMS.science[1], ITEMS.international[0], ITEMS.science[2]];
const FEATURED = [ITEMS.international[1], ITEMS.science[3], ITEMS.education[0], ITEMS.innovation[1]];
const STREAM: NewsItem[] = [
  { title: "Nga thử nghiệm thế hệ vật liệu mới cho công nghệ lượng tử", summary: "Nghiên cứu mở ra khả năng ứng dụng trong các hệ thống tính toán thế hệ mới.", category: "science", time: "10:32" },
  { title: "Vệ tinh Việt Nam - Nga quan sát Trái Đất thành công", summary: "Dữ liệu hỗ trợ giám sát môi trường và phòng chống thiên tai.", category: "science", time: "10:10" },
  { title: "Hội thảo quốc tế về trí tuệ nhân tạo Việt - Nga diễn ra tại Hà Nội", summary: "Các chuyên gia hai nước trao đổi về xu hướng và cơ hội hợp tác trong lĩnh vực AI.", category: "international", time: "09:15" },
  { title: "Tăng cường kết nối doanh nghiệp Việt - Nga trong lĩnh vực công nghệ", summary: "Nhiều thỏa thuận hợp tác được ký kết tại các chương trình kết nối chuyên môn.", category: "international", time: "08:55" },
  { title: "Bộ GD&ĐT Việt Nam và Nga ký kết chương trình đào tạo song bằng", summary: "Mở ra cơ hội học tập và nghiên cứu cho sinh viên hai nước.", category: "education", time: "08:20" },
  { title: "Startup Việt góp mặt tại triển lãm công nghệ quốc tế ở Nga", summary: "Giới thiệu nhiều giải pháp sáng tạo trong lĩnh vực AI và dữ liệu lớn.", category: "innovation", time: "07:30" },
  { title: "Việt Nam đẩy mạnh hợp tác năng lượng sạch với Nga", summary: "Hai bên hướng tới các dự án năng lượng tái tạo và công nghệ xanh.", category: "society", time: "07:45" },
  { title: "Dự án năng lượng hạt nhân thế hệ mới tiếp tục được thúc đẩy", summary: "Hai nước khẳng định cam kết phát triển công nghệ năng lượng vì mục tiêu bền vững.", category: "science", time: "06:15" },
];

const CATALOGS: Array<{ category: FeedCategory; children: string[] }> = [
  { category: "science", children: ["Trí tuệ nhân tạo", "Công nghệ lượng tử", "Vật liệu mới", "Năng lượng", "Công nghệ sinh học", "Vũ trụ - Hàng không"] },
  { category: "international", children: ["Hợp tác Việt - Nga", "Viện nghiên cứu", "Trường đại học", "Doanh nghiệp công nghệ", "Chương trình song phương", "Mạng lưới đối tác"] },
  { category: "innovation", children: ["Công nghệ mới", "Khởi nghiệp sáng tạo", "Chuyển giao công nghệ", "Sở hữu trí tuệ", "Hệ sinh thái đổi mới", "Ứng dụng thực tiễn"] },
  { category: "education", children: ["Học bổng", "Đào tạo", "Sinh viên", "Nghiên cứu sinh", "Chuyên gia", "Trao đổi học thuật"] },
  { category: "society", children: ["Kinh tế số", "Công nghiệp", "Thương mại", "Chính sách", "Phát triển bền vững", "Xã hội - Đời sống"] },
];

function Placeholder({ className = "", label = "Ảnh" }: { className?: string; label?: string }) {
  return <div className={`relative grid place-items-center overflow-hidden bg-[linear-gradient(135deg,#104185,#3d77bd_52%,#163d73)] ${className}`}><span className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-white/70">{label}</span></div>;
}

function SmallRow({ item, label }: { item: NewsItem; label: string }) {
  return <article className="grid grid-cols-[118px_minmax(0,1fr)] gap-4 border-b border-slate-100 py-4 first:pt-0 sm:grid-cols-[145px_minmax(0,1fr)]"><Placeholder className="h-[78px] rounded-xl sm:h-[88px]" /><div className="min-w-0"><h3 className="text-[15px] font-extrabold leading-[1.42] tracking-[-0.02em] text-slate-950">{item.title}</h3><div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500"><span className="font-extrabold uppercase text-blue-600">{label}</span><span>•</span><span>{item.time}</span></div></div></article>;
}

export function GuestExploreV2() {
  const { locale } = useLocale();
  const t = TEXT[locale] ?? TEXT.vi;
  const categories: Category[] = ["all", "science", "international", "innovation", "education", "society"];
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [streamCategory, setStreamCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const source = activeCategory === "all" ? Object.values(ITEMS).flat() : ITEMS[activeCategory];
    const q = query.trim().toLocaleLowerCase(locale);
    return q ? source.filter((item) => item.title.toLocaleLowerCase(locale).includes(q)) : source;
  }, [activeCategory, locale, query]);

  const stream = useMemo(() => streamCategory === "all" ? STREAM : STREAM.filter((item) => item.category === streamCategory), [streamCategory]);
  const categoryMode = activeCategory !== "all" || query.trim().length > 0;
  const filteredHalf = Math.ceil(filtered.length / 2);
  const streamHalf = Math.ceil(stream.length / 2);

  return <div className="min-h-screen bg-white text-slate-950">
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-[#f5f9ff]/95 backdrop-blur-xl">
      <div className="mx-auto grid min-h-[76px] max-w-[1480px] grid-cols-[1fr_auto_1fr] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3"><BrandMark className="size-11 shrink-0" /><strong className="hidden truncate text-[17px] font-extrabold sm:block">{t.brand}</strong></Link>
        <nav className="hidden h-full items-center gap-8 lg:flex"><Link href="/" className="text-sm font-extrabold uppercase text-slate-700">{t.home}</Link><Link href="/#about" className="text-sm font-extrabold uppercase text-slate-700">{t.about}</Link><Link href="/explore" className="relative text-sm font-extrabold uppercase text-blue-600">{t.explore}<span className="absolute inset-x-0 -bottom-5 h-0.5 bg-blue-600" /></Link></nav>
        <div className="flex items-center justify-end gap-3"><LanguageSwitcher variant="light" /><Link href="/login" className="inline-flex h-10 items-center rounded-xl bg-blue-600 px-4 text-sm font-bold text-white">{t.login}</Link></div>
      </div>
    </header>

    <main className="mx-auto max-w-[1480px] px-4 py-9 sm:px-6 lg:px-8">
      <section className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl"><div className="flex flex-wrap items-center gap-3"><h1 className="text-2xl font-black uppercase tracking-[-0.03em] text-blue-600 sm:text-3xl">{t.news}</h1><span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-extrabold uppercase text-blue-600"><span className="size-1.5 rounded-full bg-blue-600" />{t.live}</span></div><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{t.lead}</p></div>
        <div className="flex overflow-hidden rounded-xl border border-blue-100 bg-white">{[["06", "Chuyên mục"], ["24/7", "Cập nhật"], ["VN · RU", "Song phương"]].map(([value, label], index) => <div key={value} className={`min-w-[112px] px-4 py-2.5 text-center ${index ? "border-l border-blue-100" : ""}`}><strong className="block text-sm font-black">{value}</strong><span className="block text-[10px] font-bold uppercase text-slate-400">{label}</span></div>)}</div>
      </section>

      <section className="mb-7 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-color:transparent_transparent] [scrollbar-width:thin] hover:[scrollbar-color:#94a3b8_transparent] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
          {categories.map((category) => <button key={category} type="button" onClick={() => setActiveCategory(category)} className={`min-h-11 shrink-0 rounded-xl border px-5 text-sm font-bold transition ${activeCategory === category ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-100 hover:text-blue-600"}`}>{t.categories[category]}</button>)}
        </div>
        <div className="flex items-center gap-3">
          <details className="group relative"><summary className="grid size-11 list-none cursor-pointer place-items-center rounded-xl border border-slate-200 bg-white text-blue-600 hover:bg-slate-100 [&::-webkit-details-marker]:hidden"><svg viewBox="0 0 24 24" className="size-5"><path d="M5 7h14M5 12h14M5 17h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg></summary><div className="absolute right-0 top-[calc(100%+10px)] z-40 w-[min(1050px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"><div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">{CATALOGS.map((group, index) => <section key={group.category} className="border-b border-r border-slate-100 p-5"><button type="button" onClick={() => setActiveCategory(group.category)} className="flex w-full gap-2 rounded-lg border border-transparent p-2 text-left text-sm font-black hover:border-slate-200 hover:bg-slate-50 hover:text-blue-600"><span className="text-xs text-blue-600">0{index + 1}</span>{t.categories[group.category]}</button><div className="mt-2 grid gap-1">{group.children.map((child) => <button key={child} type="button" className="rounded-lg border border-transparent px-3 py-2 text-left text-xs text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-blue-600">•&nbsp;&nbsp;{child}</button>)}</div></section>)}</div></div></details>
          <label className="flex h-11 min-w-0 flex-1 items-center rounded-xl border border-slate-200 bg-white px-4 focus-within:border-blue-600 xl:w-[330px] xl:flex-none"><input value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder={t.search} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400" /><svg viewBox="0 0 24 24" className="size-5 text-slate-500"><circle cx="11" cy="11" r="6.7" fill="none" stroke="currentColor" strokeWidth="1.8" /><path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" /></svg></label>
        </div>
      </section>

      {!categoryMode ? <>
        <section className="grid gap-8 lg:grid-cols-[1.35fr_.92fr]">
          <article className="relative min-h-[520px] overflow-hidden rounded-2xl bg-slate-950 text-white"><Placeholder label="Ảnh bài viết nổi bật" className="absolute inset-0 h-full w-full rounded-none" /><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,18,45,.02)_12%,rgba(3,18,45,.18)_48%,rgba(2,14,35,.94)_100%)]" /><div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8"><span className="inline-flex min-h-8 items-center rounded-lg bg-blue-600 px-3 text-xs font-black uppercase">{t.spotlight}</span><h2 className="mt-4 max-w-4xl text-3xl font-black leading-[1.15] tracking-[-0.04em] sm:text-4xl">Việt Nam - Nga tăng cường hợp tác Khoa học, Công nghệ và Đổi mới sáng tạo</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-white/85 sm:text-base">Thúc đẩy các chương trình nghiên cứu chung, chuyển giao công nghệ và đào tạo nhân lực chất lượng cao trong giai đoạn mới.</p><div className="mt-5 flex items-center gap-2 text-xs font-semibold text-white/85"><span>{t.categories.international}</span><span>•</span><span>2 giờ trước</span></div></div></article>
          <aside><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-black uppercase text-blue-600 sm:text-xl">{t.latest}</h2><button type="button" className="text-xs font-black text-blue-600">{t.viewAll} →</button></div>{LATEST.map((item) => <SmallRow key={item.title} item={item} label={t.categories[item.category]} />)}</aside>
        </section>

        <section className="mt-12"><div className="mb-5 flex items-center gap-4"><h2 className="shrink-0 text-lg font-black uppercase text-blue-600 sm:text-xl">{t.featured}</h2><span className="h-px flex-1 bg-blue-100" /><button type="button" className="text-xs font-black text-blue-600">{t.viewAll} →</button></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{FEATURED.map((item) => <article key={item.title} className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-blue-200"><Placeholder label="Ảnh bài viết" className="h-44" /><div className="p-4"><h3 className="text-base font-extrabold leading-[1.45]">{item.title}</h3><div className="mt-4 flex items-end justify-between gap-3"><div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500"><span className="font-extrabold uppercase text-blue-600">{t.categories[item.category]}</span><span>•</span><span>{item.time}</span></div><span className="grid size-8 shrink-0 place-items-center rounded-full border border-slate-200 text-blue-600">→</span></div></div></article>)}</div></section>

        <section className="mt-12"><div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div><h2 className="text-lg font-black uppercase text-blue-600 sm:text-xl">{t.stream}</h2><p className="mt-2 text-sm text-slate-500">{t.streamLead}</p></div><div className="flex flex-wrap items-center gap-2"><select value={streamCategory} onChange={(e) => setStreamCategory(e.target.value as Category)} className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none"><option value="all">{t.allCategories}</option>{categories.slice(1).map((category) => <option key={category} value={category}>{t.categories[category]}</option>)}</select><button type="button" className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700">{t.newest}</button><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700">↑ {t.top}</button></div></div><div className="grid gap-x-10 lg:grid-cols-2">{[stream.slice(0, streamHalf), stream.slice(streamHalf)].map((column, columnIndex) => <div key={columnIndex}>{column.map((item) => <article key={`${item.time}-${item.title}`} className="grid grid-cols-[128px_minmax(0,1fr)] gap-4 border-b border-slate-100 py-5 first:pt-0 sm:grid-cols-[170px_minmax(0,1fr)]"><Placeholder className="h-[86px] rounded-xl sm:h-[105px]" /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2 text-[11px]"><span className="font-black uppercase text-blue-600">{t.categories[item.category]}</span><span className="text-slate-300">•</span><span className="font-semibold text-slate-500">{item.time}</span></div><h3 className="mt-2 text-[15px] font-extrabold leading-[1.4] sm:text-base">{item.title}</h3><p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{item.summary}</p></div></article>)}</div>)}</div></section>
      </> : <section className="mt-8"><div className="mb-5 flex items-center gap-4"><h2 className="shrink-0 text-lg font-black uppercase text-blue-600 sm:text-xl">{t.latest}</h2><span className="h-px flex-1 bg-blue-100" /></div>{filtered.length ? <div className="grid gap-x-10 lg:grid-cols-2"><div>{filtered.slice(0, filteredHalf).map((item) => <SmallRow key={item.title} item={item} label={t.categories[item.category]} />)}</div><div>{filtered.slice(filteredHalf).map((item) => <SmallRow key={item.title} item={item} label={t.categories[item.category]} />)}</div></div> : <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center text-sm font-semibold text-slate-500">{t.noResults}</div>}</section>}
    </main>
  </div>;
}

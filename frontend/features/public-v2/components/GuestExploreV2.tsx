"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { BrandMark } from "@/components/shared/BrandMark";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLocale } from "@/core/i18n/locale";

type Category = "all" | "science" | "international" | "innovation" | "education" | "society";
type NewsItem = { title: string; category: Exclude<Category, "all">; time: string };

const labels = {
  vi: {
    home: "Trang chủ", about: "Giới thiệu", explore: "Khám phá", login: "Đăng nhập", news: "Tin tức",
    search: "Tìm kiếm tin tức...", latest: "Tin mới nhất", featured: "Tin tức nổi bật", experts: "Góc nhìn chuyên gia",
    viewAll: "Xem tất cả", spotlight: "Tiêu điểm", newsletter: "Đăng ký nhận bản tin", subscribe: "Đăng ký",
    categories: { all: "Tất cả", science: "Khoa học - Công nghệ", international: "Hợp tác quốc tế", innovation: "Đổi mới sáng tạo", education: "Giáo dục - Nhân lực", society: "Kinh tế - Xã hội" },
  },
  en: {
    home: "Home", about: "About", explore: "Explore", login: "Sign in", news: "News",
    search: "Search news...", latest: "Latest news", featured: "Featured news", experts: "Expert perspectives",
    viewAll: "View all", spotlight: "Spotlight", newsletter: "Subscribe to newsletter", subscribe: "Subscribe",
    categories: { all: "All", science: "Science - Technology", international: "International cooperation", innovation: "Innovation", education: "Education - Talent", society: "Economy - Society" },
  },
  ru: {
    home: "Главная", about: "О сети", explore: "Обзор", login: "Войти", news: "Новости",
    search: "Поиск новостей...", latest: "Последние новости", featured: "Главные материалы", experts: "Мнения экспертов",
    viewAll: "Все материалы", spotlight: "Главное", newsletter: "Подписка на новости", subscribe: "Подписаться",
    categories: { all: "Все", science: "Наука - Технологии", international: "Международное сотрудничество", innovation: "Инновации", education: "Образование - Кадры", society: "Экономика - Общество" },
  },
} as const;

const news: Record<Exclude<Category, "all">, NewsItem[]> = {
  science: [
    { title: "Nga phát triển chip lượng tử thế hệ mới mạnh gấp 100 lần", category: "science", time: "3 giờ trước" },
    { title: "Các nhà khoa học Việt Nam giải mã thành công gen lúa chịu hạn", category: "science", time: "5 giờ trước" },
    { title: "Nga phóng vệ tinh viễn thám mới hỗ trợ nghiên cứu khí hậu Trái Đất", category: "science", time: "1 ngày trước" },
    { title: "Nghiên cứu chung về vật liệu mới cho năng lượng sạch", category: "science", time: "4 giờ trước" },
    { title: "Phòng thí nghiệm AI ứng dụng hỗ trợ phân tích dữ liệu lớn", category: "science", time: "2 ngày trước" },
    { title: "Công nghệ sinh học mở ra hướng mới trong nông nghiệp bền vững", category: "science", time: "2 ngày trước" },
  ],
  international: [
    { title: "Diễn đàn Khoa học và Công nghệ Việt - Nga 2025 tại Hà Nội", category: "international", time: "1 ngày trước" },
    { title: "Việt Nam và Nga ký kết 5 thỏa thuận hợp tác trong lĩnh vực công nghệ cao", category: "international", time: "2 giờ trước" },
    { title: "Mạng lưới đối tác nghiên cứu song phương được mở rộng trong năm 2026", category: "international", time: "8 giờ trước" },
    { title: "Nhiều trường đại học hai nước thúc đẩy chương trình trao đổi học thuật", category: "international", time: "1 ngày trước" },
    { title: "Doanh nghiệp công nghệ Việt - Nga tìm kiếm cơ hội chuyển giao giải pháp số", category: "international", time: "2 ngày trước" },
    { title: "Hội nghị hợp tác đổi mới sáng tạo quy tụ chuyên gia từ nhiều viện nghiên cứu", category: "international", time: "2 ngày trước" },
  ],
  innovation: [
    { title: "AI giúp mô phỏng vật liệu mới chính xác hơn gấp 10 lần", category: "innovation", time: "2 ngày trước" },
    { title: "Trí tuệ nhân tạo: Cơ hội và thách thức trong kỷ nguyên mới", category: "innovation", time: "7 giờ trước" },
    { title: "Hệ sinh thái khởi nghiệp công nghệ mở rộng hợp tác với các quỹ nghiên cứu", category: "innovation", time: "1 ngày trước" },
    { title: "Ứng dụng blockchain trong quản lý dữ liệu nghiên cứu ngày càng phổ biến", category: "innovation", time: "1 ngày trước" },
    { title: "Mô hình chuyển giao công nghệ từ phòng thí nghiệm tới doanh nghiệp tăng tốc", category: "innovation", time: "2 ngày trước" },
    { title: "Nhiều sáng kiến đổi mới số được thử nghiệm tại các trung tâm nghiên cứu", category: "innovation", time: "3 ngày trước" },
  ],
  education: [
    { title: "Chương trình học bổng toàn phần cho sinh viên Việt Nam tại Nga", category: "education", time: "6 giờ trước" },
    { title: "Mở rộng đào tạo nhân lực chất lượng cao trong các ngành công nghệ mũi nhọn", category: "education", time: "10 giờ trước" },
    { title: "Sinh viên Việt Nam đạt thành tích tốt trong cuộc thi học thuật quốc tế", category: "education", time: "1 ngày trước" },
    { title: "Nhiều chương trình trao đổi nghiên cứu sinh được triển khai trong năm học mới", category: "education", time: "1 ngày trước" },
    { title: "Đại học hai nước hợp tác xây dựng giáo trình song ngữ về công nghệ", category: "education", time: "2 ngày trước" },
    { title: "Kết nối chuyên gia và nhà khoa học trẻ qua nền tảng học thuật mở", category: "education", time: "2 ngày trước" },
  ],
  society: [
    { title: "Kinh tế số mở ra cơ hội hợp tác mới giữa các doanh nghiệp công nghệ", category: "society", time: "5 giờ trước" },
    { title: "Ứng dụng công nghệ xanh hỗ trợ phát triển bền vững tại nhiều địa phương", category: "society", time: "8 giờ trước" },
    { title: "Chính sách mới thúc đẩy đổi mới sáng tạo trong khu vực công", category: "society", time: "1 ngày trước" },
    { title: "Nhiều mô hình công nghiệp công nghệ cao được thử nghiệm thành công", category: "society", time: "1 ngày trước" },
    { title: "Hợp tác thương mại công nghệ góp phần nâng cao năng lực cạnh tranh", category: "society", time: "2 ngày trước" },
    { title: "Giải pháp số hỗ trợ nâng cao chất lượng đời sống và dịch vụ xã hội", category: "society", time: "3 ngày trước" },
  ],
};

const catalogs = [
  ["science", ["Trí tuệ nhân tạo", "Công nghệ lượng tử", "Vật liệu mới", "Năng lượng", "Công nghệ sinh học", "Vũ trụ - Hàng không"]],
  ["international", ["Hợp tác Việt - Nga", "Viện nghiên cứu", "Trường đại học", "Doanh nghiệp công nghệ", "Chương trình song phương", "Mạng lưới đối tác"]],
  ["innovation", ["Công nghệ mới", "Khởi nghiệp sáng tạo", "Chuyển giao công nghệ", "Sở hữu trí tuệ", "Hệ sinh thái đổi mới", "Ứng dụng thực tiễn"]],
  ["education", ["Học bổng", "Đào tạo", "Sinh viên", "Nghiên cứu sinh", "Chuyên gia", "Trao đổi học thuật"]],
  ["society", ["Kinh tế số", "Công nghiệp", "Thương mại", "Chính sách", "Phát triển bền vững", "Xã hội - Đời sống"]],
] as const;

const featured: NewsItem[] = [news.international[1], news.science[3], news.education[0], news.innovation[1]];
const latest = [news.science[0], news.science[1], news.international[0], news.science[2], news.innovation[0]];
const experts = [
  ["TV", "GS. Trần Văn Minh", "Viện Hàn lâm KHCN Việt Nam", "Hợp tác khoa học Việt - Nga có bề dày lịch sử và tiềm năng phát triển mạnh mẽ trong kỷ nguyên mới."],
  ["AP", "TS. Anna Petrova", "Viện Hàn lâm KH Nga", "Việt Nam là đối tác chiến lược quan trọng của Nga trong lĩnh vực khoa học và công nghệ tại Đông Nam Á."],
  ["HN", "PGS. Lê Hoàng Nam", "Đại học Bách khoa Hà Nội", "Đầu tư cho nghiên cứu và đổi mới sáng tạo là chìa khóa để nâng cao năng lực cạnh tranh quốc gia."],
  ["SI", "TS. Sergey Ivanov", "Trường ĐH Kỹ thuật Bauman", "Chúng tôi tin tưởng vào tương lai hợp tác bền vững và hiệu quả giữa hai quốc gia trong lĩnh vực công nghệ cao."],
] as const;

function Placeholder({ className = "", text = "Ảnh" }: { className?: string; text?: string }) {
  return <div className={`relative grid place-items-center overflow-hidden bg-[linear-gradient(135deg,#12428b_0%,#3d79c9_48%,#173f78_100%)] ${className}`}><div className="absolute -right-10 -top-10 size-32 rounded-full bg-white/10"/><div className="absolute -bottom-14 -left-8 size-36 rounded-full bg-white/10"/><span className="relative z-10 text-xs font-black uppercase tracking-[0.12em] text-white/75">{text}</span></div>;
}

function ListItem({ item, t }: { item: NewsItem; t: (typeof labels)[keyof typeof labels] }) {
  return <article className="grid grid-cols-[116px_minmax(0,1fr)] gap-4 border-b border-blue-100 py-4 first:pt-0 sm:grid-cols-[150px_minmax(0,1fr)]"><Placeholder className="h-[78px] rounded-xl sm:h-[92px]"/><div><h3 className="text-[15px] font-extrabold leading-[1.4] tracking-[-0.02em] sm:text-base">{item.title}</h3><div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500"><span className="font-black uppercase text-blue-600">{t.categories[item.category]}</span><span>•</span><span>{item.time}</span></div></div></article>;
}

export function GuestExploreV2() {
  const { locale } = useLocale();
  const t = labels[locale] ?? labels.vi;
  const [category, setCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");
  const allItems = useMemo(() => Object.values(news).flat(), []);
  const filtered = useMemo(() => {
    const source = category === "all" ? allItems : news[category];
    const q = query.trim().toLocaleLowerCase(locale);
    return q ? source.filter((item) => item.title.toLocaleLowerCase(locale).includes(q)) : source;
  }, [allItems, category, locale, query]);
  const half = Math.ceil(filtered.length / 2);

  return <div className="min-h-screen bg-white text-slate-950">
    <header className="sticky top-0 z-50 border-b border-blue-200/80 bg-[#edf5fe]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-[1460px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3"><BrandMark className="size-11"/><strong className="hidden text-base font-extrabold sm:block">Mạng lưới tri thức Nga - Việt</strong></Link>
        <nav className="hidden items-center gap-8 xl:flex"><Link href="/" className="text-sm font-extrabold uppercase text-slate-700">{t.home}</Link><Link href="/#about" className="text-sm font-extrabold uppercase text-slate-700">{t.about}</Link><Link href="/explore" className="relative py-6 text-sm font-extrabold uppercase text-blue-700">{t.explore}<span className="absolute inset-x-0 bottom-4 h-0.5 bg-blue-600"/></Link></nav>
        <div className="flex items-center gap-3"><LanguageSwitcher variant="light"/><Link href="/login" className="inline-flex h-10 items-center rounded-xl bg-blue-600 px-4 text-sm font-bold text-white">{t.login}</Link></div>
      </div>
    </header>

    <main className="mx-auto max-w-[1460px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <h1 className="mb-5 text-2xl font-black uppercase text-blue-600 sm:text-3xl">{t.news}</h1>
      <section className="mb-7 flex flex-col gap-3 rounded-2xl border border-blue-200 bg-blue-50/40 p-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex gap-2 overflow-x-auto">{(["all","science","international","innovation","education","society"] as Category[]).map((key) => <button key={key} type="button" onClick={() => setCategory(key)} className={`min-h-11 shrink-0 rounded-xl border px-5 text-sm font-bold ${category===key?"border-blue-600 bg-blue-600 text-white":"border-blue-100 bg-white text-slate-700"}`}>{t.categories[key]}</button>)}</div>
        <div className="flex items-center gap-3">
          <details className="group relative"><summary className="grid size-11 cursor-pointer list-none place-items-center rounded-xl border border-blue-200 bg-white text-blue-600 [&::-webkit-details-marker]:hidden"><svg viewBox="0 0 24 24" className="size-5"><path d="M5 7h14M5 12h14M5 17h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg></summary><div className="absolute right-0 top-[calc(100%+10px)] z-40 w-[min(1120px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-2xl"><div className="grid sm:grid-cols-2 xl:grid-cols-4">{catalogs.map(([key,children],i)=><section key={key} className="border-b border-r border-blue-100 p-5"><button type="button" onClick={()=>setCategory(key)} className="flex gap-2 text-left text-sm font-black"><span className="text-xs text-blue-600">0{i+1}</span><span>{t.categories[key]}</span></button><div className="mt-3 grid gap-1">{children.map(c=><button key={c} type="button" className="rounded-lg px-3 py-2 text-left text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-700"><span className="mr-2 text-blue-200">•</span>{c}</button>)}</div></section>)}<section className="border-b border-r border-blue-100 bg-blue-50/35 p-5"><button type="button" onClick={()=>setCategory("all")} className="flex gap-2 text-sm font-black"><span className="text-xs text-blue-600">00</span><span>{t.categories.all}</span></button></section></div></div></details>
          <label className="flex h-11 min-w-0 flex-1 items-center rounded-xl border border-blue-200 bg-white px-4 xl:w-[330px] xl:flex-none"><input value={query} onChange={e=>setQuery(e.target.value)} type="search" placeholder={t.search} className="min-w-0 flex-1 bg-transparent text-sm outline-none"/><svg viewBox="0 0 24 24" className="size-5 text-slate-500"><circle cx="11" cy="11" r="6.7" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg></label>
        </div>
      </section>

      {category==="all" && !query ? <>
        <section className="grid gap-8 lg:grid-cols-[1.35fr_.9fr]"><article className="relative min-h-[500px] overflow-hidden rounded-2xl bg-slate-950 text-white"><Placeholder text="Ảnh bài viết nổi bật" className="absolute inset-0 h-full w-full rounded-none"/><div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,18,45,.02),rgba(2,14,35,.93))]"/><div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8"><span className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-black uppercase">{t.spotlight}</span><h2 className="mt-4 max-w-4xl text-3xl font-black leading-tight sm:text-4xl">Việt Nam - Nga tăng cường hợp tác Khoa học, Công nghệ và Đổi mới sáng tạo</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-white/85 sm:text-base">Thúc đẩy các chương trình nghiên cứu chung, chuyển giao công nghệ và đào tạo nhân lực chất lượng cao trong giai đoạn mới.</p><div className="mt-5 text-xs">RVSTIN News • 2 giờ trước</div></div></article><aside><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-black uppercase text-blue-600">{t.latest}</h2><button type="button" className="text-xs font-black text-blue-600">{t.viewAll} →</button></div>{latest.map(item=><ListItem key={item.title} item={item} t={t}/>)}</aside></section>
        <section className="mt-12"><div className="mb-5 flex items-center gap-4"><h2 className="text-xl font-black uppercase text-blue-600">{t.featured}</h2><div className="h-px flex-1 bg-blue-100"/></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{featured.map(item=><article key={item.title} className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm"><Placeholder text="Ảnh bài viết" className="h-44"/><div className="p-4"><h3 className="text-base font-extrabold leading-relaxed">{item.title}</h3><div className="mt-4 text-xs text-slate-500">{item.time} • <span className="font-black uppercase text-blue-600">{t.categories[item.category]}</span></div></div></article>)}</div></section>
      </> : <section className="mt-9"><div className="mb-5 flex items-center gap-4"><h2 className="text-xl font-black uppercase text-blue-600">{t.latest}</h2><div className="h-px flex-1 bg-blue-100"/></div><div className="grid gap-x-10 lg:grid-cols-2"><div>{filtered.slice(0,half).map(item=><ListItem key={item.title} item={item} t={t}/>)}</div><div>{filtered.slice(half).map(item=><ListItem key={item.title} item={item} t={t}/>)}</div></div></section>}

      <section className="mt-12" id="experts"><div className="mb-5 flex items-center gap-4"><h2 className="text-xl font-black uppercase text-blue-600">{t.experts}</h2><div className="h-px flex-1 bg-blue-100"/></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{experts.map(([initials,name,org,quote])=><article key={name} className="rounded-2xl border border-blue-100 bg-blue-50/35 p-5"><div className="flex items-center gap-3"><div className="grid size-14 place-items-center rounded-full bg-blue-600 text-sm font-black text-white">{initials}</div><div><h3 className="text-sm font-black">{name}</h3><p className="mt-1 text-xs text-slate-500">{org}</p></div></div><blockquote className="mt-5 text-sm leading-6 text-slate-700">“{quote}”</blockquote></article>)}</div></section>
      <section className="mt-10 grid gap-5 rounded-2xl border border-blue-200 bg-blue-50/40 p-5 lg:grid-cols-[1fr_minmax(420px,.8fr)] lg:items-center"><div><h2 className="text-xl font-black uppercase text-blue-600">{t.newsletter}</h2><p className="mt-2 text-sm text-slate-600">Nhận những tin tức mới nhất về khoa học, công nghệ và hợp tác Việt - Nga.</p></div><form className="flex h-12 overflow-hidden rounded-xl border border-blue-200 bg-white" onSubmit={e=>e.preventDefault()}><input type="email" placeholder="Email" className="min-w-0 flex-1 px-4 text-sm outline-none"/><button type="submit" className="min-w-28 bg-blue-600 px-5 text-sm font-black text-white">{t.subscribe}</button></form></section>
    </main>

    <footer className="mt-8 border-t border-blue-100 bg-[#f6f9ff]"><div className="mx-auto grid max-w-[1460px] gap-8 px-4 py-9 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8"><div><div className="flex items-center gap-3"><BrandMark className="size-10"/><strong className="text-sm font-black">Mạng lưới tri thức Nga - Việt</strong></div><p className="mt-4 max-w-md text-sm leading-6 text-slate-600">Cầu nối tri thức và công nghệ giữa Việt Nam và Nga, thúc đẩy hợp tác, đổi mới và phát triển bền vững.</p></div><div><h3 className="text-xs font-black uppercase text-blue-600">Liên kết nhanh</h3><div className="mt-4 grid gap-2 text-sm text-slate-600"><Link href="/#about">{t.about}</Link><Link href="/experts">{t.experts}</Link><Link href="/knowledge">{t.categories.science}</Link></div></div><div><h3 className="text-xs font-black uppercase text-blue-600">Liên hệ</h3><div className="mt-4 grid gap-2 text-sm text-slate-600"><span>Hà Nội, Việt Nam</span><a href="mailto:info@rvstin.com">info@rvstin.com</a><a href="tel:+842437911234">+84 24 3791 1234</a></div></div></div></footer>
  </div>;
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { BrandMark } from "@/components/shared/BrandMark";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLocale } from "@/core/i18n/locale";

type Category =
  | "all"
  | "science"
  | "international"
  | "innovation"
  | "education"
  | "society"
  | "health"
  | "space";

type NewsItem = {
  id: number;
  title: string;
  summary: string;
  category: Exclude<Category, "all">;
  time: string;
  minutesAgo: number;
};

type TimeFilter = "all" | "today" | "24h" | "7d" | "30d";
type ViewMode = "list" | "grid";

const categoryLabels: Record<Category, string> = {
  all: "Tất cả",
  science: "Khoa học - Công nghệ",
  international: "Hợp tác quốc tế",
  innovation: "Đổi mới sáng tạo",
  education: "Giáo dục - Nhân lực",
  society: "Kinh tế - Xã hội",
  health: "Y sinh - Sức khỏe",
  space: "Không gian - Vũ trụ",
};

const topCategories: Category[] = [
  "all",
  "science",
  "international",
  "innovation",
  "education",
  "society",
];

const newsItems: NewsItem[] = [
  { id: 1, title: "Nga thử nghiệm thế hệ vật liệu mới cho công nghệ lượng tử", summary: "Nghiên cứu mở ra khả năng ứng dụng trong các hệ thống tính toán thế hệ mới.", category: "science", time: "10:32", minutesAgo: 18 },
  { id: 2, title: "Diễn đàn Khoa học và Công nghệ Việt - Nga 2025 tại Hà Nội", summary: "Sự kiện thu hút hơn 500 đại biểu từ hai nước tham dự và trao đổi hợp tác.", category: "international", time: "10:20", minutesAgo: 30 },
  { id: 3, title: "Startup Việt và Nga tìm cơ hội hợp tác trong lĩnh vực AI", summary: "Nhiều startup hai nước giới thiệu sản phẩm và tìm kiếm đối tác chiến lược.", category: "innovation", time: "10:05", minutesAgo: 45 },
  { id: 4, title: "Sinh viên Việt Nam đạt giải cao tại Olympic Tin học quốc tế", summary: "Đội tuyển Việt Nam giành thành tích nổi bật tại kỳ thi năm nay.", category: "education", time: "09:50", minutesAgo: 60 },
  { id: 5, title: "Hợp tác nghiên cứu vaccine thế hệ mới phòng bệnh truyền nhiễm", summary: "Các viện nghiên cứu hai nước ký kết thỏa thuận hợp tác dài hạn.", category: "health", time: "09:45", minutesAgo: 65 },
  { id: 6, title: "Thúc đẩy thương mại song phương Việt Nam - Liên bang Nga", summary: "Kim ngạch thương mại những tháng đầu năm tăng trưởng tích cực.", category: "society", time: "09:30", minutesAgo: 80 },
  { id: 7, title: "Nga phóng vệ tinh viễn thám mới hỗ trợ nghiên cứu Trái Đất", summary: "Vệ tinh có độ phân giải cao, phục vụ quan sát môi trường và khí hậu.", category: "space", time: "09:15", minutesAgo: 95 },
  { id: 8, title: "Robotics tự hành: Xu hướng phát triển trong công nghiệp 4.0", summary: "Các chuyên gia dự báo thị trường robot tăng trưởng mạnh trong giai đoạn mới.", category: "science", time: "09:05", minutesAgo: 105 },
  { id: 9, title: "Việt Nam và Nga mở rộng hợp tác trong lĩnh vực năng lượng", summary: "Tập trung vào năng lượng hạt nhân dân sự và năng lượng tái tạo.", category: "international", time: "08:50", minutesAgo: 120 },
  { id: 10, title: "Ứng dụng blockchain trong quản lý chuỗi cung ứng nông sản", summary: "Giải pháp giúp minh bạch hóa quy trình và nâng cao giá trị xuất khẩu.", category: "innovation", time: "08:40", minutesAgo: 130 },
  { id: 11, title: "Hội thảo về chuyển đổi số trong giáo dục đại học", summary: "Các chuyên gia chia sẻ giải pháp nâng cao chất lượng đào tạo trong kỷ nguyên số.", category: "education", time: "08:30", minutesAgo: 140 },
  { id: 12, title: "Công nghệ pin sodium-ion: Giải pháp thay thế lithium-ion", summary: "Nghiên cứu mới giúp giảm chi phí và tăng độ an toàn cho người dùng.", category: "science", time: "08:20", minutesAgo: 150 },
  { id: 13, title: "Việt Nam thu hút FDI vào lĩnh vực công nghệ cao", summary: "Nhiều tập đoàn quốc tế mở rộng đầu tư vào các khu công nghệ.", category: "society", time: "08:10", minutesAgo: 160 },
  { id: 14, title: "Nga hỗ trợ Việt Nam đào tạo nguồn nhân lực chất lượng cao", summary: "Hơn 200 học viên tham gia các khóa học ngắn hạn trao đổi chuyên môn.", category: "international", time: "08:00", minutesAgo: 170 },
  { id: 15, title: "Mô hình AI mới tăng tốc phân tích dữ liệu khoa học", summary: "Hệ thống hỗ trợ các nhóm nghiên cứu xử lý tập dữ liệu lớn hiệu quả hơn.", category: "innovation", time: "07:45", minutesAgo: 185 },
  { id: 16, title: "Nghiên cứu liệu pháp gen trong điều trị bệnh hiếm", summary: "Nhóm nghiên cứu đạt bước tiến mới trong phát triển phương pháp điều trị cá thể hóa.", category: "health", time: "07:30", minutesAgo: 200 },
  { id: 17, title: "Vệ tinh Việt - Nga hợp tác quan sát biến đổi khí hậu", summary: "Dự án sử dụng dữ liệu viễn thám để theo dõi các vùng nhạy cảm khí hậu.", category: "space", time: "07:15", minutesAgo: 215 },
  { id: 18, title: "Doanh nghiệp công nghệ hai nước tăng cường kết nối thị trường", summary: "Nhiều phiên kết nối tập trung vào phần mềm, tự động hóa và an ninh mạng.", category: "international", time: "07:00", minutesAgo: 230 },
  { id: 19, title: "Đại học hai nước xây dựng chương trình đào tạo song bằng", summary: "Chương trình hướng tới các lĩnh vực kỹ thuật, khoa học dữ liệu và công nghệ mới.", category: "education", time: "06:45", minutesAgo: 245 },
  { id: 20, title: "Năng lượng xanh trở thành trọng tâm hợp tác mới", summary: "Hydrogen và điện gió ngoài khơi được đánh giá là các lĩnh vực nhiều tiềm năng.", category: "society", time: "06:30", minutesAgo: 260 },
  { id: 21, title: "Trung tâm nghiên cứu vật liệu tiên tiến mở rộng mạng lưới đối tác", summary: "Các nhóm nghiên cứu tăng cường dùng chung phòng thí nghiệm và dữ liệu.", category: "science", time: "Hôm qua", minutesAgo: 1560 },
  { id: 22, title: "Nền tảng kết nối nhà khoa học trẻ Việt - Nga chính thức vận hành", summary: "Nền tảng hỗ trợ tìm kiếm chuyên gia, chủ đề và cơ hội cộng tác nghiên cứu.", category: "innovation", time: "Hôm qua", minutesAgo: 1720 },
  { id: 23, title: "Học bổng nghiên cứu mới dành cho sinh viên ngành công nghệ", summary: "Chương trình ưu tiên AI, tự động hóa, vật liệu mới và công nghệ sinh học.", category: "education", time: "2 ngày trước", minutesAgo: 3000 },
  { id: 24, title: "Chương trình nghiên cứu chung về môi trường và Bắc Cực", summary: "Các nhà khoa học phối hợp phân tích dữ liệu khí hậu và hệ sinh thái vùng lạnh.", category: "space", time: "3 ngày trước", minutesAgo: 4380 },
  { id: 25, title: "Đề xuất tiêu chuẩn dữ liệu chung cho nghiên cứu song phương", summary: "Khung dữ liệu mới hướng tới chia sẻ an toàn và tăng khả năng tái sử dụng kết quả nghiên cứu.", category: "science", time: "4 ngày trước", minutesAgo: 5820 },
  { id: 26, title: "Mạng lưới phòng thí nghiệm mở rộng chương trình dùng chung thiết bị", summary: "Các tổ chức nghiên cứu tăng cường chia sẻ hạ tầng khoa học có giá trị cao.", category: "international", time: "5 ngày trước", minutesAgo: 7260 },
  { id: 27, title: "AI hỗ trợ phát hiện sớm rủi ro trong chuỗi cung ứng", summary: "Mô hình dự báo mới được thử nghiệm trên dữ liệu logistics xuyên biên giới.", category: "innovation", time: "6 ngày trước", minutesAgo: 8700 },
  { id: 28, title: "Trao đổi giảng viên mở rộng sang các ngành công nghệ nền tảng", summary: "Các trường tăng số lượng chương trình giảng dạy và nghiên cứu ngắn hạn.", category: "education", time: "7 ngày trước", minutesAgo: 10020 },
];

const featuredIds = [2, 1, 23, 15];

const timeOptions: { key: TimeFilter; label: string; maxMinutes: number }[] = [
  { key: "all", label: "Tất cả thời gian", maxMinutes: Number.POSITIVE_INFINITY },
  { key: "today", label: "Hôm nay", maxMinutes: 720 },
  { key: "24h", label: "24 giờ qua", maxMinutes: 1440 },
  { key: "7d", label: "7 ngày qua", maxMinutes: 10080 },
  { key: "30d", label: "30 ngày qua", maxMinutes: 43200 },
];

function Placeholder({ category, compact = false }: { category: Category; compact?: boolean }) {
  const initials: Record<Category, string> = {
    all: "RV",
    science: "KHCN",
    international: "VN·RU",
    innovation: "ĐMST",
    education: "GD",
    society: "KT",
    health: "YS",
    space: "VT",
  };

  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-xl bg-[linear-gradient(135deg,#15458f_0%,#3f79c7_48%,#173f78_100%)] text-white ${compact ? "h-[86px] w-[118px]" : "h-40 w-full"}`}
    >
      <div className="absolute -right-8 -top-8 size-24 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 -left-6 size-28 rounded-full bg-white/10" />
      <span className="relative text-[11px] font-black tracking-[0.12em] text-white/80">
        {initials[category]}
      </span>
    </div>
  );
}

function BookmarkIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        d="M7 4.75h10a1.25 1.25 0 0 1 1.25 1.25v13.1L12 15.35 5.75 19.1V6A1.25 1.25 0 0 1 7 4.75Z"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GuestNewsV2() {
  const { locale } = useLocale();
  const [category, setCategory] = useState<Category>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [visibleCount, setVisibleCount] = useState(10);
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [showTop, setShowTop] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      all: newsItems.length,
      science: 0,
      international: 0,
      innovation: 0,
      education: 0,
      society: 0,
      health: 0,
      space: 0,
    };
    newsItems.forEach((item) => {
      counts[item.category] += 1;
    });
    return counts;
  }, []);

  const filteredItems = useMemo(() => {
    const timeOption = timeOptions.find((item) => item.key === timeFilter) ?? timeOptions[0];
    const normalizedQuery = query.trim().toLocaleLowerCase(locale);

    const result = newsItems.filter((item) => {
      const categoryMatch = category === "all" || item.category === category;
      const timeMatch = item.minutesAgo <= timeOption.maxMinutes;
      const queryMatch =
        !normalizedQuery ||
        item.title.toLocaleLowerCase(locale).includes(normalizedQuery) ||
        item.summary.toLocaleLowerCase(locale).includes(normalizedQuery);
      return categoryMatch && timeMatch && queryMatch;
    });

    return result.sort((a, b) =>
      sort === "newest" ? a.minutesAgo - b.minutesAgo : b.minutesAgo - a.minutesAgo,
    );
  }, [category, locale, query, sort, timeFilter]);

  const visibleItems = filteredItems.slice(0, visibleCount);
  const featuredItems = featuredIds
    .map((id) => newsItems.find((item) => item.id === id))
    .filter((item): item is NewsItem => Boolean(item));

  useEffect(() => {
    setVisibleCount(10);
  }, [category, query, sort, timeFilter]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || visibleCount >= filteredItems.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((current) => Math.min(current + 6, filteredItems.length));
        }
      },
      { rootMargin: "240px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredItems.length, visibleCount]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleBookmark = (id: number) => {
    setBookmarks((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-[1460px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <BrandMark className="size-11 shrink-0" />
            <strong className="hidden truncate text-base font-extrabold tracking-tight sm:block">
              Mạng lưới tri thức Nga - Việt
            </strong>
          </Link>

          <nav className="hidden items-center gap-8 xl:flex" aria-label="Điều hướng công khai">
            <Link href="/" className="text-sm font-extrabold uppercase text-slate-700 hover:text-blue-700">Trang chủ</Link>
            <Link href="/#about" className="text-sm font-extrabold uppercase text-slate-700 hover:text-blue-700">Giới thiệu</Link>
            <Link href="/explore" className="relative py-6 text-sm font-extrabold uppercase text-blue-700">
              Khám phá
              <span className="absolute inset-x-0 bottom-4 h-0.5 rounded-full bg-blue-600" />
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="light" />
            <Link href="/login" className="inline-flex h-10 items-center rounded-xl bg-blue-600 px-4 text-sm font-bold text-white hover:bg-blue-700">
              Đăng nhập
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1460px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-black uppercase tracking-[-0.03em] text-blue-600">Tin tức</h1>
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.06em] text-blue-700">
                <span className="size-1.5 rounded-full bg-blue-600" /> Cập nhật liên tục
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Cập nhật nhanh các thông tin mới nhất về khoa học, công nghệ, hợp tác quốc tế và các lĩnh vực trọng điểm giữa Việt Nam và Nga.
            </p>
          </div>

          <div className="flex overflow-hidden rounded-xl border border-blue-100 bg-slate-50">
            {[
              ["06", "Chuyên mục"],
              ["24/7", "Cập nhật"],
              ["VN · RU", "Song phương"],
            ].map(([value, label]) => (
              <div key={label} className="min-w-[108px] border-l border-blue-100 px-4 py-2.5 text-center first:border-l-0">
                <strong className="block text-sm font-black text-blue-600">{value}</strong>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 flex flex-col gap-3 rounded-2xl border border-blue-100 bg-slate-50 p-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {topCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`min-h-11 shrink-0 rounded-xl border px-5 text-sm font-bold transition ${
                  category === item
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-700"
                }`}
              >
                {categoryLabels[item]}
              </button>
            ))}
          </div>

          <label className="flex h-11 min-w-0 flex-1 items-center rounded-xl border border-slate-200 bg-white px-4 xl:w-[330px] xl:flex-none">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              type="search"
              placeholder="Tìm kiếm tin tức..."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
            <svg viewBox="0 0 24 24" className="size-5 text-slate-500" aria-hidden="true">
              <circle cx="11" cy="11" r="6.7" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="m16 16 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </label>
        </section>

        <section className="mb-12">
          <div className="mb-5 flex items-center gap-4">
            <h2 className="shrink-0 text-lg font-black uppercase text-blue-600 sm:text-xl">Tin tức nổi bật</h2>
            <div className="h-px flex-1 bg-blue-100" />
            <Link href="/news" className="text-xs font-black text-blue-600">Xem tất cả →</Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featuredItems.map((item) => (
              <article key={item.id} className="overflow-hidden rounded-2xl border border-blue-100 bg-white">
                <Placeholder category={item.category} />
                <div className="p-4">
                  <h3 className="text-base font-extrabold leading-[1.45] tracking-[-0.02em]">{item.title}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{item.summary}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>{item.time}</span><span>•</span>
                    <span className="font-black uppercase text-blue-600">{categoryLabels[item.category]}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <h2 className="shrink-0 text-lg font-black uppercase text-blue-600 sm:text-xl">Dòng tin liên tục</h2>
              <div className="h-px flex-1 bg-blue-100" />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as "newest" | "oldest")}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
                aria-label="Sắp xếp tin"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
              <button type="button" onClick={() => setViewMode("list")} aria-label="Hiển thị dạng danh sách" className={`grid size-10 place-items-center rounded-lg border ${viewMode === "list" ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-200 bg-white text-slate-500"}`}>
                <svg viewBox="0 0 24 24" className="size-5"><path d="M8 7h11M8 12h11M8 17h11M4.5 7h.01M4.5 12h.01M4.5 17h.01" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
              <button type="button" onClick={() => setViewMode("grid")} aria-label="Hiển thị dạng lưới" className={`grid size-10 place-items-center rounded-lg border ${viewMode === "grid" ? "border-blue-600 bg-blue-50 text-blue-600" : "border-slate-200 bg-white text-slate-500"}`}>
                <svg viewBox="0 0 24 24" className="size-5"><rect x="4" y="4" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.7"/><rect x="14" y="4" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.7"/><rect x="4" y="14" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.7"/><rect x="14" y="14" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.7"/></svg>
              </button>
            </div>
          </div>

          <div className="grid gap-7 lg:grid-cols-[230px_minmax(0,1fr)]">
            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <h3 className="px-2 pb-3 text-xs font-black uppercase tracking-wide text-slate-700">Lọc theo chuyên mục</h3>
                <div className="grid gap-1">
                  {(Object.keys(categoryLabels) as Category[]).map((item) => (
                    <button key={item} type="button" onClick={() => setCategory(item)} className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition ${category === item ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                      <span>{categoryLabels[item]}</span>
                      <span className="text-[10px] text-slate-400">{categoryCounts[item]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3">
                <h3 className="px-2 pb-3 text-xs font-black uppercase tracking-wide text-slate-700">Lọc theo thời gian</h3>
                <div className="grid gap-1">
                  {timeOptions.map((item) => (
                    <button key={item.key} type="button" onClick={() => setTimeFilter(item.key)} className={`rounded-lg px-3 py-2.5 text-left text-xs font-semibold transition ${timeFilter === item.key ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <form className="rounded-xl border border-blue-100 bg-blue-50/40 p-4" onSubmit={(event) => event.preventDefault()}>
                <div className="grid size-10 place-items-center rounded-lg bg-white text-blue-600">✉</div>
                <h3 className="mt-4 text-sm font-black">Nhận bản tin hằng ngày</h3>
                <p className="mt-2 text-xs leading-5 text-slate-600">Cập nhật những tin tức quan trọng mỗi ngày vào hộp thư của bạn.</p>
                <input type="email" placeholder="Nhập email của bạn..." className="mt-4 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-blue-500" />
                <button type="submit" className="mt-2 h-10 w-full rounded-lg bg-blue-600 text-xs font-black text-white hover:bg-blue-700">Đăng ký</button>
              </form>
            </aside>

            <div>
              {visibleItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-16 text-center text-sm text-slate-500">Không tìm thấy tin phù hợp.</div>
              ) : viewMode === "list" ? (
                <div className="grid gap-x-8 xl:grid-cols-2">
                  {visibleItems.map((item) => (
                    <article key={item.id} className="grid grid-cols-[118px_minmax(0,1fr)_auto] gap-4 border-b border-slate-200 py-4 first:pt-0">
                      <Placeholder category={item.category} compact />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-wide text-blue-600">
                          <span>{categoryLabels[item.category]}</span><span className="text-slate-300">•</span><span className="font-semibold text-slate-500">{item.time}</span>
                        </div>
                        <h3 className="mt-2 text-[15px] font-extrabold leading-[1.4] tracking-[-0.02em]">{item.title}</h3>
                        <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">{item.summary}</p>
                      </div>
                      <button type="button" onClick={() => toggleBookmark(item.id)} className={`self-start rounded-lg p-2 ${bookmarks.has(item.id) ? "text-blue-600" : "text-slate-400 hover:text-blue-600"}`} aria-label="Lưu bài viết">
                        <BookmarkIcon active={bookmarks.has(item.id)} />
                      </button>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {visibleItems.map((item) => (
                    <article key={item.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                      <Placeholder category={item.category} />
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] font-black uppercase text-blue-600">{categoryLabels[item.category]}</span>
                          <button type="button" onClick={() => toggleBookmark(item.id)} className={bookmarks.has(item.id) ? "text-blue-600" : "text-slate-400 hover:text-blue-600"} aria-label="Lưu bài viết"><BookmarkIcon active={bookmarks.has(item.id)} /></button>
                        </div>
                        <h3 className="mt-3 text-sm font-extrabold leading-6">{item.title}</h3>
                        <p className="mt-2 line-clamp-3 text-xs leading-5 text-slate-600">{item.summary}</p>
                        <span className="mt-4 block text-[11px] text-slate-400">{item.time}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              <div ref={loadMoreRef} className="mt-7 flex min-h-16 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center">
                {visibleCount < filteredItems.length ? (
                  <>
                    <div className="size-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
                    <span className="text-xs font-semibold text-slate-600">Đang tải thêm tin...</span>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-slate-500">Đã hiển thị toàn bộ tin phù hợp</span>
                )}
              </div>
              <p className="mt-3 text-center text-[11px] text-slate-400">Hiển thị {Math.min(visibleCount, filteredItems.length)} / {filteredItems.length} tin</p>
            </div>
          </div>
        </section>
      </main>

      {showTop && (
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-6 right-6 z-40 grid size-12 place-items-center rounded-full bg-blue-600 text-xl text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700" aria-label="Lên đầu trang">↑</button>
      )}
    </div>
  );
}

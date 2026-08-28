"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale } from "@/core/i18n/locale";
import { GuestPublicFooter } from "./GuestPublicFooter";
import { HOME_COPY } from "./GuestHomeV2";
import {
  GuestNewsFilterNav,
  newsFilterHref,
  type NewsCategory,
} from "./GuestNewsFilterNav";
import { GuestNewsMasthead } from "./GuestNewsMasthead";
import { GuestPublicNav } from "./GuestPublicNav";

type Category = "science" | "cooperation" | "education" | "society";

type ArticleRecord = {
  id: number;
  title: string;
  summary: string;
  category: Category;
  time: string;
};

const categoryLabels: Record<Category, string> = {
  science: "Khoa học - Công nghệ",
  society: "Kinh tế - Xã hội",
  education: "Giáo dục đào tạo",
  cooperation: "Hợp tác",
};

const filterCopy = {
  vi: {
    search: "Tìm kiếm tin tức...",
    clear: "Xóa tìm kiếm",
    open: "Mở bộ lọc tin tức",
    categories: { all: "Tất cả", ...categoryLabels },
  },
  en: {
    search: "Search news...",
    clear: "Clear search",
    open: "Open news filters",
    categories: {
      all: "All",
      science: "Science - Technology",
      society: "Economy - Society",
      education: "Education and Training",
      cooperation: "Cooperation",
    },
  },
  ru: {
    search: "Поиск новостей...",
    clear: "Очистить поиск",
    open: "Открыть фильтры новостей",
    categories: {
      all: "Все",
      science: "Наука - Технологии",
      society: "Экономика - Общество",
      education: "Образование и подготовка",
      cooperation: "Сотрудничество",
    },
  },
} as const;

const articles: ArticleRecord[] = [
  {
    id: 1,
    title: "Nga thử nghiệm thế hệ vật liệu mới cho công nghệ lượng tử",
    summary:
      "Nghiên cứu mở ra khả năng ứng dụng trong các hệ thống tính toán thế hệ mới.",
    category: "science",
    time: "10:32",
  },
  {
    id: 2,
    title: "Diễn đàn Khoa học và Công nghệ Việt - Nga 2025 tại Hà Nội",
    summary:
      "Sự kiện thu hút hơn 500 đại biểu từ hai nước tham dự và trao đổi hợp tác.",
    category: "cooperation",
    time: "10:20",
  },
  {
    id: 3,
    title: "Startup Việt và Nga tìm cơ hội hợp tác trong lĩnh vực AI",
    summary:
      "Nhiều startup hai nước giới thiệu sản phẩm và tìm kiếm đối tác chiến lược.",
    category: "science",
    time: "10:05",
  },
  {
    id: 4,
    title: "Sinh viên Việt Nam đạt giải cao tại Olympic Tin học quốc tế",
    summary: "Đội tuyển Việt Nam giành thành tích nổi bật tại kỳ thi năm nay.",
    category: "education",
    time: "09:50",
  },
  {
    id: 5,
    title: "Hợp tác nghiên cứu vaccine thế hệ mới phòng bệnh truyền nhiễm",
    summary: "Các viện nghiên cứu hai nước ký kết thỏa thuận hợp tác dài hạn.",
    category: "science",
    time: "09:45",
  },
  {
    id: 6,
    title: "Thúc đẩy thương mại song phương Việt Nam - Liên bang Nga",
    summary: "Kim ngạch thương mại những tháng đầu năm tăng trưởng tích cực.",
    category: "society",
    time: "09:30",
  },
  {
    id: 7,
    title: "Nga phóng vệ tinh viễn thám mới hỗ trợ nghiên cứu Trái Đất",
    summary:
      "Vệ tinh có độ phân giải cao, phục vụ quan sát môi trường và khí hậu.",
    category: "science",
    time: "09:15",
  },
  {
    id: 8,
    title: "Robotics tự hành: Xu hướng phát triển trong công nghiệp 4.0",
    summary:
      "Các chuyên gia dự báo thị trường robot tăng trưởng mạnh trong giai đoạn mới.",
    category: "science",
    time: "09:05",
  },
  {
    id: 9,
    title: "Việt Nam và Nga mở rộng hợp tác trong lĩnh vực năng lượng",
    summary: "Tập trung vào năng lượng hạt nhân dân sự và năng lượng tái tạo.",
    category: "cooperation",
    time: "08:50",
  },
  {
    id: 10,
    title: "Ứng dụng blockchain trong quản lý chuỗi cung ứng nông sản",
    summary:
      "Giải pháp giúp minh bạch hóa quy trình và nâng cao giá trị xuất khẩu.",
    category: "science",
    time: "08:40",
  },
  {
    id: 11,
    title: "Hội thảo về chuyển đổi số trong giáo dục đại học",
    summary:
      "Các chuyên gia chia sẻ giải pháp nâng cao chất lượng đào tạo trong kỷ nguyên số.",
    category: "education",
    time: "08:30",
  },
  {
    id: 12,
    title: "Công nghệ pin sodium-ion: Giải pháp thay thế lithium-ion",
    summary:
      "Nghiên cứu mới giúp giảm chi phí và tăng độ an toàn cho người dùng.",
    category: "science",
    time: "08:20",
  },
  {
    id: 13,
    title: "Việt Nam thu hút FDI vào lĩnh vực công nghệ cao",
    summary: "Nhiều tập đoàn quốc tế mở rộng đầu tư vào các khu công nghệ.",
    category: "society",
    time: "08:10",
  },
  {
    id: 14,
    title: "Nga hỗ trợ Việt Nam đào tạo nguồn nhân lực chất lượng cao",
    summary:
      "Hơn 200 học viên tham gia các khóa học ngắn hạn trao đổi chuyên môn.",
    category: "cooperation",
    time: "08:00",
  },
  {
    id: 15,
    title: "Mô hình AI mới tăng tốc phân tích dữ liệu khoa học",
    summary:
      "Hệ thống hỗ trợ các nhóm nghiên cứu xử lý tập dữ liệu lớn hiệu quả hơn.",
    category: "science",
    time: "07:45",
  },
  {
    id: 16,
    title: "Nghiên cứu liệu pháp gen trong điều trị bệnh hiếm",
    summary:
      "Nhóm nghiên cứu đạt bước tiến mới trong phát triển phương pháp điều trị cá thể hóa.",
    category: "science",
    time: "07:30",
  },
  {
    id: 17,
    title: "Vệ tinh Việt - Nga hợp tác quan sát biến đổi khí hậu",
    summary:
      "Dự án sử dụng dữ liệu viễn thám để theo dõi các vùng nhạy cảm khí hậu.",
    category: "science",
    time: "07:15",
  },
  {
    id: 18,
    title: "Doanh nghiệp công nghệ hai nước tăng cường kết nối thị trường",
    summary:
      "Nhiều phiên kết nối tập trung vào phần mềm, tự động hóa và an ninh mạng.",
    category: "cooperation",
    time: "07:00",
  },
  {
    id: 19,
    title: "Đại học hai nước xây dựng chương trình đào tạo song bằng",
    summary:
      "Chương trình hướng tới các lĩnh vực kỹ thuật, khoa học dữ liệu và công nghệ mới.",
    category: "education",
    time: "06:45",
  },
  {
    id: 20,
    title: "Năng lượng xanh trở thành trọng tâm hợp tác mới",
    summary:
      "Hydrogen và điện gió ngoài khơi được đánh giá là các lĩnh vực nhiều tiềm năng.",
    category: "society",
    time: "06:30",
  },
  {
    id: 21,
    title: "Trung tâm nghiên cứu vật liệu tiên tiến mở rộng mạng lưới đối tác",
    summary:
      "Các nhóm nghiên cứu tăng cường dùng chung phòng thí nghiệm và dữ liệu.",
    category: "science",
    time: "Hôm qua",
  },
  {
    id: 22,
    title: "Nền tảng kết nối nhà khoa học trẻ Việt - Nga chính thức vận hành",
    summary:
      "Nền tảng hỗ trợ tìm kiếm chuyên gia, chủ đề và cơ hội cộng tác nghiên cứu.",
    category: "science",
    time: "Hôm qua",
  },
  {
    id: 23,
    title: "Học bổng nghiên cứu mới dành cho sinh viên ngành công nghệ",
    summary:
      "Chương trình ưu tiên AI, tự động hóa, vật liệu mới và công nghệ sinh học.",
    category: "education",
    time: "2 ngày trước",
  },
  {
    id: 24,
    title: "Chương trình nghiên cứu chung về môi trường và Bắc Cực",
    summary:
      "Các nhà khoa học phối hợp phân tích dữ liệu khí hậu và hệ sinh thái vùng lạnh.",
    category: "science",
    time: "3 ngày trước",
  },
  {
    id: 25,
    title: "Đề xuất tiêu chuẩn dữ liệu chung cho nghiên cứu song phương",
    summary:
      "Khung dữ liệu mới hướng tới chia sẻ an toàn và tăng khả năng tái sử dụng kết quả nghiên cứu.",
    category: "science",
    time: "4 ngày trước",
  },
  {
    id: 26,
    title:
      "Mạng lưới phòng thí nghiệm mở rộng chương trình dùng chung thiết bị",
    summary:
      "Các tổ chức nghiên cứu tăng cường chia sẻ hạ tầng khoa học có giá trị cao.",
    category: "cooperation",
    time: "5 ngày trước",
  },
  {
    id: 27,
    title: "AI hỗ trợ phát hiện sớm rủi ro trong chuỗi cung ứng",
    summary:
      "Mô hình dự báo mới được thử nghiệm trên dữ liệu logistics xuyên biên giới.",
    category: "science",
    time: "6 ngày trước",
  },
  {
    id: 28,
    title: "Trao đổi giảng viên mở rộng sang các ngành công nghệ nền tảng",
    summary:
      "Các trường tăng số lượng chương trình giảng dạy và nghiên cứu ngắn hạn.",
    category: "education",
    time: "7 ngày trước",
  },
];

const ui = {
  vi: {
    home: "Trang chủ",
    about: "Giới thiệu",
    login: "Đăng nhập",
    news: "Tin tức",
    related: "Tin liên quan",
    popular: "Tin đọc nhiều",
    share: "Chia sẻ",
    tags: "Từ khóa",
  },
  en: {
    home: "Home",
    about: "About",
    login: "Sign in",
    news: "News",
    related: "Related news",
    popular: "Most read",
    share: "Share",
    tags: "Tags",
  },
  ru: {
    home: "Главная",
    about: "О сети",
    login: "Войти",
    news: "Новости",
    related: "Похожие материалы",
    popular: "Популярное",
    share: "Поделиться",
    tags: "Теги",
  },
} as const;

function ArticleVisual({ category }: { category: Category }) {
  const initials: Record<Category, string> = {
    science: "KHOA HỌC · CÔNG NGHỆ",
    society: "KINH TẾ · XÃ HỘI",
    education: "GIÁO DỤC ĐÀO TẠO",
    cooperation: "HỢP TÁC",
  };

  return (
    <div className="relative grid min-h-[360px] place-items-center overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_35%,#2874d8_0%,#0b4a9d_35%,#062b65_75%,#041d47_100%)] text-white sm:min-h-[440px]">
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute left-[8%] top-[18%] h-28 w-44 rounded-lg bg-red-600/75 shadow-2xl">
        <span className="grid h-full place-items-center text-4xl">★</span>
      </div>
      <div className="absolute right-[8%] top-[18%] h-28 w-44 overflow-hidden rounded-lg shadow-2xl">
        <div className="h-1/3 bg-white" />
        <div className="h-1/3 bg-blue-600" />
        <div className="h-1/3 bg-red-600" />
      </div>
      <div className="absolute left-1/2 top-[42%] size-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/50 shadow-[0_0_70px_rgba(56,189,248,.38)]" />
      <div className="absolute left-1/2 top-[42%] h-36 w-52 -translate-x-1/2 -translate-y-1/2 rotate-12 rounded-[50%] border border-cyan-100/60" />
      <div className="absolute left-1/2 top-[42%] h-36 w-52 -translate-x-1/2 -translate-y-1/2 -rotate-12 rounded-[50%] border border-cyan-100/60" />
      <div className="relative z-10 mt-40 rounded-full border border-white/20 bg-slate-950/35 px-5 py-2 text-xs font-black uppercase tracking-[0.18em] backdrop-blur-sm">
        {initials[category]}
      </div>
    </div>
  );
}

function Thumb({ category }: { category: Category }) {
  return (
    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-[linear-gradient(135deg,#0d4da1,#3f80cf_55%,#133f7d)]">
      <div className="absolute -right-6 -top-6 size-16 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -left-4 size-20 rounded-full bg-white/10" />
      <span className="absolute inset-0 grid place-items-center text-[10px] font-black uppercase text-white/80">
        {categoryLabels[category].split(" ")[0]}
      </span>
    </div>
  );
}

function ShareButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="grid size-9 place-items-center rounded-full border border-blue-100 bg-blue-50 text-xs font-black text-blue-600 transition hover:border-blue-300 hover:bg-blue-100"
    >
      {label}
    </button>
  );
}

export function GuestNewsArticleV2({ articleId }: { articleId: number }) {
  const router = useRouter();
  const { locale } = useLocale();
  const t = ui[locale] ?? ui.vi;
  const filters = filterCopy[locale] ?? filterCopy.vi;
  const [filterQuery, setFilterQuery] = useState("");
  const article = articles.find((item) => item.id === articleId) ?? articles[0];
  const related = articles
    .filter(
      (item) =>
        item.id !== article.id &&
        (item.category === article.category || item.category === "cooperation"),
    )
    .slice(0, 4);
  const popular = articles.filter((item) => item.id !== article.id).slice(0, 5);
  const bottomRelated = articles
    .filter((item) => item.id !== article.id)
    .slice(5, 9);

  const openNews = (category: NewsCategory, query = filterQuery) => {
    router.push(newsFilterHref(category, query));
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <GuestPublicNav active="news" />

      <main className="mx-auto max-w-[1460px] px-4 py-9 sm:px-6 lg:px-8">
        <GuestNewsMasthead />

        <GuestNewsFilterNav
          activeCategory={article.category}
          categoryLabels={filters.categories}
          clearSearchLabel={filters.clear}
          query={filterQuery}
          searchPlaceholder={filters.search}
          onCategoryChange={openNews}
          onQueryChange={setFilterQuery}
          onSearchSubmit={(query) => openNews(article.category, query)}
          filterControl={
            <Link
              href={`${newsFilterHref(article.category)}#news-filters`}
              title={filters.open}
              aria-label={filters.open}
              className="grid size-11 shrink-0 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                <path
                  d="M4 7h3M11 7h9M4 17h9M17 17h3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <circle
                  cx="9"
                  cy="7"
                  r="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <circle
                  cx="15"
                  cy="17"
                  r="2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </Link>
          }
        />

        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
          <Link href="/" className="hover:text-blue-600">
            {t.home}
          </Link>
          <span>›</span>
          <Link href="/news" className="hover:text-blue-600">
            {t.news}
          </Link>
          <span>›</span>
          <span className="text-blue-600">
            {categoryLabels[article.category]}
          </span>
        </div>

        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_340px]">
          <article className="min-w-0">
            <header>
              <h2 className="max-w-5xl text-3xl font-black leading-[1.15] tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-[46px]">
                {article.title}
              </h2>
              <p className="mt-5 max-w-4xl text-base leading-7 text-slate-600 sm:text-lg">
                {article.summary}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-y border-blue-100 py-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span>26/08/2026</span>
                  <span>•</span>
                  <span>Mạng lưới tri thức Nga - Việt</span>
                  <span>•</span>
                  <span>{1_200 + article.id * 17} lượt xem</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="mr-1 text-sm text-slate-500">
                    {t.share}:
                  </span>
                  <ShareButton label="f" />
                  <ShareButton label="Z" />
                  <ShareButton label="↗" />
                </div>
              </div>
            </header>

            <div className="mt-7">
              <ArticleVisual category={article.category} />
            </div>

            <div className="mt-8 space-y-6 text-[17px] leading-8 text-slate-800">
              <p>
                Trong khuôn khổ các chương trình hợp tác khoa học và công nghệ
                giữa Việt Nam và Liên bang Nga, các cơ quan, viện nghiên cứu và
                trường đại học hai nước tiếp tục mở rộng trao đổi chuyên gia,
                chia sẻ dữ liệu và phối hợp triển khai những dự án có tính ứng
                dụng cao.
              </p>
              <p>
                {article.summary} Các bên đánh giá đây là một trong những hướng
                hợp tác có tiềm năng tạo ra giá trị dài hạn, đồng thời góp phần
                hình thành mạng lưới nghiên cứu liên ngành và nâng cao năng lực
                đổi mới sáng tạo.
              </p>

              <h3 className="pt-2 text-2xl font-black tracking-[-0.02em] text-slate-950">
                Tăng cường hợp tác nghiên cứu và chuyển giao công nghệ
              </h3>
              <p>
                Hai bên thống nhất ưu tiên các chương trình nghiên cứu chung,
                phát triển công nghệ mới và chuyển giao kết quả từ phòng thí
                nghiệm vào thực tiễn. Các nhóm chuyên môn sẽ tập trung vào những
                lĩnh vực có thế mạnh bổ trợ như trí tuệ nhân tạo, vật liệu mới,
                năng lượng sạch, công nghệ sinh học, tự động hóa và dữ liệu khoa
                học.
              </p>

              <blockquote className="rounded-2xl border border-blue-200 bg-blue-50/60 px-6 py-5 text-[17px] italic leading-8 text-blue-950">
                “Việt Nam và Nga có nhiều tiềm năng hợp tác khoa học - công
                nghệ, cùng hướng tới mục tiêu phát triển bền vững và thịnh vượng
                chung.”
                <footer className="mt-2 text-right text-sm not-italic text-slate-600">
                  — Đại diện chương trình hợp tác khoa học Việt - Nga
                </footer>
              </blockquote>

              <h3 className="pt-2 text-2xl font-black tracking-[-0.02em] text-slate-950">
                Mở rộng giao lưu học thuật và đổi mới sáng tạo
              </h3>
              <p>
                Các chương trình trao đổi học giả, hội thảo quốc tế và dự án
                nghiên cứu chung sẽ tiếp tục được mở rộng. Việc kết nối các nhóm
                nghiên cứu trẻ và doanh nghiệp công nghệ được xem là nền tảng
                quan trọng để thúc đẩy hệ sinh thái đổi mới sáng tạo hai nước.
              </p>

              <h3 className="pt-2 text-2xl font-black tracking-[-0.02em] text-slate-950">
                Hướng tới quan hệ hợp tác chiến lược lâu dài
              </h3>
              <p>
                Những kết quả đạt được sẽ được cụ thể hóa bằng các chương trình
                hợp tác dài hạn, ưu tiên hiệu quả ứng dụng, đào tạo nguồn nhân
                lực chất lượng cao và tăng cường khả năng tiếp cận hạ tầng
                nghiên cứu hiện đại.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-blue-100 pt-6">
              <span className="mr-2 text-sm font-black text-slate-700">
                {t.tags}:
              </span>
              {[
                "Việt Nam - Nga",
                categoryLabels[article.category],
                "hợp tác khoa học",
                "đổi mới sáng tạo",
                "công nghệ cao",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_6px_22px_rgba(37,99,235,.05)]">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-black uppercase text-blue-600">
                  {t.related}
                </h2>
                <Link href="/news" className="text-xs font-black text-blue-600">
                  Xem tất cả →
                </Link>
              </div>
              <div className="grid gap-4">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="flex gap-3 border-b border-blue-50 pb-4 last:border-0 last:pb-0"
                    >
                      <Thumb category={item.category} />
                      <div className="min-w-0">
                        <h3 className="text-base font-extrabold leading-6 text-slate-900">
                          {item.title}
                        </h3>
                      </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_6px_22px_rgba(37,99,235,.05)]">
              <h2 className="mb-4 text-lg font-black uppercase text-blue-600">
                {t.popular}
              </h2>
              <div className="divide-y divide-blue-100">
                {popular.map((item) => (
                  <Link
                    key={item.id}
                    href={`/news/${item.id}`}
                    className="group block py-4 first:pt-0 last:pb-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    <span className="block text-base font-bold leading-6 text-slate-800 transition-colors group-hover:text-blue-700">
                      {item.title}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-12 border-t border-blue-100 pt-8">
          <div className="mb-5 flex items-center gap-4">
            <h2 className="shrink-0 text-xl font-black uppercase text-blue-600">
              {t.related}
            </h2>
            <div className="h-px flex-1 bg-blue-100" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {bottomRelated.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_5px_18px_rgba(37,99,235,.05)] transition hover:-translate-y-1 hover:border-blue-200"
              >
                <div className="h-36 bg-[linear-gradient(135deg,#104a9c,#3c7acb_55%,#143d76)]" />
                <div className="p-4">
                  <h3 className="text-base font-extrabold leading-6">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <GuestPublicFooter copy={HOME_COPY[locale]} />
    </div>
  );
}

"use client";

import Link from "next/link";
import { BrandMark } from "@/components/shared/BrandMark";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useLocale } from "@/core/i18n/locale";

type Category =
  | "science"
  | "international"
  | "innovation"
  | "education"
  | "society"
  | "health"
  | "space";

type ArticleRecord = {
  id: number;
  title: string;
  summary: string;
  category: Category;
  time: string;
};

const categoryLabels: Record<Category, string> = {
  science: "Khoa học - Công nghệ",
  international: "Hợp tác quốc tế",
  innovation: "Đổi mới sáng tạo",
  education: "Giáo dục - Nhân lực",
  society: "Kinh tế - Xã hội",
  health: "Y sinh - Sức khỏe",
  space: "Không gian - Vũ trụ",
};

const articles: ArticleRecord[] = [
  { id: 1, title: "Nga thử nghiệm thế hệ vật liệu mới cho công nghệ lượng tử", summary: "Nghiên cứu mở ra khả năng ứng dụng trong các hệ thống tính toán thế hệ mới.", category: "science", time: "10:32" },
  { id: 2, title: "Diễn đàn Khoa học và Công nghệ Việt - Nga 2025 tại Hà Nội", summary: "Sự kiện thu hút hơn 500 đại biểu từ hai nước tham dự và trao đổi hợp tác.", category: "international", time: "10:20" },
  { id: 3, title: "Startup Việt và Nga tìm cơ hội hợp tác trong lĩnh vực AI", summary: "Nhiều startup hai nước giới thiệu sản phẩm và tìm kiếm đối tác chiến lược.", category: "innovation", time: "10:05" },
  { id: 4, title: "Sinh viên Việt Nam đạt giải cao tại Olympic Tin học quốc tế", summary: "Đội tuyển Việt Nam giành thành tích nổi bật tại kỳ thi năm nay.", category: "education", time: "09:50" },
  { id: 5, title: "Hợp tác nghiên cứu vaccine thế hệ mới phòng bệnh truyền nhiễm", summary: "Các viện nghiên cứu hai nước ký kết thỏa thuận hợp tác dài hạn.", category: "health", time: "09:45" },
  { id: 6, title: "Thúc đẩy thương mại song phương Việt Nam - Liên bang Nga", summary: "Kim ngạch thương mại những tháng đầu năm tăng trưởng tích cực.", category: "society", time: "09:30" },
  { id: 7, title: "Nga phóng vệ tinh viễn thám mới hỗ trợ nghiên cứu Trái Đất", summary: "Vệ tinh có độ phân giải cao, phục vụ quan sát môi trường và khí hậu.", category: "space", time: "09:15" },
  { id: 8, title: "Robotics tự hành: Xu hướng phát triển trong công nghiệp 4.0", summary: "Các chuyên gia dự báo thị trường robot tăng trưởng mạnh trong giai đoạn mới.", category: "science", time: "09:05" },
  { id: 9, title: "Việt Nam và Nga mở rộng hợp tác trong lĩnh vực năng lượng", summary: "Tập trung vào năng lượng hạt nhân dân sự và năng lượng tái tạo.", category: "international", time: "08:50" },
  { id: 10, title: "Ứng dụng blockchain trong quản lý chuỗi cung ứng nông sản", summary: "Giải pháp giúp minh bạch hóa quy trình và nâng cao giá trị xuất khẩu.", category: "innovation", time: "08:40" },
  { id: 11, title: "Hội thảo về chuyển đổi số trong giáo dục đại học", summary: "Các chuyên gia chia sẻ giải pháp nâng cao chất lượng đào tạo trong kỷ nguyên số.", category: "education", time: "08:30" },
  { id: 12, title: "Công nghệ pin sodium-ion: Giải pháp thay thế lithium-ion", summary: "Nghiên cứu mới giúp giảm chi phí và tăng độ an toàn cho người dùng.", category: "science", time: "08:20" },
  { id: 13, title: "Việt Nam thu hút FDI vào lĩnh vực công nghệ cao", summary: "Nhiều tập đoàn quốc tế mở rộng đầu tư vào các khu công nghệ.", category: "society", time: "08:10" },
  { id: 14, title: "Nga hỗ trợ Việt Nam đào tạo nguồn nhân lực chất lượng cao", summary: "Hơn 200 học viên tham gia các khóa học ngắn hạn trao đổi chuyên môn.", category: "international", time: "08:00" },
  { id: 15, title: "Mô hình AI mới tăng tốc phân tích dữ liệu khoa học", summary: "Hệ thống hỗ trợ các nhóm nghiên cứu xử lý tập dữ liệu lớn hiệu quả hơn.", category: "innovation", time: "07:45" },
  { id: 16, title: "Nghiên cứu liệu pháp gen trong điều trị bệnh hiếm", summary: "Nhóm nghiên cứu đạt bước tiến mới trong phát triển phương pháp điều trị cá thể hóa.", category: "health", time: "07:30" },
  { id: 17, title: "Vệ tinh Việt - Nga hợp tác quan sát biến đổi khí hậu", summary: "Dự án sử dụng dữ liệu viễn thám để theo dõi các vùng nhạy cảm khí hậu.", category: "space", time: "07:15" },
  { id: 18, title: "Doanh nghiệp công nghệ hai nước tăng cường kết nối thị trường", summary: "Nhiều phiên kết nối tập trung vào phần mềm, tự động hóa và an ninh mạng.", category: "international", time: "07:00" },
  { id: 19, title: "Đại học hai nước xây dựng chương trình đào tạo song bằng", summary: "Chương trình hướng tới các lĩnh vực kỹ thuật, khoa học dữ liệu và công nghệ mới.", category: "education", time: "06:45" },
  { id: 20, title: "Năng lượng xanh trở thành trọng tâm hợp tác mới", summary: "Hydrogen và điện gió ngoài khơi được đánh giá là các lĩnh vực nhiều tiềm năng.", category: "society", time: "06:30" },
  { id: 21, title: "Trung tâm nghiên cứu vật liệu tiên tiến mở rộng mạng lưới đối tác", summary: "Các nhóm nghiên cứu tăng cường dùng chung phòng thí nghiệm và dữ liệu.", category: "science", time: "Hôm qua" },
  { id: 22, title: "Nền tảng kết nối nhà khoa học trẻ Việt - Nga chính thức vận hành", summary: "Nền tảng hỗ trợ tìm kiếm chuyên gia, chủ đề và cơ hội cộng tác nghiên cứu.", category: "innovation", time: "Hôm qua" },
  { id: 23, title: "Học bổng nghiên cứu mới dành cho sinh viên ngành công nghệ", summary: "Chương trình ưu tiên AI, tự động hóa, vật liệu mới và công nghệ sinh học.", category: "education", time: "2 ngày trước" },
  { id: 24, title: "Chương trình nghiên cứu chung về môi trường và Bắc Cực", summary: "Các nhà khoa học phối hợp phân tích dữ liệu khí hậu và hệ sinh thái vùng lạnh.", category: "space", time: "3 ngày trước" },
  { id: 25, title: "Đề xuất tiêu chuẩn dữ liệu chung cho nghiên cứu song phương", summary: "Khung dữ liệu mới hướng tới chia sẻ an toàn và tăng khả năng tái sử dụng kết quả nghiên cứu.", category: "science", time: "4 ngày trước" },
  { id: 26, title: "Mạng lưới phòng thí nghiệm mở rộng chương trình dùng chung thiết bị", summary: "Các tổ chức nghiên cứu tăng cường chia sẻ hạ tầng khoa học có giá trị cao.", category: "international", time: "5 ngày trước" },
  { id: 27, title: "AI hỗ trợ phát hiện sớm rủi ro trong chuỗi cung ứng", summary: "Mô hình dự báo mới được thử nghiệm trên dữ liệu logistics xuyên biên giới.", category: "innovation", time: "6 ngày trước" },
  { id: 28, title: "Trao đổi giảng viên mở rộng sang các ngành công nghệ nền tảng", summary: "Các trường tăng số lượng chương trình giảng dạy và nghiên cứu ngắn hạn.", category: "education", time: "7 ngày trước" },
];

const ui = {
  vi: { home: "Trang chủ", about: "Giới thiệu", login: "Đăng nhập", news: "Tin tức", related: "Tin liên quan", popular: "Tin đọc nhiều", share: "Chia sẻ", tags: "Từ khóa" },
  en: { home: "Home", about: "About", login: "Sign in", news: "News", related: "Related news", popular: "Most read", share: "Share", tags: "Tags" },
  ru: { home: "Главная", about: "О сети", login: "Войти", news: "Новости", related: "Похожие материалы", popular: "Популярное", share: "Поделиться", tags: "Теги" },
} as const;

function ArticleVisual({ category }: { category: Category }) {
  const initials: Record<Category, string> = {
    science: "KHOA HỌC · CÔNG NGHỆ",
    international: "VIỆT NAM · LIÊN BANG NGA",
    innovation: "ĐỔI MỚI SÁNG TẠO",
    education: "GIÁO DỤC · NHÂN LỰC",
    society: "KINH TẾ · XÃ HỘI",
    health: "Y SINH · SỨC KHỎE",
    space: "KHÔNG GIAN · VŨ TRỤ",
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
    <button type="button" className="grid size-9 place-items-center rounded-full border border-blue-100 bg-blue-50 text-xs font-black text-blue-600 transition hover:border-blue-300 hover:bg-blue-100">
      {label}
    </button>
  );
}

export function GuestNewsArticleV2({ articleId }: { articleId: number }) {
  const { locale } = useLocale();
  const t = ui[locale] ?? ui.vi;
  const article = articles.find((item) => item.id === articleId) ?? articles[0];
  const related = articles.filter((item) => item.id !== article.id && (item.category === article.category || item.category === "international")).slice(0, 4);
  const popular = articles.filter((item) => item.id !== article.id).slice(0, 5);
  const bottomRelated = articles.filter((item) => item.id !== article.id).slice(5, 9);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[74px] max-w-[1460px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex min-w-0 items-center gap-3.5">
            <BrandMark className="size-[52px] shrink-0 shadow-xs" />
            <strong className="hidden truncate text-base lg:text-lg font-black tracking-tight text-slate-950 sm:block">Mạng lưới tri thức Nga - Việt</strong>
          </Link>

          <nav className="hidden items-center gap-8 xl:flex">
            <Link href="/" className="text-sm font-extrabold uppercase text-slate-700 hover:text-blue-700">{t.home}</Link>
            <Link href="/#about" className="text-sm font-extrabold uppercase text-slate-700 hover:text-blue-700">{t.about}</Link>
            <Link href="/news" className="relative py-6 text-sm font-extrabold uppercase text-blue-700">{t.news}<span className="absolute inset-x-0 bottom-4 h-0.5 rounded-full bg-blue-600" /></Link>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher variant="light" />
            <Link href="/login" className="inline-flex h-10 items-center rounded-xl bg-blue-600 px-4 text-sm font-bold text-white transition hover:bg-blue-700">{t.login}</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1460px] px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-7 flex flex-col gap-5 border-b border-blue-100 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-[-0.02em] text-blue-600">{t.news}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">Cập nhật những thông tin mới nhất về khoa học, công nghệ, hợp tác quốc tế và các lĩnh vực trọng điểm giữa Việt Nam và Nga.</p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600">
            <span><strong className="mr-2 text-lg text-blue-600">06</strong>Chuyên mục</span>
            <span><strong className="mr-2 text-lg text-blue-600">24/7</strong>Cập nhật</span>
            <span><strong className="mr-2 text-lg text-blue-600">VN · RU</strong>Song phương</span>
          </div>
        </section>

        <nav className="mb-7 flex flex-wrap items-center gap-2 rounded-2xl border border-blue-100 bg-slate-50 p-3">
          <Link href="/news" className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white">Tất cả</Link>
          {(["science", "international", "innovation", "education", "society"] as Category[]).map((category) => (
            <Link key={category} href="/news" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:border-blue-200 hover:text-blue-700">{categoryLabels[category]}</Link>
          ))}
        </nav>

        <div className="mb-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/" className="hover:text-blue-600">{t.home}</Link><span>›</span>
          <Link href="/news" className="hover:text-blue-600">{t.news}</Link><span>›</span>
          <span className="text-blue-600">{categoryLabels[article.category]}</span>
        </div>

        <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_340px]">
          <article className="min-w-0">
            <header>
              <h2 className="max-w-5xl text-3xl font-black leading-[1.15] tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-[46px]">{article.title}</h2>
              <p className="mt-5 max-w-4xl text-base leading-7 text-slate-600 sm:text-lg">{article.summary}</p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-y border-blue-100 py-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span>26/08/2026</span>
                  <span>•</span>
                  <span>Mạng lưới tri thức Nga - Việt</span>
                  <span>•</span>
                  <span>{1_200 + article.id * 17} lượt xem</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="mr-1 text-sm text-slate-500">{t.share}:</span>
                  <ShareButton label="f" />
                  <ShareButton label="Z" />
                  <ShareButton label="↗" />
                </div>
              </div>
            </header>

            <div className="mt-7"><ArticleVisual category={article.category} /></div>

            <div className="mt-8 space-y-6 text-[17px] leading-8 text-slate-800">
              <p>Trong khuôn khổ các chương trình hợp tác khoa học và công nghệ giữa Việt Nam và Liên bang Nga, các cơ quan, viện nghiên cứu và trường đại học hai nước tiếp tục mở rộng trao đổi chuyên gia, chia sẻ dữ liệu và phối hợp triển khai những dự án có tính ứng dụng cao.</p>
              <p>{article.summary} Các bên đánh giá đây là một trong những hướng hợp tác có tiềm năng tạo ra giá trị dài hạn, đồng thời góp phần hình thành mạng lưới nghiên cứu liên ngành và nâng cao năng lực đổi mới sáng tạo.</p>

              <h3 className="pt-2 text-2xl font-black tracking-[-0.02em] text-slate-950">Tăng cường hợp tác nghiên cứu và chuyển giao công nghệ</h3>
              <p>Hai bên thống nhất ưu tiên các chương trình nghiên cứu chung, phát triển công nghệ mới và chuyển giao kết quả từ phòng thí nghiệm vào thực tiễn. Các nhóm chuyên môn sẽ tập trung vào những lĩnh vực có thế mạnh bổ trợ như trí tuệ nhân tạo, vật liệu mới, năng lượng sạch, công nghệ sinh học, tự động hóa và dữ liệu khoa học.</p>

              <blockquote className="rounded-2xl border border-blue-200 bg-blue-50/60 px-6 py-5 text-[17px] italic leading-8 text-blue-950">“Việt Nam và Nga có nhiều tiềm năng hợp tác khoa học - công nghệ, cùng hướng tới mục tiêu phát triển bền vững và thịnh vượng chung.”<footer className="mt-2 text-right text-sm not-italic text-slate-600">— Đại diện chương trình hợp tác khoa học Việt - Nga</footer></blockquote>

              <h3 className="pt-2 text-2xl font-black tracking-[-0.02em] text-slate-950">Mở rộng giao lưu học thuật và đổi mới sáng tạo</h3>
              <p>Các chương trình trao đổi học giả, hội thảo quốc tế và dự án nghiên cứu chung sẽ tiếp tục được mở rộng. Việc kết nối các nhóm nghiên cứu trẻ và doanh nghiệp công nghệ được xem là nền tảng quan trọng để thúc đẩy hệ sinh thái đổi mới sáng tạo hai nước.</p>

              <h3 className="pt-2 text-2xl font-black tracking-[-0.02em] text-slate-950">Hướng tới quan hệ hợp tác chiến lược lâu dài</h3>
              <p>Những kết quả đạt được sẽ được cụ thể hóa bằng các chương trình hợp tác dài hạn, ưu tiên hiệu quả ứng dụng, đào tạo nguồn nhân lực chất lượng cao và tăng cường khả năng tiếp cận hạ tầng nghiên cứu hiện đại.</p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-blue-100 pt-6">
              <span className="mr-2 text-sm font-black text-slate-700">{t.tags}:</span>
              {["Việt Nam - Nga", categoryLabels[article.category], "hợp tác khoa học", "đổi mới sáng tạo", "công nghệ cao"].map((tag) => (
                <span key={tag} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">{tag}</span>
              ))}
            </div>
          </article>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_6px_22px_rgba(37,99,235,.05)]">
              <div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-lg font-black uppercase text-blue-600">{t.related}</h2><Link href="/news" className="text-xs font-black text-blue-600">Xem tất cả →</Link></div>
              <div className="grid gap-4">
                {related.map((item) => (
                  <Link key={item.id} href={`/news/${item.id}`} className="flex gap-3 border-b border-blue-50 pb-4 last:border-0 last:pb-0">
                    <Thumb category={item.category} />
                    <div className="min-w-0"><h3 className="text-sm font-extrabold leading-5 text-slate-900">{item.title}</h3><p className="mt-2 text-[11px] font-black uppercase text-blue-600">{categoryLabels[item.category]}</p></div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-[0_6px_22px_rgba(37,99,235,.05)]">
              <h2 className="mb-4 text-lg font-black uppercase text-blue-600">{t.popular}</h2>
              <div className="grid gap-3">
                {popular.map((item, index) => (
                  <Link key={item.id} href={`/news/${item.id}`} className="flex gap-3 rounded-xl border border-blue-50 p-3 transition hover:border-blue-200 hover:bg-blue-50/40"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-blue-600 text-xs font-black text-white">{index + 1}</span><span className="text-sm font-bold leading-5 text-slate-800">{item.title}</span></Link>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <section className="mt-12 border-t border-blue-100 pt-8">
          <div className="mb-5 flex items-center gap-4"><h2 className="shrink-0 text-xl font-black uppercase text-blue-600">{t.related}</h2><div className="h-px flex-1 bg-blue-100" /></div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {bottomRelated.map((item) => (
              <Link key={item.id} href={`/news/${item.id}`} className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-[0_5px_18px_rgba(37,99,235,.05)] transition hover:-translate-y-1 hover:border-blue-200">
                <div className="h-36 bg-[linear-gradient(135deg,#104a9c,#3c7acb_55%,#143d76)]" />
                <div className="p-4"><h3 className="text-base font-extrabold leading-6">{item.title}</h3><div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500"><span className="font-black uppercase text-blue-600">{categoryLabels[item.category]}</span><span>•</span><span>{item.time}</span></div></div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-12 border-t border-blue-100 bg-slate-50">
        <div className="mx-auto grid max-w-[1460px] gap-8 px-4 py-9 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
          <div><div className="flex items-center gap-3.5"><BrandMark className="size-14 shadow-xs" /><strong className="text-base font-black text-slate-900">Mạng lưới tri thức Nga - Việt</strong></div><p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">Kết nối tri thức - Hợp tác bền vững - Kiến tạo tương lai.</p></div>
          <div><h3 className="text-xs font-black uppercase text-blue-600">Liên kết nhanh</h3><div className="mt-4 grid gap-2 text-sm text-slate-600"><Link href="/">Trang chủ</Link><Link href="/#about">Giới thiệu</Link><Link href="/news">Tin tức</Link></div></div>
          <div><h3 className="text-xs font-black uppercase text-blue-600">Chuyên mục</h3><div className="mt-4 grid gap-2 text-sm text-slate-600"><span>Khoa học - Công nghệ</span><span>Hợp tác quốc tế</span><span>Đổi mới sáng tạo</span><span>Giáo dục - Nhân lực</span></div></div>
          <div><h3 className="text-xs font-black uppercase text-blue-600">Liên hệ</h3><div className="mt-4 grid gap-2 text-sm text-slate-600"><span>Hà Nội, Việt Nam</span><a href="mailto:info@rvstin.com">info@rvstin.com</a><span>+84 24 3791 1234</span></div></div>
        </div>
        <div className="border-t border-blue-100"><div className="mx-auto flex max-w-[1460px] flex-col gap-3 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><span>© 2026 Mạng lưới tri thức Nga - Việt. All rights reserved.</span><div className="flex gap-5"><span>Chính sách bảo mật</span><span>Điều khoản sử dụng</span></div></div></div>
      </footer>
    </div>
  );
}

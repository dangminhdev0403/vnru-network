"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/core/i18n/locale";
import { GuestPublicFooter } from "./GuestPublicFooter";
import { HOME_COPY } from "./GuestHomeV2";
import { GuestPublicNav } from "./GuestPublicNav";

type Category =
  | "all"
  | "science"
  | "international"
  | "innovation"
  | "education"
  | "society";
type FeedCategory = Exclude<Category, "all">;
type NewsItem = {
  title: string;
  summary: string;
  category: FeedCategory;
  time: string;
  image: string;
};

const TEXT = {
  vi: {
    brand: "Mạng lưới tri thức Nga - Việt",
    home: "Trang chủ",
    about: "Giới thiệu",
    explore: "Khám phá",
    login: "Đăng nhập",
    news: "Tin tức",
    lead: "Theo dõi những chuyển động mới nhất về khoa học, công nghệ, đổi mới sáng tạo và hợp tác tri thức Nga - Việt.",
    live: "Cập nhật liên tục",
    latest: "Tin mới nhất",
    featured: "Tin tức nổi bật",
    stream: "Dòng tin liên tục",
    streamLead: "Cập nhật liên tục những tin tức mới nhất từ các chuyên mục",
    search: "Tìm kiếm tin tức...",
    viewAll: "Xem tất cả",
    spotlight: "Tiêu điểm",
    allCategories: "Tất cả chuyên mục",
    newest: "Mới nhất",
    top: "Lên đầu",
    noResults: "Không tìm thấy bài viết phù hợp.",
    scrollMore: "Cuộn xuống để tải thêm",
    loadingMore: "Đang tải thêm tin...",
    showing: "Hiển thị",
    articles: "tin",
    categories: {
      all: "Tất cả",
      science: "Khoa học - Công nghệ",
      international: "Hợp tác quốc tế",
      innovation: "Đổi mới sáng tạo",
      education: "Giáo dục - Nhân lực",
      society: "Kinh tế - Xã hội",
    },
  },
  en: {
    brand: "Mạng lưới tri thức Nga - Việt",
    home: "Home",
    about: "About",
    explore: "Explore",
    login: "Sign in",
    news: "News",
    lead: "Follow the latest developments in science, technology, innovation and Vietnam - Russia knowledge cooperation.",
    live: "Continuous updates",
    latest: "Latest news",
    featured: "Featured news",
    stream: "Continuous news",
    streamLead: "Continuously updated news from the network's key categories",
    search: "Search news...",
    viewAll: "View all",
    spotlight: "Spotlight",
    allCategories: "All categories",
    newest: "Newest",
    top: "Top",
    noResults: "No matching articles found.",
    scrollMore: "Scroll to load more",
    loadingMore: "Loading more news...",
    showing: "Showing",
    articles: "articles",
    categories: {
      all: "All",
      science: "Science - Technology",
      international: "International cooperation",
      innovation: "Innovation",
      education: "Education - Talent",
      society: "Economy - Society",
    },
  },
  ru: {
    brand: "Mạng lưới tri thức Nga - Việt",
    home: "Главная",
    about: "О сети",
    explore: "Обзор",
    login: "Войти",
    news: "Новости",
    lead: "Следите за последними новостями науки, технологий, инноваций и российско-вьетнамского сотрудничества.",
    live: "Постоянное обновление",
    latest: "Последние новости",
    featured: "Главные материалы",
    stream: "Лента новостей",
    streamLead: "Постоянно обновляемые новости по основным направлениям сети",
    search: "Поиск новостей...",
    viewAll: "Все материалы",
    spotlight: "Главное",
    allCategories: "Все категории",
    newest: "Сначала новые",
    top: "Наверх",
    noResults: "Подходящие материалы не найдены.",
    scrollMore: "Прокрутите, чтобы загрузить ещё",
    loadingMore: "Загружаем ещё...",
    showing: "Показано",
    articles: "материалов",
    categories: {
      all: "Все",
      science: "Наука - Технологии",
      international: "Международное сотрудничество",
      innovation: "Инновации",
      education: "Образование - Кадры",
      society: "Экономика - Общество",
    },
  },
} as const;

const ITEMS: Record<FeedCategory, NewsItem[]> = {
  science: [
    {
      title: "Nga phát triển chip lượng tử thế hệ mới mạnh gấp 100 lần",
      summary:
        "Công nghệ mới mở rộng khả năng xử lý trong các hệ thống tính toán hiệu năng cao.",
      category: "science",
      time: "3 giờ trước",
      image: "https://picsum.photos/seed/sci1/800/500",
    },
    {
      title: "Các nhà khoa học Việt Nam giải mã thành công gen lúa chịu hạn",
      summary:
        "Kết quả nghiên cứu góp phần tạo giống cây trồng thích ứng tốt hơn với biến đổi khí hậu.",
      category: "science",
      time: "5 giờ trước",
      image: "https://picsum.photos/seed/sci2/800/500",
    },
    {
      title:
        "Nga phóng vệ tinh viễn thám mới hỗ trợ nghiên cứu khí hậu Trái Đất",
      summary:
        "Dữ liệu vệ tinh phục vụ giám sát môi trường và nghiên cứu khí hậu.",
      category: "science",
      time: "1 ngày trước",
      image: "https://picsum.photos/seed/sci3/800/500",
    },
    {
      title: "Nghiên cứu chung về vật liệu mới cho năng lượng sạch",
      summary:
        "Các nhóm nghiên cứu hai nước phát triển vật liệu tiên tiến cho pin thế hệ mới.",
      category: "science",
      time: "4 giờ trước",
      image: "https://picsum.photos/seed/sci4/800/500",
    },
  ],
  international: [
    {
      title: "Diễn đàn Khoa học và Công nghệ Việt - Nga 2025 tại Hà Nội",
      summary:
        "Các chuyên gia hai nước trao đổi về xu hướng và cơ hội hợp tác công nghệ cao.",
      category: "international",
      time: "1 ngày trước",
      image: "https://picsum.photos/seed/intl1/800/500",
    },
    {
      title:
        "Việt Nam và Nga ký kết 5 thỏa thuận hợp tác trong lĩnh vực công nghệ cao",
      summary:
        "Các thỏa thuận tập trung vào nghiên cứu chung, đào tạo và chuyển giao công nghệ.",
      category: "international",
      time: "2 giờ trước",
      image: "https://picsum.photos/seed/intl2/800/500",
    },
    {
      title:
        "Tăng cường kết nối doanh nghiệp Việt - Nga trong lĩnh vực công nghệ",
      summary: "Các hoạt động kết nối tiếp tục được mở rộng giữa hai nước.",
      category: "international",
      time: "8 giờ trước",
      image: "https://picsum.photos/seed/intl3/800/500",
    },
    {
      title:
        "Mạng lưới đối tác nghiên cứu song phương được mở rộng trong năm 2026",
      summary:
        "Viện nghiên cứu và trường đại học tăng cường kết nối chuyên môn.",
      category: "international",
      time: "1 ngày trước",
      image: "https://picsum.photos/seed/intl4/800/500",
    },
  ],
  innovation: [
    {
      title: "AI giúp mô phỏng vật liệu mới chính xác hơn gấp 10 lần",
      summary: "Mô hình mới rút ngắn thời gian thử nghiệm vật liệu tiên tiến.",
      category: "innovation",
      time: "2 ngày trước",
      image: "https://picsum.photos/seed/inno1/800/500",
    },
    {
      title: "Trí tuệ nhân tạo: Cơ hội và thách thức trong kỷ nguyên mới",
      summary:
        "Các chuyên gia phân tích xu hướng AI và tác động đến nghiên cứu, giáo dục và sản xuất.",
      category: "innovation",
      time: "7 giờ trước",
      image: "https://picsum.photos/seed/inno2/800/500",
    },
    {
      title: "Startup Việt góp mặt tại triển lãm công nghệ quốc tế ở Nga",
      summary: "Các dự án giới thiệu giải pháp AI, dữ liệu lớn và tự động hóa.",
      category: "innovation",
      time: "9 giờ trước",
      image: "https://picsum.photos/seed/inno3/800/500",
    },
    {
      title:
        "Mô hình chuyển giao công nghệ từ phòng thí nghiệm tới doanh nghiệp tăng tốc",
      summary:
        "Các trung tâm đổi mới rút ngắn khoảng cách từ nghiên cứu tới ứng dụng.",
      category: "innovation",
      time: "2 ngày trước",
      image: "https://picsum.photos/seed/inno4/800/500",
    },
  ],
  education: [
    {
      title: "Chương trình học bổng toàn phần cho sinh viên Việt Nam tại Nga",
      summary:
        "Nhiều cơ hội học tập dành cho các ngành khoa học, công nghệ và kỹ thuật.",
      category: "education",
      time: "6 giờ trước",
      image: "https://picsum.photos/seed/edu1/800/500",
    },
    {
      title: "Bộ GD&ĐT Việt Nam và Nga ký kết chương trình đào tạo song bằng",
      summary:
        "Chương trình mở rộng cơ hội học tập và nghiên cứu cho sinh viên hai nước.",
      category: "education",
      time: "8 giờ trước",
      image: "https://picsum.photos/seed/edu2/800/500",
    },
    {
      title:
        "Mở rộng đào tạo nhân lực chất lượng cao trong các ngành công nghệ mũi nhọn",
      summary: "Hai bên thúc đẩy trao đổi giảng viên và nghiên cứu sinh.",
      category: "education",
      time: "10 giờ trước",
      image: "https://picsum.photos/seed/edu3/800/500",
    },
    {
      title:
        "Đại học hai nước hợp tác xây dựng giáo trình song ngữ về công nghệ",
      summary:
        "Giáo trình mới hỗ trợ trao đổi học thuật và đào tạo chuyên sâu.",
      category: "education",
      time: "2 ngày trước",
      image: "https://picsum.photos/seed/edu4/800/500",
    },
  ],
  society: [
    {
      title: "Việt Nam đẩy mạnh hợp tác năng lượng sạch với Nga",
      summary:
        "Hai bên hướng tới các dự án năng lượng tái tạo và công nghệ xanh.",
      category: "society",
      time: "7 giờ trước",
      image: "https://picsum.photos/seed/soc1/800/500",
    },
    {
      title:
        "Kinh tế số mở ra cơ hội hợp tác mới giữa các doanh nghiệp công nghệ",
      summary:
        "Doanh nghiệp tăng cường chia sẻ giải pháp số và kinh nghiệm triển khai.",
      category: "society",
      time: "5 giờ trước",
      image: "https://picsum.photos/seed/soc2/800/500",
    },
    {
      title:
        "Ứng dụng công nghệ xanh hỗ trợ phát triển bền vững tại nhiều địa phương",
      summary:
        "Các mô hình mới tập trung vào tiết kiệm năng lượng và giảm phát thải.",
      category: "society",
      time: "8 giờ trước",
      image: "https://picsum.photos/seed/soc3/800/500",
    },
    {
      title: "Chính sách mới thúc đẩy đổi mới sáng tạo trong khu vực công",
      summary: "Các cơ chế mới tạo điều kiện thử nghiệm giải pháp công nghệ.",
      category: "society",
      time: "1 ngày trước",
      image: "https://picsum.photos/seed/soc4/800/500",
    },
  ],
};

const LATEST = [
  ITEMS.science[0],
  ITEMS.international[1],
  ITEMS.education[0],
  ITEMS.innovation[1],
  ITEMS.society[0],
].slice(0, 5);

const FEATURED = [
  ITEMS.international[1],
  ITEMS.science[3],
  ITEMS.education[0],
  ITEMS.innovation[1],
];

const STREAM: NewsItem[] = [
  {
    title: "Nga thử nghiệm thế hệ vật liệu mới cho công nghệ lượng tử",
    summary:
      "Nghiên cứu mở ra khả năng ứng dụng trong các hệ thống tính toán thế hệ mới.",
    category: "science",
    time: "10:32",
    image: "https://picsum.photos/seed/str1/800/500",
  },
  {
    title: "Vệ tinh Việt Nam - Nga quan sát Trái Đất thành công",
    summary: "Dữ liệu hỗ trợ giám sát môi trường và phòng chống thiên tai.",
    category: "science",
    time: "10:10",
    image: "https://picsum.photos/seed/str2/800/500",
  },
  {
    title: "Hội thảo quốc tế về trí tuệ nhân tạo Việt - Nga diễn ra tại Hà Nội",
    summary:
      "Các chuyên gia hai nước trao đổi về xu hướng và cơ hội hợp tác trong lĩnh vực AI.",
    category: "international",
    time: "09:15",
    image: "https://picsum.photos/seed/str3/800/500",
  },
  {
    title:
      "Tăng cường kết nối doanh nghiệp Việt - Nga trong lĩnh vực công nghệ",
    summary:
      "Nhiều thỏa thuận hợp tác được ký kết tại các chương trình kết nối chuyên môn.",
    category: "international",
    time: "08:55",
    image: "https://picsum.photos/seed/str4/800/500",
  },
  {
    title: "Bộ GD&ĐT Việt Nam và Nga ký kết chương trình đào tạo song bằng",
    summary: "Mở ra cơ hội học tập và nghiên cứu cho sinh viên hai nước.",
    category: "education",
    time: "08:20",
    image: "https://picsum.photos/seed/str5/800/500",
  },
  {
    title: "Startup Việt góp mặt tại triển lãm công nghệ quốc tế ở Nga",
    summary:
      "Giới thiệu nhiều giải pháp sáng tạo trong lĩnh vực AI và dữ liệu lớn.",
    category: "innovation",
    time: "07:30",
    image: "https://picsum.photos/seed/str6/800/500",
  },
  {
    title: "Việt Nam đẩy mạnh hợp tác năng lượng sạch với Nga",
    summary:
      "Hai bên hướng tới các dự án năng lượng tái tạo và công nghệ xanh.",
    category: "society",
    time: "07:45",
    image: "https://picsum.photos/seed/str7/800/500",
  },
  {
    title: "Dự án năng lượng hạt nhân thế hệ mới tiếp tục được thúc đẩy",
    summary:
      "Hai nước khẳng định cam kết phát triển công nghệ năng lượng vì mục tiêu bền vững.",
    category: "science",
    time: "06:15",
    image: "https://picsum.photos/seed/str8/800/500",
  },
  {
    title: "Phòng thí nghiệm chung công bố bộ dữ liệu vật liệu mở",
    summary:
      "Bộ dữ liệu hỗ trợ các nhóm nghiên cứu rút ngắn thời gian sàng lọc vật liệu mới.",
    category: "science",
    time: "05:50",
    image: "https://picsum.photos/seed/str9/800/500",
  },
  {
    title: "Chương trình trao đổi chuyên gia trẻ mở đợt đăng ký mới",
    summary:
      "Ứng viên có thể đề xuất chủ đề nghiên cứu chung tại các cơ sở đối tác hai nước.",
    category: "education",
    time: "05:25",
    image: "https://picsum.photos/seed/str10/800/500",
  },
  {
    title: "Doanh nghiệp thử nghiệm nền tảng logistics số Việt - Nga",
    summary:
      "Giải pháp tập trung theo dõi hành trình và chuẩn hóa dữ liệu chuỗi cung ứng.",
    category: "society",
    time: "05:05",
    image: "https://picsum.photos/seed/str11/800/500",
  },
  {
    title: "Trung tâm đổi mới sáng tạo kết nối thêm mười nhóm nghiên cứu",
    summary:
      "Mạng lưới mới ưu tiên AI, robot, công nghệ sinh học và năng lượng sạch.",
    category: "innovation",
    time: "04:40",
    image: "https://picsum.photos/seed/str12/800/500",
  },
  {
    title: "Hai viện hàn lâm thống nhất lịch hội thảo khoa học thường niên",
    summary:
      "Chuỗi hội thảo tạo diễn đàn chia sẻ kết quả và hình thành đề tài liên ngành.",
    category: "international",
    time: "04:15",
    image: "https://picsum.photos/seed/str13/800/500",
  },
  {
    title: "Mô hình dự báo khí hậu được hiệu chỉnh bằng dữ liệu song phương",
    summary:
      "Kết quả cải thiện độ chính xác khi phân tích các hiện tượng thời tiết cực đoan.",
    category: "science",
    time: "03:50",
    image: "https://picsum.photos/seed/str14/800/500",
  },
  {
    title: "Sinh viên phát triển robot hỗ trợ kiểm tra hạ tầng công nghiệp",
    summary:
      "Nguyên mẫu sử dụng thị giác máy tính để nhận diện sớm dấu hiệu xuống cấp.",
    category: "education",
    time: "03:20",
    image: "https://picsum.photos/seed/str15/800/500",
  },
  {
    title: "Nền tảng bản đồ chuyên gia bổ sung hồ sơ nghiên cứu liên ngành",
    summary:
      "Dữ liệu mới giúp tổ chức tìm đúng đối tác theo chuyên môn và địa bàn.",
    category: "innovation",
    time: "02:55",
    image: "https://picsum.photos/seed/str16/800/500",
  },
];

const STREAM_BATCH_SIZE = 4;
const STREAM_INITIAL_COUNT = 8;
const SPOTLIGHT_INTERVAL_MS = 5_000;

const CATALOGS: Array<{
  category: Category;
  title: { vi: string; en: string; ru: string };
  children: string[];
}> = [
  {
    category: "science",
    title: {
      vi: "Khoa học - Công nghệ",
      en: "Science - Technology",
      ru: "Наука - Технологии",
    },
    children: [
      "Trí tuệ nhân tạo",
      "Công nghệ lượng tử",
      "Vật liệu mới",
      "Năng lượng sạch",
      "Công nghệ sinh học",
      "Vũ trụ - Hàng không",
    ],
  },
  {
    category: "international",
    title: {
      vi: "Hợp tác quốc tế",
      en: "International cooperation",
      ru: "Международное сотрудничество",
    },
    children: [
      "Hợp tác Việt - Nga",
      "Viện nghiên cứu",
      "Trường đại học",
      "Doanh nghiệp công nghệ",
      "Hiệp định song phương",
      "Mạng lưới đối tác",
    ],
  },
  {
    category: "innovation",
    title: {
      vi: "Đổi mới sáng tạo",
      en: "Innovation",
      ru: "Инновации",
    },
    children: [
      "Công nghệ mới",
      "Khởi nghiệp sáng tạo",
      "Chuyển giao công nghệ",
      "Sở hữu trí tuệ",
      "Vườn ươm công nghệ",
      "Ứng dụng thực tiễn",
    ],
  },
  {
    category: "education",
    title: {
      vi: "Giáo dục - Nhân lực",
      en: "Education - Talent",
      ru: "Образование - Кадры",
    },
    children: [
      "Học bổng toàn phần",
      "Đào tạo song bằng",
      "Sinh viên & Du học",
      "Nghiên cứu sinh",
      "Chuyên gia thỉnh giảng",
      "Trao đổi học thuật",
    ],
  },
  {
    category: "society",
    title: {
      vi: "Kinh tế - Xã hội",
      en: "Economy - Society",
      ru: "Экономика - Общество",
    },
    children: [
      "Kinh tế số",
      "Công nghiệp công nghệ",
      "Logistics & Thương mại",
      "Chính sách KH & CN",
      "Phát triển bền vững",
      "Đô thị thông minh",
    ],
  },
  {
    category: "all",
    title: {
      vi: "Khoa học Biển & Môi trường",
      en: "Ocean & Environmental Science",
      ru: "Морские науки и экология",
    },
    children: [
      "Hải dương học",
      "Biến đổi khí hậu",
      "Viễn thám đại dương",
      "Đa dạng sinh học",
      "Tài nguyên khoáng sản",
      "Bảo tồn sinh thái",
    ],
  },
];

function NewsImage({
  className = "",
  src,
  label = "Ảnh",
}: {
  className?: string;
  src?: string;
  label?: string;
}) {
  if (src) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img
        src={src}
        alt={label}
        loading="lazy"
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label="Đang tải ảnh"
      className={`animate-pulse bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 motion-reduce:animate-none ${className}`}
    >
      <span className="sr-only">{label}</span>
    </div>
  );
}

function SmallRow({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news/${articleId(item)}`}
      className="grid grid-cols-[128px_minmax(0,1fr)] gap-4 border-b border-slate-100 py-5 first:pt-0 sm:grid-cols-[180px_minmax(0,1fr)]"
    >
      <NewsImage
        src={item.image}
        className="h-[88px] w-full rounded-xl sm:h-[112px]"
      />
      <div className="min-w-0">
        <h3 className="text-[15px] font-extrabold leading-[1.4] transition-colors hover:text-blue-700 sm:text-lg">
          {item.title}
        </h3>
        <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-slate-600 sm:text-base">
          {item.summary}
        </p>
      </div>
    </Link>
  );
}

function articleId(item: NewsItem) {
  return (
    1 +
    ([...item.title].reduce(
      (sum, character) => sum + character.codePointAt(0)!,
      0,
    ) %
      28)
  );
}

export function GuestExploreV2() {
  const { locale } = useLocale();
  const t = TEXT[locale] ?? TEXT.vi;
  const categories: Category[] = [
    "all",
    "science",
    "international",
    "innovation",
    "education",
    "society",
  ];
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedScope, setSelectedScope] = useState("all");
  const [selectedContentTypes, setSelectedContentTypes] = useState<string[]>(
    [],
  );
  const [selectedPeriod, setSelectedPeriod] = useState("newest");
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [streamCategory, setStreamCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const slidingTimerRef = useRef<number | null>(null);

  const changeSpotlight = (nextIndex: number | ((curr: number) => number)) => {
    setIsSliding(true);
    setSpotlightIndex(nextIndex);
    if (slidingTimerRef.current) {
      window.clearTimeout(slidingTimerRef.current);
    }
    slidingTimerRef.current = window.setTimeout(() => {
      setIsSliding(false);
    }, 1200);
  };

  const [visibleStreamCount, setVisibleStreamCount] =
    useState(STREAM_INITIAL_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const streamLoadMoreRef = useRef<HTMLDivElement | null>(null);
  const filterDetailsRef = useRef<HTMLDetailsElement | null>(null);

  const filtered = useMemo(() => {
    const source =
      activeCategory === "all"
        ? Object.values(ITEMS).flat()
        : ITEMS[activeCategory];
    const q = query.trim().toLocaleLowerCase(locale);
    return q
      ? source.filter((item) =>
          item.title.toLocaleLowerCase(locale).includes(q),
        )
      : source;
  }, [activeCategory, locale, query]);
  const previewCategory = CATALOGS.find((group) =>
    group.children.some((topic) => selectedTopics.includes(topic)),
  )?.category;
  const filterResultCount =
    previewCategory && previewCategory !== "all"
      ? ITEMS[previewCategory].length
      : Object.values(ITEMS).flat().length;

  const stream = useMemo(
    () =>
      streamCategory === "all"
        ? STREAM
        : STREAM.filter((item) => item.category === streamCategory),
    [streamCategory],
  );
  const visibleStream = stream.slice(0, visibleStreamCount);
  const categoryMode = activeCategory !== "all" || query.trim().length > 0;
  const filteredHalf = Math.ceil(filtered.length / 2);
  const streamHalf = Math.ceil(visibleStream.length / 2);

  const selectStreamCategory = (nextCategory: Category) => {
    setStreamCategory(nextCategory);
    setVisibleStreamCount(STREAM_INITIAL_COUNT);
    setIsLoadingMore(false);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => changeSpotlight((current) => (current + 1) % LATEST.length),
      SPOTLIGHT_INTERVAL_MS,
    );
    return () => {
      window.clearInterval(timer);
      if (slidingTimerRef.current) window.clearTimeout(slidingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const target = streamLoadMoreRef.current;
    if (!target || visibleStreamCount >= stream.length) return;
    let timer = 0;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        observer.disconnect();
        setIsLoadingMore(true);
        timer = window.setTimeout(() => {
          setVisibleStreamCount((current) =>
            Math.min(current + STREAM_BATCH_SIZE, stream.length),
          );
          setIsLoadingMore(false);
        }, 700);
      }
    });
    observer.observe(target);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [stream.length, visibleStreamCount]);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <GuestPublicNav active="news" />

      <main className="mx-auto max-w-[1480px] px-4 py-9 sm:px-6 lg:px-8">
        <section className="mb-6 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-black uppercase tracking-[-0.03em] text-blue-600 sm:text-3xl">
                {t.news}
              </h1>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-extrabold uppercase text-emerald-700">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                {t.live}
              </span>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              {t.lead}
            </p>
          </div>
          <div className="flex overflow-hidden rounded-xl border border-blue-100 bg-white">
            {[
              ["06", "Chuyên mục"],
              ["24/7", "Cập nhật"],
              ["VN · RU", "Song phương"],
            ].map(([value, label], index) => (
              <div
                key={value}
                className={`min-w-[112px] px-4 py-2.5 text-center ${index ? "border-l border-blue-100" : ""}`}
              >
                <strong className="block text-sm font-black">{value}</strong>
                <span className="block text-[10px] font-bold uppercase text-slate-400">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="relative z-30 mb-8 overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm has-[details[open]]:rounded-b-none">
          {/* Row 1: Unified Segmented Tabs Strip (Dính kịch với nhau) */}
          <div className="grid w-full grid-cols-2 divide-x divide-slate-200 border-b border-slate-200 sm:grid-cols-3 xl:grid-cols-6">
            {categories.map((category, index) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`flex min-h-11 w-full items-center justify-center px-3 text-center text-sm font-bold transition-colors ${
                  index === 0 ? "rounded-tl-2xl" : ""
                } ${index === categories.length - 1 ? "rounded-tr-2xl" : ""} ${
                  activeCategory === category
                    ? "bg-blue-600 text-white font-black"
                    : "bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                }`}
              >
                {t.categories[category]}
              </button>
            ))}
          </div>

          {/* Row 2: Category Catalog Button + Full Width Search Input */}
          <div className="flex w-full items-center gap-2 p-2.5 sm:p-3">
            <details ref={filterDetailsRef} className="group">
              <summary
                title={t.allCategories}
                className="grid size-11 shrink-0 list-none cursor-pointer place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 [&::-webkit-details-marker]:hidden"
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
              </summary>
              <div className="absolute -left-px -right-px top-full z-50 -mt-px overflow-hidden rounded-b-lg border-x border-b border-slate-200 bg-white shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <fieldset className="border-b border-slate-200 p-5 md:border-r">
                    <legend className="flex items-center gap-2 text-base font-black text-slate-900">
                      <span
                        className="text-xl font-normal text-blue-600"
                        aria-hidden="true"
                      >
                        ◇
                      </span>
                      Chủ đề
                    </legend>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {CATALOGS[0].children
                        .slice(0, showAllTopics ? undefined : 5)
                        .map((topic) => (
                          <label
                            key={topic}
                            className="flex min-h-9 cursor-pointer items-center gap-3 text-sm text-slate-700"
                          >
                            <input
                              type="checkbox"
                              checked={selectedTopics.includes(topic)}
                              onChange={() =>
                                setSelectedTopics((current) =>
                                  current.includes(topic)
                                    ? current.filter((item) => item !== topic)
                                    : [...current, topic],
                                )
                              }
                              className="size-4 rounded accent-blue-600"
                            />
                            <span>{topic}</span>
                          </label>
                        ))}
                      <button
                        type="button"
                        onClick={() => setShowAllTopics((current) => !current)}
                        className="min-h-9 text-left text-sm font-semibold text-blue-600"
                      >
                        {showAllTopics ? "− Thu gọn" : "+ Xem thêm"}
                      </button>
                    </div>
                  </fieldset>

                  <fieldset className="border-b border-slate-200 p-5">
                    <legend className="flex items-center gap-2 text-base font-black text-slate-900">
                      <span
                        className="text-xl font-normal text-blue-600"
                        aria-hidden="true"
                      >
                        ◎
                      </span>
                      Phạm vi
                    </legend>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {[
                        ["all", "Tất cả"],
                        ["vietnam", "Việt Nam"],
                        ["russia", "Liên bang Nga"],
                        ["bilateral", "Hợp tác Việt - Nga"],
                      ].map(([value, label]) => (
                        <label
                          key={value}
                          className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                        >
                          <input
                            type="radio"
                            name="filter-scope"
                            value={value}
                            checked={selectedScope === value}
                            onChange={() => setSelectedScope(value)}
                            className="size-4 accent-blue-600"
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="border-b border-slate-200 p-5 md:border-b-0 md:border-r">
                    <legend className="flex items-center gap-2 text-base font-black text-slate-900">
                      <span
                        className="text-xl font-normal text-blue-600"
                        aria-hidden="true"
                      >
                        ▣
                      </span>
                      Loại nội dung
                    </legend>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {[
                        ["news", "Tin tức"],
                        ["research", "Nghiên cứu"],
                        ["event", "Sự kiện"],
                        ["policy", "Chính sách"],
                      ].map(([value, label]) => (
                        <label
                          key={value}
                          className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                        >
                          <input
                            type="checkbox"
                            checked={selectedContentTypes.includes(value)}
                            onChange={() =>
                              setSelectedContentTypes((current) =>
                                current.includes(value)
                                  ? current.filter((item) => item !== value)
                                  : [...current, value],
                              )
                            }
                            className="size-4 rounded accent-blue-600"
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="p-5">
                    <legend className="flex items-center gap-2 text-base font-black text-slate-900">
                      <span
                        className="text-xl font-normal text-blue-600"
                        aria-hidden="true"
                      >
                        ◷
                      </span>
                      Thời gian
                    </legend>
                    <div className="mt-3 grid grid-cols-3 overflow-hidden rounded-lg border border-slate-200">
                      {[
                        ["newest", "Mới nhất"],
                        ["7days", "7 ngày"],
                        ["30days", "30 ngày"],
                      ].map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setSelectedPeriod(value)}
                          aria-pressed={selectedPeriod === value}
                          className={`min-h-11 border-r border-slate-200 px-3 text-sm font-semibold last:border-r-0 ${selectedPeriod === value ? "bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-600" : "bg-white text-slate-600 hover:bg-slate-50"}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="grid grid-cols-2 gap-3 border-t border-slate-200 p-5 md:col-span-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTopics([]);
                        setSelectedScope("all");
                        setSelectedContentTypes([]);
                        setSelectedPeriod("newest");
                      }}
                      className="min-h-11 rounded-lg border border-slate-200 bg-white px-4 text-base font-bold text-slate-700 hover:bg-slate-50"
                    >
                      Đặt lại
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const selectedGroup = CATALOGS.find((group) =>
                          group.children.some((topic) =>
                            selectedTopics.includes(topic),
                          ),
                        );
                        setActiveCategory(selectedGroup?.category ?? "all");
                        if (filterDetailsRef.current)
                          filterDetailsRef.current.open = false;
                      }}
                      className="min-h-11 rounded-lg bg-blue-600 px-4 text-base font-bold text-white shadow-sm hover:bg-blue-700"
                    >
                      Áp dụng bộ lọc ({filterResultCount})
                    </button>
                  </div>
                </div>
              </div>
            </details>

            <label className="flex h-11 min-w-0 flex-1 items-center rounded-xl border border-slate-200 bg-slate-50/80 px-4 transition-all focus-within:border-blue-600 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder={t.search}
                style={{ outline: "none" }}
                className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 sm:text-base"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="mr-2 text-xs font-bold text-slate-400 hover:text-slate-600"
                  aria-label="Xóa tìm kiếm"
                >
                  ✕
                </button>
              ) : null}
              <svg
                viewBox="0 0 24 24"
                className="size-5 shrink-0 text-slate-400"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="6.7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="m16 16 4 4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </label>
          </div>
        </section>

        {!categoryMode ? (
          <>
            <section className="grid gap-8 lg:grid-cols-[1.35fr_.92fr]">
              <article
                className="relative min-h-[520px] overflow-hidden rounded-2xl bg-slate-950 text-white"
                aria-roledescription="carousel"
                aria-label={t.spotlight}
              >
                <div
                  className="absolute inset-0 flex transition-transform duration-[1500ms] ease-in-out motion-reduce:transition-none"
                  style={{ transform: `translateX(-${spotlightIndex * 100}%)` }}
                >
                  {LATEST.map((item, index) => (
                    <Link
                      key={item.title}
                      href={`/news/${articleId(item)}`}
                      className="relative min-w-full"
                      aria-hidden={index !== spotlightIndex}
                      tabIndex={index === spotlightIndex ? 0 : -1}
                    >
                      <NewsImage
                        src={item.image}
                        label="Ảnh bài viết nổi bật"
                        className="absolute inset-0 h-full w-full rounded-none"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,18,45,.02)_12%,rgba(3,18,45,.18)_48%,rgba(2,14,35,.94)_100%)]" />
                      <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-8">
                        <span className="inline-flex min-h-8 items-center rounded-lg bg-blue-600 px-3 text-xs font-black uppercase">
                          {t.spotlight}
                        </span>
                        <h2 className="mt-4 max-w-4xl text-3xl font-black leading-[1.15] tracking-[-0.04em] sm:text-4xl">
                          {item.title}
                        </h2>
                        <p className="mt-4 max-w-3xl text-base leading-7 text-white/90 sm:text-lg">
                          {item.summary}
                        </p>
                        <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-white/85">
                          <span>{t.categories[item.category]}</span>
                          <span>•</span>
                          <span>{item.time}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="absolute bottom-6 right-6 z-20 flex items-center gap-1.5">
                  {LATEST.map((item, index) => {
                    const isActive = index === spotlightIndex;
                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => changeSpotlight(index)}
                        aria-label={`${index + 1} / ${LATEST.length}`}
                        aria-current={isActive ? "true" : undefined}
                        className="group grid h-7 w-7 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        <span
                          className={`h-2 rounded-full transition-all duration-500 ease-out motion-reduce:transition-none ${
                            isActive
                              ? isSliding
                                ? "w-7 bg-white"
                                : "w-2 bg-white ring-2 ring-white/60"
                              : "w-2 bg-white/40 group-hover:bg-white/75"
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>
              </article>
              <aside>
                <div className="mb-4">
                  <h2 className="text-lg font-black uppercase text-blue-600 sm:text-xl">
                    {t.latest}
                  </h2>
                </div>
                {LATEST.map((item) => (
                  <SmallRow key={item.title} item={item} />
                ))}
              </aside>
            </section>

            <section className="mt-12">
              <div className="mb-5 flex items-center gap-4">
                <h2 className="shrink-0 text-lg font-black uppercase text-blue-600 sm:text-xl">
                  {t.featured}
                </h2>
                <span className="h-px flex-1 bg-blue-100" />
              </div>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {FEATURED.map((item) => (
                  <Link
                    key={item.title}
                    href={`/news/${articleId(item)}`}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-blue-200"
                  >
                    <NewsImage
                      src={item.image}
                      label="Ảnh bài viết"
                      className="h-44 w-full"
                    />
                    <div className="p-4">
                      <h3 className="text-base font-extrabold leading-[1.45]">
                        {item.title}
                      </h3>
                      <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-slate-600 sm:text-base">
                        {item.summary}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-12">
              <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-lg font-black uppercase text-blue-600 sm:text-xl">
                    {t.stream}
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">{t.streamLead}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={streamCategory}
                    onChange={(e) =>
                      selectStreamCategory(e.target.value as Category)
                    }
                    className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none"
                  >
                    <option value="all">{t.allCategories}</option>
                    {categories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {t.categories[category]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
                  >
                    {t.newest}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700"
                  >
                    ↑ {t.top}
                  </button>
                </div>
              </div>
              <div className="grid gap-x-10 lg:grid-cols-2">
                {[
                  visibleStream.slice(0, streamHalf),
                  visibleStream.slice(streamHalf),
                ].map((column, columnIndex) => (
                  <div key={columnIndex}>
                    {column.map((item) => (
                      <Link
                        key={`${item.time}-${item.title}`}
                        href={`/news/${articleId(item)}`}
                        className="grid grid-cols-[128px_minmax(0,1fr)] gap-4 border-b border-slate-100 py-5 first:pt-0 sm:grid-cols-[170px_minmax(0,1fr)]"
                      >
                        <NewsImage
                          src={item.image}
                          className="h-[86px] w-full rounded-xl sm:h-[105px]"
                        />
                        <div className="min-w-0">
                          <h3 className="text-base font-extrabold leading-[1.4] transition-colors hover:text-blue-700 sm:text-lg">
                            {item.title}
                          </h3>
                          <p className="mt-2.5 line-clamp-2 text-sm leading-6 text-slate-600 sm:text-base">
                            {item.summary}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
              <div
                ref={streamLoadMoreRef}
                className="mt-6 flex min-h-16 items-center justify-center gap-3 border-t border-slate-100 pt-5"
                aria-live="polite"
              >
                {visibleStreamCount < stream.length ? (
                  isLoadingMore ? (
                    <>
                      <span
                        className="size-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600 motion-reduce:animate-none"
                        aria-hidden="true"
                      />
                      <span className="text-base font-semibold text-slate-600">
                        {t.loadingMore}
                      </span>
                    </>
                  ) : (
                    <span className="text-base font-semibold text-slate-500">
                      ↓ {t.scrollMore}
                    </span>
                  )
                ) : (
                  <span className="text-base font-semibold text-slate-500">
                    {t.showing} {Math.min(visibleStreamCount, stream.length)} /{" "}
                    {stream.length} {t.articles}
                  </span>
                )}
              </div>
            </section>
          </>
        ) : (
          <section className="mt-8">
            <div className="mb-5 flex items-center gap-4">
              <h2 className="shrink-0 text-lg font-black uppercase text-blue-600 sm:text-xl">
                {t.latest}
              </h2>
              <span className="h-px flex-1 bg-blue-100" />
            </div>
            {filtered.length ? (
              <div className="grid gap-x-10 lg:grid-cols-2">
                <div>
                  {filtered.slice(0, filteredHalf).map((item) => (
                    <SmallRow key={item.title} item={item} />
                  ))}
                </div>
                <div>
                  {filtered.slice(filteredHalf).map((item) => (
                    <SmallRow key={item.title} item={item} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center text-sm font-semibold text-slate-500">
                {t.noResults}
              </div>
            )}
          </section>
        )}
      </main>

      <GuestPublicFooter copy={HOME_COPY[locale]} />
    </div>
  );
}

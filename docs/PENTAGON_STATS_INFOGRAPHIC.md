# Hướng Dẫn Khôi Phục Sơ Đồ Ngũ Giác Thống Kê (NetworkStatsInfographic)

Tài liệu này lưu trữ toàn bộ mã nguồn, cấu trúc dữ liệu và hướng dẫn kích hoạt lại khối **Sơ đồ Ngũ giác Thống kê (Pentagon Stats Infographic)** trên Trang chủ (`/` - `GuestHomeV2.tsx`).

---

## 1. Vị trí trên Trang Chủ (`GuestHomeV2.tsx`)

Để hiển thị lại khối này trên Trang chủ:
Mở file `frontend/features/public-v2/components/GuestHomeV2.tsx`, tìm đến cuối thẻ `<main>` (ngay trước `</main>`) và bỏ comment component:

```tsx
        {/* ═══════════ SECTION 4: NHỮNG CON SỐ (SƠ ĐỒ NGŨ GIÁC) ═══════════ */}
        {/* 
        <NetworkStatsInfographic
          stats={t.stats}
          titleMain={t.titleMain}
          country1={t.country1}
          hyphen={t.hyphen}
          country2={t.country2}
        />
        */}
```

---

## 2. Mã nguồn Component & Dữ liệu

### 2.1 Cấu trúc Dữ liệu Stats trong `HOME_COPY`

Mỗi ngôn ngữ (`vi`, `en`, `ru`) trong `HOME_COPY` có cấu trúc:

```ts
stats: [
  {
    tone: "blue",
    icon: "public",
    val: "2",
    lbl: "Quốc gia",
  },
  {
    tone: "blue",
    icon: "groups",
    val: "500+",
    lbl: "Chuyên gia & Nhà khoa học",
  },
  {
    tone: "emerald",
    icon: "hub",
    val: "300+",
    lbl: "Dự án hợp tác song phương",
  },
  {
    tone: "purple",
    icon: "science",
    val: "20+",
    lbl: "Lĩnh vực nghiên cứu trọng điểm",
  },
  {
    tone: "amber",
    icon: "account_balance",
    val: "50+",
    lbl: "Viện nghiên cứu & Trường đại học",
  },
]
```

### 2.2 Mã nguồn Component `NetworkStatsInfographic`

```tsx
const NETWORK_TONE_STYLES = {
  blue: {
    glow: "drop-shadow-[0_16px_22px_rgba(31,99,233,0.3)]",
    accent: "#38bdf8",
    faceStart: "#58a6ff",
    faceEnd: "#1f63e9",
  },
  emerald: {
    glow: "drop-shadow-[0_16px_22px_rgba(18,174,98,0.3)]",
    accent: "#32d486",
    faceStart: "#5ce49a",
    faceEnd: "#159f5b",
  },
  purple: {
    glow: "drop-shadow-[0_16px_22px_rgba(112,66,218,0.3)]",
    accent: "#8c62f5",
    faceStart: "#a97bff",
    faceEnd: "#6438d0",
  },
  amber: {
    glow: "drop-shadow-[0_16px_22px_rgba(238,139,19,0.3)]",
    accent: "#ffae2d",
    faceStart: "#ffc64d",
    faceEnd: "#ec7f16",
  },
} as const;

const NETWORK_ROUNDED_PENTAGON_PATH =
  "M 8 -80 L 72 -34 Q 82 -27 79 -16 L 55 61 Q 52 72 41 72 L -41 72 Q -52 72 -55 61 L -79 -16 Q -82 -27 -72 -34 L -8 -80 Q 0 -86 8 -80 Z";

const NETWORK_DESKTOP_NODES = [
  {
    connector: [600, 175, 600, 237],
    center: [600, 100],
    rotation: 180,
    scale: 0.9,
    content: [535, 40, 130, 122],
  },
  {
    connector: [431, 316, 493, 316],
    center: [346, 316],
    rotation: 90,
    scale: 1.02,
    content: [269, 242, 154, 148],
  },
  {
    connector: [769, 316, 707, 316],
    center: [854, 316],
    rotation: -90,
    scale: 1.02,
    content: [777, 242, 154, 148],
  },
  {
    connector: [478.3, 475, 532, 444],
    center: [405, 517],
    rotation: 60,
    scale: 1.02,
    content: [328, 442, 154, 148],
  },
  {
    connector: [721.7, 475, 668, 444],
    center: [795, 517],
    rotation: -60,
    scale: 1.02,
    content: [718, 442, 154, 148],
  },
] as const;

export function NetworkStatsInfographic({
  stats,
  titleMain,
  country1,
  hyphen,
  country2,
}: Readonly<{
  stats: readonly {
    tone: "blue" | "emerald" | "purple" | "amber";
    icon: string;
    val: string;
    lbl: string;
  }[];
  titleMain: string;
  country1: string;
  hyphen: string;
  country2: string;
}>) {
  return (
    <section
      aria-label="Infographic những con số"
      className="relative z-10 w-full overflow-hidden bg-white/70 py-16 backdrop-blur-md"
    >
      <div className="mx-auto max-w-[1240px] px-4">
        {/* Mobile View */}
        <div className="flex flex-col gap-4 lg:hidden">
          <div className="rounded-3xl border border-blue-200/80 bg-white/90 p-6 text-center shadow-lg">
            <h2 className="text-sm font-bold text-blue-900">{titleMain}</h2>
            <p className="mt-1 text-2xl font-black text-blue-950">
              {country1} {hyphen} {country2}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {stats.map((stat) => (
              <div
                key={stat.lbl}
                className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-white p-4 shadow-sm"
              >
                <div className="text-2xl font-black text-blue-600">{stat.val}</div>
                <div className="text-xs font-bold text-slate-700">{stat.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop View SVG Infographic */}
        <div className="hidden items-center justify-center lg:flex">
          <div className="relative w-full max-w-[1040px]">
            <svg
              viewBox="0 0 1200 680"
              className="h-auto w-full overflow-visible"
              aria-hidden="true"
            >
              {/* Pentagonal SVG code */}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
```

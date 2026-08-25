import type { Metadata } from "next";
import { Be_Vietnam_Pro, Noto_Sans, Noto_Serif } from "next/font/google";
import QueryProvider from "../components/providers/QueryProvider";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const sans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "vietnamese", "cyrillic", "cyrillic-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const serif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin", "vietnamese", "cyrillic", "cyrillic-ext"],
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Mạng lưới Tri thức Khoa học - Công nghệ Nga - Việt",
  description: "Independent Vietnam–Russia knowledge and collaboration portal.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${beVietnamPro.variable} ${sans.variable} ${serif.variable}`}
    >
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body suppressHydrationWarning className="vnru-motion-root min-h-screen bg-background font-sans text-on-background antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

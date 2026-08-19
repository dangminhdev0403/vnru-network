import type { Metadata } from "next";
import { Hanken_Grotesk, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sans = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin", "vietnamese", "latin-ext"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const serif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "vietnamese", "cyrillic", "cyrillic-ext", "latin-ext"],
  display: "swap",
  weight: ["400", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "VN-RU Knowledge Network",
  description: "Independent Vietnam–Russia knowledge and collaboration portal.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="font-sans antialiased bg-background text-on-background min-h-screen">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Hanken_Grotesk, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sans = Hanken_Grotesk({ variable: "--font-hanken", subsets: ["latin", "vietnamese", "cyrillic-ext"] });
const serif = Source_Serif_4({ variable: "--font-source-serif", subsets: ["latin", "vietnamese", "cyrillic-ext"] });

export const metadata: Metadata = {
  title: "VN-RU Knowledge Network",
  description: "Independent Vietnam–Russia knowledge and collaboration portal.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${serif.variable}`}>{children}</body></html>;
}

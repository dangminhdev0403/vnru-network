"use client";

import Link from "next/link";
import { useLocale, type Locale } from "@/core/i18n/locale";
import { HOME_COPY } from "./GuestHomeV2";
import { GuestPublicFooter } from "./GuestPublicFooter";
import { GuestPublicNav } from "./GuestPublicNav";

type Content = {
  title: string; lead: string;
  opportunities: string; opportunityLead: string;
  members: string; memberLead: string;
  projects: string; projectLead: string;
  library: string; libraryLead: string;
  sources: string; sourceLabel: string; aboutPartners: string;
};

const COPY: Record<Locale, Content> = {
  vi: {
    title: "Hệ sinh thái RU-VN", lead: "Cơ hội hợp tác, thành viên, dự án và nguồn tri thức của Mạng lưới.",
    opportunities: "Cơ hội hợp tác", opportunityLead: "Kết nối đối tác, công bố khoa học và thông tin tài trợ song phương.",
    members: "Thành viên", memberLead: "Các tổ chức Nga và Việt Nam được cung cấp trong nguồn chính thức của Mạng lưới.",
    projects: "Dự án & Kết quả", projectLead: "Dự án Khai Sáng và các hoạt động giáo dục, văn hóa, xuất bản đã triển khai.",
    library: "Thư viện tri thức", libraryLead: "Tài liệu và báo cáo chuyên ngành được Mạng lưới tuyển chọn.",
    sources: "Thông tin chi tiết đang được chuẩn hóa từ tài liệu chính thức.", sourceLabel: "Nguồn", aboutPartners: "Xem danh sách tổ chức",
  },
  en: {
    title: "RU-VN Ecosystem", lead: "Collaboration opportunities, members, projects and knowledge resources.",
    opportunities: "Collaboration opportunities", opportunityLead: "Partner matching, scientific calls and bilateral funding information.",
    members: "Members", memberLead: "Russian and Vietnamese organizations supplied in the Network's official source.",
    projects: "Projects & outcomes", projectLead: "The Khai Sang project and delivered education, culture and publishing activities.",
    library: "Knowledge library", libraryLead: "Selected specialist documents and reports.",
    sources: "Details are being normalized from official documents.", sourceLabel: "Source", aboutPartners: "View organizations",
  },
  ru: {
    title: "Экосистема RU-VN", lead: "Возможности сотрудничества, участники, проекты и ресурсы знаний.",
    opportunities: "Возможности сотрудничества", opportunityLead: "Поиск партнеров, научные конкурсы и двустороннее финансирование.",
    members: "Участники", memberLead: "Российские и вьетнамские организации из официальных материалов Сети.",
    projects: "Проекты и результаты", projectLead: "Проект «Кхай Шанг» и реализованные образовательные, культурные и издательские мероприятия.",
    library: "Библиотека знаний", libraryLead: "Отобранные специализированные документы и доклады.",
    sources: "Материалы уточняются по официальным документам.", sourceLabel: "Источник", aboutPartners: "Список организаций",
  },
};

const OPPORTUNITIES = [
  { title: "Kết nối", body: "Tiếp nhận nhu cầu tìm chuyên gia, tổ chức và đối tác cho sáng kiến hợp tác Việt – Nga." },
  { title: "Công bố", body: "Hội nghị, hội thảo và call for papers chỉ được đăng khi có nguồn và thời hạn rõ ràng." },
  { title: "Tài trợ", body: "Thông tin từ NAFOSTED, NATIF, VINIF, RSF, JINR và các chương trình hợp tác Việt – Nga." },
];

const PROJECTS = [
  "Giải thưởng Khai Sáng: 70 học sinh, sinh viên Việt Nam tại Nga được ghi nhận từ năm 2023.",
  "Cuộc thi Dịch tiếng Việt chuyên nghiệp toàn Nga.",
  "Dịch, biên soạn và xuất bản sách về quan hệ, lịch sử và văn hóa Việt – Nga.",
  "Xây dựng Phòng Việt Nam tại IKSA thuộc Viện Hàn lâm Khoa học Nga.",
  "Thúc đẩy nghiên cứu tiếng Nga tại Việt Nam và tiếng Việt tại Liên bang Nga.",
  "Trại hè và Đại hội Thể thao Sinh viên Việt Nam tại Nga.",
];

function Heading({ title, lead }: Readonly<{ title: string; lead: string }>) {
  return <div><h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{title}</h2><p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{lead}</p></div>;
}

export function GuestEcosystemV2({ isAuthenticated, workspaceHref }: Readonly<{ isAuthenticated: boolean; workspaceHref: string }>) {
  const { locale } = useLocale();
  const t = COPY[locale] ?? COPY.vi;
  const footer = HOME_COPY[locale] ?? HOME_COPY.vi;

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-slate-900">
      <GuestPublicNav active="ecosystem" isAuthenticated={isAuthenticated} workspaceHref={workspaceHref} />
      <main>
        <section className="border-b border-blue-100 bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-[1460px]"><p className="text-base font-bold uppercase tracking-[0.16em] text-blue-600">RU-VN</p><h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">{t.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{t.lead}</p></div>
        </section>

        <section id="opportunities" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px]"><Heading title={t.opportunities} lead={t.opportunityLead} /><div className="mt-8 grid gap-5 md:grid-cols-3">{OPPORTUNITIES.map((item) => <article key={item.title} className="rounded-2xl border border-blue-100 bg-white p-6"><h3 className="text-xl font-black">{item.title}</h3><p className="mt-3 text-base leading-7 text-slate-600">{item.body}</p></article>)}</div><p className="mt-6 text-sm font-semibold text-slate-500">{t.sources}</p></div>
        </section>

        <section id="members" className="scroll-mt-24 border-y border-blue-100 bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px]"><Heading title={t.members} lead={t.memberLead} /><div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6"><p className="text-base leading-7 text-slate-700">Московский Политех · СПбУТУиЭ · ЦЭМИ РАН · СПбГУ · РУДН · Đại học Quốc gia Hà Nội · Học viện Công nghệ Bưu chính Viễn thông · Đại học Kinh tế - Kỹ thuật Công nghiệp</p><Link href="/about#participating-partners" className="mt-5 inline-flex min-h-11 items-center text-base font-bold text-blue-700 hover:underline">{t.aboutPartners} →</Link></div></div>
        </section>

        <section id="projects" className="scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px]"><Heading title={t.projects} lead={t.projectLead} /><div className="mt-8 rounded-3xl border border-blue-100 bg-white p-7 sm:p-10"><h3 className="text-2xl font-black">DỰ ÁN “KHAI SÁNG”</h3><ul className="mt-6 grid gap-4 md:grid-cols-2">{PROJECTS.map((item) => <li key={item} className="rounded-xl bg-blue-50 p-5 text-base leading-7 text-slate-700">{item}</li>)}</ul><p className="mt-6 text-sm font-bold text-slate-500">{t.sourceLabel}: RVSTIN/Hệ sinh thái/Dự án Khai sáng.docx</p></div></div>
        </section>

        <section id="knowledge-library" className="scroll-mt-24 border-t border-blue-100 bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1460px]"><Heading title={t.library} lead={t.libraryLead} /><article className="mt-8 max-w-4xl rounded-3xl border border-blue-100 bg-blue-50 p-7 sm:p-10"><p className="text-sm font-bold uppercase tracking-wider text-blue-700">Kinh tế · Công nghệ</p><h3 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">Chuyển đổi kinh tế Nga trong bối cảnh xây dựng chủ quyền công nghệ</h3><p className="mt-4 text-base leading-7 text-slate-600">Chủ biên E. B. Lenchuk. Công trình phân tích hiện đại hóa cấu trúc, công nghệ và mô hình phát triển bền vững của kinh tế Nga.</p><p className="mt-5 text-sm font-bold text-slate-500">{t.sourceLabel}: Viện Kinh tế, Viện Hàn lâm Khoa học Nga</p></article></div>
        </section>
      </main>
      <GuestPublicFooter copy={footer} />
    </div>
  );
}

import Link from "next/link";
import { BrandMark } from "@/components/shared/BrandMark";

type GuestPublicFooterCopy = {
  footer: {
    brandTitle: string;
    subtitle: string;
    desc: string;
    openDataBadge: string;
    navTitle: string;
    pillarsTitle: string;
    contactTitle: string;
    hanoiOffice: string;
    hanoiAddress: string;
    moscowOffice: string;
    moscowAddress: string;
    supportLabel: string;
    copyright: string;
    terms: string;
    privacy: string;
    ethics: string;
    openData: string;
    pillars: string[];
  };
  ecosystem: { title: string; cards: { title: string }[] };
  events: { title: string };
};

export function GuestPublicFooter({
  copy: t,
}: Readonly<{ copy: GuestPublicFooterCopy }>) {
  return (
    <footer
      id="contact"
      className="scroll-mt-24 border-t border-blue-200/90 bg-[#e3eefc] pt-14 pb-10 text-slate-700"
    >
      <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-flex items-center gap-3.5"
              aria-label={t.footer.brandTitle}
            >
              <BrandMark className="size-11 shadow-xs" />
              <span>
                <strong className="block text-base sm:text-lg font-black tracking-tight text-[#1A1C1CD9]">
                  {t.footer.brandTitle}
                </strong>
                {t.footer.subtitle ? (
                  <small className="block text-xs font-extrabold tracking-wider text-slate-600 uppercase">
                    {t.footer.subtitle}
                  </small>
                ) : null}
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-xs sm:text-sm leading-relaxed text-slate-600">
              {t.footer.desc}
            </p>
            <div className="mt-5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-white/90 px-3 py-1 text-xs font-bold text-blue-800 shadow-xs">
                <span className="size-2 rounded-full bg-emerald-500" />
                {t.footer.openDataBadge}
              </span>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#1A1C1CD9]">
              {t.footer.navTitle}
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-semibold text-slate-600">
              <li>
                <Link
                  href="/opportunities"
                  className="transition hover:text-blue-700 hover:underline"
                >
                  {t.ecosystem.cards[0].title}
                </Link>
              </li>
              <li>
                <Link
                  href="/experts"
                  className="transition hover:text-blue-700 hover:underline"
                >
                  {t.ecosystem.cards[1].title}
                </Link>
              </li>
              <li>
                <Link
                  href="/knowledge"
                  className="transition hover:text-blue-700 hover:underline"
                >
                  {t.ecosystem.cards[3].title}
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="transition hover:text-blue-700 hover:underline"
                >
                  {t.ecosystem.title}
                </Link>
              </li>
              <li>
                <Link
                  href="/#events"
                  className="transition hover:text-blue-700 hover:underline"
                >
                  {t.events.title}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#1A1C1CD9]">
              {t.footer.pillarsTitle}
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm font-semibold text-slate-600">
              {t.footer.pillars.map((pillar) => (
                <li key={pillar}>
                  <span className="text-slate-700">{pillar}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#1A1C1CD9]">
              {t.footer.contactTitle}
            </h4>
            <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-600">
              <div>
                <strong className="block font-bold text-slate-900">
                  {t.footer.moscowOffice}
                </strong>
                <span>{t.footer.moscowAddress}</span>
              </div>
              <div className="pt-1">
                <span className="block font-medium">
                  {t.footer.supportLabel}
                </span>
                <a
                  href="mailto:info@fonddruzhba.ru"
                  className="font-bold text-blue-700 transition hover:underline"
                >
                  info@fonddruzhba.ru
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-blue-200/80 pt-8 text-xs sm:text-sm font-medium text-slate-600 md:flex-row">
          <p>{t.footer.copyright}</p>
          <div className="flex flex-wrap gap-5 font-semibold text-slate-600">
            <Link href="/#about" className="hover:text-blue-700">
              {t.footer.terms}
            </Link>
            <Link href="/#about" className="hover:text-blue-700">
              {t.footer.privacy}
            </Link>
            <Link href="/#about" className="hover:text-blue-700">
              {t.footer.ethics}
            </Link>
            <Link href="/#about" className="hover:text-blue-700">
              {t.footer.openData}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

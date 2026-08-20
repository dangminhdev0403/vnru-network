import Link from "next/link";
import type { ExpertDetailResult, ExpertMatchesResult } from "../types";

const L = {
  vi: { back: "← Danh sách chuyên gia", org: "Tổ chức", expertise: "Lĩnh vực chuyên môn", bio: "Tiểu sử", partners: "Đối tác tiềm năng", sharedExpertise: "Chuyên môn chung", noPartners: "Chưa có đối tác phù hợp.", notFound: "Không tìm thấy chuyên gia.", error: "Không thể tải thông tin chuyên gia.", matchError: "Không thể tải đối tác.", retry: "Thử lại", country: "Quốc gia", language: "Ngôn ngữ" },
  en: { back: "← Expert directory", org: "Organization", expertise: "Areas of expertise", bio: "Biography", partners: "Potential partners", sharedExpertise: "Shared expertise", noPartners: "No matching partners found.", notFound: "Expert not found.", error: "Unable to load expert information.", matchError: "Unable to load partners.", retry: "Retry", country: "Country", language: "Language" },
  ru: { back: "← Каталог экспертов", org: "Организация", expertise: "Области экспертизы", bio: "Биография", partners: "Потенциальные партнёры", sharedExpertise: "Общая экспертиза", noPartners: "Подходящих партнёров не найдено.", notFound: "Эксперт не найден.", error: "Не удалось загрузить информацию об эксперте.", matchError: "Не удалось загрузить партнёров.", retry: "Повторить", country: "Страна", language: "Язык" },
} as const;
type Locale = keyof typeof L;

type Props = Readonly<{
  expertResult: ExpertDetailResult;
  matchesResult: ExpertMatchesResult;
  id: string;
  locale?: Locale;
}>;

export default function ExpertDetail({ expertResult, matchesResult, id, locale = "vi" }: Props) {
  const t = L[locale];

  if (expertResult.status === "error") {
    const isNotFound = expertResult.kind === "not_found";
    return (
      <div className="mx-auto max-w-[1580px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
        <Link href="/experts" className="text-sm font-medium text-blue-700 hover:underline">{t.back}</Link>
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-950">
          {isNotFound ? t.notFound : t.error}
          {!isNotFound && (
            <Link href={`/experts/${id}`} className="mt-2 block text-xs font-bold text-blue-800 hover:underline">
              {t.retry} →
            </Link>
          )}
        </div>
      </div>
    );
  }

  const expert = expertResult.expert;

  return (
    <div className="mx-auto max-w-[1580px] px-4 py-7 sm:px-6 lg:px-8 lg:py-8">
      <Link href="/experts" className="text-sm font-medium text-blue-700 hover:underline">{t.back}</Link>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        {/* Main info */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {expert.displayName}
          </h1>

          <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-slate-500">{t.org}</dt>
              <dd className="text-slate-900">{expert.organization.name} ({expert.organization.country})</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-500">{t.country}</dt>
              <dd className="text-slate-900">{expert.country}</dd>
            </div>
            {expert.language && (
              <div>
                <dt className="font-semibold text-slate-500">{t.language}</dt>
                <dd className="text-slate-900">{expert.language}</dd>
              </div>
            )}
          </dl>

          {expert.expertises.length > 0 && (
            <div className="mt-5">
              <h2 className="text-sm font-bold text-slate-700">{t.expertise}</h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {expert.expertises.map((x) => (
                  <span
                    key={x.id}
                    className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800"
                  >
                    {x.labels.vi ?? x.labels.en ?? x.slug}
                  </span>
                ))}
              </div>
            </div>
          )}

          {expert.bio && (
            <div className="mt-5">
              <h2 className="text-sm font-bold text-slate-700">{t.bio}</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">{expert.bio}</p>
            </div>
          )}
        </div>

        {/* Partner suggestions */}
        <aside className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-black text-slate-900">{t.partners}</h2>

          {matchesResult.status === "error" ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-950">
              {t.matchError}
            </div>
          ) : matchesResult.items.length === 0 ? (
            <p className="mt-4 text-sm text-slate-500">{t.noPartners}</p>
          ) : (
            <div className="mt-4 divide-y divide-slate-100">
              {matchesResult.items.map((m) => (
                <Link
                  key={m.candidateId}
                  href={`/experts/${m.candidateId}`}
                  className="block py-3 transition hover:bg-slate-50 -mx-2 px-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="text-sm font-semibold text-blue-700">{m.candidateId}</span>
                  <p className="mt-1 text-xs text-slate-500">
                    {t.sharedExpertise}: {m.reasons.map((r) => r.label).join(", ")}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

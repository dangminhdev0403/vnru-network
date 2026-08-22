import { getPublicationById } from "@/features/publications/repository";
import { getLabels } from "@/features/publications/types";
import PublicationDetail from "@/features/publications/components/PublicationDetail";
import PublicHeader from "@/components/shared/PublicHeader";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function PublicationPage({ params, searchParams }: Props) {
  const [{ id }, raw] = await Promise.all([params, searchParams]);
  const lang = typeof raw.lang === "string" ? raw.lang : "en";
  const t = getLabels(lang);
  const data = await getPublicationById(id);

  if (data.status === "not_found") notFound();

  return (
    <>
      <PublicHeader />
      <main>
        <PublicationDetail data={data} labels={t} lang={lang} />
      </main>
    </>
  );
}

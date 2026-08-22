import ExpertList from "../../features/experts/components/ExpertList";
import { getExperts } from "../../features/experts/repository";
import PublicHeader from "@/components/shared/PublicHeader";

type Params = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (typeof v === "string" ? v : undefined);

export default async function ExpertsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const raw = await searchParams;
  const query = {
    q: one(raw.q),
    country: one(raw.country),
    topic: one(raw.topic),
    language: one(raw.language),
    cursor: one(raw.cursor),
    limit: "20",
  };
  const result = await getExperts(query);
  return (
    <>
      <PublicHeader />
      <ExpertList result={result} query={query} />
    </>
  );
}

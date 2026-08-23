"use client";

import Link from "next/link";
import { useProjects } from "../hooks";
import type { Project } from "../types";
import { useLocale, type Locale } from "@/app/HomeMotion";

const copy: Record<Locale, Record<string, string>> = {
  vi: { loading: "Đang tải…", error: "Không thể tải dự án.", empty: "Chưa có dự án.", title: "Dự án", project: "Dự án", proposal: "Đề xuất", state: "Trạng thái" },
  en: { loading: "Loading…", error: "Unable to load projects.", empty: "No projects found.", title: "Projects", project: "Project", proposal: "Proposal", state: "State" },
  ru: { loading: "Загрузка…", error: "Не удалось загрузить проекты.", empty: "Проекты не найдены.", title: "Проекты", project: "Проект", proposal: "Заявка", state: "Статус" },
};

export function ProjectList() {
  const { locale } = useLocale();
  const t = copy[locale] ?? copy.vi;
  const { projects, isLoading } = useProjects();

  if (isLoading) return <div className="p-8">{t.loading}</div>;
  if (!projects) return <div className="p-8">{t.error}</div>;

  const items = Array.isArray(projects) ? projects : ((projects as { items?: Project[] }).items ?? []);

  if (!items.length) return <div className="p-8">{t.empty}</div>;

  return (
    <div className="p-8 space-y-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
      <div className="grid grid-cols-1 gap-4">
        {items.map((p: unknown) => {
          const project = p as Project;
          return (
            <Link key={project.id} href={`/workspace/collaboration/projects/${project.id}`} className="block border p-4 rounded shadow-sm hover:shadow-md transition-shadow focus-visible:ring">
              <h2 className="font-semibold text-lg">{t.project} {project.id}</h2>
              <p className="text-sm text-gray-500">{t.proposal}: {project.proposalRef} | {t.state}: {project.status}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

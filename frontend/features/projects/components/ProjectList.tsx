"use client";

import Link from "next/link";
import { useProjects } from "../hooks";
import type { Project } from "../types";

export function ProjectList() {
  const { projects, isLoading } = useProjects();

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (!projects) return <div className="p-8">Error loading projects.</div>;

  const items = Array.isArray(projects) ? projects : ((projects as { items?: Project[] }).items ?? []);

  if (!items.length) return <div className="p-8">No projects found.</div>;

  return (
    <div className="p-8 space-y-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>
      <div className="grid grid-cols-1 gap-4">
        {items.map((p: unknown) => {
          const project = p as Project;
          return (
            <Link key={project.id} href={`/workspace/collaboration/projects/${project.id}`} className="block border p-4 rounded shadow-sm hover:shadow-md transition-shadow focus-visible:ring">
              <h2 className="font-semibold text-lg">Project {project.id}</h2>
              <p className="text-sm text-gray-500">Proposal: {project.proposalRef} | State: {project.status}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

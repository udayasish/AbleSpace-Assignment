"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { PriorityIndicator } from "@/components/tasks/priority-indicator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { projectsService } from "@/lib/projects-service";
import type { Project } from "@/types/api";

export function ProjectDetailView({ projectId }: { projectId: string }) {
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    projectsService
      .find(projectId)
      .then(setProject)
      .catch(() => setError("Project not found"));
  }, [projectId]);

  return (
    <>
      <PageHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/projects">Projects</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{project?.name ?? "…"}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </PageHeader>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {error ? (
          <p className="text-destructive text-sm">{error}</p>
        ) : !project ? (
          <Skeleton className="h-32 w-full rounded-md" />
        ) : (
          <>
            <h1 className="text-2xl font-semibold">{project.name}</h1>

            <div className="grid gap-3 rounded-md border p-4 text-sm sm:max-w-md">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Priority</span>
                <PriorityIndicator priority={project.priority} />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Lead</span>
                <span>{project.leadLabel ?? "Unassigned"}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Due Date</span>
                <span>
                  {project.dueDate
                    ? new Date(project.dueDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

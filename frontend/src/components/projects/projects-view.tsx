"use client";

import { Filter, ListFilter, MoreHorizontal, Plus, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CreateProjectDialog } from "@/components/projects/create-project-dialog";
import { PriorityIndicator } from "@/components/tasks/priority-indicator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { projectsService } from "@/lib/projects-service";
import {
  removeProject,
  setProjects,
  setProjectsError,
} from "@/store/projectsSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export function ProjectsView() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.projects);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    projectsService
      .list()
      .then((projects) => dispatch(setProjects(projects)))
      .catch(() => dispatch(setProjectsError("Could not load projects")));
  }, [dispatch]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((p) => p.name.toLowerCase().includes(term));
  }, [items, query]);

  const onDelete = async (id: string) => {
    try {
      await projectsService.remove(id);
      dispatch(removeProject(id));
    } catch {
      toast.error("Could not delete project");
    }
  };

  return (
    // min-w-0 lets the scroll boxes shrink; flex children default to min-width:auto.
    <div className="flex min-w-0 flex-1 flex-col gap-4 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>

        <div className="flex flex-wrap items-center gap-2">
          {searching ? (
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects…"
                className="h-8 w-full pl-8 sm:w-56"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => {
                  setSearching(false);
                  setQuery("");
                }}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              onClick={() => setSearching(true)}
            >
              <Search className="size-4" />
            </Button>
          )}

          <Button variant="outline" className="gap-1 rounded-md px-3 text-xs">
            <ListFilter className="size-4" />
            Fields
          </Button>

          <Button variant="ghost" size="icon" aria-label="Filter">
            <Filter className="size-4" />
          </Button>

          <Button
            className="gap-1 rounded-md px-3 text-xs"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="size-4" />
            Add Project
          </Button>
        </div>
      </div>

      {loading ? (
        <Skeleton className="h-48 w-full rounded-md" />
      ) : error ? (
        <p className="text-destructive text-sm">{error}</p>
      ) : (
        // Scrolls within its own box so the page never overflows.
        <div className="overflow-x-auto rounded-md border">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-accent border-b">
                <th className="text-muted-foreground h-12 px-3 text-left font-medium">
                  Projects
                </th>
                <th className="text-muted-foreground h-12 w-32 px-3 text-left font-medium">
                  Priority
                </th>
                <th className="text-muted-foreground h-12 w-28 px-3 text-left font-medium">
                  Lead
                </th>
                <th className="text-muted-foreground h-12 w-36 px-3 text-left font-medium">
                  Due Date
                </th>
                <th className="text-muted-foreground h-12 w-20 px-3 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((project) => (
                <tr key={project.id} className="border-b last:border-b-0">
                  <td className="h-12 px-3">
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-primary font-medium hover:underline"
                    >
                      {project.name}
                    </Link>
                  </td>
                  <td className="h-12 px-3">
                    <PriorityIndicator priority={project.priority} />
                  </td>
                  <td className="h-12 px-3">
                    <Avatar className="size-6">
                      <AvatarFallback className="text-[10px]">
                        {(project.leadLabel ?? "?").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </td>
                  <td className="text-muted-foreground h-12 px-3">
                    {project.dueDate
                      ? new Date(project.dueDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="h-12 px-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onDelete(project.id)}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan={5} className="h-12 px-3">
                  <button
                    type="button"
                    onClick={() => setDialogOpen(true)}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm font-medium"
                  >
                    <Plus className="size-4" />
                    Add Projects
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <CreateProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}

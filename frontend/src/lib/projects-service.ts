import { apiFetch } from "./api";
import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from "@/types/api";

export const projectsService = {
  list: () => apiFetch<Project[]>("/projects"),

  find: (id: string) => apiFetch<Project>(`/projects/${id}`),

  create: (body: CreateProjectInput) =>
    apiFetch<Project>("/projects", { method: "POST", body }),

  update: (id: string, body: UpdateProjectInput) =>
    apiFetch<Project>(`/projects/${id}`, { method: "PATCH", body }),

  remove: (id: string) =>
    apiFetch<{ removed: boolean }>(`/projects/${id}`, { method: "DELETE" }),
};

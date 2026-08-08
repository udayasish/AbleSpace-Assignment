import { apiFetch } from "./api";
import type { CreateTaskInput, Task, UpdateTaskInput } from "@/types/api";

export const tasksService = {
  list: (params?: { status?: string; q?: string }) => {
    const query = new URLSearchParams(
      Object.entries(params ?? {}).filter(([, v]) => v),
    ).toString();
    return apiFetch<Task[]>(`/tasks${query ? `?${query}` : ""}`);
  },

  create: (body: CreateTaskInput) =>
    apiFetch<Task>("/tasks", { method: "POST", body }),

  update: (id: string, body: UpdateTaskInput) =>
    apiFetch<Task>(`/tasks/${id}`, { method: "PATCH", body }),

  remove: (id: string) =>
    apiFetch<{ removed: boolean }>(`/tasks/${id}`, { method: "DELETE" }),
};

import { apiFetch } from "./api";
import type {
  CreateSubtaskInput,
  CreateTaskInput,
  Subtask,
  Task,
  TaskComment,
  TaskDetail,
  UpdateSubtaskInput,
  UpdateTaskInput,
} from "@/types/api";

export const tasksService = {
  list: (params?: { status?: string; q?: string }) => {
    const query = new URLSearchParams(
      Object.entries(params ?? {}).filter(([, v]) => v),
    ).toString();
    return apiFetch<Task[]>(`/tasks${query ? `?${query}` : ""}`);
  },

  find: (id: string) => apiFetch<TaskDetail>(`/tasks/${id}`),

  create: (body: CreateTaskInput) =>
    apiFetch<Task>("/tasks", { method: "POST", body }),

  update: (id: string, body: UpdateTaskInput) =>
    apiFetch<Task>(`/tasks/${id}`, { method: "PATCH", body }),

  remove: (id: string) =>
    apiFetch<{ removed: boolean }>(`/tasks/${id}`, { method: "DELETE" }),

  addSubtask: (taskId: string, body: CreateSubtaskInput) =>
    apiFetch<Subtask>(`/tasks/${taskId}/subtasks`, { method: "POST", body }),

  updateSubtask: (taskId: string, subtaskId: string, body: UpdateSubtaskInput) =>
    apiFetch<Subtask>(`/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: "PATCH",
      body,
    }),

  removeSubtask: (taskId: string, subtaskId: string) =>
    apiFetch<{ removed: boolean }>(`/tasks/${taskId}/subtasks/${subtaskId}`, {
      method: "DELETE",
    }),

  addComment: (taskId: string, body: string) =>
    apiFetch<TaskComment>(`/tasks/${taskId}/comments`, {
      method: "POST",
      body: { body },
    }),
};

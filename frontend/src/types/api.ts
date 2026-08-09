export type ThemeMode = "light" | "dark";

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string | null;
  name: string;
  username: string | null;
  title: string | null;
  avatarUrl: string | null;
  isGuest: boolean;
  themeMode: ThemeMode;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export type TaskStatus = "todo" | "doing" | "completed" | "on_hold";
export type TaskPriority = "none" | "urgent" | "high" | "medium" | "low";

export interface Task {
  id: string;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeLabel: string | null;
  dueDate: string | null;
  labels: string[];
  position: number;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeLabel?: string;
  dueDate?: string;
  labels?: string[];
}

/** `position` is update-only — creates always append to the column. */
export type UpdateTaskInput = Partial<CreateTaskInput> & { position?: number };

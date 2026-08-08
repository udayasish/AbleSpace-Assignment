import type { TaskPriority, TaskStatus } from "@/types/api";

/** Column order on the board, matching the Figma design. */
export const TASK_STATUSES: TaskStatus[] = [
  "todo",
  "doing",
  "completed",
  "on_hold",
];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  doing: "Doing",
  completed: "Completed",
  on_hold: "On Hold",
};

export const TASK_PRIORITIES: TaskPriority[] = [
  "none",
  "urgent",
  "high",
  "medium",
  "low",
];

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  none: "No Priority",
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

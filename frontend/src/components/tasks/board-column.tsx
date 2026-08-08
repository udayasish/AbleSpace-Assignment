"use client";

import { GripVertical, MoreHorizontal, Plus } from "lucide-react";
import { TaskCard } from "@/components/tasks/task-card";
import { STATUS_LABELS } from "@/lib/task-constants";
import type { Task, TaskStatus } from "@/types/api";

interface Props {
  status: TaskStatus;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
}

/** Figma: 289px fixed, rounded-md, 1px border, bg accent (#F5F5F5), p-2. */
export function BoardColumn({ status, tasks, onAddTask }: Props) {
  return (
    <div className="bg-accent flex h-fit w-[289px] shrink-0 flex-col gap-2 rounded-md border p-2">
      <div className="text-muted-foreground flex items-center gap-1 px-1 text-xs font-medium">
        <GripVertical className="size-3.5" />
        <span className="text-foreground">{STATUS_LABELS[status]}</span>
        <button
          type="button"
          onClick={() => onAddTask(status)}
          aria-label={`Add task to ${STATUS_LABELS[status]}`}
          className="hover:text-foreground ml-auto"
        >
          <Plus className="size-4" />
        </button>
        <button type="button" className="hover:text-foreground">
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}

      <button
        type="button"
        onClick={() => onAddTask(status)}
        className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 rounded-md px-1 py-1.5 text-xs font-medium"
      >
        <Plus className="size-3.5" />
        Add Task
      </button>
    </div>
  );
}

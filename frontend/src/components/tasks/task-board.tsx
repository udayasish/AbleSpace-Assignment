"use client";

import { BoardColumn } from "@/components/tasks/board-column";
import { TASK_STATUSES } from "@/lib/task-constants";
import type { Task, TaskStatus } from "@/types/api";

interface Props {
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
}

/** Figma: columns row, gap 16px, scrolls horizontally when it overflows. */
export function TaskBoard({ tasks, onAddTask }: Props) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {TASK_STATUSES.map((status) => (
        <BoardColumn
          key={status}
          status={status}
          tasks={tasks.filter((task) => task.status === status)}
          onAddTask={onAddTask}
        />
      ))}
    </div>
  );
}

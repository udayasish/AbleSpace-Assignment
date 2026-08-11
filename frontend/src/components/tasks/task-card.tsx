"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { DueDateBadge } from "@/components/tasks/due-date-badge";
import { TaskLabelChip } from "@/components/tasks/task-label-chip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { tasksService } from "@/lib/tasks-service";
import { cn } from "@/lib/utils";
import { removeTask } from "@/store/tasksSlice";
import { useAppDispatch } from "@/store/hooks";
import type { Task } from "@/types/api";

/** Figma: 273px fixed, rounded-md, 1px border, bg background, p-3, gap-2. */
export function TaskCard({ task }: { task: Task }) {
  const dispatch = useAppDispatch();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { status: task.status } });

  const onDelete = async () => {
    try {
      await tasksService.remove(task.id);
      dispatch(removeTask(task.id));
    } catch {
      toast.error("Could not delete task");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "bg-background flex w-[273px] flex-col gap-2 rounded-md border p-3",
        isDragging && "opacity-50",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        {/* The 5px drag threshold lets this stay a real link: click opens, drag moves. */}
        <Link
          href={`/tasks/${task.id}`}
          {...attributes}
          {...listeners}
          className="text-accent-foreground flex-1 cursor-grab text-sm font-medium hover:underline active:cursor-grabbing"
        >
          {task.title}
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground shrink-0">
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem variant="destructive" onClick={onDelete}>
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-muted-foreground flex items-center gap-1.5 text-xs font-medium">
          <Avatar className="size-5">
            <AvatarFallback className="text-[10px]">
              {(task.assigneeLabel ?? "?").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {task.assigneeLabel ?? "Unassigned"}
        </span>
        {task.dueDate && <DueDateBadge date={task.dueDate} />}
      </div>

      {task.labels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {task.labels.map((label) => (
            <TaskLabelChip key={label} label={label} />
          ))}
        </div>
      )}
    </div>
  );
}

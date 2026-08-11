"use client";

import {
  Link2,
  Lock,
  MoreHorizontal,
  PanelRight,
  Share2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { CommentsSection } from "@/components/tasks/detail/comments-section";
import { DetailsPanel } from "@/components/tasks/detail/details-panel";
import { PropertyRow } from "@/components/tasks/detail/property-row";
import { SubtasksSection } from "@/components/tasks/detail/subtasks-section";
import { DueDateBadge } from "@/components/tasks/due-date-badge";
import { TaskLabelChip } from "@/components/tasks/task-label-chip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { initials } from "@/lib/format";
import { tasksService } from "@/lib/tasks-service";
import { removeTask, updateTask } from "@/store/tasksSlice";
import { useAppDispatch } from "@/store/hooks";
import type { TaskDetail, TaskPriority, TaskStatus } from "@/types/api";

export function TaskDetailView({ taskId }: { taskId: string }) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [task, setTask] = useState<TaskDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    tasksService
      .find(taskId)
      .then(setTask)
      .catch(() => setError("Task not found"));
  }, [taskId]);

  const patch = async (body: { status?: TaskStatus; priority?: TaskPriority }) => {
    if (!task) return;

    const previous = task;
    setTask({ ...task, ...body });
    try {
      // Keep the board in sync so going back shows the new column/priority.
      dispatch(updateTask(await tasksService.update(task.id, body)));
    } catch {
      setTask(previous);
      toast.error("Could not update task");
    }
  };

  const onDelete = async () => {
    if (!task) return;
    try {
      await tasksService.remove(task.id);
      dispatch(removeTask(task.id));
      router.push("/tasks");
    } catch {
      toast.error("Could not delete task");
    }
  };

  return (
    <>
      <PageHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/tasks">Tasks</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[40vw] truncate">
                {task?.title ?? "…"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </PageHeader>

      <div className="flex min-w-0 flex-1 flex-col gap-5 p-4">
        {error ? (
          <p className="text-destructive text-sm">{error}</p>
        ) : !task ? (
          <Skeleton className="h-64 w-full rounded-md" />
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 flex-col gap-1.5">
                {/* Figma: Inter 600, 24/32, -0.4px tracking. */}
                <h1 className="text-2xl leading-8 font-semibold tracking-[-0.4px]">
                  {task.title}
                </h1>
                {task.description && (
                  <p className="text-muted-foreground text-sm">
                    {task.description}
                  </p>
                )}
              </div>

              <div className="text-muted-foreground flex shrink-0 items-center gap-3">
                <Lock className="hidden size-4 sm:block" />
                <Share2 className="hidden size-4 sm:block" />
                <DropdownMenu>
                  <DropdownMenuTrigger
                    aria-label="Task actions"
                    className="hover:text-foreground"
                  >
                    <MoreHorizontal className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem variant="destructive" onClick={onDelete}>
                      <Trash2 className="size-4" />
                      Delete task
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <PanelRight className="hidden size-4 sm:block" />
              </div>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row">
              <div className="flex min-w-0 flex-1 flex-col gap-5">
                <div className="flex flex-col gap-3">
                  <PropertyRow label="Properties">
                    <span className="flex items-center gap-1.5 text-sm font-medium">
                      <Avatar className="size-5">
                        <AvatarFallback className="text-[10px]">
                          {initials(task.assigneeLabel)}
                        </AvatarFallback>
                      </Avatar>
                      {task.assigneeLabel ?? "Unassigned"}
                    </span>
                    {task.dueDate && <DueDateBadge date={task.dueDate} />}
                  </PropertyRow>

                  <PropertyRow label="Labels">
                    {task.labels.length > 0 ? (
                      task.labels.map((label) => (
                        <TaskLabelChip key={label} label={label} />
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </PropertyRow>

                  <PropertyRow label="Resources">
                    <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                      <Link2 className="size-3.5" />
                      Add document or link...
                    </span>
                  </PropertyRow>
                </div>

                <SubtasksSection
                  taskId={task.id}
                  subtasks={task.subtasks}
                  onAdded={(subtask) =>
                    setTask((prev) =>
                      prev
                        ? { ...prev, subtasks: [...prev.subtasks, subtask] }
                        : prev,
                    )
                  }
                  onRemoved={(subtaskId) =>
                    setTask((prev) =>
                      prev
                        ? {
                            ...prev,
                            subtasks: prev.subtasks.filter(
                              (s) => s.id !== subtaskId,
                            ),
                          }
                        : prev,
                    )
                  }
                />

                <CommentsSection
                  taskId={task.id}
                  comments={task.comments}
                  onAdded={(comment) =>
                    setTask((prev) =>
                      prev
                        ? { ...prev, comments: [...prev.comments, comment] }
                        : prev,
                    )
                  }
                />
              </div>

              <DetailsPanel task={task} onChange={patch} />
            </div>
          </>
        )}
      </div>
    </>
  );
}

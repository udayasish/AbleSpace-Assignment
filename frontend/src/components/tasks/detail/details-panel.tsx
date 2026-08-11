"use client";

import { Calendar, ChevronDown, Plus, Settings2, Users } from "lucide-react";
import { PriorityIndicator } from "@/components/tasks/priority-indicator";
import { TaskLabelChip } from "@/components/tasks/task-label-chip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate, formatRelative, initials } from "@/lib/format";
import {
  PRIORITY_LABELS,
  STATUS_LABELS,
  TASK_PRIORITIES,
  TASK_STATUSES,
} from "@/lib/task-constants";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import type { TaskDetail, TaskPriority, TaskStatus } from "@/types/api";

const STATUS_DOTS: Record<TaskStatus, string> = {
  todo: "bg-muted-foreground",
  doing: "bg-blue-500",
  completed: "bg-emerald-500",
  on_hold: "bg-amber-500",
};

interface Props {
  task: TaskDetail;
  onChange: (patch: { status?: TaskStatus; priority?: TaskPriority }) => void;
}

/** Figma: 323px, rounded-lg, 1px border, p-3, gap-3; rows 28px with a 90px label. */
export function DetailsPanel({ task, onChange }: Props) {
  const user = useAppSelector((state) => state.auth.userData);

  return (
    <aside className="flex w-full shrink-0 flex-col gap-5 lg:w-[323px]">
      <Collapsible
        defaultOpen
        className="group/details flex flex-col gap-3 rounded-lg border p-3"
      >
        <div className="flex items-center gap-2">
          <CollapsibleTrigger className="text-foreground flex items-center gap-1 text-sm font-medium">
            <ChevronDown className="size-4 transition-transform group-data-[state=closed]/details:-rotate-90" />
            Details
          </CollapsibleTrigger>
          <span className="text-muted-foreground ml-auto flex items-center gap-2">
            <Plus className="size-4" />
            <Settings2 className="size-4" />
          </span>
        </div>

        <CollapsibleContent className="flex flex-col gap-3">
          <DetailRow label="Status">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5 text-sm">
                <span
                  className={cn("size-2 rounded-full", STATUS_DOTS[task.status])}
                />
                {STATUS_LABELS[task.status]}
                <ChevronDown className="text-muted-foreground size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {TASK_STATUSES.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => onChange({ status })}
                  >
                    <span
                      className={cn("size-2 rounded-full", STATUS_DOTS[status])}
                    />
                    {STATUS_LABELS[status]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </DetailRow>

          <DetailRow label="Priority">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5">
                <PriorityIndicator priority={task.priority} />
                <ChevronDown className="text-muted-foreground size-3.5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {TASK_PRIORITIES.map((priority) => (
                  <DropdownMenuItem
                    key={priority}
                    onClick={() => onChange({ priority })}
                  >
                    {PRIORITY_LABELS[priority]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </DetailRow>

          <DetailRow label="Members">
            {task.assigneeLabel ? (
              <span className="flex items-center gap-1.5 text-sm">
                <Avatar className="size-5">
                  <AvatarFallback className="text-[10px]">
                    {initials(task.assigneeLabel)}
                  </AvatarFallback>
                </Avatar>
                {task.assigneeLabel}
              </span>
            ) : (
              <span className="text-muted-foreground flex items-center gap-1.5 text-sm">
                <Users className="size-4" />
                Add members
              </span>
            )}
          </DetailRow>

          <DetailRow label="Dates">
            {task.dueDate ? (
              <span className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium">
                <Calendar className="size-3" />
                {formatDate(task.dueDate)}
              </span>
            ) : (
              <span className="text-muted-foreground text-sm">No due date</span>
            )}
          </DetailRow>

          <DetailRow label="Labels">
            {task.labels.length > 0 ? (
              task.labels.map((label) => (
                <TaskLabelChip key={label} label={label} />
              ))
            ) : (
              <span className="text-muted-foreground text-sm">—</span>
            )}
          </DetailRow>

          <DetailRow label="Teams">
            <span className="text-muted-foreground text-sm">—</span>
          </DetailRow>

          <DetailRow label="Reporter">
            <span className="flex items-center gap-1.5 text-sm">
              <Avatar className="size-5">
                <AvatarFallback className="text-[10px]">
                  {initials(user?.name)}
                </AvatarFallback>
              </Avatar>
              {user?.name ?? "—"}
            </span>
          </DetailRow>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible
        defaultOpen
        className="group/updates flex flex-col gap-3 rounded-lg border p-3"
      >
        <CollapsibleTrigger className="text-foreground flex items-center gap-1 text-sm font-medium">
          <ChevronDown className="size-4 transition-transform group-data-[state=closed]/updates:-rotate-90" />
          Updates
        </CollapsibleTrigger>

        <CollapsibleContent className="flex flex-col gap-3">
          <ActivityRow
            name={user?.name}
            text="created this task"
            at={task.createdAt}
          />
          {task.comments.map((comment) => (
            <ActivityRow
              key={comment.id}
              name={comment.authorName}
              text="posted an update"
              at={comment.createdAt}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </aside>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-7 items-center gap-2">
      <span className="text-muted-foreground w-[90px] shrink-0 text-xs leading-none font-medium">
        {label}
      </span>
      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
        {children}
      </div>
    </div>
  );
}

function ActivityRow({
  name,
  text,
  at,
}: {
  name: string | null | undefined;
  text: string;
  at: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Avatar className="size-5">
        <AvatarFallback className="text-[10px]">
          {initials(name)}
        </AvatarFallback>
      </Avatar>
      <span className="min-w-0 truncate">
        <span className="font-medium">{name ?? "Someone"}</span>{" "}
        <span className="text-muted-foreground">
          {text} · {formatRelative(at)}
        </span>
      </span>
    </div>
  );
}

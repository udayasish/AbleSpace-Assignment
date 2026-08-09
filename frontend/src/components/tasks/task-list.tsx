"use client";

import { ChevronDown, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
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
import type { FieldKey } from "@/components/tasks/fields-dropdown";
import { STATUS_LABELS, TASK_STATUSES } from "@/lib/task-constants";
import { tasksService } from "@/lib/tasks-service";
import { removeTask } from "@/store/tasksSlice";
import { useAppDispatch } from "@/store/hooks";
import type { Task, TaskStatus } from "@/types/api";

interface Props {
  tasks: Task[];
  fields: Record<FieldKey, boolean>;
  onAddTask: (status: TaskStatus) => void;
}

/** Figma: header + cells are h-12 with px-3; header bg base/accent, 1px bottom border. */
export function TaskList({ tasks, fields, onAddTask }: Props) {
  return (
    <div className="flex flex-col gap-6">
      {TASK_STATUSES.map((status) => (
        <StatusGroup
          key={status}
          status={status}
          tasks={tasks.filter((task) => task.status === status)}
          fields={fields}
          onAddTask={onAddTask}
        />
      ))}
    </div>
  );
}

function StatusGroup({
  status,
  tasks,
  fields,
  onAddTask,
}: Props & { status: TaskStatus }) {
  const dispatch = useAppDispatch();

  const onDelete = async (id: string) => {
    try {
      await tasksService.remove(id);
      dispatch(removeTask(id));
    } catch {
      toast.error("Could not delete task");
    }
  };

  return (
    <Collapsible defaultOpen className="group/group">
      <CollapsibleTrigger className="text-foreground mb-2 flex items-center gap-1 text-sm font-medium">
        <ChevronDown className="size-4 transition-transform group-data-[state=closed]/group:-rotate-90" />
        {STATUS_LABELS[status]}
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="overflow-hidden rounded-md border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-accent border-b">
                <th className="text-muted-foreground h-12 px-3 text-left font-medium">
                  Task
                </th>
                {fields.priority && (
                  <th className="text-muted-foreground h-12 w-32 px-3 text-left font-medium">
                    Priority
                  </th>
                )}
                {fields.members && (
                  <th className="text-muted-foreground h-12 w-28 px-3 text-left font-medium">
                    Members
                  </th>
                )}
                {fields.dueDate && (
                  <th className="text-muted-foreground h-12 w-32 px-3 text-left font-medium">
                    Due Date
                  </th>
                )}
                {fields.labels && (
                  <th className="text-muted-foreground h-12 px-3 text-left font-medium">
                    Labels
                  </th>
                )}
                {fields.status && (
                  <th className="text-muted-foreground h-12 w-28 px-3 text-left font-medium">
                    Status
                  </th>
                )}
                <th className="text-muted-foreground h-12 w-20 px-3 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b last:border-b-0">
                  <td className="h-12 px-3">{task.title}</td>
                  {fields.priority && (
                    <td className="h-12 px-3">
                      <PriorityIndicator priority={task.priority} />
                    </td>
                  )}
                  {fields.members && (
                    <td className="h-12 px-3">
                      <Avatar className="size-6">
                        <AvatarFallback className="text-[10px]">
                          {(task.assigneeLabel ?? "?").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </td>
                  )}
                  {fields.dueDate && (
                    <td className="text-muted-foreground h-12 px-3">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                  )}
                  {fields.labels && (
                    <td className="h-12 px-3">
                      <div className="flex flex-wrap gap-1.5">
                        {task.labels.map((label) => (
                          <TaskLabelChip key={label} label={label} />
                        ))}
                      </div>
                    </td>
                  )}
                  {fields.status && (
                    <td className="text-muted-foreground h-12 px-3">
                      {STATUS_LABELS[task.status]}
                    </td>
                  )}
                  <td className="h-12 px-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onDelete(task.id)}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan={8} className="h-12 px-3">
                  <button
                    type="button"
                    onClick={() => onAddTask(status)}
                    className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm font-medium"
                  >
                    <Plus className="size-4" />
                    Add Task
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

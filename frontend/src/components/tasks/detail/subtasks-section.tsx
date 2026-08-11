"use client";

import { ChevronDown, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PriorityIndicator } from "@/components/tasks/priority-indicator";
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
import { Input } from "@/components/ui/input";
import { formatDate, initials } from "@/lib/format";
import { tasksService } from "@/lib/tasks-service";
import type { Subtask } from "@/types/api";

interface Props {
  taskId: string;
  subtasks: Subtask[];
  onAdded: (subtask: Subtask) => void;
  onRemoved: (subtaskId: string) => void;
}

/** Figma: rounded-md card, 5 equal columns, head 48px, cells 44px. */
export function SubtasksSection({
  taskId,
  subtasks,
  onAdded,
  onRemoved,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const value = title.trim();
    if (!value) return setAdding(false);

    setSaving(true);
    try {
      onAdded(await tasksService.addSubtask(taskId, { title: value }));
      setTitle("");
      setAdding(false);
    } catch {
      toast.error("Could not add subtask");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (subtaskId: string) => {
    try {
      await tasksService.removeSubtask(taskId, subtaskId);
      onRemoved(subtaskId);
    } catch {
      toast.error("Could not delete subtask");
    }
  };

  return (
    <Collapsible defaultOpen className="group/subtasks flex flex-col gap-4">
      <CollapsibleTrigger className="text-foreground flex items-center gap-1 text-sm font-medium">
        <ChevronDown className="size-4 transition-transform group-data-[state=closed]/subtasks:-rotate-90" />
        Subtasks
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="overflow-x-auto rounded-md border">
          {/* Figma splits the columns evenly, but auto layout keeps real titles readable. */}
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-muted-foreground h-12 px-3 text-left font-medium whitespace-nowrap">
                  Task
                </th>
                <th className="text-muted-foreground h-12 px-3 text-left font-medium whitespace-nowrap">
                  Priority
                </th>
                <th className="text-muted-foreground h-12 px-3 text-left font-medium whitespace-nowrap">
                  Members
                </th>
                <th className="text-muted-foreground h-12 px-3 text-left font-medium whitespace-nowrap">
                  Due Date
                </th>
                <th className="text-muted-foreground h-12 px-3 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {subtasks.map((subtask) => (
                <tr key={subtask.id} className="border-b">
                  <td className="h-11 px-3 font-medium">{subtask.title}</td>
                  <td className="h-11 px-3 whitespace-nowrap">
                    <PriorityIndicator priority={subtask.priority} />
                  </td>
                  <td className="h-11 px-3">
                    {subtask.assigneeLabel ? (
                      <Avatar className="size-6">
                        <AvatarFallback className="text-[10px]">
                          {initials(subtask.assigneeLabel)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <span className="text-muted-foreground">
                        <Plus className="size-4" />
                      </span>
                    )}
                  </td>
                  <td className="text-muted-foreground h-11 px-3 whitespace-nowrap">
                    {subtask.dueDate ? formatDate(subtask.dueDate) : "—"}
                  </td>
                  <td className="h-11 px-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        aria-label={`Actions for ${subtask.title}`}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <MoreHorizontal className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => remove(subtask.id)}
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
                <td colSpan={5} className="h-11 px-3">
                  {adding ? (
                    <Input
                      autoFocus
                      disabled={saving}
                      value={title}
                      placeholder="Subtask title"
                      onChange={(e) => setTitle(e.target.value)}
                      onBlur={submit}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") submit();
                        if (e.key === "Escape") {
                          setTitle("");
                          setAdding(false);
                        }
                      }}
                      className="h-7 max-w-sm"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setAdding(true)}
                      className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm font-medium"
                    >
                      <Plus className="size-4" />
                      Add Subtasks
                    </button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

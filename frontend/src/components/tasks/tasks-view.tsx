"use client";

import { Filter, Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import {
  FieldsDropdown,
  FIELD_KEYS,
  type BoardView,
  type FieldKey,
} from "@/components/tasks/fields-dropdown";
import { TaskBoard } from "@/components/tasks/task-board";
import { TaskList } from "@/components/tasks/task-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { tasksService } from "@/lib/tasks-service";
import { setError, setTasks } from "@/store/tasksSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { TaskStatus } from "@/types/api";

const DEFAULT_FIELDS: Record<FieldKey, boolean> = {
  priority: true,
  members: true,
  dueDate: true,
  labels: false,
  status: false,
};

export function TasksView() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.tasks);

  const [view, setView] = useState<BoardView>("board");
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState<TaskStatus>("todo");

  useEffect(() => {
    tasksService
      .list()
      .then((tasks) => dispatch(setTasks(tasks)))
      .catch(() => dispatch(setError("Could not load tasks")));
  }, [dispatch]);

  // Filtering client-side keeps typing instant; the API also supports ?q=.
  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((task) => task.title.toLowerCase().includes(term));
  }, [items, query]);

  const openDialog = (status: TaskStatus) => {
    setDialogStatus(status);
    setDialogOpen(true);
  };

  return (
    // min-w-0 lets the scroll boxes shrink; flex children default to min-width:auto.
    <div className="flex min-w-0 flex-1 flex-col gap-4 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Tasks</h1>

        <div className="flex flex-wrap items-center gap-2">
          {searching ? (
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks…"
                className="h-8 w-full pl-8 sm:w-56"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => {
                  setSearching(false);
                  setQuery("");
                }}
                className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              onClick={() => setSearching(true)}
            >
              <Search className="size-4" />
            </Button>
          )}

          <FieldsDropdown
            view={view}
            onViewChange={setView}
            fields={fields}
            onFieldChange={(key, value) =>
              setFields((prev) => ({ ...prev, [key]: value }))
            }
          />

          <Button variant="ghost" size="icon" aria-label="Filter">
            <Filter className="size-4" />
          </Button>

          {/* Figma toolbar buttons: h-8, rounded-md, text-xs, gap-1, px-3. */}
          <Button
            className="gap-1 rounded-md px-3 text-xs"
            onClick={() => openDialog("todo")}
          >
            <Plus className="size-4" />
            Add Task
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 w-[289px] shrink-0 rounded-md" />
          ))}
        </div>
      ) : error ? (
        <p className="text-destructive text-sm">{error}</p>
      ) : view === "board" ? (
        <TaskBoard tasks={visible} onAddTask={openDialog} />
      ) : (
        <TaskList tasks={visible} fields={fields} onAddTask={openDialog} />
      )}

      <CreateTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultStatus={dialogStatus}
      />
    </div>
  );
}

export { FIELD_KEYS };

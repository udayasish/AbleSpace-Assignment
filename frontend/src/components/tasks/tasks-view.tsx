"use client";

import { Filter, ListFilter, Plus, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { TaskBoard } from "@/components/tasks/task-board";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { tasksService } from "@/lib/tasks-service";
import { setError, setTasks } from "@/store/tasksSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { TaskStatus } from "@/types/api";

export function TasksView() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.tasks);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStatus, setDialogStatus] = useState<TaskStatus>("todo");

  useEffect(() => {
    tasksService
      .list()
      .then((tasks) => dispatch(setTasks(tasks)))
      .catch(() => dispatch(setError("Could not load tasks")));
  }, [dispatch]);

  const openDialog = (status: TaskStatus) => {
    setDialogStatus(status);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="size-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ListFilter className="size-4" />
            Fields
          </Button>
          <Button variant="ghost" size="icon" aria-label="Filter">
            <Filter className="size-4" />
          </Button>
          <Button size="sm" onClick={() => openDialog("todo")}>
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
      ) : (
        <TaskBoard tasks={items} onAddTask={openDialog} />
      )}

      <CreateTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        defaultStatus={dialogStatus}
      />
    </div>
  );
}

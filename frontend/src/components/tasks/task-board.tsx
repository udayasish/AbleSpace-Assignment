"use client";

import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useState } from "react";
import { toast } from "sonner";
import { BoardColumn } from "@/components/tasks/board-column";
import { TaskCard } from "@/components/tasks/task-card";
import { positionForIndex } from "@/lib/position";
import { TASK_STATUSES } from "@/lib/task-constants";
import { tasksService } from "@/lib/tasks-service";
import { setTasks, updateTask } from "@/store/tasksSlice";
import { useAppDispatch } from "@/store/hooks";
import type { Task, TaskStatus } from "@/types/api";

interface Props {
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
}

const byStatus = (tasks: Task[], status: TaskStatus) =>
  tasks
    .filter((task) => task.status === status)
    .sort((a, b) => a.position - b.position);

/** Figma: columns row, gap 16px, scrolls horizontally when it overflows. */
export function TaskBoard({ tasks, onAddTask }: Props) {
  const dispatch = useAppDispatch();
  const [dragging, setDragging] = useState<Task | null>(null);

  // A small distance threshold keeps the card's menu button clickable.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const onDragStart = (event: DragStartEvent) => {
    setDragging(tasks.find((t) => t.id === event.active.id) ?? null);
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setDragging(null);
    if (!over) return;

    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    const overId = String(over.id);
    const targetStatus = overId.startsWith("column-")
      ? (overId.replace("column-", "") as TaskStatus)
      : (tasks.find((t) => t.id === over.id)?.status ?? task.status);

    const siblings = byStatus(tasks, targetStatus).filter(
      (t) => t.id !== task.id,
    );
    const index = overId.startsWith("column-")
      ? siblings.length
      : siblings.findIndex((t) => t.id === over.id);

    const insertAt = index === -1 ? siblings.length : index;
    const position = positionForIndex(siblings, insertAt);

    if (targetStatus === task.status && position === task.position) return;

    const previous = tasks;
    dispatch(updateTask({ ...task, status: targetStatus, position }));

    try {
      const saved = await tasksService.update(task.id, {
        status: targetStatus,
        position,
      });
      dispatch(updateTask(saved));
    } catch {
      dispatch(setTasks(previous));
      toast.error("Could not move task");
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {TASK_STATUSES.map((status) => (
          <BoardColumn
            key={status}
            status={status}
            tasks={byStatus(tasks, status)}
            onAddTask={onAddTask}
          />
        ))}
      </div>

      <DragOverlay>{dragging && <TaskCard task={dragging} />}</DragOverlay>
    </DndContext>
  );
}

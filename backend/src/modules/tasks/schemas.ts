import { z } from 'zod';

export const taskStatuses = ['todo', 'doing', 'completed', 'on_hold'] as const;
export const taskPriorities = [
  'none',
  'urgent',
  'high',
  'medium',
  'low',
] as const;

export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  status: z.enum(taskStatuses).default('todo'),
  priority: z.enum(taskPriorities).default('none'),
  assigneeLabel: z.string().max(60).optional(),
  dueDate: z.iso.datetime().optional(),
  labels: z.array(z.string().min(1).max(40)).max(10).default([]),
});

/** `position` is settable only on update — creates always append to the column. */
export const updateTaskSchema = createTaskSchema
  .partial()
  .extend({ position: z.number().optional() });

export const listTasksQuerySchema = z.object({
  status: z.enum(taskStatuses).optional(),
  q: z.string().max(255).optional(),
});

export const taskIdSchema = z.uuid();

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
export type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;

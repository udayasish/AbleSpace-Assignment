import { z } from 'zod';
import { taskPriorities } from '../tasks/schemas';

export const createProjectSchema = z.object({
  name: z.string().min(1).max(255),
  priority: z.enum(taskPriorities).default('none'),
  leadLabel: z.string().max(60).optional(),
  dueDate: z.iso.datetime().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectIdSchema = z.uuid();

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;

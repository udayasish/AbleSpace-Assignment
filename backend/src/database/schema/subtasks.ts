import {
  doublePrecision,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { commonFields } from './common';
import { taskPriorityEnum, tasks } from './tasks';

export const subtasks = pgTable('subtasks', {
  ...commonFields,

  taskId: uuid('task_id')
    .notNull()
    .references(() => tasks.id, { onDelete: 'cascade' }),

  title: varchar('title', { length: 255 }).notNull(),
  priority: taskPriorityEnum('priority').notNull().default('none'),
  assigneeLabel: varchar('assignee_label', { length: 60 }),
  dueDate: timestamp('due_date', { withTimezone: true }),

  position: doublePrecision('position').notNull(),
});

export type Subtask = typeof subtasks.$inferSelect;

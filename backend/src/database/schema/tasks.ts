import {
  doublePrecision,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { commonFields } from './common';
import { users } from './users';

export const taskStatusEnum = pgEnum('task_status', [
  'todo',
  'doing',
  'completed',
  'on_hold',
]);

export const taskPriorityEnum = pgEnum('task_priority', [
  'none',
  'urgent',
  'high',
  'medium',
  'low',
]);

export const tasks = pgTable('tasks', {
  ...commonFields,

  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),

  status: taskStatusEnum('status').notNull().default('todo'),
  priority: taskPriorityEnum('priority').notNull().default('none'),

  /** Free-text owner shown on the card ("Admin", "QA Team"). */
  assigneeLabel: varchar('assignee_label', { length: 60 }),
  dueDate: timestamp('due_date', { withTimezone: true }),
  labels: text('labels').array().notNull().default([]),

  /** Sort key within a column. Float so cards can be inserted between two others. */
  position: doublePrecision('position').notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;

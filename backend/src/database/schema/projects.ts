import {
  doublePrecision,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { commonFields } from './common';
import { taskPriorityEnum } from './tasks';
import { users } from './users';

export const projects = pgTable('projects', {
  ...commonFields,

  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  name: varchar('name', { length: 255 }).notNull(),
  priority: taskPriorityEnum('priority').notNull().default('none'),

  /** Free-text lead shown in the table ("CN", "Admin"). */
  leadLabel: varchar('lead_label', { length: 60 }),
  dueDate: timestamp('due_date', { withTimezone: true }),

  position: doublePrecision('position').notNull(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

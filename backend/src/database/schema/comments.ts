import { pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { commonFields } from './common';
import { tasks } from './tasks';
import { users } from './users';

export const comments = pgTable('comments', {
  ...commonFields,

  taskId: uuid('task_id')
    .notNull()
    .references(() => tasks.id, { onDelete: 'cascade' }),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  body: text('body').notNull(),
});

export type Comment = typeof comments.$inferSelect;

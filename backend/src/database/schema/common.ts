import { timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Columns every table gets. Spread this into a table definition instead of
 * repeating id/createdAt/updatedAt everywhere.
 *
 * `$onUpdate` makes Drizzle bump `updated_at` automatically on every UPDATE,
 * so we never have to remember to set it by hand.
 */
export const commonFields = {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

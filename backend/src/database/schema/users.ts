import { boolean, pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { commonFields } from './common';

/** Light / dark, matching the Theme dropdown in the Figma design. */
export const themeModeEnum = pgEnum('theme_mode', ['light', 'dark']);

/**
 * One row per person, whether they registered or tapped "Continue as Guest".
 *
 * Guests are real users with `isGuest = true` and no email/password — that way
 * every downstream feature (tasks, projects, comments) works identically for
 * them, and a guest can later be upgraded to a full account in place without
 * migrating any of their data.
 */
export const users = pgTable('users', {
  ...commonFields,

  /** Null for guests; unique for registered users. */
  email: varchar('email', { length: 255 }).unique(),
  /** Argon2id hash. Null for guests, who have no password. */
  passwordHash: text('password_hash'),

  name: varchar('name', { length: 120 }).notNull(),
  username: varchar('username', { length: 60 }),
  title: varchar('title', { length: 120 }),
  avatarUrl: text('avatar_url'),

  isGuest: boolean('is_guest').notNull().default(false),

  /**
   * Persisted so the chosen theme follows the account across browsers, not
   * just the device that set it. The client still keeps a copy in localStorage
   * so the correct theme paints before the first API call returns.
   */
  themeMode: themeModeEnum('theme_mode').notNull().default('light'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

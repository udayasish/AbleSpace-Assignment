import { boolean, pgEnum, pgTable, text, varchar } from 'drizzle-orm/pg-core';
import { commonFields } from './common';

export const themeModeEnum = pgEnum('theme_mode', ['light', 'dark']);

/** Registered and guest users share this table; guests have no email/password. */
export const users = pgTable('users', {
  ...commonFields,

  email: varchar('email', { length: 255 }).unique(),
  passwordHash: text('password_hash'),

  name: varchar('name', { length: 120 }).notNull(),
  username: varchar('username', { length: 60 }),
  title: varchar('title', { length: 120 }),
  avatarUrl: text('avatar_url'),

  isGuest: boolean('is_guest').notNull().default(false),
  themeMode: themeModeEnum('theme_mode').notNull().default('light'),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

import { timestamp, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { commonFields } from './common';
import { users } from './users';

/** One row per active session. Rotated on refresh, so a token is usable once. */
export const refreshTokens = pgTable('refresh_tokens', {
  ...commonFields,

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  /** SHA-256 of the issued token, never the token itself. */
  tokenHash: text('token_hash').notNull(),

  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  /** Null while valid; set on rotation or logout. */
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
});

export type RefreshToken = typeof refreshTokens.$inferSelect;

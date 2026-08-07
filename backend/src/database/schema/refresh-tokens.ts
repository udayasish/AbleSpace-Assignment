import { timestamp, pgTable, text, uuid } from 'drizzle-orm/pg-core';
import { commonFields } from './common';
import { users } from './users';

/**
 * Refresh tokens live in the database so they can be revoked.
 *
 * Access tokens are short-lived JWTs we never store — they're verified by
 * signature alone. A refresh token is long-lived, so we need the ability to
 * kill it (on logout, or if it's stolen). We store only a HASH of it: if this
 * table leaked, the rows still couldn't be replayed as valid tokens.
 *
 * On each refresh the old row is revoked and a new one issued (rotation), so a
 * stolen token is usable at most once before it stops working.
 */
export const refreshTokens = pgTable('refresh_tokens', {
  ...commonFields,

  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  /** SHA-256 of the token we handed out — never the token itself. */
  tokenHash: text('token_hash').notNull(),

  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  /** Set when the token is rotated or the user logs out. Null = still valid. */
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
});

export type RefreshToken = typeof refreshTokens.$inferSelect;

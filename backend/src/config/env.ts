import { z } from 'zod';

/**
 * Every environment variable the app needs, described once.
 *
 * The app refuses to boot if any of these are missing or malformed, so we never
 * discover a bad config halfway through a request. Same approach as the
 * reference project's `src/lib/env.ts`, wired into Nest's ConfigModule.
 */
export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z.url(),

  /** Long random string. Anyone holding this can mint valid tokens. */
  JWT_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  /** Where the Next.js app is served from — needed for CORS + cookies. */
  CORS_ORIGIN: z.url().default('http://localhost:3000'),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Handed to `ConfigModule.forRoot({ validate })`. Nest calls this once at
 * startup with `process.env`; throwing here aborts the boot with a readable
 * list of what's wrong rather than a stack trace.
 */
export function validateEnv(raw: Record<string, unknown>): Env {
  const parsed = envSchema.safeParse(raw);

  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }

  return parsed.data;
}

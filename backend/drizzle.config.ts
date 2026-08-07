import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

/**
 * Config for the drizzle-kit CLI (migration generation + running).
 *
 * This runs outside the Nest app, so it can't use ConfigService — it loads
 * `.env` directly via dotenv.
 */
export default defineConfig({
  schema: './src/database/schema/index.ts',
  out: './src/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});

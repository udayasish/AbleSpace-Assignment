import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

/**
 * Injection token for the Drizzle instance. We use a symbol rather than a
 * string so it can't collide with another provider by accident.
 */
export const DRIZZLE = Symbol('DRIZZLE');

/** Handy alias so services can write `@Inject(DRIZZLE) private db: Database`. */
export type Database = NodePgDatabase<typeof schema>;

/**
 * `@Global()` means any module can inject DRIZZLE without importing
 * DatabaseModule first — the database is genuinely app-wide infrastructure,
 * so this saves repeating the import in every feature module.
 */
@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Database => {
        const pool = new Pool({
          connectionString: config.getOrThrow<string>('DATABASE_URL'),
        });
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DatabaseModule {}

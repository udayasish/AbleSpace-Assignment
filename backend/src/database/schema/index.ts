/**
 * Barrel for every table. Drizzle needs the whole schema object in one place
 * so `db.query.<table>` is typed, and drizzle-kit reads this file to generate
 * migrations.
 */
export * from './common';
export * from './users';
export * from './refresh-tokens';

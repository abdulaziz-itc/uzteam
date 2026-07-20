import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Do not crash at import time (build/CI may not have a DB) — fail on first query instead.
  console.warn('⚠️  DATABASE_URL is not set. Database queries will fail until it is configured.');
}

// Reuse a single pool across hot-reloads in dev.
const globalForDb = globalThis as unknown as { __uzteamPool?: Pool };

const pool =
  globalForDb.__uzteamPool ??
  new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.__uzteamPool = pool;
}

export const db = drizzle(pool, { schema });
export { schema };
export * from './schema';

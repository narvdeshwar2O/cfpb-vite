import pkg from "pg";
import { config } from "../config.js";

const { Pool } = pkg;

/**
 * Shared PostgreSQL connection pool for the auth server.
 * A single pool is reused across requests for efficient connection handling.
 */
export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
});

export async function query<T extends pkg.QueryResultRow = pkg.QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<pkg.QueryResult<T>> {
  return pool.query<T>(text, params as any[]);
}

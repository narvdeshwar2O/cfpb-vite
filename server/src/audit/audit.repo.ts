import pkg from "pg";
import { pool, query } from "../db/pool.js";

export type AuditActorType = "user" | "super_admin" | "system" | "service";
export type AuditOutcome = "success" | "failure" | "denied";

export interface CreateAuditLogParams {
  actorId?: string | null;
  actorUsername?: string | null;
  actorType?: AuditActorType;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  outcome: AuditOutcome;
  failureReason?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  details?: Record<string, unknown> | null;
}

export interface AuditLogDto {
  id: string;
  timestamp: string;
  actorId: string | null;
  actorUsername: string | null;
  actorType: AuditActorType;
  action: string;
  resourceType: string;
  resourceId: string | null;
  outcome: AuditOutcome;
  failureReason: string | null;
  clientIp: string | null;
  userAgent: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
}

export interface AuditLogQueryFilters {
  startDate?: string;
  endDate?: string;
  actorUsername?: string;
  action?: string;
  resourceType?: string;
  outcome?: AuditOutcome;
  clientIp?: string;
  limit?: number;
  offset?: number;
}

/** Redacts sensitive keys before persisting details to audit_logs */
export function sanitizeAuditDetails(details?: Record<string, unknown> | null): Record<string, unknown> | null {
  if (!details) return null;
  const sensitiveKeys = new Set([
    "password",
    "passwordhash",
    "password_hash",
    "bindpassword",
    "bind_password",
    "token",
    "jwt",
    "secret",
    "clientsecret",
  ]);

  function clean(val: any): any {
    if (val === null || val === undefined) return val;
    if (Array.isArray(val)) return val.map(clean);
    if (typeof val === "object") {
      const result: Record<string, any> = {};
      for (const [k, v] of Object.entries(val)) {
        const normKey = k.toLowerCase().replace(/[-_]/g, "");
        if (sensitiveKeys.has(normKey) || sensitiveKeys.has(k.toLowerCase())) {
          result[k] = "[REDACTED]";
        } else if (typeof v === "object") {
          result[k] = clean(v);
        } else {
          result[k] = v;
        }
      }
      return result;
    }
    return val;
  }

  return clean(details);
}

/**
 * Durably records an audit event.
 * If a transaction client is passed, persists atomically within that transaction.
 */
export async function logAuditEvent(
  params: CreateAuditLogParams,
  client?: pkg.PoolClient
): Promise<string> {
  const sanitizedDetails = sanitizeAuditDetails(params.details);
  const sql = `
    INSERT INTO audit_logs (
      actor_id, actor_username, actor_type,
      action, resource_type, resource_id,
      outcome, failure_reason,
      client_ip, user_agent, details
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING id
  `;
  const values = [
    params.actorId || null,
    params.actorUsername || null,
    params.actorType || "user",
    params.action,
    params.resourceType,
    params.resourceId || null,
    params.outcome,
    params.failureReason || null,
    params.clientIp || null,
    params.userAgent || null,
    sanitizedDetails ? JSON.stringify(sanitizedDetails) : null,
  ];

  if (client) {
    const res = await client.query<{ id: string }>(sql, values);
    return res.rows[0].id;
  }

  const res = await query<{ id: string }>(sql, values);
  return res.rows[0].id;
}

/**
 * Queries audit logs with pagination and multi-attribute filters.
 */
export async function queryAuditLogs(
  filters: AuditLogQueryFilters
): Promise<{ logs: AuditLogDto[]; total: number }> {
  const conditions: string[] = [];
  const values: unknown[] = [];
  let paramIdx = 1;

  if (filters.startDate) {
    conditions.push(`timestamp >= $${paramIdx++}`);
    values.push(filters.startDate);
  }
  if (filters.endDate) {
    conditions.push(`timestamp <= $${paramIdx++}`);
    values.push(filters.endDate);
  }
  if (filters.actorUsername) {
    conditions.push(`actor_username ILIKE $${paramIdx++}`);
    values.push(`%${filters.actorUsername.trim()}%`);
  }
  if (filters.action) {
    conditions.push(`action = $${paramIdx++}`);
    values.push(filters.action.trim());
  }
  if (filters.resourceType) {
    conditions.push(`resource_type = $${paramIdx++}`);
    values.push(filters.resourceType.trim());
  }
  if (filters.outcome) {
    conditions.push(`outcome = $${paramIdx++}`);
    values.push(filters.outcome);
  }
  if (filters.clientIp) {
    conditions.push(`client_ip = $${paramIdx++}::inet`);
    values.push(filters.clientIp.trim());
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Get total count
  const countSql = `SELECT COUNT(*) AS total FROM audit_logs ${whereClause}`;
  const countRes = await query<{ total: string }>(countSql, values);
  const total = parseInt(countRes.rows[0]?.total ?? "0", 10);

  // Pagination bounds
  const limit = Math.min(Math.max(Number(filters.limit) || 25, 1), 100);
  const offset = Math.max(Number(filters.offset) || 0, 0);

  const selectSql = `
    SELECT id, timestamp, actor_id, actor_username, actor_type,
           action, resource_type, resource_id, outcome, failure_reason,
           host(client_ip) AS client_ip, user_agent, details, created_at
      FROM audit_logs
     ${whereClause}
     ORDER BY timestamp DESC
     LIMIT $${paramIdx++} OFFSET $${paramIdx++}
  `;
  values.push(limit, offset);

  const res = await query<any>(selectSql, values);

  const logs: AuditLogDto[] = res.rows.map((row) => ({
    id: row.id,
    timestamp: row.timestamp instanceof Date ? row.timestamp.toISOString() : String(row.timestamp),
    actorId: row.actor_id,
    actorUsername: row.actor_username,
    actorType: row.actor_type,
    action: row.action,
    resourceType: row.resource_type,
    resourceId: row.resource_id,
    outcome: row.outcome,
    failureReason: row.failure_reason,
    clientIp: row.client_ip,
    userAgent: row.user_agent,
    details: row.details,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  }));

  return { logs, total };
}

/** Retrieves single audit event by ID */
export async function getAuditLogById(id: string): Promise<AuditLogDto | null> {
  const sql = `
    SELECT id, timestamp, actor_id, actor_username, actor_type,
           action, resource_type, resource_id, outcome, failure_reason,
           host(client_ip) AS client_ip, user_agent, details, created_at
      FROM audit_logs
     WHERE id = $1
  `;
  const res = await query<any>(sql, [id]);
  const row = res.rows[0];
  if (!row) return null;

  return {
    id: row.id,
    timestamp: row.timestamp instanceof Date ? row.timestamp.toISOString() : String(row.timestamp),
    actorId: row.actor_id,
    actorUsername: row.actor_username,
    actorType: row.actor_type,
    action: row.action,
    resourceType: row.resource_type,
    resourceId: row.resource_id,
    outcome: row.outcome,
    failureReason: row.failure_reason,
    clientIp: row.client_ip,
    userAgent: row.user_agent,
    details: row.details,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at),
  };
}


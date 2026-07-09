import bcrypt from "bcryptjs";
import { pool, query } from "../db/pool.js";

const GUARD = "web";
const MODEL_TYPE = "User";

export interface RoleDto {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
}

export interface AdminUserDto {
  id: string;
  username: string;
  fullName: string | null;
  state: string | null;
  isActive: boolean;
  roles: string[];
}

// ── Permissions ──────────────────────────────────────────────────────────────
export async function listPermissions(): Promise<
  Array<{ id: string; name: string; description: string | null }>
> {
  const res = await query<{ id: string; name: string; description: string | null }>(
    `SELECT id, name, description FROM permissions WHERE guard_name = $1 ORDER BY name`,
    [GUARD]
  );
  return res.rows;
}

export async function createPermission(
  name: string,
  description: string | null
): Promise<string> {
  const res = await query<{ id: string }>(
    `INSERT INTO permissions (name, guard_name, description)
     VALUES ($1, $2, $3)
     ON CONFLICT (name, guard_name) DO UPDATE SET description = EXCLUDED.description
     RETURNING id`,
    [name, GUARD, description]
  );
  return res.rows[0].id;
}

// ── Roles ────────────────────────────────────────────────────────────────────
export async function listRoles(): Promise<RoleDto[]> {
  const res = await query<{
    id: string;
    name: string;
    description: string | null;
    permissions: string[] | null;
  }>(
    `SELECT r.id, r.name, r.description,
            COALESCE(array_agg(p.name) FILTER (WHERE p.name IS NOT NULL), '{}') AS permissions
       FROM roles r
       LEFT JOIN role_has_permissions rhp ON rhp.role_id = r.id
       LEFT JOIN permissions p ON p.id = rhp.permission_id
      WHERE r.guard_name = $1
      GROUP BY r.id, r.name, r.description
      ORDER BY r.name`,
    [GUARD]
  );
  return res.rows.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    permissions: r.permissions ?? [],
  }));
}

export async function createRole(
  name: string,
  description: string | null
): Promise<string> {
  const res = await query<{ id: string }>(
    `INSERT INTO roles (name, guard_name, description)
     VALUES ($1, $2, $3)
     ON CONFLICT (name, guard_name) DO UPDATE SET description = EXCLUDED.description
     RETURNING id`,
    [name, GUARD, description]
  );
  return res.rows[0].id;
}

/** Replaces a role's permission set (Spatie syncPermissions). */
export async function syncRolePermissions(
  roleId: string,
  permissionNames: string[]
): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(`DELETE FROM role_has_permissions WHERE role_id = $1`, [roleId]);
    if (permissionNames.length > 0) {
      await client.query(
        `INSERT INTO role_has_permissions (permission_id, role_id)
         SELECT p.id, $1 FROM permissions p
          WHERE p.guard_name = $2 AND p.name = ANY($3::text[])
         ON CONFLICT DO NOTHING`,
        [roleId, GUARD, permissionNames]
      );
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function roleExists(roleId: string): Promise<boolean> {
  const res = await query(`SELECT 1 FROM roles WHERE id = $1`, [roleId]);
  return res.rowCount! > 0;
}

// ── Users ────────────────────────────────────────────────────────────────────
export async function listUsers(): Promise<AdminUserDto[]> {
  const res = await query<{
    id: string;
    username: string;
    full_name: string | null;
    state: string | null;
    is_active: boolean;
    roles: string[] | null;
  }>(
    `SELECT u.id, u.username, u.full_name, u.state, u.is_active,
            COALESCE(array_agg(r.name) FILTER (WHERE r.name IS NOT NULL), '{}') AS roles
       FROM users u
       LEFT JOIN model_has_roles mhr ON mhr.model_id = u.id AND mhr.model_type = $1
       LEFT JOIN roles r ON r.id = mhr.role_id
      GROUP BY u.id, u.username, u.full_name, u.state, u.is_active
      ORDER BY u.username`,
    [MODEL_TYPE]
  );
  return res.rows.map((u) => ({
    id: u.id,
    username: u.username,
    fullName: u.full_name,
    state: u.state,
    isActive: u.is_active,
    roles: u.roles ?? [],
  }));
}

export async function createUser(input: {
  username: string;
  password: string;
  fullName: string | null;
  state: string | null;
}): Promise<string> {
  const hash = await bcrypt.hash(input.password, 10);
  const res = await query<{ id: string }>(
    `INSERT INTO users (username, password_hash, full_name, state, is_active)
     VALUES ($1, $2, $3, $4, TRUE)
     RETURNING id`,
    [input.username, hash, input.fullName, input.state]
  );
  return res.rows[0].id;
}

export async function usernameTaken(username: string): Promise<boolean> {
  const res = await query(`SELECT 1 FROM users WHERE username = $1`, [username]);
  return res.rowCount! > 0;
}

export async function userExists(userId: string): Promise<boolean> {
  const res = await query(`SELECT 1 FROM users WHERE id = $1`, [userId]);
  return res.rowCount! > 0;
}

/** Replaces a user's role set (Spatie syncRoles). */
export async function syncUserRoles(userId: string, roleNames: string[]): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(
      `DELETE FROM model_has_roles WHERE model_id = $1 AND model_type = $2`,
      [userId, MODEL_TYPE]
    );
    if (roleNames.length > 0) {
      await client.query(
        `INSERT INTO model_has_roles (role_id, model_type, model_id)
         SELECT r.id, $2, $1 FROM roles r
          WHERE r.guard_name = $3 AND r.name = ANY($4::text[])
         ON CONFLICT DO NOTHING`,
        [userId, MODEL_TYPE, GUARD, roleNames]
      );
    }
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function setUserState(
  userId: string,
  state: string | null
): Promise<void> {
  await query(`UPDATE users SET state = $1, updated_at = now() WHERE id = $2`, [
    state,
    userId,
  ]);
}

/** Activates or deactivates a user. Deactivated users cannot log in. */
export async function setUserActive(
  userId: string,
  isActive: boolean
): Promise<void> {
  await query(
    `UPDATE users SET is_active = $1, updated_at = now() WHERE id = $2`,
    [isActive, userId]
  );
}

/** Sets a new bcrypt-hashed password for a user. */
export async function setUserPassword(
  userId: string,
  password: string
): Promise<void> {
  const hash = await bcrypt.hash(password, 10);
  await query(
    `UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2`,
    [hash, userId]
  );
}

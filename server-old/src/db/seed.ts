import bcrypt from "bcryptjs";
import { pool } from "./pool.js";

/**
 * Seeds the RBAC baseline (permissions, roles, role→permission mappings) and a
 * set of demo users — one per role — so access gating can be exercised.
 * Idempotent: re-running upserts rather than duplicating.
 */

const GUARD = "web";
const MODEL_TYPE = "User";

// ── Permissions (per-page views + management) ────────────────────────────────
const PERMISSIONS: Array<{ name: string; description: string }> = [
  { name: "dashboard.view", description: "View the Dashboard" },
  { name: "agency.view", description: "View Ten Print / Agency" },
  { name: "slip.view", description: "View Slip Capture" },
  { name: "mesa.view", description: "View Mesa" },
  { name: "interpol.view", description: "View Interpol" },
  { name: "trace.view", description: "View Trace Reports" },
  { name: "users.manage", description: "Create/update users and assign roles" },
  { name: "roles.manage", description: "Create/update roles and permissions" },
];

const ALL_VIEWS = [
  "dashboard.view",
  "agency.view",
  "slip.view",
  "mesa.view",
  "interpol.view",
  "trace.view",
];

// ── Roles → permission names ('*' marks Super Admin which bypasses checks) ────
const ROLES: Array<{ name: string; description: string; permissions: string[] }> = [
  { name: "Super Admin", description: "Bypasses all permission checks", permissions: [] },
  {
    name: "Admin",
    description: "All views plus user and role management",
    permissions: [...ALL_VIEWS, "users.manage", "roles.manage"],
  },
  { name: "Analyst", description: "All report pages, no management", permissions: [...ALL_VIEWS] },
  { name: "Viewer", description: "Dashboard only", permissions: ["dashboard.view"] },
  {
    name: "State Viewer",
    description: "All report pages, restricted to an assigned state",
    permissions: [...ALL_VIEWS],
  },
];

// ── Demo users (username/password) → role + optional state scope ─────────────
const USERS: Array<{
  username: string;
  password: string;
  fullName: string;
  role: string;
  state?: string;
}> = [
  { username: "admin", password: "admin", fullName: "Administrator", role: "Super Admin" },
  { username: "analyst", password: "analyst", fullName: "Analyst User", role: "Analyst" },
  { username: "viewer", password: "viewer", fullName: "Dashboard Viewer", role: "Viewer" },
  {
    username: "bihar_viewer",
    password: "viewer",
    fullName: "Bihar State Viewer",
    role: "State Viewer",
    state: "Bihar",
  },
];

async function upsertPermission(name: string, description: string): Promise<string> {
  const res = await pool.query<{ id: string }>(
    `INSERT INTO permissions (name, guard_name, description)
     VALUES ($1, $2, $3)
     ON CONFLICT (name, guard_name) DO UPDATE SET description = EXCLUDED.description
     RETURNING id`,
    [name, GUARD, description]
  );
  return res.rows[0].id;
}

async function upsertRole(name: string, description: string): Promise<string> {
  const res = await pool.query<{ id: string }>(
    `INSERT INTO roles (name, guard_name, description)
     VALUES ($1, $2, $3)
     ON CONFLICT (name, guard_name) DO UPDATE SET description = EXCLUDED.description
     RETURNING id`,
    [name, GUARD, description]
  );
  return res.rows[0].id;
}

async function syncRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
  // Replace the role's permission set to match the seed (Spatie's syncPermissions).
  await pool.query(`DELETE FROM role_has_permissions WHERE role_id = $1`, [roleId]);
  for (const pid of permissionIds) {
    await pool.query(
      `INSERT INTO role_has_permissions (permission_id, role_id)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [pid, roleId]
    );
  }
}

async function upsertUser(
  username: string,
  password: string,
  fullName: string,
  state: string | undefined
): Promise<string> {
  const hash = await bcrypt.hash(password, 10);
  const res = await pool.query<{ id: string }>(
    `INSERT INTO users (username, password_hash, full_name, state, is_active)
     VALUES ($1, $2, $3, $4, TRUE)
     ON CONFLICT (username)
       DO UPDATE SET password_hash = EXCLUDED.password_hash,
                     full_name = EXCLUDED.full_name,
                     state = EXCLUDED.state,
                     is_active = TRUE,
                     updated_at = now()
     RETURNING id`,
    [username, hash, fullName, state ?? null]
  );
  return res.rows[0].id;
}

async function assignRole(userId: string, roleId: string): Promise<void> {
  await pool.query(
    `INSERT INTO model_has_roles (role_id, model_type, model_id)
     VALUES ($1, $2, $3) ON CONFLICT DO NOTHING`,
    [roleId, MODEL_TYPE, userId]
  );
}

async function seed(): Promise<void> {
  // Permissions
  const permIdByName = new Map<string, string>();
  for (const p of PERMISSIONS) {
    permIdByName.set(p.name, await upsertPermission(p.name, p.description));
  }

  // Roles + their permissions
  const roleIdByName = new Map<string, string>();
  for (const r of ROLES) {
    const roleId = await upsertRole(r.name, r.description);
    roleIdByName.set(r.name, roleId);
    await syncRolePermissions(
      roleId,
      r.permissions.map((name) => permIdByName.get(name)!).filter(Boolean)
    );
  }

  // Demo users
  for (const u of USERS) {
    const userId = await upsertUser(u.username, u.password, u.fullName, u.state);
    await assignRole(userId, roleIdByName.get(u.role)!);
  }

  console.log("✓ Seeded permissions, roles, and demo users:");
  for (const u of USERS) {
    console.log(
      `   - ${u.username} / ${u.password}  (${u.role}${u.state ? `, state=${u.state}` : ""})`
    );
  }
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());

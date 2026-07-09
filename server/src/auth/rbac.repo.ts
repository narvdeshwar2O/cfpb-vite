import { query } from "../db/pool.js";

/** Role name that bypasses every permission check (Laravel Gate::before style). */
export const SUPER_ADMIN_ROLE = "Super Admin";

const MODEL_TYPE = "User";

/** Role names assigned to a user (via model_has_roles). */
export async function getUserRoles(userId: string): Promise<string[]> {
  const res = await query<{ name: string }>(
    `SELECT r.name
       FROM model_has_roles mhr
       JOIN roles r ON r.id = mhr.role_id
      WHERE mhr.model_id = $1 AND mhr.model_type = $2
      ORDER BY r.name`,
    [userId, MODEL_TYPE]
  );
  return res.rows.map((r) => r.name);
}

/**
 * Effective permission names for a user: permissions granted via their roles
 * UNION permissions granted directly (model_has_permissions). Mirrors Spatie's
 * getAllPermissions().
 */
export async function getUserPermissions(userId: string): Promise<string[]> {
  const res = await query<{ name: string }>(
    `SELECT DISTINCT p.name FROM (
        SELECT rhp.permission_id
          FROM model_has_roles mhr
          JOIN role_has_permissions rhp ON rhp.role_id = mhr.role_id
         WHERE mhr.model_id = $1 AND mhr.model_type = $2
        UNION
        SELECT mhp.permission_id
          FROM model_has_permissions mhp
         WHERE mhp.model_id = $1 AND mhp.model_type = $2
     ) eff
     JOIN permissions p ON p.id = eff.permission_id
     ORDER BY p.name`,
    [userId, MODEL_TYPE]
  );
  return res.rows.map((r) => r.name);
}

export interface UserAccess {
  roles: string[];
  permissions: string[];
  isSuperAdmin: boolean;
}

/** Loads a user's roles + effective permissions in one shot. */
export async function getUserAccess(userId: string): Promise<UserAccess> {
  const [roles, permissions] = await Promise.all([
    getUserRoles(userId),
    getUserPermissions(userId),
  ]);
  return {
    roles,
    permissions,
    isSuperAdmin: roles.includes(SUPER_ADMIN_ROLE),
  };
}

/** Spatie-style can(): true if super admin, or the permission is in the effective set. */
export function accessCan(access: UserAccess, permission: string): boolean {
  return access.isSuperAdmin || access.permissions.includes(permission);
}

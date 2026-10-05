export const SUPER_ADMIN_ROLE = "Super Admin";
export const CFPB_ADMIN_ROLE = "CFPB ADMIN";
export const STATE_ADMIN_ROLE = "STATE ADMIN";
export const STATE_OPERATOR_ROLE = "STATE OPERATOR";

// Helper: Normalize string for comparison (removes spaces, underscores, lowercase)
export function normalizeRoleName(name: string): string {
  return name ? name.toLowerCase().replace(/[\s_-]+/g, "") : "";
}

/**
 * Numeric priority hierarchy:
 * Higher number = higher authority.
 * A role cannot manage or assign roles with priority >= its own priority.
 */
export const ROLE_HIERARCHY: Record<string, number> = {
  // Exact names
  "Super Admin": 100,
  "CFPB ADMIN": 70,
  "STATE ADMIN": 50,
  "STATE OPERATOR": 20,

  // Case/naming variations & legacy aliases
  superadmin: 100,
  cfpbadmin: 70,
  admin: 70,
  stateadmin: 50,
  stateoperator: 20,
  stateviewer: 20,
  "State Viewer": 20,
};

export function getRolePriority(roles: string[]): number {
  if (!roles || roles.length === 0) return 0;
  return Math.max(
    ...roles.map((r) => {
      if (ROLE_HIERARCHY[r] !== undefined) return ROLE_HIERARCHY[r];
      const norm = normalizeRoleName(r);
      return ROLE_HIERARCHY[norm] ?? 10;
    })
  );
}

export function isSuperAdminRole(roleName: string): boolean {
  const norm = normalizeRoleName(roleName);
  return norm === "superadmin";
}

export function isCfpbAdminRole(roleName: string): boolean {
  const norm = normalizeRoleName(roleName);
  return norm === "cfpbadmin" || norm === "admin";
}

export function isStateAdminRole(roleName: string): boolean {
  const norm = normalizeRoleName(roleName);
  return norm === "stateadmin";
}

export function isStateOperatorRole(roleName: string): boolean {
  const norm = normalizeRoleName(roleName);
  return norm === "stateoperator" || norm === "stateviewer";
}

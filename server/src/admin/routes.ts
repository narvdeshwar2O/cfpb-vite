import { Router, type NextFunction, type Request, type Response } from "express";
import { requireAuth, requirePermission, type AuthedRequest } from "../auth/middleware.js";
import { getUserAccess } from "../auth/rbac.repo.js";
import { getAuthUserById } from "../auth/users.repo.js";
import {
  SUPER_ADMIN_ROLE,
  CFPB_ADMIN_ROLE,
  STATE_ADMIN_ROLE,
  STATE_OPERATOR_ROLE,
  ROLE_HIERARCHY,
  getRolePriority,
  isSuperAdminRole,
  isCfpbAdminRole,
  isStateAdminRole,
  isStateOperatorRole,
} from "../auth/constants.js";
import * as repo from "./admin.repo.js";

export const adminRouter = Router();

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}

// All admin routes require authentication.
adminRouter.use(requireAuth);

// Helper: resolve caller's context and priority
async function getCallerContext(req: AuthedRequest) {
  const callerId = req.user!.sub;
  const caller = await getAuthUserById(callerId);
  const roles = caller?.roles ?? [];
  const priority = getRolePriority(roles);
  const isSuper = roles.some((r) => isSuperAdminRole(r));
  const isCfpb = roles.some((r) => isCfpbAdminRole(r));
  const isStateAdmin = roles.some((r) => isStateAdminRole(r));
  const isStateOperator = roles.some((r) => isStateOperatorRole(r));

  return {
    caller,
    callerId,
    roles,
    priority,
    isSuper,
    isCfpb,
    isStateAdmin,
    isStateOperator,
    state: caller?.state ?? null,
  };
}

// ── Permissions ──────────────────────────────────────────────────────────────
adminRouter.get(
  "/permissions",
  requirePermission("roles.manage"),
  asyncHandler(async (_req, res) => {
    res.json({ permissions: await repo.listPermissions() });
  })
);

adminRouter.post(
  "/permissions",
  requirePermission("roles.manage"),
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const caller = await getCallerContext(req);
    // Only Super Admin and cfpbAdmin can create permissions
    if (caller.isStateAdmin || caller.isStateOperator) {
      return res.status(403).json({ message: "Only central admins can create permissions" });
    }
    const { name, description } = req.body ?? {};
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "name is required" });
    }
    const id = await repo.createPermission(name.trim(), description ?? null);
    return res.status(201).json({ id });
  })
);

// ── Roles ────────────────────────────────────────────────────────────────────
adminRouter.get(
  "/roles",
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const caller = await getCallerContext(req);
    const hasRoleManage = caller.caller?.permissions.includes("roles.manage");
    const hasUserManage = caller.caller?.permissions.includes("users.manage");

    if (!caller.isSuper && !hasRoleManage && !hasUserManage) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    const allRoles = await repo.listRoles();

    // Filter roles visible based on priority:
    // Super Admin: sees all
    // cfpbAdmin: cannot manage/see Super Admin
    // stateAdmin: only sees stateOperator / State Viewer
    if (caller.isSuper) {
      return res.json({ roles: allRoles });
    }
    if (caller.isCfpb) {
      return res.json({
        roles: allRoles.filter((r) => !isSuperAdminRole(r.name)),
      });
    }
    if (caller.isStateAdmin) {
      return res.json({
        roles: allRoles.filter((r) => isStateOperatorRole(r.name)),
      });
    }

    return res.json({ roles: [] });
  })
);

adminRouter.post(
  "/roles",
  requirePermission("roles.manage"),
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const caller = await getCallerContext(req);
    if (!caller.isSuper && !caller.isCfpb) {
      return res.status(403).json({ message: "Only central admins can create roles" });
    }
    const { name, description, permissions } = req.body ?? {};
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "name is required" });
    }
    if (!caller.isSuper && name.trim() === SUPER_ADMIN_ROLE) {
      return res.status(403).json({ message: "Cannot create Super Admin role" });
    }
    const roleId = await repo.createRole(name.trim(), description ?? null);
    if (Array.isArray(permissions)) {
      await repo.syncRolePermissions(roleId, permissions.filter((p) => typeof p === "string"));
    }
    return res.status(201).json({ id: roleId });
  })
);

adminRouter.put(
  "/roles/:id/permissions",
  requirePermission("roles.manage"),
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const caller = await getCallerContext(req);
    if (!caller.isSuper && !caller.isCfpb) {
      return res.status(403).json({ message: "Only central admins can edit role permissions" });
    }
    const { id } = req.params;
    const { permissions } = req.body ?? {};
    if (!Array.isArray(permissions)) {
      return res.status(400).json({ message: "permissions must be an array of names" });
    }
    if (!(await repo.roleExists(id))) {
      return res.status(404).json({ message: "Role not found" });
    }
    await repo.syncRolePermissions(id, permissions.filter((p) => typeof p === "string"));
    return res.json({ ok: true });
  })
);

// ── Users ────────────────────────────────────────────────────────────────────
adminRouter.get(
  "/users",
  requirePermission("users.manage"),
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const caller = await getCallerContext(req);

    // State Admin: can only view users belonging to their assigned state
    if (caller.isStateAdmin) {
      if (!caller.state) {
        return res.json({ users: [] });
      }
      const stateUsers = await repo.listUsers(caller.state);
      // Filter out any accounts with higher or equal priority
      return res.json({
        users: stateUsers.filter((u) => getRolePriority(u.roles) < caller.priority),
      });
    }

    // cfpbAdmin: see all users except Super Admins
    if (caller.isCfpb && !caller.isSuper) {
      const allUsers = await repo.listUsers();
      return res.json({
        users: allUsers.filter((u) => !u.roles.includes(SUPER_ADMIN_ROLE)),
      });
    }

    // Super Admin: sees everyone
    res.json({ users: await repo.listUsers() });
  })
);

adminRouter.post(
  "/users",
  requirePermission("users.manage"),
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const caller = await getCallerContext(req);

    if (caller.isStateOperator) {
      return res.status(403).json({ message: "State operators have view-only access" });
    }

    const { username, password, fullName, state, roles } = req.body ?? {};
    if (typeof username !== "string" || !username.trim()) {
      return res.status(400).json({ message: "username is required" });
    }
    if (typeof password !== "string" || password.length < 4) {
      return res.status(400).json({ message: "password is required (min 4 chars)" });
    }
    if (await repo.usernameTaken(username.trim())) {
      return res.status(409).json({ message: "username already exists" });
    }

    const requestedRoles = Array.isArray(roles)
      ? roles.filter((r) => typeof r === "string")
      : [];

    // Rule: Cannot assign a role with priority >= caller priority
    for (const r of requestedRoles) {
      const targetPriority = ROLE_HIERARCHY[r] ?? 10;
      if (!caller.isSuper && targetPriority >= caller.priority) {
        return res.status(403).json({
          message: `You cannot create or assign role '${r}' with equal or higher priority than your own`,
        });
      }
    }

    // Rule: State Admin can ONLY assign STATE OPERATOR
    if (caller.isStateAdmin) {
      const invalidRole = requestedRoles.find((r) => !isStateOperatorRole(r));
      if (invalidRole) {
        return res.status(403).json({
          message: `State Admins can only assign '${STATE_OPERATOR_ROLE}' role`,
        });
      }
    }

    // Rule: State Admin can ONLY create users for their assigned state
    let targetState = typeof state === "string" && state.trim() ? state.trim() : null;
    if (caller.isStateAdmin) {
      if (!caller.state) {
        return res.status(400).json({ message: "Your account has no state assigned" });
      }
      targetState = caller.state;
    }

    const userId = await repo.createUser({
      username: username.trim(),
      password,
      fullName: typeof fullName === "string" ? fullName : null,
      state: targetState,
    });

    if (requestedRoles.length > 0) {
      await repo.syncUserRoles(userId, requestedRoles);
    }
    return res.status(201).json({ id: userId });
  })
);

adminRouter.put(
  "/users/:id/roles",
  requirePermission("users.manage"),
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const caller = await getCallerContext(req);
    const { id } = req.params;
    const { roles } = req.body ?? {};

    if (!Array.isArray(roles)) {
      return res.status(400).json({ message: "roles must be an array of names" });
    }

    const targetUser = await repo.getUserById(id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Rule: Cannot modify a user with priority >= caller's priority
    const targetPriority = getRolePriority(targetUser.roles);
    if (!caller.isSuper && targetPriority >= caller.priority) {
      return res.status(403).json({
        message: "You cannot modify roles of a user with equal or higher priority",
      });
    }

    // Rule: State Admin can only modify users in their own state
    if (caller.isStateAdmin && targetUser.state?.toLowerCase() !== caller.state?.toLowerCase()) {
      return res.status(403).json({
        message: "You can only manage users within your assigned state",
      });
    }

    const requestedRoles = roles.filter((r) => typeof r === "string");

    // Rule: Cannot assign roles with priority >= caller's priority
    for (const r of requestedRoles) {
      const rPriority = ROLE_HIERARCHY[r] ?? 10;
      if (!caller.isSuper && rPriority >= caller.priority) {
        return res.status(403).json({
          message: `Cannot assign role '${r}' with equal or higher priority than your own`,
        });
      }
    }

    // Rule: State Admin can only assign STATE OPERATOR
    if (caller.isStateAdmin) {
      const invalid = requestedRoles.find((r) => !isStateOperatorRole(r));
      if (invalid) {
        return res.status(403).json({
          message: `State Admins can only assign '${STATE_OPERATOR_ROLE}'`,
        });
      }
    }

    await repo.syncUserRoles(id, requestedRoles);
    return res.json({ ok: true });
  })
);

adminRouter.put(
  "/users/:id/state",
  requirePermission("users.manage"),
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const caller = await getCallerContext(req);
    const { id } = req.params;
    const { state } = req.body ?? {};

    if (caller.isStateAdmin) {
      return res.status(403).json({ message: "State Admins cannot change user states" });
    }

    const targetUser = await repo.getUserById(id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!caller.isSuper && getRolePriority(targetUser.roles) >= caller.priority) {
      return res.status(403).json({
        message: "Cannot modify state of a user with equal or higher priority",
      });
    }

    if (state !== null && typeof state !== "string") {
      return res.status(400).json({ message: "state must be a string or null" });
    }

    await repo.setUserState(id, state ? String(state).trim() : null);
    return res.json({ ok: true });
  })
);

adminRouter.put(
  "/users/:id/active",
  requirePermission("users.manage"),
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const caller = await getCallerContext(req);
    const { id } = req.params;
    const { isActive } = req.body ?? {};
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be a boolean" });
    }
    
    // Prevent self-deactivation
    if (req.user!.sub === id && !isActive) {
      return res.status(403).json({ message: "You cannot deactivate your own account" });
    }

    const targetUser = await repo.getUserById(id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cannot deactivate users with priority >= caller
    if (!caller.isSuper && getRolePriority(targetUser.roles) >= caller.priority) {
      return res.status(403).json({
        message: "Cannot activate/deactivate a user with equal or higher priority",
      });
    }

    if (caller.isStateAdmin && targetUser.state?.toLowerCase() !== caller.state?.toLowerCase()) {
      return res.status(403).json({
        message: "You can only manage users within your assigned state",
      });
    }

    await repo.setUserActive(id, isActive);
    return res.json({ ok: true });
  })
);

adminRouter.put(
  "/users/:id/password",
  requirePermission("users.manage"),
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const caller = await getCallerContext(req);
    const { id } = req.params;
    const { password } = req.body ?? {};
    if (typeof password !== "string" || password.length < 4) {
      return res.status(400).json({ message: "password is required (min 4 chars)" });
    }

    const targetUser = await repo.getUserById(id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!caller.isSuper && getRolePriority(targetUser.roles) >= caller.priority) {
      return res.status(403).json({
        message: "Cannot reset password of a user with equal or higher priority",
      });
    }

    if (caller.isStateAdmin && targetUser.state?.toLowerCase() !== caller.state?.toLowerCase()) {
      return res.status(403).json({
        message: "You can only manage users within your assigned state",
      });
    }

    await repo.setUserPassword(id, password);
    return res.json({ ok: true });
  })
);

adminRouter.put(
  '/users/:id/profile',
  requirePermission('users.manage'),
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    // Only super admins can update profiles
    const access = await getUserAccess(req.user!.sub);
    if (!access.isSuperAdmin) {
      return res.status(403).json({ message: 'Only Super Admins can update profiles' });
    }

    const { id } = req.params;

    // Super admins cannot edit their own profile
    if (req.user!.sub === id) {
      return res.status(403).json({ message: 'Super Admins cannot edit their own profile' });
    }

    const { username, fullName } = req.body ?? {};
    if (typeof username !== 'string' || !username.trim()) {
      return res.status(400).json({ message: 'username is required' });
    }
    
    // Check if another user has this username
    const existing = await repo.usernameTakenByOtherUser(username.trim(), id);
    if (existing) {
      return res.status(409).json({ message: 'username already exists' });
    }
    
    try {
      await repo.updateUserProfile(id, username.trim(), typeof fullName === 'string' ? fullName.trim() : null);
      return res.json({ ok: true });
    } catch (err: any) {
      if (err.code === '23505') { // Postgres unique_violation
        return res.status(409).json({ message: 'username already exists' });
      }
      throw err;
    }
  })
);

adminRouter.delete(
  "/users/:id",
  requirePermission("users.manage"),
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const caller = await getCallerContext(req);
    if (!caller.isSuper) {
      return res.status(403).json({ message: "Only Super Admins can permanently delete users" });
    }

    const { id } = req.params;

    if (req.user!.sub === id) {
      return res.status(403).json({ message: "You cannot delete your own account" });
    }

    const targetUser = await repo.getUserById(id);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await repo.deleteUser(id);
    return res.json({ ok: true });
  })
);

// ── LDAP / Active Directory Integration (SUPER ADMIN ONLY) ──────────────────
adminRouter.get(
  "/ldap-config",
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const access = await getUserAccess(req.user!.sub);
    if (!access.isSuperAdmin) {
      return res.status(403).json({ message: "Only Super Admins can access LDAP configuration" });
    }
    const { getLdapConfig } = await import("./ldap-config.repo.js");
    const data = await getLdapConfig();
    // Return masked password indicator so real credentials aren't exposed in plaintext over network
    return res.json({
      config: {
        ...data,
        bindPassword: data.bindPassword ? "••••••••••••" : "",
      },
    });
  })
);

adminRouter.put(
  "/ldap-config",
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const access = await getUserAccess(req.user!.sub);
    if (!access.isSuperAdmin) {
      return res.status(403).json({ message: "Only Super Admins can update LDAP configuration" });
    }
    const b = req.body ?? {};
    const rawMappings = (b.group_role_mapping ?? b.groupRoleMappings ?? []) as Array<{ groupName: string; roleName: string }>;
    // Disallow Super Admin in group-role mappings
    const safeMappings = rawMappings.filter((m) => {
      const clean = (m.roleName || "").toLowerCase().replace(/[\s_-]+/g, "");
      return clean !== "superadmin";
    });

    const normalized = {
      enabled: b.enabled ?? false,
      serverUrl: b.server_url ?? b.serverUrl ?? "",
      baseDn: b.base_dn ?? b.baseDn ?? "",
      bindDn: b.bind_dn ?? b.bindDn ?? "",
      bindPassword: b.bind_password ?? b.bindPassword,
      searchFilter: b.user_search_filter ?? b.searchFilter ?? "(|(sAMAccountName={username})(uid={username}))",
      useTls: b.use_tls ?? b.useTls ?? true,
      groupRoleMappings: safeMappings,
    };
    const { saveLdapConfig } = await import("./ldap-config.repo.js");
    await saveLdapConfig(normalized);
    return res.json({ ok: true });
  })
);

adminRouter.post(
  "/ldap-config/test",
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const access = await getUserAccess(req.user!.sub);
    if (!access.isSuperAdmin) {
      return res.status(403).json({ message: "Only Super Admins can test LDAP configuration" });
    }
    const { testLdapConnection } = await import("../auth/ldap.service.js");
    const b = req.body ?? {};
    let serverUrl = b.server_url ?? b.serverUrl ?? "";
    let bindDn = b.bind_dn ?? b.bindDn ?? "";
    let bindPassword = b.bind_password ?? b.bindPassword;
    let baseDn = b.base_dn ?? b.baseDn ?? "";
    
    // If password wasn't typed or is masked, retrieve existing stored password
    if (!bindPassword || bindPassword === "••••••••••••") {
      const { getLdapConfig } = await import("./ldap-config.repo.js");
      const current = await getLdapConfig();
      bindPassword = current.bindPassword;
    }

    const result = await testLdapConnection({ serverUrl, bindDn, bindPassword, baseDn });
    return res.json(result);
  })
);

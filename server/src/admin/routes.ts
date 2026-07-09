import { Router, type NextFunction, type Request, type Response } from "express";
import { requireAuth, requirePermission } from "../auth/middleware.js";
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
  asyncHandler(async (req, res) => {
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
  requirePermission("roles.manage"),
  asyncHandler(async (_req, res) => {
    res.json({ roles: await repo.listRoles() });
  })
);

adminRouter.post(
  "/roles",
  requirePermission("roles.manage"),
  asyncHandler(async (req, res) => {
    const { name, description, permissions } = req.body ?? {};
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "name is required" });
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
  asyncHandler(async (req, res) => {
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
  asyncHandler(async (_req, res) => {
    res.json({ users: await repo.listUsers() });
  })
);

adminRouter.post(
  "/users",
  requirePermission("users.manage"),
  asyncHandler(async (req, res) => {
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
    const userId = await repo.createUser({
      username: username.trim(),
      password,
      fullName: typeof fullName === "string" ? fullName : null,
      state: typeof state === "string" && state.trim() ? state.trim() : null,
    });
    if (Array.isArray(roles)) {
      await repo.syncUserRoles(userId, roles.filter((r) => typeof r === "string"));
    }
    return res.status(201).json({ id: userId });
  })
);

adminRouter.put(
  "/users/:id/roles",
  requirePermission("users.manage"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { roles } = req.body ?? {};
    if (!Array.isArray(roles)) {
      return res.status(400).json({ message: "roles must be an array of names" });
    }
    if (!(await repo.userExists(id))) {
      return res.status(404).json({ message: "User not found" });
    }
    await repo.syncUserRoles(id, roles.filter((r) => typeof r === "string"));
    return res.json({ ok: true });
  })
);

adminRouter.put(
  "/users/:id/state",
  requirePermission("users.manage"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { state } = req.body ?? {};
    if (state !== null && typeof state !== "string") {
      return res.status(400).json({ message: "state must be a string or null" });
    }
    if (!(await repo.userExists(id))) {
      return res.status(404).json({ message: "User not found" });
    }
    await repo.setUserState(id, state ? String(state).trim() : null);
    return res.json({ ok: true });
  })
);

adminRouter.put(
  "/users/:id/active",
  requirePermission("users.manage"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body ?? {};
    if (typeof isActive !== "boolean") {
      return res.status(400).json({ message: "isActive must be a boolean" });
    }
    if (!(await repo.userExists(id))) {
      return res.status(404).json({ message: "User not found" });
    }
    await repo.setUserActive(id, isActive);
    return res.json({ ok: true });
  })
);

adminRouter.put(
  "/users/:id/password",
  requirePermission("users.manage"),
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { password } = req.body ?? {};
    if (typeof password !== "string" || password.length < 4) {
      return res.status(400).json({ message: "password is required (min 4 chars)" });
    }
    if (!(await repo.userExists(id))) {
      return res.status(404).json({ message: "User not found" });
    }
    await repo.setUserPassword(id, password);
    return res.json({ ok: true });
  })
);

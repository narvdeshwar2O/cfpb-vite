import { Router, type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { signToken } from "./jwt.js";
import { config } from "../config.js";
import { authenticateLdap } from "./ldap.service.js";
import {
  findActiveUserByUsername,
  findOrCreateLdapUser,
  getAuthUserById,
  toAuthUserDto,
  touchLastLogin,
} from "./users.repo.js";
import { requireAuth, type AuthedRequest } from "./middleware.js";

export const authRouter = Router();

/** Wraps an async handler so rejected promises reach the error middleware. */
function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}

/**
 * GET /auth/config
 * Public endpoint returning system auth configuration (e.g. if LDAP is enabled).
 */
authRouter.get(
  "/config",
  asyncHandler(async (_req: Request, res: Response) => {
    const { getLdapConfig } = await import("../admin/ldap-config.repo.js");
    const ldapConfig = await getLdapConfig();
    return res.json({ ldapEnabled: !!ldapConfig.enabled });
  })
);

/**
 * POST /auth/login
 * Body: { username, password }
 * Verifies credentials via LDAP (if enabled) or local DB, and returns a JWT plus
 * the user's roles, effective permissions, and assigned state.
 */
authRouter.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const { username, password, authType } = req.body ?? {};
    const { extractClientIp, extractUserAgent } = await import("../audit/ip.utils.js");
    const { logAuditEvent } = await import("../audit/audit.repo.js");
    const clientIp = extractClientIp(req);
    const userAgent = extractUserAgent(req);

    if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
      await logAuditEvent({
        actorUsername: typeof username === "string" ? username : null,
        actorType: "user",
        action: "auth.login",
        resourceType: "auth",
        outcome: "failure",
        failureReason: "Missing credentials",
        clientIp,
        userAgent,
      }).catch(() => {});
      return res.status(400).json({ message: "username and password are required" });
    }

    const type = authType === "ldap" ? "ldap" : "local";
    let authenticatedUser = null;
    let failReason = "Invalid credentials";

    // ── 1. LDAP Authentication Mode ──
    if (type === "ldap") {
      const { getLdapConfig } = await import("../admin/ldap-config.repo.js");
      const ldapConfig = await getLdapConfig();

      if (!ldapConfig.enabled) {
        await logAuditEvent({
          actorUsername: username.trim(),
          actorType: "user",
          action: "auth.login.ldap",
          resourceType: "auth",
          outcome: "failure",
          failureReason: "LDAP authentication is currently disabled",
          clientIp,
          userAgent,
        }).catch(() => {});
        return res.status(503).json({ message: "LDAP authentication is currently disabled" });
      }

      const ldapUser = await authenticateLdap(username.trim(), password);
      if (ldapUser) {

        // JIT provision or sync local database record with role mapping
        const record = await findOrCreateLdapUser({
          username: ldapUser.username,
          fullName: ldapUser.fullName,
          email: ldapUser.email,
          state: ldapUser.state,
          groups: ldapUser.groups,
          groupRoleMappings: ldapConfig.groupRoleMappings,
        });

        if (record && record.is_active) {
          authenticatedUser = record;
        } else if (record && !record.is_active) {
          failReason = "Account deactivated";
        }
      }

      if (!authenticatedUser) {
        await logAuditEvent({
          actorUsername: username.trim(),
          actorType: "user",
          action: "auth.login.ldap",
          resourceType: "auth",
          outcome: "failure",
          failureReason: failReason,
          clientIp,
          userAgent,
        }).catch(() => {});
        return res.status(401).json({ message: "Invalid LDAP / Domain credentials" });
      }
    } else {
      // ── 2. Local Database Authentication Mode ──
      const localUser = await findActiveUserByUsername(username.trim());
      const hashToCheck =
        localUser?.password_hash ?? "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv";
      const ok = await bcrypt.compare(password, hashToCheck);

      if (localUser && ok) {
        authenticatedUser = localUser;
      } else {
        failReason = !localUser ? "User not found or inactive" : "Invalid password";
      }

      if (!authenticatedUser) {
        await logAuditEvent({
          actorUsername: username.trim(),
          actorType: "user",
          action: "auth.login.local",
          resourceType: "auth",
          outcome: "failure",
          failureReason: failReason,
          clientIp,
          userAgent,
        }).catch(() => {});
        return res.status(401).json({ message: "Invalid local credentials" });
      }
    }

    const dto = await toAuthUserDto(authenticatedUser);
    await touchLastLogin(authenticatedUser.id);

    const token = signToken({
      sub: authenticatedUser.id,
      username: authenticatedUser.username,
      roles: dto.roles,
    });

    const isSuper = dto.roles.includes("Super Admin");

    // Durably log successful login
    await logAuditEvent({
      actorId: authenticatedUser.id,
      actorUsername: authenticatedUser.username,
      actorType: isSuper ? "super_admin" : "user",
      action: type === "ldap" ? "auth.login.ldap" : "auth.login.local",
      resourceType: "auth",
      resourceId: authenticatedUser.id,
      outcome: "success",
      clientIp,
      userAgent,
      details: {
        roles: dto.roles,
        state: dto.state,
        authType: type,
      },
    }).catch((err) => console.error("Audit log error:", err));

    return res.json({ token, user: dto });
  })
);

/**
 * POST /auth/logout
 * Audits explicit user logout.
 */
authRouter.post(
  "/logout",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const authed = req as AuthedRequest;
    const { extractClientIp, extractUserAgent } = await import("../audit/ip.utils.js");
    const { logAuditEvent } = await import("../audit/audit.repo.js");

    await logAuditEvent({
      actorId: authed.user?.sub,
      actorUsername: authed.user?.username,
      actorType: authed.user?.roles?.includes("Super Admin") ? "super_admin" : "user",
      action: "auth.logout",
      resourceType: "auth",
      outcome: "success",
      clientIp: extractClientIp(req),
      userAgent: extractUserAgent(req),
    }).catch(() => {});

    return res.json({ ok: true });
  })
);

/**
 * GET /auth/me
 * Returns the current user (resolved fresh from the DB) for the bearer token.
 */
authRouter.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as AuthedRequest).user!.sub;
    const user = await getAuthUserById(userId);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists or is inactive" });
    }
    return res.json({ user });
  })
);

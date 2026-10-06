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
 * POST /auth/login
 * Body: { username, password }
 * Verifies credentials via LDAP (if enabled) or local DB, and returns a JWT plus
 * the user's roles, effective permissions, and assigned state.
 */
authRouter.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const { username, password, authType } = req.body ?? {};

    if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }

    const type = authType === "ldap" ? "ldap" : "local";
    let authenticatedUser = null;

    // ── 1. LDAP Authentication Mode ──
    if (type === "ldap") {
      const { getLdapConfig } = await import("../admin/ldap-config.repo.js");
      const ldapConfig = await getLdapConfig();

      if (!ldapConfig.enabled) {
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
          defaultRole: ldapConfig.defaultRole,
          groupRoleMappings: ldapConfig.groupRoleMappings,
        });

        if (record && record.is_active) {
          authenticatedUser = record;
        }
      }

      if (!authenticatedUser) {
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
      }

      if (!authenticatedUser) {
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

    return res.json({ token, user: dto });
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

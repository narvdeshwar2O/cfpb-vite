import type { NextFunction, Request, Response } from "express";
import { verifyToken, type JwtPayload } from "./jwt.js";
import { getUserAccess, SUPER_ADMIN_ROLE } from "./rbac.repo.js";

/** Express request augmented with the authenticated user's JWT payload. */
export interface AuthedRequest extends Request {
  user?: JwtPayload;
}

/**
 * Verifies the Bearer token on the Authorization header and attaches the
 * decoded payload to req.user. Responds 401 when missing or invalid.
 */
export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
): void {
  const header = req.header("authorization") ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({ message: "Missing or malformed Authorization header" });
    return;
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

/**
 * RBAC guard: allows the request only if the user holds one of the given roles,
 * or is a Super Admin. Resolves roles live from the DB so revocations take
 * effect immediately. Must run after requireAuth.
 */
export function requireRole(...allowed: string[]) {
  return async (req: AuthedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const access = await getUserAccess(req.user!.sub);
      if (access.isSuperAdmin || access.roles.some((r) => allowed.includes(r))) {
        next();
        return;
      }
      res.status(403).json({ message: "Insufficient role" });
    } catch (err) {
      next(err);
    }
  };
}

/**
 * RBAC guard: allows the request only if the user has ALL of the given
 * permissions (via roles or directly), or is a Super Admin. Resolves live from
 * the DB. Must run after requireAuth.
 */
export function requirePermission(...required: string[]) {
  return async (req: AuthedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const access = await getUserAccess(req.user!.sub);
      if (access.roles.includes(SUPER_ADMIN_ROLE)) {
        next();
        return;
      }
      const ok = required.every((p) => access.permissions.includes(p));
      if (ok) {
        next();
        return;
      }
      res.status(403).json({ message: "Insufficient permissions" });
    } catch (err) {
      next(err);
    }
  };
}

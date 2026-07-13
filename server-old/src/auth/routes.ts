import { Router, type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { signToken } from "./jwt.js";
import {
  findActiveUserByUsername,
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
 * Verifies credentials against the database and returns a JWT plus the user's
 * roles, effective permissions, and assigned state.
 */
authRouter.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    const { username, password } = req.body ?? {};

    if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
      return res.status(400).json({ message: "username and password are required" });
    }

    const user = await findActiveUserByUsername(username);
    // Run a hash comparison even when the user is missing to avoid leaking which
    // usernames exist via timing differences.
    const hashToCheck =
      user?.password_hash ?? "$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv";
    const ok = await bcrypt.compare(password, hashToCheck);

    if (!user || !ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const dto = await toAuthUserDto(user);
    await touchLastLogin(user.id);

    const token = signToken({ sub: user.id, username: user.username, roles: dto.roles });

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

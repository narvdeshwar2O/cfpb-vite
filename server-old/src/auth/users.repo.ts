import { query } from "../db/pool.js";
import { getUserAccess } from "./rbac.repo.js";

export interface UserRecord {
  id: string;
  username: string;
  email: string | null;
  password_hash: string;
  full_name: string | null;
  state: string | null;
  is_active: boolean;
}

export interface AuthUserDto {
  id: string;
  username: string;
  email: string | null;
  fullName: string | null;
  /** Assigned state for data-scoped roles (e.g. State Viewer); null otherwise. */
  state: string | null;
  roles: string[];
  permissions: string[];
}

/** Looks up an active user by username, including the password hash for verification. */
export async function findActiveUserByUsername(
  username: string
): Promise<UserRecord | null> {
  const result = await query<UserRecord>(
    `SELECT id, username, email, password_hash, full_name, state, is_active
       FROM users
      WHERE username = $1 AND is_active = TRUE
      LIMIT 1`,
    [username]
  );
  return result.rows[0] ?? null;
}

/** Builds the client-facing DTO (roles + effective permissions + state) for a user. */
export async function toAuthUserDto(user: UserRecord): Promise<AuthUserDto> {
  const access = await getUserAccess(user.id);
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.full_name,
    state: user.state,
    roles: access.roles,
    permissions: access.permissions,
  };
}

/** Loads a user plus roles/permissions for the /auth/me endpoint. */
export async function getAuthUserById(userId: string): Promise<AuthUserDto | null> {
  const result = await query<UserRecord>(
    `SELECT id, username, email, password_hash, full_name, state, is_active
       FROM users
      WHERE id = $1 AND is_active = TRUE
      LIMIT 1`,
    [userId]
  );
  const user = result.rows[0];
  if (!user) return null;
  return toAuthUserDto(user);
}

/** Records a successful login timestamp. */
export async function touchLastLogin(userId: string): Promise<void> {
  await query(`UPDATE users SET last_login_at = now() WHERE id = $1`, [userId]);
}

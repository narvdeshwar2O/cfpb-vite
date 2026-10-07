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
  username: string,
): Promise<UserRecord | null> {
  const result = await query<UserRecord>(
    `SELECT id, username, email, password_hash, full_name, state, is_active
       FROM users
      WHERE username = $1 AND is_active = TRUE
      LIMIT 1`,
    [username],
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
export async function getAuthUserById(
  userId: string,
): Promise<AuthUserDto | null> {
  const result = await query<UserRecord>(
    `SELECT id, username, email, password_hash, full_name, state, is_active
       FROM users
      WHERE id = $1 AND is_active = TRUE
      LIMIT 1`,
    [userId],
  );
  const user = result.rows[0];
  if (!user) return null;
  return toAuthUserDto(user);
}

/** Records a successful login timestamp. */
export async function touchLastLogin(userId: string): Promise<void> {
  await query(`UPDATE users SET last_login_at = now() WHERE id = $1`, [userId]);
}

/**
 * Finds an existing user or creates a new one via JIT (Just-In-Time) provisioning
 * upon successful LDAP authentication, synchronizing their role from group mappings or default role.
 */
export async function findOrCreateLdapUser(input: {
  username: string;
  fullName: string | null;
  email: string | null;
  state: string | null;
  groups?: string[];
  defaultRole?: string;
  groupRoleMappings?: Array<{ groupName: string; roleName: string }>;
}): Promise<UserRecord> {
  const userGroups = input.groups || [];

  // --- 1. STATE EXTRACTOR ---
  const VALID_STATES = [
    "andaman and nicobar",
    "andhra pradesh",
    "arunachal pradesh",
    "assam",
    "bihar",
    "cbi",
    "chandigarh",
    "chhattisgarh",
    "dadra and nagar haveli",
    "daman diu",
    "delhi",
    "goa",
    "gujarat",
    "haryana",
    "himachal pradesh",
    "intelligence bureau",
    "jammu and kashmir",
    "jharkhand",
    "karnataka",
    "kerala",
    "ladakh",
    "lakshadweep",
    "madhya pradesh",
    "maharashtra",
    "manipur",
    "meghalaya",
    "mizoram",
    "nagaland",
    "ncb",
    "nia",
    "odisha",
    "puducherry",
    "punjab",
    "rajasthan",
    "sikkim",
    "tamil nadu",
    "telangana",
    "tripura",
    "uttar pradesh",
    "uttarakhand",
    "west bengal",
  ];

  let extractedState = input.state;
  if (userGroups.length > 0) {
    for (const g of userGroups) {
      const cleanG = g.toLowerCase();
      const foundState = VALID_STATES.find(
        (s) =>
          cleanG === s ||
          cleanG.includes(`cn=${s},`) ||
          cleanG.includes(`cn=${s}`),
      );
      if (foundState) {
        extractedState = foundState;
        break;
      }
    }
  }
  input.state = extractedState;

  // Determine assigned role based on group mappings or defaultRole
  let targetRole = input.defaultRole || "STATE OPERATOR";
  const mappings = input.groupRoleMappings || [];

  if (mappings.length > 0 && userGroups.length > 0) {
    // Check if user's memberOf groups match any configured mapping
    const matchedRoles: string[] = [];
    for (const m of mappings) {
      const match = userGroups.some((g) => {
        const cleanG = g.toLowerCase();
        const cleanM = m.groupName.toLowerCase();
        return (
          cleanG === cleanM ||
          cleanG.includes(`cn=${cleanM}`) ||
          cleanG.includes(cleanM)
        );
      });
      if (match) {
        matchedRoles.push(m.roleName);
      }
    }
    if (matchedRoles.length > 0) {
      // Pick highest priority role among matches
      const { getRolePriority } = await import("./constants.js");
      matchedRoles.sort((a, b) => getRolePriority([b]) - getRolePriority([a]));
      targetRole = matchedRoles[0];
    }
  }

  // 1. Check if user already exists
  const existing = await query<UserRecord>(
    `SELECT id, username, email, password_hash, full_name, state, is_active
       FROM users
      WHERE username = $1
      LIMIT 1`,
    [input.username],
  );

  let user: UserRecord;

  if (existing.rows[0]) {
    user = existing.rows[0];
    await query(
      `UPDATE users
          SET full_name = COALESCE($1, full_name),
              email = COALESCE($2, email),
              state = COALESCE($3, state),
              last_login_at = now(),
              updated_at = now()
        WHERE id = $4`,
      [input.fullName, input.email, input.state, user.id],
    );
  } else {
    // 2. Insert new domain user with dummy hashed password (LDAP authenticates password)
    const dummyHash =
      "$2a$10$LDAP.MANAGED.ACCOUNT.NO.LOCAL.PASSWORD.ALLOWED00000000000000";
    const inserted = await query<UserRecord>(
      `INSERT INTO users (username, password_hash, full_name, email, state, is_active, last_login_at)
       VALUES ($1, $2, $3, $4, $5, TRUE, now())
       RETURNING id, username, email, password_hash, full_name, state, is_active`,
      [input.username, dummyHash, input.fullName, input.email, input.state],
    );
    user = inserted.rows[0];
  }

  // 3. Sync user role to match AD exactly on every login
  if (targetRole) {
    const { syncUserRoles } = await import("../admin/admin.repo.js");
    await syncUserRoles(user.id, [targetRole]);
  }

  return user;
}

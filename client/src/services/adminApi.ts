/**
 * Client for the RBAC management API (server/src/admin). All calls require a
 * Bearer token belonging to a user with the relevant *.manage permission.
 */
const AUTH_BASE_URL =
  import.meta.env.VITE_AUTH_API_URL || "http://localhost:3001";

const TOKEN_KEY = "authToken";

export interface AdminUser {
  id: string;
  username: string;
  fullName: string | null;
  state: string | null;
  isActive: boolean;
  roles: string[];
}

export interface AdminRole {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
}

export interface CreateUserInput {
  username: string;
  password: string;
  fullName?: string;
  state?: string | null;
  roles?: string[];
}

function authHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${AUTH_BASE_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers ?? {}) },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message || `Request failed (${res.status})`);
  }
  // Some endpoints (PUT) return small ack bodies; tolerate empty.
  return (await res.json().catch(() => ({}))) as T;
}

export async function listUsers(): Promise<AdminUser[]> {
  const data = await request<{ users: AdminUser[] }>("/admin/users");
  return data.users;
}

export async function listRoles(): Promise<AdminRole[]> {
  const data = await request<{ roles: AdminRole[] }>("/admin/roles");
  return data.roles;
}

export async function createUser(input: CreateUserInput): Promise<{ id: string }> {
  return request<{ id: string }>("/admin/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateUserRoles(userId: string, roles: string[]): Promise<void> {
  await request(`/admin/users/${userId}/roles`, {
    method: "PUT",
    body: JSON.stringify({ roles }),
  });
}

export async function updateUserState(
  userId: string,
  state: string | null
): Promise<void> {
  await request(`/admin/users/${userId}/state`, {
    method: "PUT",
    body: JSON.stringify({ state }),
  });
}

export async function setUserActive(userId: string, isActive: boolean): Promise<void> {
  await request(`/admin/users/${userId}/active`, {
    method: "PUT",
    body: JSON.stringify({ isActive }),
  });
}

export async function resetUserPassword(userId: string, password: string): Promise<void> {
  await request(`/admin/users/${userId}/password`, {
    method: "PUT",
    body: JSON.stringify({ password }),
  });
}

export interface AdminPermission {
  id: string;
  name: string;
  description: string | null;
}

export async function listPermissions(): Promise<AdminPermission[]> {
  const data = await request<{ permissions: AdminPermission[] }>("/admin/permissions");
  return data.permissions;
}

export async function createPermission(input: {
  name: string;
  description?: string | null;
}): Promise<{ id: string }> {
  return request<{ id: string }>("/admin/permissions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function createRole(input: {
  name: string;
  description?: string | null;
  permissions?: string[];
}): Promise<{ id: string }> {
  return request<{ id: string }>("/admin/roles", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateRolePermissions(
  roleId: string,
  permissions: string[]
): Promise<void> {
  await request(`/admin/roles/${roleId}/permissions`, {
    method: "PUT",
    body: JSON.stringify({ permissions }),
  });
}

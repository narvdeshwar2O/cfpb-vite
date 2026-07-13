const AUTH_BASE_URL = import.meta.env.VITE_AUTH_API_URL || "http://localhost:3001";

export interface AuthUser {
  id: string;
  username: string;
  email: string | null;
  fullName: string | null;
  state: string | null;
  roles: string[];
  permissions: string[];
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export async function loginRequest(
  username: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${AUTH_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message || "Login failed");
  }

  return res.json();
}

export async function fetchMe(token: string): Promise<AuthUser> {
  const res = await fetch(`${AUTH_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error("Session invalid");
  }

  const body = (await res.json()) as { user: AuthUser };
  return body.user;
}

# NCRB Auth Server

Small Node + Express + TypeScript backend that provides **database-backed
authentication** (and the foundation for RBAC) for the NCRB analytics dashboard.

- **DB:** PostgreSQL database `ncrb_auth` (separate from the analytics `ncrb_data`)
- **Port:** `3001` (port 3000 is used by an unrelated app on this machine)
- **Auth:** username/password verified against the DB (bcrypt), JWT returned

## Tables

| Table              | Purpose                                              |
| ------------------ | ---------------------------------------------------- |
| `users`            | accounts; `password_hash` is bcrypt                  |
| `roles`            | role definitions (e.g. `admin`)                      |
| `permissions`      | fine-grained permissions (for full RBAC, later)      |
| `user_roles`       | user ↔ role assignments                              |
| `role_permissions` | role ↔ permission assignments                        |

## Endpoints

| Method | Path          | Description                                  |
| ------ | ------------- | -------------------------------------------- |
| GET    | `/health`     | liveness + DB connectivity                   |
| POST   | `/auth/login` | `{ username, password }` → `{ token, user }` |
| GET    | `/auth/me`    | current user (requires `Bearer <token>`)     |

## Setup

```bash
cd server
cp .env.example .env      # adjust PG* / JWT_SECRET as needed
bun install               # (or npm install)
bun run migrate           # create tables (idempotent)
bun run seed              # create admin/admin user (idempotent)
bun run start             # start on http://localhost:3001  (dev: bun run dev)
```

Default seeded credentials: **`admin` / `admin`** (change for production).

## Configuration (`.env`)

- `PORT` — server port (default `3001`)
- `PGHOST` / `PGPORT` / `PGUSER` / `PGPASSWORD` / `PGDATABASE` — Postgres connection
- `JWT_SECRET` — signing secret (**replace in production**)
- `JWT_EXPIRES_IN` — token lifetime (default `8h`)
- `CORS_ORIGINS` — comma-separated allowed frontend origins (includes `:4000`)

## Frontend wiring

The frontend reads `VITE_AUTH_API_URL` (see `.env.development`, default
`http://localhost:3001`). Auth calls live in `src/services/authApi.ts`; session
state is managed by `src/context/AuthContext.tsx`.

## Next step: full RBAC

The schema already includes `permissions` and `role_permissions`. To grow RBAC:
seed permissions, attach them to roles, and guard routes with `requireRole(...)`
(in `src/auth/middleware.ts`) or a new `requirePermission(...)` guard.

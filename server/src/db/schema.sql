-- NCRB auth + RBAC schema. Idempotent: safe to run repeatedly.
-- RBAC modelled on Laravel's spatie/laravel-permission:
--   roles, permissions, role_has_permissions,
--   model_has_roles, model_has_permissions (polymorphic via model_type/model_id),
--   guard_name on roles & permissions.
-- The "model" here is always a User (model_type = 'User', model_id = users.id).

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      TEXT NOT NULL UNIQUE,
  email         TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  full_name     TEXT,
  -- Data-scoping for the State Viewer role: when set, the user only sees this state.
  state         TEXT,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add state column for pre-existing installs (idempotent).
ALTER TABLE users ADD COLUMN IF NOT EXISTS state TEXT;

-- ── Roles ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roles (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  guard_name  TEXT NOT NULL DEFAULT 'web',
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE roles ADD COLUMN IF NOT EXISTS guard_name TEXT NOT NULL DEFAULT 'web';
-- Spatie uniqueness is per (name, guard_name).
CREATE UNIQUE INDEX IF NOT EXISTS roles_name_guard_unique ON roles (name, guard_name);

-- ── Permissions ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS permissions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  guard_name  TEXT NOT NULL DEFAULT 'web',
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE permissions ADD COLUMN IF NOT EXISTS guard_name TEXT NOT NULL DEFAULT 'web';
CREATE UNIQUE INDEX IF NOT EXISTS permissions_name_guard_unique ON permissions (name, guard_name);

-- ── role_has_permissions (role ↔ permission) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS role_has_permissions (
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  role_id       UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (permission_id, role_id)
);

-- ── model_has_roles (user ↔ role, polymorphic) ───────────────────────────────
CREATE TABLE IF NOT EXISTS model_has_roles (
  role_id    UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  model_type TEXT NOT NULL DEFAULT 'User',
  model_id   UUID NOT NULL,
  PRIMARY KEY (role_id, model_id, model_type)
);
CREATE INDEX IF NOT EXISTS model_has_roles_model_idx ON model_has_roles (model_id, model_type);

-- ── model_has_permissions (user ↔ direct permission, polymorphic) ────────────
CREATE TABLE IF NOT EXISTS model_has_permissions (
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  model_type    TEXT NOT NULL DEFAULT 'User',
  model_id      UUID NOT NULL,
  PRIMARY KEY (permission_id, model_id, model_type)
);
CREATE INDEX IF NOT EXISTS model_has_permissions_model_idx ON model_has_permissions (model_id, model_type);

-- ── Legacy tables (kept, no longer used) ─────────────────────────────────────
-- Earlier session created user_roles / role_permissions. They are retained
-- (nothing is dropped) but superseded by model_has_roles / role_has_permissions.
-- Migrate any data that may exist in them into the Spatie tables (idempotent).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_roles') THEN
    INSERT INTO model_has_roles (role_id, model_type, model_id)
    SELECT role_id, 'User', user_id FROM user_roles
    ON CONFLICT DO NOTHING;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'role_permissions') THEN
    INSERT INTO role_has_permissions (permission_id, role_id)
    SELECT permission_id, role_id FROM role_permissions
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

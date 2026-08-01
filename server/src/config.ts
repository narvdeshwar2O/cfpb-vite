import "dotenv/config";

/**
 * Centralised, validated runtime configuration for the auth server.
 * Reading env vars in one place keeps the rest of the code free of process.env.
 */
function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 3001),
  db: {
    host: required("PGHOST", "localhost"),
    port: Number(process.env.PGPORT ?? 5432),
    user: required("PGUSER"),
    // Empty password is valid for local Homebrew Postgres trust auth.
    password: process.env.PGPASSWORD ?? "",
    database: required("PGDATABASE", "ncrb_auth"),
  },
  jwt: {
    secret: required("JWT_SECRET"),
    expiresIn: (process.env.JWT_EXPIRES_IN || "8h").trim(),
  },
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:4000")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
} as const;

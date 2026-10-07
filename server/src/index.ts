import express, { type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import { config } from "./config.js";
import { pool } from "./db/pool.js";
import { authRouter } from "./auth/routes.js";
import { adminRouter } from "./admin/routes.js";

const app = express();

app.use(
  cors({
    origin: (requestOrigin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!requestOrigin) return callback(null, true);

      // Check if origin is explicitly in config.corsOrigins
      if (config.corsOrigins.includes(requestOrigin)) {
        return callback(null, true);
      }

      // Automatically allow localhost, 127.0.0.1, or private LAN IPs (10.x.x.x, 192.168.x.x, 172.16-31.x.x)
      try {
        const url = new URL(requestOrigin);
        const host = url.hostname;
        if (
          host === "localhost" ||
          host === "127.0.0.1" ||
          host.startsWith("10.") ||
          host.startsWith("192.168.") ||
          /^172\.(1[6-9]|2\d|3[01])\./.test(host)
        ) {
          return callback(null, true);
        }
      } catch {
        // Fallback below
      }

      callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());

// Global response sanitizer: ensures passwords/credentials never leak in any response body
app.use((_req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json.bind(res);
  const sensitiveKeys = new Set([
    "bindpassword",
    "bind_password",
    "password",
    "password_hash",
    "passwordhash",
    "client_secret",
    "clientsecret",
  ]);

  function sanitize(obj: any): any {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map(sanitize);
    if (typeof obj === "object") {
      const cleaned: Record<string, any> = {};
      for (const [k, v] of Object.entries(obj)) {
        const lowerK = k.toLowerCase().replace(/[-_]/g, "");
        if (sensitiveKeys.has(lowerK) || sensitiveKeys.has(k.toLowerCase())) {
          // Redact completely or mask
          cleaned[k] = "••••••••••••";
        } else if (typeof v === "object") {
          cleaned[k] = sanitize(v);
        } else {
          cleaned[k] = v;
        }
      }
      return cleaned;
    }
    return obj;
  }

  res.json = (body: any) => {
    return originalJson(sanitize(body));
  };
  next();
});

// Liveness + DB connectivity check.
app.get("/health", async (_req: Request, res: Response) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "up" });
  } catch {
    res.status(503).json({ status: "degraded", db: "down" });
  }
});

app.use("/auth", authRouter);
app.use("/admin", adminRouter);

// Centralised error handler so route handlers can throw/await freely.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(config.port, "0.0.0.0", () => {
  console.log(`Auth server listening on port ${config.port} (0.0.0.0)`);
});

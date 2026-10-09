import type { Request } from "express";

/**
 * Normalizes and extracts trustworthy client IP address for direct private-network deployment.
 * 
 * In a private network deployment without trusted reverse proxy:
 * - req.socket.remoteAddress represents the actual TCP connection socket.
 * - Client-supplied headers like X-Forwarded-For or X-Real-IP can be easily spoofed
 *   unless explicitly configured with a trusted proxy.
 * - Handles IPv4-mapped IPv6 addresses (e.g. ::ffff:192.168.1.10 -> 192.168.1.10).
 * - Handles localhost IPv6 (::1 -> 127.0.0.1 or ::1).
 */
export function extractClientIp(req: Request): string | null {
  // Obtain socket address
  let rawIp = req.socket?.remoteAddress || req.connection?.remoteAddress || null;

  if (!rawIp) {
    return null;
  }

  // Normalize IPv4-mapped IPv6 (::ffff:192.168.x.x)
  if (rawIp.startsWith("::ffff:")) {
    rawIp = rawIp.substring(7);
  } else if (rawIp === "::1") {
    rawIp = "127.0.0.1";
  }

  return rawIp;
}

export function extractUserAgent(req: Request): string | null {
  const ua = req.headers["user-agent"];
  if (typeof ua === "string") {
    // Bound user agent string to 255 chars
    return ua.substring(0, 255);
  }
  return null;
}

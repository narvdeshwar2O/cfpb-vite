import jwt from "jsonwebtoken";
import { config } from "../config.js";

export interface JwtPayload {
  sub: string; // user id
  username: string;
  roles: string[];
}

/** Signs a JWT for an authenticated user. */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  });
}

/** Verifies a JWT and returns its payload, or throws if invalid/expired. */
export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, config.jwt.secret) as JwtPayload;
}

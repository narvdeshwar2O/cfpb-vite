import crypto from "crypto";
import { config } from "../config.js";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // Standard 96-bit IV for GCM
const TAG_LENGTH = 16; // Standard 128-bit authentication tag

/**
 * Derives a consistent 32-byte key from JWT_SECRET or an encryption secret.
 */
function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY || config.jwt.secret || "ncrb-default-system-secret-key-salt";
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts a plaintext string using AES-256-GCM.
 * Format: enc:v1:<base64-iv>:<base64-tag>:<base64-ciphertext>
 */
export function encryptValue(plainText: string): string {
  if (!plainText) return plainText;
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(plainText, "utf8", "base64");
  encrypted += cipher.final("base64");
  const authTag = cipher.getAuthTag();

  return `enc:v1:${iv.toString("base64")}:${authTag.toString("base64")}:${encrypted}`;
}

/**
 * Decrypts a ciphertext string encrypted with AES-256-GCM.
 * If the input is not encrypted (e.g. legacy plain text), returns the original string gracefully.
 */
export function decryptValue(cipherText: string | undefined | null): string {
  if (!cipherText) return "";
  if (!cipherText.startsWith("enc:v1:")) {
    // Plaintext backwards compatibility
    return cipherText;
  }

  try {
    const parts = cipherText.split(":");
    if (parts.length !== 5) {
      return cipherText;
    }

    const [, , ivBase64, tagBase64, encBase64] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivBase64, "base64");
    const authTag = Buffer.from(tagBase64, "base64");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encBase64, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("[crypto] Decryption error:", err);
    return "";
  }
}

import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

// Hash kata sandi dengan scrypt (bawaan Node, tanpa dependensi tambahan).
// Format simpan: saltHex:hashHex
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const attempt = scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(attempt, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function newSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export const SESSION_COOKIE = "lvg_session";
// Sesi berlaku 30 hari. Disimpan di KV (bukan sesi file PHP) sehingga
// login tidak hilang sendiri seperti di hosting gratis sebelumnya.
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

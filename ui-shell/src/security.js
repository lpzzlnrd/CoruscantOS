/**
 * security.js — CoruscantOS Lock Security Module
 *
 * Provides PIN-based authentication with:
 *   - PBKDF2-SHA-256 key derivation (100 000 iterations) — no plaintext stored
 *   - Per-device random salt, stored separately from the hash
 *   - Consecutive failed-attempt tracking (max 3) persisted in localStorage
 *   - Security lockout state that survives page reloads
 *
 * All sensitive data written to localStorage is hashed / non-reversible.
 * The raw PIN is never stored anywhere.
 */

/** localStorage keys */
const KEY_HASH = "cos_pin_hash";
const KEY_SALT = "cos_pin_salt";
const KEY_ATTEMPTS = "cos_fail_attempts";
const KEY_LOCKOUT = "cos_lockout";

/** Maximum consecutive failed unlock attempts before security lockout. */
export const MAX_ATTEMPTS = 3;

/** Default PIN used the first time the app runs (before the user changes it). */
const DEFAULT_PIN = "1138";

/** PBKDF2 iteration count — high enough to be costly for brute-force. */
const PBKDF2_ITERATIONS = 100_000;

// ─── Internal helpers ────────────────────────────────────────────────────────

/**
 * Generate 16 cryptographically random bytes, hex-encoded.
 * @returns {string}
 */
function generateSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Decode a hex string to a Uint8Array.
 * @param {string} hex
 * @returns {Uint8Array}
 */
function hexToBytes(hex) {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    out[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return out;
}

/**
 * Derive a 256-bit key from pin + saltHex using PBKDF2-SHA-256.
 * @param {string} pin      Raw PIN string.
 * @param {string} saltHex  Hex-encoded salt.
 * @returns {Promise<string>}  Hex-encoded derived key.
 */
async function deriveKey(pin, saltHex) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(pin),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: hexToBytes(saltHex),
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  return Array.from(new Uint8Array(bits))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Bootstrap PIN storage on first run.
 * If no hash is stored yet, derive and persist the default PIN.
 * Must be awaited before any verifyPin / changePin call.
 * @returns {Promise<void>}
 */
export async function initPin() {
  if (!localStorage.getItem(KEY_HASH)) {
    const salt = generateSalt();
    const hash = await deriveKey(DEFAULT_PIN, salt);
    localStorage.setItem(KEY_SALT, salt);
    localStorage.setItem(KEY_HASH, hash);
  }
}

/**
 * Verify whether the supplied PIN matches the stored hash.
 * @param {string} pin
 * @returns {Promise<boolean>}
 */
export async function verifyPin(pin) {
  const storedHash = localStorage.getItem(KEY_HASH);
  const storedSalt = localStorage.getItem(KEY_SALT);
  if (!storedHash || !storedSalt) {
    return false;
  }
  const hash = await deriveKey(pin, storedSalt);
  return hash === storedHash;
}

/**
 * Change the stored PIN.
 * Requires the correct current PIN; generates a fresh salt for the new hash.
 * @param {string} currentPin
 * @param {string} newPin
 * @returns {Promise<boolean>}  true on success, false if currentPin is wrong.
 */
export async function changePin(currentPin, newPin) {
  if (!(await verifyPin(currentPin))) {
    return false;
  }
  const salt = generateSalt();
  const hash = await deriveKey(newPin, salt);
  localStorage.setItem(KEY_SALT, salt);
  localStorage.setItem(KEY_HASH, hash);
  return true;
}

/**
 * Return the current count of consecutive failed unlock attempts.
 * @returns {number}
 */
export function getFailedAttempts() {
  return parseInt(localStorage.getItem(KEY_ATTEMPTS) || "0", 10);
}

/**
 * Increment the failed-attempts counter.
 * @returns {number}  New counter value.
 */
export function incrementFailedAttempts() {
  const next = getFailedAttempts() + 1;
  localStorage.setItem(KEY_ATTEMPTS, String(next));
  return next;
}

/**
 * Reset the failed-attempts counter to zero.
 */
export function resetFailedAttempts() {
  localStorage.removeItem(KEY_ATTEMPTS);
}

/**
 * Returns true when the device is in a persistent security lockout.
 * @returns {boolean}
 */
export function isLockedOut() {
  return localStorage.getItem(KEY_LOCKOUT) === "1";
}

/**
 * Activate or deactivate the security lockout.
 * Deactivating also resets the failed-attempts counter.
 * @param {boolean} locked
 */
export function setLockout(locked) {
  if (locked) {
    localStorage.setItem(KEY_LOCKOUT, "1");
  } else {
    localStorage.removeItem(KEY_LOCKOUT);
    resetFailedAttempts();
  }
}

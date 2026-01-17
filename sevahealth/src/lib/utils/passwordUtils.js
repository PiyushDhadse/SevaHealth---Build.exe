/**
 * Password Hashing Utilities
 * For custom authentication without Supabase Auth
 */

/**
 * Simple password hashing using Web Crypto API
 * For production, consider using bcrypt or similar
 */
export async function hashPassword(password) {
  try {
    // Convert password to ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(password);

    // Hash using SHA-256 (for development)
    // In production, use bcrypt or Argon2 for better security
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    // Convert to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return `sha256:${hashHex}`;
  } catch (error) {
    console.error("Password hashing error:", error);
    throw new Error("Failed to hash password");
  }
}

/**
 * Verify password against hash
 */
export async function verifyPassword(password, hash) {
  try {
    const hashedPassword = await hashPassword(password);
    return hashedPassword === hash;
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

/**
 * Simple password validation
 */
export function validatePassword(password) {
  if (!password) {
    return { valid: false, error: "Password is required" };
  }

  if (password.length < 6) {
    return {
      valid: false,
      error: "Password must be at least 6 characters long",
    };
  }

  return { valid: true };
}

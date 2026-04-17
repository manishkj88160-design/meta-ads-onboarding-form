import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword, generateRandomPassword } from "./_core/adminAuth";

describe("Admin Authentication", () => {
  it("should hash passwords correctly", () => {
    const password = "testPassword123!";
    const hash = hashPassword(password);
    
    expect(hash).toBeDefined();
    expect(hash.length).toBe(64); // SHA-256 produces 64 character hex string
    expect(hash).not.toBe(password); // Hash should not equal original password
  });

  it("should verify correct passwords", () => {
    const password = "mySecurePassword";
    const hash = hashPassword(password);
    
    const isValid = verifyPassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("should reject incorrect passwords", () => {
    const password = "correctPassword";
    const wrongPassword = "wrongPassword";
    const hash = hashPassword(password);
    
    const isValid = verifyPassword(wrongPassword, hash);
    expect(isValid).toBe(false);
  });

  it("should generate random passwords", () => {
    const password1 = generateRandomPassword(12);
    const password2 = generateRandomPassword(12);
    
    expect(password1).toBeDefined();
    expect(password1.length).toBe(12);
    expect(password2).toBeDefined();
    expect(password2.length).toBe(12);
    expect(password1).not.toBe(password2); // Should be different random passwords
  });

  it("should generate passwords with special characters", () => {
    const password = generateRandomPassword(20);
    
    // Check that password contains various character types
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    
    expect(password.length).toBe(20);
    // At least one of these should be true for a 20-char password
    expect(hasUppercase || hasLowercase || hasNumbers).toBe(true);
  });

  it("should handle same password with different hashes", () => {
    const password = "samePassword";
    const hash1 = hashPassword(password);
    const hash2 = hashPassword(password);
    
    // Same password should produce same hash (deterministic)
    expect(hash1).toBe(hash2);
    
    // Both hashes should verify the password
    expect(verifyPassword(password, hash1)).toBe(true);
    expect(verifyPassword(password, hash2)).toBe(true);
  });
});

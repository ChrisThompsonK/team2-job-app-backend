import { describe, expect, it } from "vitest";
import {
	decodeUserId,
	encodeUserId,
	isValidEmail,
	validatePasswordStrength,
	verifyUserId,
} from "../utils/auth.js";

describe("Email Validation", () => {
	describe("Valid Emails", () => {
		it("should accept standard email formats", () => {
			expect(isValidEmail("user@example.com")).toBe(true);
			expect(isValidEmail("test.user@example.com")).toBe(true);
			expect(isValidEmail("user+tag@example.com")).toBe(true);
			expect(isValidEmail("user_name@example.com")).toBe(true);
			expect(isValidEmail("user-name@example.com")).toBe(true);
		});

		it("should accept emails with subdomains", () => {
			expect(isValidEmail("user@mail.example.com")).toBe(true);
			expect(isValidEmail("user@sub.mail.example.com")).toBe(true);
		});

		it("should accept emails with numbers", () => {
			expect(isValidEmail("user123@example.com")).toBe(true);
			expect(isValidEmail("123user@example.com")).toBe(true);
			expect(isValidEmail("user@example123.com")).toBe(true);
		});

		it("should accept emails with hyphens in domain", () => {
			expect(isValidEmail("user@my-domain.com")).toBe(true);
			expect(isValidEmail("user@sub-domain.example.com")).toBe(true);
		});

		it("should accept various TLD lengths", () => {
			expect(isValidEmail("user@example.co")).toBe(true);
			expect(isValidEmail("user@example.com")).toBe(true);
			expect(isValidEmail("user@example.info")).toBe(true);
			expect(isValidEmail("user@example.museum")).toBe(true);
		});
	});

	describe("Invalid Emails", () => {
		it("should reject emails with invalid characters in local part", () => {
			expect(isValidEmail('asdasdasdsad@!<>:"|{}_+()*(&^&%^$%£!.com')).toBe(
				false
			);
			expect(isValidEmail("user@#$%@example.com")).toBe(false);
			expect(isValidEmail("user!#$%@example.com")).toBe(false);
			expect(isValidEmail("user<>@example.com")).toBe(false);
			expect(isValidEmail("user|@example.com")).toBe(false);
			expect(isValidEmail("user[@example.com")).toBe(false);
			expect(isValidEmail("user]@example.com")).toBe(false);
		});

		it("should reject emails with invalid characters in domain", () => {
			expect(isValidEmail("user@exam!ple.com")).toBe(false);
			expect(isValidEmail("user@exam_ple.com")).toBe(false);
			expect(isValidEmail("user@exam+ple.com")).toBe(false);
			expect(isValidEmail("user@exam ple.com")).toBe(false);
		});

		it("should reject emails without @ symbol", () => {
			expect(isValidEmail("userexample.com")).toBe(false);
			expect(isValidEmail("user.example.com")).toBe(false);
		});

		it("should reject emails without domain", () => {
			expect(isValidEmail("user@")).toBe(false);
			expect(isValidEmail("user@.com")).toBe(false);
		});

		it("should reject emails without TLD", () => {
			expect(isValidEmail("user@example")).toBe(false);
			expect(isValidEmail("user@example.")).toBe(false);
		});

		it("should reject emails without local part", () => {
			expect(isValidEmail("@example.com")).toBe(false);
		});

		it("should reject emails with spaces", () => {
			expect(isValidEmail("user name@example.com")).toBe(false);
			expect(isValidEmail("user@exam ple.com")).toBe(false);
			expect(isValidEmail(" user@example.com")).toBe(false);
			expect(isValidEmail("user@example.com ")).toBe(false);
		});

		it("should reject emails with consecutive dots", () => {
			expect(isValidEmail("user..name@example.com")).toBe(false);
			expect(isValidEmail("user@example..com")).toBe(false);
		});

		it("should reject emails starting or ending with dots", () => {
			expect(isValidEmail(".user@example.com")).toBe(false);
			expect(isValidEmail("user.@example.com")).toBe(false);
			expect(isValidEmail("user@.example.com")).toBe(false);
		});

		it("should reject emails with multiple @ symbols", () => {
			expect(isValidEmail("user@@example.com")).toBe(false);
			expect(isValidEmail("user@name@example.com")).toBe(false);
		});

		it("should reject emails with invalid TLD", () => {
			expect(isValidEmail("user@example.c")).toBe(false); // TLD too short
			expect(isValidEmail("user@example.123")).toBe(false); // TLD with numbers
		});

		it("should reject emails that are too long", () => {
			// Local part > 64 characters
			const longLocal = "a".repeat(65);
			expect(isValidEmail(`${longLocal}@example.com`)).toBe(false);

			// Domain > 253 characters
			const longDomain = "a".repeat(250);
			expect(isValidEmail(`user@${longDomain}.com`)).toBe(false);
		});

		it("should reject empty or whitespace-only strings", () => {
			expect(isValidEmail("")).toBe(false);
			expect(isValidEmail(" ")).toBe(false);
			expect(isValidEmail("   ")).toBe(false);
		});
	});
});

describe("User ID Encoding (Sqids)", () => {
	describe("encodeUserId", () => {
		it("should encode user IDs to unique strings", () => {
			const encoded1 = encodeUserId(1);
			const encoded2 = encodeUserId(2);
			const encoded100 = encodeUserId(100);

			expect(encoded1).toBeTruthy();
			expect(encoded2).toBeTruthy();
			expect(encoded100).toBeTruthy();

			// All should be different
			expect(encoded1).not.toBe(encoded2);
			expect(encoded1).not.toBe(encoded100);
			expect(encoded2).not.toBe(encoded100);
		});

		it("should produce minimum 8-character IDs", () => {
			const encoded = encodeUserId(1);
			expect(encoded.length).toBeGreaterThanOrEqual(8);
		});

		it("should produce consistent results for same input", () => {
			const encoded1a = encodeUserId(123);
			const encoded1b = encodeUserId(123);
			expect(encoded1a).toBe(encoded1b);
		});

		it("should handle large user IDs", () => {
			const largeId = 9999999;
			const encoded = encodeUserId(largeId);
			expect(encoded).toBeTruthy();
			expect(typeof encoded).toBe("string");
		});
	});

	describe("decodeUserId", () => {
		it("should decode encoded IDs back to original numbers", () => {
			const originalId = 42;
			const encoded = encodeUserId(originalId);
			const decoded = decodeUserId(encoded);

			expect(decoded).toBe(originalId);
		});

		it("should return null for empty encoded IDs", () => {
			expect(decodeUserId("")).toBe(null);
		});

		it("should handle multiple encode/decode cycles", () => {
			const testIds = [1, 10, 100, 1000, 10000];

			for (const id of testIds) {
				const encoded = encodeUserId(id);
				const decoded = decodeUserId(encoded);
				expect(decoded).toBe(id);
			}
		});
	});

	describe("verifyUserId", () => {
		it("should verify matching ID and encoded ID", () => {
			const userId = 123;
			const encodedId = encodeUserId(userId);

			expect(verifyUserId(userId, encodedId)).toBe(true);
		});

		it("should reject non-matching ID and encoded ID", () => {
			const userId1 = 123;
			const userId2 = 456;
			const encodedId1 = encodeUserId(userId1);

			expect(verifyUserId(userId2, encodedId1)).toBe(false);
		});

		it("should handle edge cases", () => {
			expect(verifyUserId(1, encodeUserId(1))).toBe(true);
			expect(verifyUserId(0, encodeUserId(0))).toBe(true);
		});
	});
});

describe("Password Validation", () => {
	describe("Valid Passwords", () => {
		it("should accept passwords meeting all requirements", () => {
			expect(validatePasswordStrength("Password123!").isValid).toBe(true);
			expect(validatePasswordStrength("MyP@ssw0rd").isValid).toBe(true);
			expect(validatePasswordStrength("Str0ng#Pass").isValid).toBe(true);
		});
	});

	describe("Invalid Passwords", () => {
		it("should reject passwords shorter than 8 characters", () => {
			const result = validatePasswordStrength("Pass1!");
			expect(result.isValid).toBe(false);
			expect(result.message).toContain("at least 8 characters");
		});

		it("should reject passwords without uppercase letters", () => {
			const result = validatePasswordStrength("password123!");
			expect(result.isValid).toBe(false);
			expect(result.message).toContain("uppercase letter");
		});

		it("should reject passwords without lowercase letters", () => {
			const result = validatePasswordStrength("PASSWORD123!");
			expect(result.isValid).toBe(false);
			expect(result.message).toContain("lowercase letter");
		});

		it("should reject passwords without numbers", () => {
			const result = validatePasswordStrength("Password!");
			expect(result.isValid).toBe(false);
			expect(result.message).toContain("number");
		});

		it("should reject passwords without special characters", () => {
			const result = validatePasswordStrength("Password123");
			expect(result.isValid).toBe(false);
			expect(result.message).toContain("special character");
		});
	});
});

import { describe, expect, it } from "vitest";
import { isValidEmail, validatePasswordStrength } from "../utils/auth.js";

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

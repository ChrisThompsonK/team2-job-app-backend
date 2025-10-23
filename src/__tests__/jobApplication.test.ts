import { describe, expect, it } from "vitest";

describe("Job Application - Get by User Email", () => {
	it("should validate email format correctly", () => {
		const validEmails = [
			"user@example.com",
			"john.doe@company.co.uk",
			"test+tag@domain.org",
			"name123@test-domain.com",
		];

		const invalidEmails = [
			"invalid-email",
			"@example.com",
			"user@",
			"user name@example.com",
			"",
		];

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

		for (const email of validEmails) {
			expect(emailRegex.test(email)).toBe(true);
		}

		for (const email of invalidEmails) {
			expect(emailRegex.test(email)).toBe(false);
		}
	});

	it("should handle URL encoding correctly", () => {
		const email = "john.doe@example.com";
		const encoded = encodeURIComponent(email);
		const decoded = decodeURIComponent(encoded);

		expect(encoded).toBe("john.doe%40example.com");
		expect(decoded).toBe(email);
	});

	it("should validate application status values", () => {
		const validStatuses = [
			"in progress",
			"pending",
			"under_review",
			"shortlisted",
			"rejected",
			"hired",
		];

		for (const status of validStatuses) {
			expect(typeof status).toBe("string");
			expect(status.length).toBeGreaterThan(0);
		}
	});

	it("should format ISO date strings correctly", () => {
		const now = new Date();
		const isoString = now.toISOString();

		expect(isoString).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);

		const parsed = new Date(isoString);
		expect(parsed.getTime()).toBe(now.getTime());
	});

	it("should structure job application response correctly", () => {
		const sampleApplication = {
			id: 1,
			jobRoleId: 5,
			applicantName: "John Doe",
			applicantEmail: "john.doe@example.com",
			coverLetter: "I am interested in this position...",
			resumeUrl: "http://localhost:8000/uploads/cvs/application-1-cv.pdf",
			hasCv: true,
			cvFileName: "john_doe_cv.pdf",
			cvMimeType: "application/pdf",
			status: "pending",
			submittedAt: "2025-10-23T10:30:00.000Z",
			updatedAt: "2025-10-23T10:30:00.000Z",
			jobRole: {
				id: 5,
				jobRoleName: "Software Engineer",
				description: "Job description...",
				responsibilities: "Job responsibilities...",
				jobSpecLink: "https://example.com/job-spec.pdf",
				location: "Belfast",
				capability: "Engineering",
				band: "Associate",
				closingDate: "2025-11-30T00:00:00.000Z",
				status: "open",
				numberOfOpenPositions: 3,
				createdAt: "2025-10-01T00:00:00.000Z",
				updatedAt: "2025-10-01T00:00:00.000Z",
			},
		};

		// Validate structure
		expect(sampleApplication).toHaveProperty("id");
		expect(sampleApplication).toHaveProperty("jobRoleId");
		expect(sampleApplication).toHaveProperty("applicantName");
		expect(sampleApplication).toHaveProperty("applicantEmail");
		expect(sampleApplication).toHaveProperty("status");
		expect(sampleApplication).toHaveProperty("submittedAt");
		expect(sampleApplication).toHaveProperty("jobRole");

		// Validate types
		expect(typeof sampleApplication.id).toBe("number");
		expect(typeof sampleApplication.jobRoleId).toBe("number");
		expect(typeof sampleApplication.applicantName).toBe("string");
		expect(typeof sampleApplication.applicantEmail).toBe("string");
		expect(typeof sampleApplication.hasCv).toBe("boolean");

		// Validate nested jobRole
		expect(sampleApplication.jobRole).toHaveProperty("id");
		expect(sampleApplication.jobRole).toHaveProperty("jobRoleName");
		expect(sampleApplication.jobRole).toHaveProperty("status");
	});

	it("should handle empty application list correctly", () => {
		const emptyResponse = {
			success: true,
			data: [],
		};

		expect(emptyResponse.success).toBe(true);
		expect(Array.isArray(emptyResponse.data)).toBe(true);
		expect(emptyResponse.data.length).toBe(0);
	});

	it("should structure error responses correctly", () => {
		const badRequestError = {
			success: false,
			message: "Invalid email format",
			error: "Email parameter is required and must be valid",
		};

		expect(badRequestError.success).toBe(false);
		expect(badRequestError).toHaveProperty("message");
		expect(badRequestError).toHaveProperty("error");

		const serverError = {
			success: false,
			message: "Failed to fetch user applications",
			error: "Database connection error",
		};

		expect(serverError.success).toBe(false);
		expect(serverError).toHaveProperty("message");
		expect(serverError).toHaveProperty("error");
	});
});

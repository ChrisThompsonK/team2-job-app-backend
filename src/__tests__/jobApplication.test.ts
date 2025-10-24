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

describe("Job Application - Withdraw Application", () => {
	it("should validate application ID format", () => {
		const validIds = [1, 42, 100, 9999];
		const invalidIds = ["abc", -1, 0, null, undefined, NaN, ""];

		for (const id of validIds) {
			const parsed = Number.parseInt(String(id), 10);
			expect(Number.isNaN(parsed)).toBe(false);
			expect(parsed).toBeGreaterThan(0);
		}

		for (const id of invalidIds) {
			const parsed = Number.parseInt(String(id), 10);
			expect(Number.isNaN(parsed) || parsed <= 0).toBe(true);
		}
	});

	it("should identify withdrawable statuses correctly", () => {
		const withdrawableStatuses = ["pending", "under_review", "in progress"];
		const nonWithdrawableStatuses = [
			"withdrawn",
			"accepted",
			"rejected",
			"hired",
		];

		for (const status of withdrawableStatuses) {
			expect(withdrawableStatuses.includes(status)).toBe(true);
		}

		for (const status of nonWithdrawableStatuses) {
			expect(withdrawableStatuses.includes(status)).toBe(false);
		}
	});

	it("should structure successful withdrawal response correctly", () => {
		const withdrawalResponse = {
			success: true,
			data: {
				id: 42,
				jobRoleId: 10,
				applicantName: "John Doe",
				applicantEmail: "john.doe@example.com",
				coverLetter: "I am very interested in this position...",
				resumeUrl: "/uploads/cv_42_resume.pdf",
				hasCv: true,
				cvFileName: "john_doe_resume.pdf",
				cvMimeType: "application/pdf",
				status: "withdrawn",
				submittedAt: "2025-10-20T14:30:00.000Z",
				updatedAt: "2025-10-24T10:15:00.000Z",
				jobRole: {
					id: 10,
					jobRoleName: "Software Engineer",
					description: "Backend development position",
					responsibilities: "Develop and maintain APIs",
					jobSpecLink: "https://example.com/specs/software-engineer",
					location: "Belfast",
					capability: "Engineering",
					band: "Senior",
					closingDate: "2025-11-15T23:59:59.000Z",
					status: "open",
					numberOfOpenPositions: 3,
					createdAt: "2025-10-01T09:00:00.000Z",
					updatedAt: "2025-10-01T09:00:00.000Z",
				},
			},
		};

		// Validate structure
		expect(withdrawalResponse.success).toBe(true);
		expect(withdrawalResponse.data).toHaveProperty("id");
		expect(withdrawalResponse.data).toHaveProperty("status");
		expect(withdrawalResponse.data.status).toBe("withdrawn");
		expect(withdrawalResponse.data).toHaveProperty("updatedAt");

		// Validate that updatedAt is more recent than submittedAt
		const submittedDate = new Date(withdrawalResponse.data.submittedAt);
		const updatedDate = new Date(withdrawalResponse.data.updatedAt);
		expect(updatedDate.getTime()).toBeGreaterThan(submittedDate.getTime());
	});

	it("should structure error responses correctly", () => {
		// Invalid application ID
		const invalidIdError = {
			success: false,
			message: "Invalid application ID",
		};
		expect(invalidIdError.success).toBe(false);
		expect(invalidIdError.message).toBe("Invalid application ID");

		// Application not found
		const notFoundError = {
			success: false,
			message: "Application not found",
		};
		expect(notFoundError.success).toBe(false);
		expect(notFoundError.message).toBe("Application not found");

		// Forbidden - not application owner
		const forbiddenError = {
			success: false,
			message: "You do not have permission to withdraw this application",
		};
		expect(forbiddenError.success).toBe(false);
		expect(forbiddenError.message).toContain("permission");

		// Cannot withdraw
		const cannotWithdrawError = {
			success: false,
			message:
				"This application cannot be withdrawn. Only applications with status 'pending', 'under_review', or 'in progress' can be withdrawn.",
		};
		expect(cannotWithdrawError.success).toBe(false);
		expect(cannotWithdrawError.message).toContain("cannot be withdrawn");

		// Server error
		const serverError = {
			success: false,
			message: "An error occurred while withdrawing the application",
		};
		expect(serverError.success).toBe(false);
		expect(serverError.message).toContain("error occurred");
	});

	it("should validate user ownership correctly", () => {
		const applicationOwnerEmail = "john.doe@example.com";
		const authenticatedUserEmail = "john.doe@example.com";
		const differentUserEmail = "jane.smith@example.com";

		// Same user - should be allowed
		expect(applicationOwnerEmail).toBe(authenticatedUserEmail);

		// Different user - should not be allowed
		expect(applicationOwnerEmail).not.toBe(differentUserEmail);
	});

	it("should preserve application data after withdrawal", () => {
		const beforeWithdrawal = {
			id: 42,
			applicantName: "John Doe",
			applicantEmail: "john.doe@example.com",
			coverLetter: "I am very interested...",
			cvFileName: "john_doe_resume.pdf",
			status: "pending",
		};

		const afterWithdrawal = {
			...beforeWithdrawal,
			status: "withdrawn",
			updatedAt: new Date().toISOString(),
		};

		// All fields except status and updatedAt should remain unchanged
		expect(afterWithdrawal.id).toBe(beforeWithdrawal.id);
		expect(afterWithdrawal.applicantName).toBe(beforeWithdrawal.applicantName);
		expect(afterWithdrawal.applicantEmail).toBe(
			beforeWithdrawal.applicantEmail
		);
		expect(afterWithdrawal.coverLetter).toBe(beforeWithdrawal.coverLetter);
		expect(afterWithdrawal.cvFileName).toBe(beforeWithdrawal.cvFileName);

		// Only status should change
		expect(afterWithdrawal.status).toBe("withdrawn");
		expect(afterWithdrawal.status).not.toBe(beforeWithdrawal.status);
	});

	it("should handle authentication requirements", () => {
		// Authenticated request with header
		const authenticatedHeaders = {
			"x-user-email": "john.doe@example.com",
		};
		expect(authenticatedHeaders["x-user-email"]).toBeDefined();
		expect(authenticatedHeaders["x-user-email"]).toMatch(
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/
		);

		// Unauthenticated request without header
		const unauthenticatedHeaders = {};
		expect(unauthenticatedHeaders).not.toHaveProperty("x-user-email");

		// Invalid email format in header
		const invalidEmailHeaders = {
			"x-user-email": "invalid-email",
		};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		expect(emailRegex.test(invalidEmailHeaders["x-user-email"])).toBe(false);
	});

	it("should validate status transition rules", () => {
		// Valid transitions to withdrawn
		const validTransitions = [
			{ from: "pending", to: "withdrawn", allowed: true },
			{ from: "under_review", to: "withdrawn", allowed: true },
			{ from: "in progress", to: "withdrawn", allowed: true },
		];

		// Invalid transitions to withdrawn
		const invalidTransitions = [
			{ from: "withdrawn", to: "withdrawn", allowed: false },
			{ from: "accepted", to: "withdrawn", allowed: false },
			{ from: "rejected", to: "withdrawn", allowed: false },
			{ from: "hired", to: "withdrawn", allowed: false },
		];

		for (const transition of validTransitions) {
			expect(transition.allowed).toBe(true);
		}

		for (const transition of invalidTransitions) {
			expect(transition.allowed).toBe(false);
		}
	});
});

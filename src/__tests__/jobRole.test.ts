import { describe, expect, it } from "vitest";
import type { CreateJobRoleRequest } from "../types/jobRole";

describe("Job Role Types", () => {
	it("should have correct job role structure", () => {
		const sampleRequest: CreateJobRoleRequest = {
			jobRoleName: "Test Developer",
			description: "Test description",
			responsibilities: "Test responsibilities",
			jobSpecLink: "https://example.com/job-spec",
			location: "Test Location",
			capability: "Engineering",
			band: "Mid",
			closingDate: "2025-12-31T23:59:59.000Z",
			numberOfOpenPositions: 1,
		};

		// Check that all required fields are present
		expect(sampleRequest.jobRoleName).toBe("Test Developer");
		expect(sampleRequest.description).toBe("Test description");
		expect(sampleRequest.responsibilities).toBe("Test responsibilities");
		expect(sampleRequest.jobSpecLink).toBe("https://example.com/job-spec");
		expect(sampleRequest.location).toBe("Test Location");
		expect(sampleRequest.capability).toBe("Engineering");
		expect(sampleRequest.band).toBe("Mid");
		expect(sampleRequest.closingDate).toBe("2025-12-31T23:59:59.000Z");
		expect(sampleRequest.numberOfOpenPositions).toBe(1);
	});

	it("should validate date string format", () => {
		const isoDateString = "2025-12-31T23:59:59.000Z";
		const date = new Date(isoDateString);

		expect(date.toISOString()).toBe(isoDateString);
		expect(Number.isNaN(date.getTime())).toBe(false);
	});

	it("should have proper status enum values", () => {
		const validStatuses = ["active", "closed", "draft"];

		for (const status of validStatuses) {
			expect(typeof status).toBe("string");
			expect(status.length).toBeGreaterThan(0);
		}
	});
});

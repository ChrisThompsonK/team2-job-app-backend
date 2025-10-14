import { describe, expect, it } from "vitest";
import type { CreateJobRoleRequest } from "../types/jobRole";
import {
	calculatePaginationMetadata,
	validatePaginationParams,
} from "../utils/pagination";

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

describe("Pagination Utilities", () => {
	describe("validatePaginationParams", () => {
		it("should use default values when no parameters provided", () => {
			const result = validatePaginationParams();
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.params.page).toBe(1);
				expect(result.params.limit).toBe(12);
				expect(result.params.offset).toBe(0);
			}
		});

		it("should validate valid page and limit parameters", () => {
			const result = validatePaginationParams("2", "10");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.params.page).toBe(2);
				expect(result.params.limit).toBe(10);
				expect(result.params.offset).toBe(10);
			}
		});

		it("should reject invalid page parameter", () => {
			const result = validatePaginationParams("0", "12");
			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toContain("Page must be a positive integer");
			}
		});

		it("should reject non-numeric page parameter", () => {
			const result = validatePaginationParams("abc", "12");
			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toContain("Page must be a positive integer");
			}
		});

		it("should reject limit below minimum", () => {
			const result = validatePaginationParams("1", "0");
			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toContain("Limit must be a positive integer");
			}
		});

		it("should reject limit above maximum", () => {
			const result = validatePaginationParams("1", "101");
			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toContain("Limit must be a positive integer");
			}
		});

		it("should reject non-numeric limit parameter", () => {
			const result = validatePaginationParams("1", "xyz");
			expect(result.valid).toBe(false);
			if (!result.valid) {
				expect(result.error).toContain("Limit must be a positive integer");
			}
		});

		it("should calculate correct offset", () => {
			const result = validatePaginationParams("3", "5");
			expect(result.valid).toBe(true);
			if (result.valid) {
				expect(result.params.offset).toBe(10); // (3-1) * 5
			}
		});
	});

	describe("calculatePaginationMetadata", () => {
		it("should calculate metadata for first page", () => {
			const metadata = calculatePaginationMetadata(50, 1, 12);
			expect(metadata.currentPage).toBe(1);
			expect(metadata.totalPages).toBe(5); // Math.ceil(50/12)
			expect(metadata.totalCount).toBe(50);
			expect(metadata.limit).toBe(12);
			expect(metadata.hasNext).toBe(true);
			expect(metadata.hasPrevious).toBe(false);
		});

		it("should calculate metadata for middle page", () => {
			const metadata = calculatePaginationMetadata(50, 3, 12);
			expect(metadata.currentPage).toBe(3);
			expect(metadata.totalPages).toBe(5);
			expect(metadata.totalCount).toBe(50);
			expect(metadata.limit).toBe(12);
			expect(metadata.hasNext).toBe(true);
			expect(metadata.hasPrevious).toBe(true);
		});

		it("should calculate metadata for last page", () => {
			const metadata = calculatePaginationMetadata(50, 5, 12);
			expect(metadata.currentPage).toBe(5);
			expect(metadata.totalPages).toBe(5);
			expect(metadata.totalCount).toBe(50);
			expect(metadata.limit).toBe(12);
			expect(metadata.hasNext).toBe(false);
			expect(metadata.hasPrevious).toBe(true);
		});

		it("should handle empty results", () => {
			const metadata = calculatePaginationMetadata(0, 1, 12);
			expect(metadata.currentPage).toBe(1);
			expect(metadata.totalPages).toBe(0);
			expect(metadata.totalCount).toBe(0);
			expect(metadata.limit).toBe(12);
			expect(metadata.hasNext).toBe(false);
			expect(metadata.hasPrevious).toBe(false);
		});

		it("should handle single page", () => {
			const metadata = calculatePaginationMetadata(5, 1, 12);
			expect(metadata.currentPage).toBe(1);
			expect(metadata.totalPages).toBe(1);
			expect(metadata.totalCount).toBe(5);
			expect(metadata.limit).toBe(12);
			expect(metadata.hasNext).toBe(false);
			expect(metadata.hasPrevious).toBe(false);
		});

		it("should handle exact page boundary", () => {
			const metadata = calculatePaginationMetadata(24, 2, 12);
			expect(metadata.currentPage).toBe(2);
			expect(metadata.totalPages).toBe(2);
			expect(metadata.totalCount).toBe(24);
			expect(metadata.limit).toBe(12);
			expect(metadata.hasNext).toBe(false);
			expect(metadata.hasPrevious).toBe(true);
		});
	});
});

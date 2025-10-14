import type { PaginationMetadata, PaginationParams } from "../types/jobRole";

/**
 * Validates and parses pagination parameters from query string
 */
export function validatePaginationParams(
	page?: string,
	limit?: string
): { valid: true; params: PaginationParams } | { valid: false; error: string } {
	// Default values
	const DEFAULT_PAGE = 1;
	const DEFAULT_LIMIT = 12;
	const MIN_PAGE = 1;
	const MIN_LIMIT = 1;
	const MAX_LIMIT = 100;

	// Parse page
	let parsedPage = DEFAULT_PAGE;
	if (page !== undefined) {
		const pageNum = Number.parseInt(page, 10);
		if (Number.isNaN(pageNum) || pageNum < MIN_PAGE) {
			return {
				valid: false,
				error: `Page must be a positive integer greater than or equal to ${MIN_PAGE}`,
			};
		}
		parsedPage = pageNum;
	}

	// Parse limit
	let parsedLimit = DEFAULT_LIMIT;
	if (limit !== undefined) {
		const limitNum = Number.parseInt(limit, 10);
		if (
			Number.isNaN(limitNum) ||
			limitNum < MIN_LIMIT ||
			limitNum > MAX_LIMIT
		) {
			return {
				valid: false,
				error: `Limit must be a positive integer between ${MIN_LIMIT} and ${MAX_LIMIT}`,
			};
		}
		parsedLimit = limitNum;
	}

	// Calculate offset
	const offset = (parsedPage - 1) * parsedLimit;

	return {
		valid: true,
		params: {
			page: parsedPage,
			limit: parsedLimit,
			offset,
		},
	};
}

/**
 * Calculates pagination metadata
 */
export function calculatePaginationMetadata(
	totalCount: number,
	currentPage: number,
	limit: number
): PaginationMetadata {
	const totalPages = Math.ceil(totalCount / limit);
	const hasNext = currentPage < totalPages;
	const hasPrevious = currentPage > 1;

	return {
		currentPage,
		totalPages,
		totalCount,
		limit,
		hasNext,
		hasPrevious,
	};
}

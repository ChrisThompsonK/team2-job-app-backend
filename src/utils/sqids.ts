import Sqids from "sqids";

const sqids = new Sqids({
	minLength: 8, // Minimum length of generated IDs
	alphabet: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
});

/**
 * Generate a unique user ID using timestamp and random number
 * @returns A unique Sqid string (e.g., "xYz4A9pQ")
 */
export function generateUserId(): string {
	const timestamp = Date.now();
	const random = Math.floor(Math.random() * 1000000);
	return sqids.encode([timestamp, random]);
}

/**
 * Decode a Sqid back to its component numbers
 * @param id The Sqid string to decode
 * @returns Array of numbers or null if invalid
 */
export function decodeUserId(id: string): number[] | null {
	try {
		return sqids.decode(id);
	} catch {
		return null;
	}
}

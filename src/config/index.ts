/**
 * Centralized application configuration module
 * Loads and validates environment variables with type safety
 */

import "dotenv/config";

/**
 * Application configuration interface
 */
interface Config {
	app: {
		name: string;
		version: string;
		nodeEnv: string;
	};
	server: {
		port: number;
		host: string;
	};
	database: {
		url: string;
	};
	features: {
		debugMode: boolean;
	};
	cors: {
		origin: string;
	};
	session: {
		secret: string;
		name: string;
		maxAge: number; // in milliseconds
		secure: boolean;
		httpOnly: boolean;
		sameSite: "strict" | "lax" | "none";
	};
}

/**
 * Validates that required environment variables are present
 * @param variables - Array of required variable names
 * @throws Error if any required variable is missing
 */
function validateRequiredVariables(variables: readonly string[]): void {
	const missing: string[] = [];

	for (const variable of variables) {
		if (!process.env[variable]) {
			missing.push(variable);
		}
	}

	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missing.join(", ")}\n` +
				"Please check your .env file or environment configuration."
		);
	}
}

/**
 * Parses a string to a boolean
 * @param value - String value to parse
 * @param defaultValue - Default value if parsing fails
 * @returns Boolean value
 */
function parseBoolean(
	value: string | undefined,
	defaultValue = false
): boolean {
	if (!value) return defaultValue;
	return value.toLowerCase() === "true" || value === "1";
}

/**
 * Parses a string to an integer with validation
 * @param value - String value to parse
 * @param defaultValue - Default value if parsing fails
 * @param min - Minimum allowed value (optional)
 * @param max - Maximum allowed value (optional)
 * @returns Parsed integer value
 */
function parseInteger(
	value: string | undefined,
	defaultValue: number,
	min?: number,
	max?: number
): number {
	const parsed = value ? Number.parseInt(value, 10) : defaultValue;

	if (Number.isNaN(parsed)) {
		return defaultValue;
	}

	if (min !== undefined && parsed < min) {
		throw new Error(`Value ${parsed} is below minimum allowed value ${min}`);
	}

	if (max !== undefined && parsed > max) {
		throw new Error(`Value ${parsed} exceeds maximum allowed value ${max}`);
	}

	return parsed;
}

// List of required environment variables (none strictly required for development)
const REQUIRED_VARIABLES: readonly string[] = [];

// Validate required variables
validateRequiredVariables(REQUIRED_VARIABLES);

/**
 * Application configuration object
 * All environment variables are loaded and validated here
 */
export const config: Config = {
	app: {
		name: process.env["APP_NAME"] || "team2-job-app-backend",
		version: process.env["APP_VERSION"] || "1.0.0",
		nodeEnv: process.env["NODE_ENV"] || "development",
	},
	server: {
		port: parseInteger(process.env["PORT"], 8000, 1024, 65535),
		host: process.env["HOST"] || "localhost",
	},
	database: {
		url:
			process.env["DATABASE_URL"] ||
			(process.env["NODE_ENV"] === "test"
				? "./test-database.sqlite"
				: "./database.sqlite"),
	},
	features: {
		debugMode: parseBoolean(process.env["DEBUG"], false),
	},
	cors: {
		origin: process.env["FRONTEND_URL"] || "http://localhost:3000",
	},
	session: {
		secret:
			process.env["SESSION_SECRET"] || "your-secret-key-change-in-production",
		name: process.env["SESSION_NAME"] || "job_app_session",
		maxAge: parseInteger(
			process.env["SESSION_MAX_AGE"],
			1000 * 60 * 60 * 24 * 7
		), // 7 days
		secure: process.env["NODE_ENV"] === "production", // HTTPS only in production
		httpOnly: true,
		sameSite: process.env["NODE_ENV"] === "production" ? "strict" : "lax",
	},
};

/**
 * Check if application is running in production
 */
export const isProduction = (): boolean => config.app.nodeEnv === "production";

/**
 * Check if application is running in development
 */
export const isDevelopment = (): boolean =>
	config.app.nodeEnv === "development";

/**
 * Check if application is running in test mode
 */
export const isTest = (): boolean => config.app.nodeEnv === "test";

/**
 * Log configuration on startup (excluding sensitive data)
 */
export function logConfiguration(): void {
	console.log("📋 Configuration loaded:");
	console.log(`   App Name: ${config.app.name}`);
	console.log(`   Version: ${config.app.version}`);
	console.log(`   Environment: ${config.app.nodeEnv}`);
	console.log(`   Server Port: ${config.server.port}`);
	console.log(`   Server Host: ${config.server.host}`);
	console.log(`   Database URL: ${config.database.url}`);
	console.log(`   Debug Mode: ${config.features.debugMode}`);
}

// Export the Config type for use in other modules
export type { Config };

import { config } from "dotenv";

// Load environment variables from .env file
config();

interface EnvironmentVariables {
	NODE_ENV: "development" | "test" | "production";
	PORT: number;
	DATABASE_URL: string;
	API_PREFIX: string;
	CORS_ORIGIN: string;
	LOG_LEVEL: "error" | "warn" | "info" | "debug";
}

function validateEnv(): EnvironmentVariables {
	const requiredVars = [
		"NODE_ENV",
		"PORT",
		"DATABASE_URL",
		"API_PREFIX",
		"CORS_ORIGIN",
		"LOG_LEVEL",
	];

	const missing = requiredVars.filter((varName) => !process.env[varName]);

	if (missing.length > 0) {
		throw new Error(
			`Missing required environment variables: ${missing.join(", ")}`
		);
	}

	const port = Number.parseInt(process.env["PORT"] ?? "8080", 10);
	if (Number.isNaN(port) || port < 0 || port > 65535) {
		throw new Error("PORT must be a valid number between 0 and 65535");
	}

	const nodeEnv = process.env["NODE_ENV"];
	if (!["development", "test", "production"].includes(nodeEnv ?? "")) {
		throw new Error(
			'NODE_ENV must be one of: "development", "test", "production"'
		);
	}

	const logLevel = process.env["LOG_LEVEL"];
	if (!["error", "warn", "info", "debug"].includes(logLevel ?? "")) {
		throw new Error(
			'LOG_LEVEL must be one of: "error", "warn", "info", "debug"'
		);
	}

	return {
		NODE_ENV: nodeEnv as "development" | "test" | "production",
		PORT: port,
		DATABASE_URL: process.env["DATABASE_URL"] ?? "",
		API_PREFIX: process.env["API_PREFIX"] ?? "",
		CORS_ORIGIN: process.env["CORS_ORIGIN"] ?? "",
		LOG_LEVEL: logLevel as "error" | "warn" | "info" | "debug",
	};
}

export const env = validateEnv();

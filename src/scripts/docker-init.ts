#!/usr/bin/env tsx

/**
 * Docker container initialization script
 * Runs database migrations and seeds the database on startup
 */

import { exec } from "node:child_process";
import { promisify } from "node:util";

const execPromise = promisify(exec);

async function runCommand(command: string, description: string): Promise<void> {
	console.log(`🔄 ${description}...`);
	try {
		const { stdout, stderr } = await execPromise(command);
		if (stdout) console.log(stdout);
		if (stderr) console.error(stderr);
		console.log(`✅ ${description} completed`);
	} catch (error) {
		console.error(`❌ ${description} failed:`, error);
		throw error;
	}
}

async function initialize(): Promise<void> {
	console.log("🚀 Initializing Docker container...\n");

	try {
		// Run database migrations
		await runCommand("npx drizzle-kit push", "Running database migrations");

		// Seed the database
		await runCommand("npx tsx src/scripts/seedDatabase.ts", "Seeding database");

		console.log("\n✅ Docker container initialization complete!");
		console.log("🎉 Starting application...\n");
	} catch (error) {
		console.error("\n❌ Initialization failed!", error);
		process.exit(1);
	}
}

initialize();

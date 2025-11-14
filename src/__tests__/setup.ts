import fs from "node:fs";
import Database from "better-sqlite3";
import { beforeAll, beforeEach } from "vitest";

const TEST_DB_PATH = "./test-database.sqlite";

beforeAll(() => {
	process.env["NODE_ENV"] = "test";

	if (fs.existsSync(TEST_DB_PATH)) {
		try {
			const sqlite = new Database(TEST_DB_PATH);
			const tables = sqlite
				.prepare("SELECT name FROM sqlite_master WHERE type='table'")
				.all();
			sqlite.close();

			if ((tables as unknown[]).length > 0) return;
		} catch {
			// Recreate on error
		}
		fs.unlinkSync(TEST_DB_PATH);
	}

	const sqlite = new Database(TEST_DB_PATH);
	sqlite.pragma("foreign_keys = ON");

	// Create tables directly
	sqlite.exec(`
		CREATE TABLE IF NOT EXISTS job_roles (
			id INTEGER PRIMARY KEY NOT NULL,
			job_role_name TEXT NOT NULL,
			description TEXT NOT NULL,
			responsibilities TEXT NOT NULL,
			job_spec_link TEXT NOT NULL,
			location TEXT NOT NULL,
			capability TEXT NOT NULL,
			band TEXT NOT NULL,
			closing_date INTEGER NOT NULL,
			status TEXT DEFAULT 'active' NOT NULL,
			number_of_open_positions INTEGER DEFAULT 1 NOT NULL,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL
		)
	`);

	sqlite.exec(`
		CREATE TABLE IF NOT EXISTS auth_users (
			user_id TEXT PRIMARY KEY NOT NULL,
			email TEXT NOT NULL UNIQUE,
			password TEXT NOT NULL,
			forename TEXT NOT NULL,
			surname TEXT NOT NULL,
			role TEXT DEFAULT 'Applicant' NOT NULL,
			is_active INTEGER DEFAULT 1 NOT NULL,
			last_login INTEGER,
			created_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL
		)
	`);

	sqlite.exec(`
		CREATE TABLE IF NOT EXISTS job_applications (
			id INTEGER PRIMARY KEY NOT NULL,
			job_role_id INTEGER NOT NULL,
			user_id TEXT,
			applicant_name TEXT NOT NULL,
			applicant_email TEXT NOT NULL,
			cover_letter TEXT,
			resume_url TEXT,
			cv_data TEXT,
			cv_file_name TEXT,
			cv_mime_type TEXT,
			status TEXT DEFAULT 'in progress' NOT NULL,
			submitted_at INTEGER NOT NULL,
			updated_at INTEGER NOT NULL,
			FOREIGN KEY (job_role_id) REFERENCES job_roles(id),
			FOREIGN KEY (user_id) REFERENCES auth_users(user_id)
		)
	`);

	sqlite.exec(`
		CREATE TABLE IF NOT EXISTS sessions (
			sid TEXT PRIMARY KEY NOT NULL,
			expired INTEGER NOT NULL,
			sess TEXT NOT NULL
		)
	`);

	sqlite.exec("PRAGMA integrity_check");
	sqlite.close();
});

beforeEach(() => {
	const sqlite = new Database(TEST_DB_PATH);
	try {
		sqlite.exec("DELETE FROM job_applications");
		sqlite.exec("DELETE FROM sessions");
		sqlite.exec("DELETE FROM auth_users");
		sqlite.exec("DELETE FROM job_roles");
	} catch {
		// Ignore cleanup errors
	}
	sqlite.close();
});

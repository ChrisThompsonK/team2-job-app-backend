/**
 * Test setup file
 * Initializes test database with proper schema
 */

import Database from "better-sqlite3";
import { beforeAll } from "vitest";

// Use a separate test database
const TEST_DB_PATH = "./test-database.sqlite";

beforeAll(() => {
	// Initialize test database
	const sqlite = new Database(TEST_DB_PATH);

	// Run migrations to create tables
	// Since we don't have proper migration files yet, create tables manually
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
		);
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
		);
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
		);
	`);

	// Create sessions table for connect-sqlite3
	sqlite.exec(`
		CREATE TABLE IF NOT EXISTS sessions (
			sid TEXT PRIMARY KEY NOT NULL,
			expired INTEGER NOT NULL,
			sess TEXT NOT NULL
		);
	`);

	sqlite.close();
});

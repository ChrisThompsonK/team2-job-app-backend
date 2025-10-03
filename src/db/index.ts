import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema/index";

/**
 * Database connection setup
 * Uses better-sqlite3 driver with Drizzle ORM
 */
const sqlite = new Database("database.sqlite");

// Enable foreign keys for referential integrity
sqlite.pragma("foreign_keys = ON");

/**
 * Drizzle database instance with schema
 */
export const db = drizzle(sqlite, { schema });

/**
 * Close database connection
 * Call this when shutting down the application
 */
export const closeDatabase = () => {
	sqlite.close();
};

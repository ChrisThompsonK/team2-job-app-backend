import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Unified jobs table with all job data
export const jobs = sqliteTable("jobs", {
	id: integer("id").primaryKey(),
	title: text("title").notNull(),
	company: text("company").notNull(),
	location: text("location"),
	description: text("description"),
	requirements: text("requirements"), // JSON string for array
	type: text("type", { enum: ["full-time", "part-time", "contract", "internship"] }).default("full-time"),
	remote: integer("remote", { mode: "boolean" }).default(false),
	datePosted: text("date_posted"),
	applicationUrl: text("application_url"),
	status: text("status").default("open"),
	createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
	updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
});

// Keep job roles table for backward compatibility if needed
export const jobRoles = sqliteTable("job_roles", {
	id: integer("id").primaryKey(),
	jobRoleId: integer("job_role_id").notNull(),
	roleName: text("role_name").notNull(),
	description: text("description").notNull(),
	responsibilities: text("responsibilities").notNull(),
	jobSpecLink: text("job_spec_link").notNull(),
	location: text("location").notNull(),
	capability: text("capability").notNull(),
	band: text("band").notNull(),
	closingDate: text("closing_date").notNull(),
	status: text("status").notNull(),
	numberOfOpenPositions: integer("number_of_open_positions").notNull(),
});
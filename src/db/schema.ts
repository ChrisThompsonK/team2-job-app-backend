import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Job Applications table with all required properties
export const jobApplications = sqliteTable("job_applications", {
	id: integer("id").primaryKey(),
	jobRoleName: text("job_role_name").notNull(),
	description: text("description").notNull(),
	responsibilities: text("responsibilities").notNull(),
	jobSpecLink: text("job_spec_link").notNull(),
	location: text("location").notNull(),
	capability: text("capability").notNull(),
	band: text("band").notNull(),
	closingDate: integer("closing_date", { mode: "timestamp" }).notNull(),
	status: text("status").notNull().default("active"),
	numberOfOpenPositions: integer("number_of_open_positions")
		.notNull()
		.default(1),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Users table for authentication and management
export const users = sqliteTable("users", {
	id: integer("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	role: text("role").notNull().default("user"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Application submissions table (tracks who applied for what)
export const applicationSubmissions = sqliteTable("application_submissions", {
	id: integer("id").primaryKey(),
	jobApplicationId: integer("job_application_id")
		.notNull()
		.references(() => jobApplications.id),
	userId: integer("user_id")
		.notNull()
		.references(() => users.id),
	coverLetter: text("cover_letter"),
	resumeUrl: text("resume_url"),
	status: text("status").notNull().default("pending"),
	submittedAt: integer("submitted_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

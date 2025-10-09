import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Job Roles table - represents available job roles that people can apply for
export const jobRoles = sqliteTable("job_roles", {
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

// Users table - represents job applicants
export const users = sqliteTable("users", {
	id: integer("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	role: text("role").notNull().default("user"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Job Applications table - represents individual job applications
export const jobApplications = sqliteTable("job_applications", {
	id: integer("id").primaryKey(),
	jobRoleId: integer("job_role_id")
		.notNull()
		.references(() => jobRoles.id),
	applicantName: text("applicant_name").notNull(),
	applicantEmail: text("applicant_email").notNull(),
	coverLetter: text("cover_letter"),
	resumeUrl: text("resume_url"),
	status: text("status").notNull().default("pending"),
	submittedAt: integer("submitted_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

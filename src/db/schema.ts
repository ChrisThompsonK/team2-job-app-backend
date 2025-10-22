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

// Authentication Users table - represents authenticated users (Admins and Applicants)
export const authUsers = sqliteTable("auth_users", {
	userId: text("user_id").primaryKey(), // Sqid-generated ID
	email: text("email").notNull().unique(),
	password: text("password").notNull(), // bcrypt hashed
	forename: text("forename").notNull(),
	surname: text("surname").notNull(),
	role: text("role", { enum: ["Admin", "Applicant"] })
		.notNull()
		.default("Applicant"),
	isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
	lastLogin: integer("last_login", { mode: "timestamp" }),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Note: Sessions table is managed automatically by connect-sqlite3
// The library creates and manages its own 'sessions' table structure

// Job Applications table - represents individual job applications
export const jobApplications = sqliteTable("job_applications", {
	id: integer("id").primaryKey(),
	jobRoleId: integer("job_role_id")
		.notNull()
		.references(() => jobRoles.id),
	userId: text("user_id").references(() => authUsers.userId), // Link to authenticated user (optional for guest applications)
	applicantName: text("applicant_name").notNull(),
	applicantEmail: text("applicant_email").notNull(),
	coverLetter: text("cover_letter"),
	resumeUrl: text("resume_url"),
	cvData: text("cv_data"), // Base64 encoded CV file data
	cvFileName: text("cv_file_name"), // Original CV file name
	cvMimeType: text("cv_mime_type"), // MIME type of the CV file
	status: text("status").notNull().default("in progress"),
	submittedAt: integer("submitted_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

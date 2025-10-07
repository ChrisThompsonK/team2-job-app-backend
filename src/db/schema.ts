import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Users table - represents users who can authenticate and access the system
export const users = sqliteTable("users", {
	id: integer("id").primaryKey({ autoIncrement: true }),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	isAdmin: integer("is_admin", { mode: "boolean" }).notNull().default(false),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

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

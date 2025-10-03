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

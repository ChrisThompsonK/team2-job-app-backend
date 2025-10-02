import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

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
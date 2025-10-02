import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Unified jobs table with all job data
export const jobs = sqliteTable("jobs", {
	id: integer("id").primaryKey(),
	title: text("title").notNull(),
	company: text("company").notNull(),
	location: text("location"),
	description: text("description"),
	requirements: text("requirements"), // JSON string for array
	type: text("type", {
		enum: ["full-time", "part-time", "contract", "internship"],
	}).default("full-time"),
	remote: integer("remote", { mode: "boolean" }).default(false),
	datePosted: text("date_posted"),
	applicationUrl: text("application_url"),
	status: text("status").default("open"),
	createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
	updatedAt: text("updated_at").default("CURRENT_TIMESTAMP"),
});

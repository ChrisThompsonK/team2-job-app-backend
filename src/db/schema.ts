import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Example schema - you can modify this according to your needs
export const users = sqliteTable("users", {
	id: integer("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const posts = sqliteTable("posts", {
	id: integer("id").primaryKey(),
	title: text("title").notNull(),
	content: text("content"),
	authorId: integer("author_id")
		.notNull()
		.references(() => users.id),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

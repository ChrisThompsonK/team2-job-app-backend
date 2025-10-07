import { config } from "dotenv";

// Load environment variables
config();

export default {
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "sqlite",
	dbCredentials: {
		url: process.env["DATABASE_URL"] ?? "./database.sqlite",
	},
};
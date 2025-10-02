import { readFileSync } from "fs";
import { resolve } from "path";
import { db } from "./db/index.js";
import { jobRoles } from "./db/schema.js";
import type { JobRole } from "./types/Job.js";

interface JobRolesData {
	jobRoles: JobRole[];
}

async function migrateJobRoles() {
	try {
		console.log("🚀 Starting job roles migration...");

		// Read the JSON file
		const jsonPath = resolve(process.cwd(), "job_roles.json");
		const jsonData = readFileSync(jsonPath, "utf-8");
		const data: JobRolesData = JSON.parse(jsonData);

		console.log(`📝 Found ${data.jobRoles.length} job roles to migrate`);

		// Insert each job role into the database
		for (const jobRole of data.jobRoles) {
			await db.insert(jobRoles).values({
				jobRoleId: jobRole.jobRoleId,
				roleName: jobRole.roleName,
				description: jobRole.description,
				responsibilities: jobRole.responsibilities,
				jobSpecLink: jobRole.jobSpecLink,
				location: jobRole.location,
				capability: jobRole.capability,
				band: jobRole.band,
				closingDate: jobRole.closingDate,
				status: jobRole.status,
				numberOfOpenPositions: jobRole.numberOfOpenPositions,
			});

			console.log(
				`✅ Migrated: ${jobRole.roleName} (ID: ${jobRole.jobRoleId})`
			);
		}

		console.log("🎉 Migration completed successfully!");

		// Verify the data was inserted
		const count = await db.select().from(jobRoles);
		console.log(`📊 Total job roles in database: ${count.length}`);
	} catch (error) {
		console.error("❌ Migration failed:", error);
		throw error;
	}
}

// Run the migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
	migrateJobRoles()
		.then(() => {
			console.log("Migration script completed");
			process.exit(0);
		})
		.catch((error) => {
			console.error("Migration script failed:", error);
			process.exit(1);
		});
}

export { migrateJobRoles };

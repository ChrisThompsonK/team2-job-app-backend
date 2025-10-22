import Database from "better-sqlite3";
import cron from "node-cron";

/**
 * CRON job to clean up expired sessions
 * Runs every hour at the start of the hour (0 * * * *)
 *
 * Note: connect-sqlite3 manages the sessions table with columns:
 * - sid (session ID)
 * - expired (timestamp)
 * - sess (JSON session data)
 */
export function startSessionCleanupJob(): void {
	cron.schedule("0 * * * *", async () => {
		try {
			console.log("🧹 Running session cleanup job...");

			// Use better-sqlite3 directly to clean up expired sessions
			const dbPath = process.env["DATABASE_URL"] || "./database.sqlite";
			const sqlite = new Database(dbPath);

			const now = Date.now();
			const result = sqlite
				.prepare("DELETE FROM sessions WHERE expired < ?")
				.run(now);

			sqlite.close();

			if (result.changes > 0) {
				console.log(`✅ Cleaned up ${result.changes} expired sessions`);
			} else {
				console.log("✅ No expired sessions to clean up");
			}
		} catch (error) {
			console.error("❌ Session cleanup job failed:", error);
		}
	});

	console.log("⏰ Session cleanup job scheduled (runs hourly)");
}

/**
 * Initialize CRON jobs
 */
export function initializeCronJobs(): void {
	console.log("\n⏰ Initializing CRON jobs...");
	startSessionCleanupJob();
	console.log("✅ CRON jobs initialized\n");
}

import { lt } from "drizzle-orm";
import cron from "node-cron";
import { db } from "../db/index";
import { sessions } from "../db/schema";

/**
 * CRON job to clean up expired sessions
 * Runs every hour at the start of the hour (0 * * * *)
 */
export function startSessionCleanupJob(): void {
	cron.schedule("0 * * * *", async () => {
		try {
			console.log("🧹 Running session cleanup job...");

			const now = new Date();
			const result = await db
				.delete(sessions)
				.where(lt(sessions.expiresAt, now));

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

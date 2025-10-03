/**
 * Sample data generation script
 * Creates example users: 3 admins and 7 standard users
 */

import bcrypt from "bcrypt";
import { db } from "../db/index";
import { users } from "../db/schema/users";

const SALT_ROUNDS = 12;

// Sample users data - 3 admins and 7 standard users
const sampleUsers = [
	// 3 Admin users
	{
		email: "admin@company.com",
		password: "Admin123!",
		firstName: "Sarah",
		lastName: "Johnson",
		role: "admin" as const,
	},
	{
		email: "hr.manager@company.com",
		password: "HRAdmin123!",
		firstName: "Michael",
		lastName: "Chen",
		role: "admin" as const,
	},
	{
		email: "recruitment.lead@company.com",
		password: "RecAdmin123!",
		firstName: "Emma",
		lastName: "Williams",
		role: "admin" as const,
	},

	// 7 Standard users (job applicants)
	{
		email: "john.doe@email.com",
		password: "Password123!",
		firstName: "John",
		lastName: "Doe",
		role: "standard" as const,
	},
	{
		email: "jane.smith@email.com",
		password: "Password123!",
		firstName: "Jane",
		lastName: "Smith",
		role: "standard" as const,
	},
	{
		email: "alex.garcia@email.com",
		password: "Password123!",
		firstName: "Alex",
		lastName: "Garcia",
		role: "standard" as const,
	},
	{
		email: "maria.rodriguez@email.com",
		password: "Password123!",
		firstName: "Maria",
		lastName: "Rodriguez",
		role: "standard" as const,
	},
	{
		email: "david.lee@email.com",
		password: "Password123!",
		firstName: "David",
		lastName: "Lee",
		role: "standard" as const,
	},
	{
		email: "lisa.wilson@email.com",
		password: "Password123!",
		firstName: "Lisa",
		lastName: "Wilson",
		role: "standard" as const,
	},
	{
		email: "tom.brown@email.com",
		password: "Password123!",
		firstName: "Tom",
		lastName: "Brown",
		role: "standard" as const,
	},
];

/**
 * Hash a password using bcrypt
 */
async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Generate sample users
 */
async function generateSampleUsers() {
	console.log("🚀 Starting to generate sample users...");

	try {
		// Process each user
		for (const userData of sampleUsers) {
			console.log(
				`Creating user: ${userData.firstName} ${userData.lastName} (${userData.role})`
			);

			// Hash the password
			const passwordHash = await hashPassword(userData.password);

			// Insert user into database
			await db.insert(users).values({
				email: userData.email,
				passwordHash: passwordHash,
				firstName: userData.firstName,
				lastName: userData.lastName,
				role: userData.role,
			});

			console.log(`✅ Created: ${userData.email}`);
		}

		console.log("\n🎉 Successfully created all sample users!");
		console.log("\n📊 Summary:");
		console.log("- 3 Admin users (full access)");
		console.log("- 7 Standard users (limited access)");
		console.log("\n🔐 All passwords are hashed with bcrypt (12 salt rounds)");
		console.log("\n👤 Admin Accounts:");
		console.log("  • admin@company.com (Admin123!)");
		console.log("  • hr.manager@company.com (HRAdmin123!)");
		console.log("  • recruitment.lead@company.com (RecAdmin123!)");
		console.log("\n👥 Standard Accounts:");
		console.log("  • john.doe@email.com (Password123!)");
		console.log("  • jane.smith@email.com (Password123!)");
		console.log("  • alex.garcia@email.com (Password123!)");
		console.log("  • maria.rodriguez@email.com (Password123!)");
		console.log("  • david.lee@email.com (Password123!)");
		console.log("  • lisa.wilson@email.com (Password123!)");
		console.log("  • tom.brown@email.com (Password123!)");
	} catch (error) {
		console.error("❌ Error generating sample users:", error);
		throw error;
	}
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
	generateSampleUsers()
		.then(() => {
			console.log("\n✨ Sample data generation complete!");
			process.exit(0);
		})
		.catch((error) => {
			console.error("💥 Failed to generate sample data:", error);
			process.exit(1);
		});
}

export { generateSampleUsers };

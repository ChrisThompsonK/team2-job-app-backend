#!/usr/bin/env tsx

import { db } from "../db/index";
import { jobRoles, users } from "../db/schema";
import { userRepository } from "../repositories/userRepository";
import { hashPassword } from "../utils/auth";

async function seedDatabase(): Promise<void> {
	console.log("🌱 Starting database seeding...");

	try {
		// Clear existing data first
		await db.delete(jobRoles);
		await db.delete(users);
		console.log("🧹 Cleared existing job roles and users");

		// Create sample job roles
		const now = new Date();

		// Helper function to get random element from array
		const getRandomItem = <T>(array: T[]): T => {
			return array[Math.floor(Math.random() * array.length)] as T;
		};

		// Define arrays for generating diverse job data
		const capabilities = [
			"Engineering",
			"Product",
			"Design",
			"Analytics",
			"Security",
			"Quality Assurance",
			"Documentation",
			"Marketing",
			"Sales",
			"Human Resources",
			"Finance",
			"Operations",
		];

		const locations = [
			"Belfast, Northern Ireland",
			"Birmingham, England",
			"Derry~Londonderry, Northern Ireland",
			"Dublin, Ireland",
			"London, England",
			"Gdansk, Poland",
			"Helsinki, Finland",
			"Paris, France",
			"Antwerp, Belgium",
			"Buenos Aires, Argentina",
			"Indianapolis, United States",
			"Nova Scotia, Canada",
			"Toronto, Canada",
		];
		const bands = ["Junior", "Mid", "Senior", "Lead", "Principal"];
		const statuses = ["Open", "Closed"];

		// Base job titles by capability
		const jobTitlesByCapability: Record<string, string[]> = {
			Engineering: [
				"Software Engineer",
				"Frontend Developer",
				"Backend Developer",
				"Full Stack Developer",
				"Mobile Developer",
				"Cloud Engineer",
				"DevOps Engineer",
				"Site Reliability Engineer",
				"Platform Engineer",
				"Data Engineer",
			],
			Product: [
				"Product Manager",
				"Product Owner",
				"Product Designer",
				"Product Analyst",
				"Growth Product Manager",
				"Technical Product Manager",
			],
			Design: [
				"UX Designer",
				"UI Designer",
				"UX/UI Designer",
				"Product Designer",
				"Visual Designer",
				"Interaction Designer",
				"Design System Designer",
			],
			Analytics: [
				"Data Scientist",
				"Data Analyst",
				"Business Intelligence Analyst",
				"Analytics Engineer",
				"Machine Learning Engineer",
				"Research Scientist",
			],
			Security: [
				"Security Analyst",
				"Security Engineer",
				"Cybersecurity Specialist",
				"Information Security Manager",
				"Penetration Tester",
				"Security Architect",
			],
			"Quality Assurance": [
				"QA Engineer",
				"Test Engineer",
				"Automation Engineer",
				"Performance Test Engineer",
				"QA Analyst",
			],
			Documentation: [
				"Technical Writer",
				"Documentation Manager",
				"Content Designer",
				"Developer Advocate",
			],
			Marketing: [
				"Marketing Manager",
				"Digital Marketing Specialist",
				"Content Marketing Manager",
				"Growth Marketing Manager",
				"Brand Manager",
			],
			Sales: [
				"Sales Representative",
				"Account Manager",
				"Sales Engineer",
				"Business Development Manager",
				"Customer Success Manager",
			],
			"Human Resources": [
				"HR Business Partner",
				"Talent Acquisition Specialist",
				"People Operations Manager",
				"HR Generalist",
			],
			Finance: [
				"Financial Analyst",
				"Finance Manager",
				"Controller",
				"Treasury Analyst",
				"Revenue Analyst",
			],
			Operations: [
				"Operations Manager",
				"Business Operations Analyst",
				"Supply Chain Manager",
				"Process Improvement Specialist",
			],
		};

		// Generate job roles
		const jobsToCreate = [];
		const totalJobs = 75; // This will give us good pagination testing

		for (let i = 0; i < totalJobs; i++) {
			const capability = getRandomItem(capabilities);
			const band = getRandomItem(bands);
			const location = getRandomItem(locations);
			const status = getRandomItem(statuses);
			const titles = jobTitlesByCapability[capability];
			const baseTitle = getRandomItem(titles || ["Software Engineer"]); // Fallback if capability not found

			// Add band prefix to title for Senior+ roles
			const jobRoleName: string = ["Senior", "Lead", "Principal"].includes(band)
				? `${band} ${baseTitle}`
				: baseTitle;

			// Generate varied closing dates
			const baseDate = new Date();
			baseDate.setMonth(
				baseDate.getMonth() + Math.floor(Math.random() * 6) + 1
			);
			baseDate.setDate(Math.floor(Math.random() * 28) + 1);

			jobsToCreate.push({
				jobRoleName,
				description: `Join our ${location.split(",")[0]} team as a ${jobRoleName}. Work with cutting-edge technologies and contribute to innovative solutions that make a real impact.`,
				responsibilities: `Lead projects and collaborate with cross-functional teams, contribute to technical decisions, mentor team members, ensure code quality and best practices, participate in agile development processes.`,
				jobSpecLink: `https://company.sharepoint.com/sites/hr/jobs/${jobRoleName.toLowerCase().replace(/\s+/g, "-")}-${location.toLowerCase().split(",")[0]?.replace(/\s+/g, "-")}`,
				location,
				capability,
				band,
				closingDate: baseDate,
				status,
				numberOfOpenPositions: Math.floor(Math.random() * 4) + 1,
				createdAt: new Date(
					now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
				), // Random created dates in last 30 days
				updatedAt: now,
			});
		}

		// Insert all jobs in batches to avoid potential issues with large inserts
		const batchSize = 25;
		const allCreatedJobs = [];

		for (let i = 0; i < jobsToCreate.length; i += batchSize) {
			const batch = jobsToCreate.slice(i, i + batchSize);
			const createdBatch = await db.insert(jobRoles).values(batch).returning();
			allCreatedJobs.push(...createdBatch);
		}

		console.log(`✅ Created ${allCreatedJobs.length} job roles`);

		// Seed users
		console.log("\n👥 Seeding users...");

		// Generate secure random passwords for test users
		const generateSecurePassword = (): string => {
			const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
			const lowercase = "abcdefghijklmnopqrstuvwxyz";
			const numbers = "0123456789";
			const special = "!@#$%^&*";

			let password = "";
			password += uppercase[Math.floor(Math.random() * uppercase.length)];
			password += lowercase[Math.floor(Math.random() * lowercase.length)];
			password += numbers[Math.floor(Math.random() * numbers.length)];
			password += special[Math.floor(Math.random() * special.length)];

			const allChars = uppercase + lowercase + numbers + special;
			for (let i = 0; i < 8; i++) {
				password += allChars[Math.floor(Math.random() * allChars.length)];
			}

			return password
				.split("")
				.sort(() => 0.5 - Math.random())
				.join("");
		};

		const usersToCreate = [
			{
				username: "admin@kainos.com",
				password: generateSecurePassword(),
				userType: "Admin" as const,
				forename: "Sarah",
				surname: "Johnson",
			},
			{
				username: "john.doe@example.com",
				password: generateSecurePassword(),
				userType: "Applicant" as const,
				forename: "John",
				surname: "Doe",
			},
			{
				username: "jane.smith@example.com",
				password: generateSecurePassword(),
				userType: "Applicant" as const,
				forename: "Jane",
				surname: "Smith",
			},
			{
				username: "michael.brown@example.com",
				password: generateSecurePassword(),
				userType: "Applicant" as const,
				forename: "Michael",
				surname: "Brown",
			},
			{
				username: "emily.davis@example.com",
				password: generateSecurePassword(),
				userType: "Applicant" as const,
				forename: "Emily",
				surname: "Davis",
			},
			{
				username: "robert.wilson@example.com",
				password: generateSecurePassword(),
				userType: "Applicant" as const,
				forename: "Robert",
				surname: "Wilson",
			},
			{
				username: "admin2@kainos.com",
				password: generateSecurePassword(),
				userType: "Admin" as const,
				forename: "David",
				surname: "Martinez",
			},
		];

		const createdUsers = [];
		for (const userData of usersToCreate) {
			const hashedPassword = await hashPassword(userData.password);
			const user = await userRepository.create({
				...userData,
				password: hashedPassword,
			});
			createdUsers.push(user);
		}

		// Create one inactive user
		const inactiveUser = await userRepository.create({
			username: "inactive.user@example.com",
			password: await hashPassword(generateSecurePassword()),
			userType: "Applicant",
			forename: "Inactive",
			surname: "User",
		});
		await userRepository.updateActiveStatus(inactiveUser.id, false);
		createdUsers.push({ ...inactiveUser, isActive: false });
		console.log(`✅ Created ${createdUsers.length} users`);
		console.log("   - Admin accounts: admin@kainos.com, admin2@kainos.com");
		console.log("   - Applicant accounts: 6 test users");
		console.log("   - Default password format: [Name]123! or similar");

		console.log("\n🎉 Database seeding completed successfully!");

		// Display summary statistics
		console.log("\n📊 Job Role Statistics:");

		const statsByCapability = allCreatedJobs.reduce(
			(acc, job) => {
				acc[job.capability] = (acc[job.capability] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		const statsByBand = allCreatedJobs.reduce(
			(acc, job) => {
				acc[job.band] = (acc[job.band] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		const statsByStatus = allCreatedJobs.reduce(
			(acc, job) => {
				acc[job.status] = (acc[job.status] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		console.log("\nBy Capability:");
		for (const [capability, count] of Object.entries(statsByCapability)) {
			console.log(`  ${capability}: ${count}`);
		}

		console.log("\nBy Band:");
		for (const [band, count] of Object.entries(statsByBand)) {
			console.log(`  ${band}: ${count}`);
		}

		console.log("\nBy Status:");
		for (const [status, count] of Object.entries(statsByStatus)) {
			console.log(`  ${status}: ${count}`);
		}

		console.log("\n👥 User Statistics:");
		const statsByUserType = createdUsers.reduce(
			(acc, user) => {
				acc[user.userType] = (acc[user.userType] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		console.log(`  Total users: ${createdUsers.length}`);
		for (const [userType, count] of Object.entries(statsByUserType)) {
			console.log(`  ${userType}: ${count}`);
		}
		console.log(
			`  Active users: ${createdUsers.filter((u) => u.isActive).length}`
		);
		console.log(
			`  Inactive users: ${createdUsers.filter((u) => !u.isActive).length}`
		);

		console.log(`\n🔗 Test pagination at: /api/job-roles?page=1&limit=12`);
		console.log(
			`📄 Total pages with limit 12: ${Math.ceil(allCreatedJobs.length / 12)}`
		);
		console.log("\n🔐 Test login credentials have been configured securely.");
		console.log(
			"   For security reasons, plaintext passwords are not displayed."
		);
		console.log("   Contact your system administrator for test credentials.");
	} catch (error) {
		console.error("❌ Error seeding database:", error);
		process.exit(1);
	}
}

// Run the seeding script
if (import.meta.url === `file://${process.argv[1]}`) {
	seedDatabase()
		.then(() => {
			console.log("✨ Seeding script completed");
			process.exit(0);
		})
		.catch((error) => {
			console.error("💥 Seeding script failed:", error);
			process.exit(1);
		});
}

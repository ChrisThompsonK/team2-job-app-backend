#!/usr/bin/env tsx

import { db } from "../db/index";
import { jobRoles } from "../db/schema";

async function seedDatabase(): Promise<void> {
	console.log("🌱 Starting database seeding...");

	try {
		// Clear existing data first
		await db.delete(jobRoles);
		console.log("🧹 Cleared existing job roles");

		// Create sample job roles
		const now = new Date();

		// Helper function to generate random closing dates between 3-6 months from now
		const getRandomClosingDate = () => {
			const date = new Date();
			const minMonths = 3;
			const maxMonths = 6;
			const randomMonths = Math.random() * (maxMonths - minMonths) + minMonths;
			date.setMonth(date.getMonth() + randomMonths);
			// Add random days within the month for more variation
			const randomDays = Math.floor(Math.random() * 15) - 7; // ±7 days
			date.setDate(date.getDate() + randomDays);
			return date;
		};

		// Helper function to get random element from array
		const getRandomItem = <T>(array: T[]): T => {
			return array[Math.floor(Math.random() * array.length)];
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
			"Derry~Londonderry, Northern Ireland",
			"London, England",
			"Birmingham, England",
			"Manchester, England",
			"Edinburgh, Scotland",
			"Dublin, Ireland",
			"Cork, Ireland",
			"Gdańsk, Poland",
			"Warsaw, Poland",
			"Amsterdam, Netherlands",
			"Frankfurt, Germany",
			"Berlin, Germany",
			"Antwerp, Belgium",
			"Brussels, Belgium",
			"Paris, France",
			"Madrid, Spain",
			"Barcelona, Spain",
			"Milan, Italy",
			"Stockholm, Sweden",
			"Copenhagen, Denmark",
			"Oslo, Norway",
			"Indianapolis, USA",
			"Toronto, Canada",
			"New York, USA",
			"San Francisco, USA",
			"Austin, USA",
			"Sydney, Australia",
			"Melbourne, Australia",
			"Singapore",
		];

		const bands = ["Junior", "Mid", "Senior", "Lead", "Principal"];
		const statuses = ["active", "draft", "closed"];

		// Base job titles by capability
		const jobTitlesByCapability = {
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
			const baseTitle = getRandomItem(jobTitlesByCapability[capability]);
			
			// Add band prefix to title for Senior+ roles
			const jobRoleName = ["Senior", "Lead", "Principal"].includes(band) 
				? `${band} ${baseTitle}`
				: baseTitle;

			// Generate varied closing dates
			const baseDate = new Date();
			baseDate.setMonth(baseDate.getMonth() + Math.floor(Math.random() * 6) + 1);
			baseDate.setDate(Math.floor(Math.random() * 28) + 1);

			jobsToCreate.push({
				jobRoleName,
				description: `Join our ${location.split(',')[0]} team as a ${jobRoleName}. Work with cutting-edge technologies and contribute to innovative solutions that make a real impact.`,
				responsibilities: `Lead projects and collaborate with cross-functional teams, contribute to technical decisions, mentor team members, ensure code quality and best practices, participate in agile development processes.`,
				jobSpecLink: `https://company.sharepoint.com/sites/hr/jobs/${jobRoleName.toLowerCase().replace(/\s+/g, '-')}-${location.toLowerCase().split(',')[0].replace(/\s+/g, '-')}`,
				location,
				capability,
				band,
				closingDate: baseDate,
				status,
				numberOfOpenPositions: Math.floor(Math.random() * 4) + 1,
				createdAt: new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random created dates in last 30 days
				updatedAt: now,
			});
		}

		// Insert all jobs in batches to avoid potential issues with large inserts
		const batchSize = 25;
		const allCreatedJobs = [];
		
		for (let i = 0; i < jobsToCreate.length; i += batchSize) {
			const batch = jobsToCreate.slice(i, i + batchSize);
			const createdBatch = await db
				.insert(jobRoles)
				.values(batch)
				.returning();
			allCreatedJobs.push(...createdBatch);
		}

		console.log(`✅ Created ${allCreatedJobs.length} job roles`);
		console.log("🎉 Database seeding completed successfully!");

		// Display summary statistics
		console.log("\n📊 Job Role Statistics:");
		
		const statsByCapability = allCreatedJobs.reduce((acc, job) => {
			acc[job.capability] = (acc[job.capability] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);
		
		const statsByBand = allCreatedJobs.reduce((acc, job) => {
			acc[job.band] = (acc[job.band] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);
		
		const statsByStatus = allCreatedJobs.reduce((acc, job) => {
			acc[job.status] = (acc[job.status] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

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

		console.log(`\n🔗 Test pagination at: /api/job-roles?page=1&limit=12`);
		console.log(`📄 Total pages with limit 12: ${Math.ceil(allCreatedJobs.length / 12)}`);
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

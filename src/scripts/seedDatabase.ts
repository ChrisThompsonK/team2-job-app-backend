#!/usr/bin/env tsx

import { db } from "../db/index";
import { jobApplications, users } from "../db/schema";

async function seedDatabase(): Promise<void> {
	console.log("🌱 Starting database seeding...");

	try {
		// Create sample users
		const sampleUsers = await db
			.insert(users)
			.values([
				{
					name: "John Doe",
					email: "john.doe@company.com",
					role: "admin",
					createdAt: new Date(),
				},
				{
					name: "Jane Smith",
					email: "jane.smith@company.com",
					role: "hr",
					createdAt: new Date(),
				},
				{
					name: "Bob Johnson",
					email: "bob.johnson@example.com",
					role: "user",
					createdAt: new Date(),
				},
			])
			.returning();

		console.log(`✅ Created ${sampleUsers.length} users`);

		// Create sample job applications
		const now = new Date();
		const futureDate = new Date();
		futureDate.setMonth(futureDate.getMonth() + 2);

		const sampleJobs = await db
			.insert(jobApplications)
			.values([
				{
					jobRoleName: "Senior Software Engineer",
					description:
						"We are looking for an experienced software engineer to join our development team.",
					responsibilities:
						"Design and develop scalable web applications, mentor junior developers, participate in code reviews, collaborate with product teams.",
					jobSpecLink:
						"https://company.sharepoint.com/sites/hr/jobs/senior-software-engineer",
					location: "London, UK",
					capability: "Engineering",
					band: "Senior",
					closingDate: futureDate,
					status: "active",
					numberOfOpenPositions: 2,
					createdAt: now,
					updatedAt: now,
				},
				{
					jobRoleName: "Product Manager",
					description:
						"Join our product team to drive innovation and deliver exceptional user experiences.",
					responsibilities:
						"Define product roadmap, coordinate with stakeholders, analyze market trends, manage product backlog.",
					jobSpecLink:
						"https://company.sharepoint.com/sites/hr/jobs/product-manager",
					location: "Manchester, UK",
					capability: "Product",
					band: "Mid",
					closingDate: futureDate,
					status: "active",
					numberOfOpenPositions: 1,
					createdAt: now,
					updatedAt: now,
				},
				{
					jobRoleName: "UX Designer",
					description:
						"Creative UX designer needed to enhance our user interface and experience design.",
					responsibilities:
						"Create wireframes and prototypes, conduct user research, collaborate with development teams, design user interfaces.",
					jobSpecLink:
						"https://company.sharepoint.com/sites/hr/jobs/ux-designer",
					location: "Birmingham, UK",
					capability: "Design",
					band: "Mid",
					closingDate: futureDate,
					status: "active",
					numberOfOpenPositions: 1,
					createdAt: now,
					updatedAt: now,
				},
				{
					jobRoleName: "Data Analyst",
					description:
						"Analyze business data to drive strategic decisions and improve operations.",
					responsibilities:
						"Collect and analyze data, create reports and dashboards, identify trends and insights, present findings to stakeholders.",
					jobSpecLink:
						"https://company.sharepoint.com/sites/hr/jobs/data-analyst",
					location: "Leeds, UK",
					capability: "Analytics",
					band: "Junior",
					closingDate: futureDate,
					status: "active",
					numberOfOpenPositions: 3,
					createdAt: now,
					updatedAt: now,
				},
				{
					jobRoleName: "DevOps Engineer",
					description:
						"Build and maintain our cloud infrastructure and deployment pipelines.",
					responsibilities:
						"Manage CI/CD pipelines, monitor system performance, implement security best practices, automate deployments.",
					jobSpecLink:
						"https://company.sharepoint.com/sites/hr/jobs/devops-engineer",
					location: "Remote, UK",
					capability: "Engineering",
					band: "Senior",
					closingDate: futureDate,
					status: "draft",
					numberOfOpenPositions: 1,
					createdAt: now,
					updatedAt: now,
				},
			])
			.returning();

		console.log(`✅ Created ${sampleJobs.length} job applications`);
		console.log("🎉 Database seeding completed successfully!");

		// Display the created jobs
		console.log("\n📋 Created Job Applications:");
		for (const job of sampleJobs) {
			console.log(
				`- ${job.jobRoleName} (${job.capability}) - ${job.location} [${job.status}]`
			);
		}
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

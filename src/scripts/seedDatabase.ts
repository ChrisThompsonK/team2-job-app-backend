#!/usr/bin/env tsx

import { db } from "../db/index";
import { jobRoles } from "../db/schema";

async function seedDatabase(): Promise<void> {
	console.log("🌱 Starting database seeding...");

	try {
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

		const sampleJobs = await db
			.insert(jobRoles)
			.values([
				{
					jobRoleName: "Senior Software Engineer",
					description:
						"Join our Belfast engineering hub to build next-generation financial software solutions. Lead complex projects and mentor junior developers in our growing team.",
					responsibilities:
						"Design and develop scalable microservices, lead architectural decisions, mentor junior developers, conduct code reviews, collaborate with cross-functional teams, implement best practices for security and performance.",
					jobSpecLink:
						"https://company.sharepoint.com/sites/hr/jobs/senior-software-engineer-belfast",
					location: "Belfast, Northern Ireland",
					capability: "Engineering",
					band: "Senior",
					closingDate: getRandomClosingDate(),
					status: "active",
					numberOfOpenPositions: 2,
					createdAt: now,
					updatedAt: now,
				},
				{
					jobRoleName: "Frontend Developer",
					description:
						"Create stunning user interfaces for our global client base in our historic Derry office. Work with modern React and TypeScript technologies.",
					responsibilities:
						"Develop responsive web applications, implement pixel-perfect UI designs, optimize application performance, collaborate with UX designers, write comprehensive unit tests, maintain component libraries.",
					jobSpecLink:
						"https://company.sharepoint.com/sites/hr/jobs/frontend-developer-derry",
					location: "Derry~Londonderry, Northern Ireland",
					capability: "Engineering",
					band: "Mid",
					closingDate: getRandomClosingDate(),
					status: "active",
					numberOfOpenPositions: 1,
					createdAt: now,
					updatedAt: now,
				},
				{
					jobRoleName: "Product Manager",
					description:
						"Drive product strategy from our London headquarters. Lead cross-functional teams to deliver innovative solutions that delight customers worldwide.",
					responsibilities:
						"Define product roadmap and strategy, conduct market research, coordinate with stakeholders, manage product backlog, analyze user feedback, drive feature prioritization, present to executive leadership.",
					jobSpecLink:
						"https://company.sharepoint.com/sites/hr/jobs/product-manager-london",
					location: "London, England",
					capability: "Product",
					band: "Senior",
					closingDate: getRandomClosingDate(),
					status: "active",
					numberOfOpenPositions: 1,
					createdAt: now,
					updatedAt: now,
				},
				{
					jobRoleName: "UX/UI Designer",
					description:
						"Shape the future of user experience in Birmingham's tech quarter. Design intuitive interfaces that make complex processes simple and delightful.",
					responsibilities:
						"Create wireframes and interactive prototypes, conduct user research and usability testing, design user interfaces and experiences, collaborate with development teams, maintain design systems, create user journey maps.",
					jobSpecLink:
						"https://company.sharepoint.com/sites/hr/jobs/ux-ui-designer-birmingham",
					location: "Birmingham, England",
					capability: "Design",
					band: "Mid",
					closingDate: getRandomClosingDate(),
					status: "active",
					numberOfOpenPositions: 2,
					createdAt: now,
					updatedAt: now,
				},
				{
					jobRoleName: "Data Scientist",
					description:
						"Join our Dublin analytics center of excellence. Use machine learning and AI to unlock insights from massive datasets and drive business transformation.",
					responsibilities:
						"Develop machine learning models, analyze complex datasets, create predictive algorithms, build data pipelines, present insights to stakeholders, collaborate with engineering teams, research new methodologies.",
					jobSpecLink:
						"https://company.sharepoint.com/sites/hr/jobs/data-scientist-dublin",
					location: "Dublin, Ireland",
					capability: "Analytics",
					band: "Senior",
					closingDate: getRandomClosingDate(),
					status: "active",
					numberOfOpenPositions: 1,
					createdAt: now,
					updatedAt: now,
				},
				{
					jobRoleName: "Cloud Infrastructure Engineer",
					description:
						"Build and scale our European cloud infrastructure from Amsterdam. Work with cutting-edge technologies to support millions of users across the continent.",
					responsibilities:
						"Design cloud architecture solutions, manage Kubernetes clusters, implement Infrastructure as Code, optimize system performance, ensure high availability, automate deployment processes, monitor system health.",
					jobSpecLink:
						"https://company.sharepoint.com/sites/hr/jobs/cloud-engineer-amsterdam",
					location: "Gdańsk, Poland",
					capability: "Engineering",
					band: "Senior",
					closingDate: getRandomClosingDate(),
					status: "active",
					numberOfOpenPositions: 1,
					createdAt: now,
					updatedAt: now,
				},
				{
					jobRoleName: "Security Analyst",
					description:
						"Protect our digital assets and customer data from Frankfurt, Germany's financial hub. Implement robust security measures and respond to emerging threats.",
					responsibilities:
						"Monitor security systems, investigate security incidents, implement security policies, conduct vulnerability assessments, manage security tools, collaborate with compliance teams, provide security training.",
					jobSpecLink:
						"https://company.sharepoint.com/sites/hr/jobs/security-analyst-frankfurt",
					location: "Antwerp, Belgium",
					capability: "Security",
					band: "Mid",
					closingDate: getRandomClosingDate(),
					status: "active",
					numberOfOpenPositions: 2,
					createdAt: now,
					updatedAt: now,
				},
				{
					jobRoleName: "Quality Assurance Engineer",
					description:
						"Ensure product excellence from our Gdańsk development center. Design and execute comprehensive testing strategies for our global software products.",
					responsibilities:
						"Develop automated test suites, perform manual testing, create test plans and cases, identify and report defects, collaborate with development teams, maintain testing frameworks, ensure quality standards.",
					jobSpecLink:
						"https://company.sharepoint.com/sites/hr/jobs/qa-engineer-gdansk",
					location: "Gdańsk, Poland",
					capability: "Quality Assurance",
					band: "Mid",
					closingDate: getRandomClosingDate(),
					status: "active",
					numberOfOpenPositions: 1,
					createdAt: now,
					updatedAt: now,
				},
				{
					jobRoleName: "Business Intelligence Analyst",
					description:
						"Drive data-driven decision making from Indianapolis. Transform complex business data into actionable insights that guide strategic initiatives.",
					responsibilities:
						"Create business intelligence dashboards, analyze market trends, generate executive reports, collaborate with business stakeholders, maintain data models, identify growth opportunities, present findings to leadership.",
					jobSpecLink:
						"https://company.sharepoint.com/sites/hr/jobs/bi-analyst-indianapolis",
					location: "Indianapolis, USA",
					capability: "Analytics",
					band: "Mid",
					closingDate: getRandomClosingDate(),
					status: "active",
					numberOfOpenPositions: 1,
					createdAt: now,
					updatedAt: now,
				},
				{
					jobRoleName: "Technical Writer",
					description:
						"Create world-class documentation from Toronto. Help developers and users understand our complex systems through clear, comprehensive technical writing.",
					responsibilities:
						"Write technical documentation, create user guides and tutorials, maintain API documentation, collaborate with engineering teams, review and edit content, ensure documentation standards, manage content workflows.",
					jobSpecLink:
						"https://company.sharepoint.com/sites/hr/jobs/technical-writer-toronto",
					location: "Toronto, Canada",
					capability: "Documentation",
					band: "Mid",
					closingDate: getRandomClosingDate(),
					status: "active",
					numberOfOpenPositions: 1,
					createdAt: now,
					updatedAt: now,
				},
				{
					jobRoleName: "Junior Software Developer",
					description:
						"Start your tech career in vibrant Dublin! Join our graduate development program and work alongside experienced mentors on exciting projects.",
					responsibilities:
						"Write clean, maintainable code, participate in code reviews, learn new technologies, contribute to team projects, attend training sessions, collaborate in agile development processes, support bug fixes and feature development.",
					jobSpecLink:
						"https://company.sharepoint.com/sites/hr/jobs/junior-developer-dublin",
					location: "Dublin, Ireland",
					capability: "Engineering",
					band: "Junior",
					closingDate: getRandomClosingDate(),
					status: "active",
					numberOfOpenPositions: 3,
					createdAt: now,
					updatedAt: now,
				},
				{
					jobRoleName: "DevOps Engineer",
					description:
						"Lead our continuous integration and deployment efforts from London. Streamline development workflows and ensure reliable, scalable deployments.",
					responsibilities:
						"Manage CI/CD pipelines, automate deployment processes, monitor system performance, implement security best practices, collaborate with development teams, optimize infrastructure costs, ensure high availability.",
					jobSpecLink:
						"https://company.sharepoint.com/sites/hr/jobs/devops-engineer-london",
					location: "London, England",
					capability: "Engineering",
					band: "Senior",
					closingDate: getRandomClosingDate(),
					status: "draft",
					numberOfOpenPositions: 1,
					createdAt: now,
					updatedAt: now,
				},
			])
			.returning();

		console.log(`✅ Created ${sampleJobs.length} job roles`);
		console.log("🎉 Database seeding completed successfully!");

		// Display the created jobs
		console.log("\n📋 Created Job Roles:");
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

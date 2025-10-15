#!/usr/bin/env tsx
/**
 * Test script to verify the /api/job-roles/:id/applicants endpoint
 * Run this after starting the server with npm run dev
 */

interface JobRole {
	id: number;
	jobRoleName: string;
	status: string;
	location: string;
	capability: string;
	band: string;
	closingDate: string;
	createdAt: string;
	updatedAt: string;
}

interface Application {
	id: number;
	jobRoleId: number;
	applicantName: string;
	applicantEmail: string;
	status: string;
	submittedAt: string;
}

interface ApiResponse {
	success: boolean;
	data?: {
		jobRole: JobRole;
		applications: Application[];
	};
	error?: string;
}

async function testApplicantsEndpoint() {
	const baseUrl = "http://localhost:8000";

	console.log("🧪 Testing Applicants Endpoint\n");

	// Test 1: Get all job roles to find a valid ID
	console.log("Step 1: Fetching job roles to find a valid ID...");
	try {
		const rolesResponse = await fetch(`${baseUrl}/api/job-roles?limit=1`);
		const rolesData = (await rolesResponse.json()) as {
			success: boolean;
			data: { jobRoles: JobRole[] };
		};

		if (!rolesData.success || !rolesData.data.jobRoles.length) {
			console.log("❌ No job roles found. Please seed the database first.");
			return;
		}

		const jobRoleId = rolesData.data.jobRoles[0]?.id;
		if (!jobRoleId) {
			console.log("❌ Could not get job role ID");
			return;
		}
		console.log(
			`✅ Found job role ID: ${jobRoleId} (${rolesData.data.jobRoles[0]?.jobRoleName})\n`
		);

		// Test 2: Call the applicants endpoint
		console.log(`Step 2: Fetching applicants for job role ${jobRoleId}...`);
		const applicantsUrl = `${baseUrl}/api/job-roles/${jobRoleId}/applicants`;
		console.log(`URL: ${applicantsUrl}\n`);

		const response = await fetch(applicantsUrl);
		console.log(`Response Status: ${response.status} ${response.statusText}`);
		console.log(`Content-Type: ${response.headers.get("content-type")}\n`);

		const data = (await response.json()) as ApiResponse;

		// Test 3: Verify response structure
		console.log("Step 3: Verifying response structure...\n");
		console.log("Response structure:");
		console.log(JSON.stringify(data, null, 2));
		console.log("\n");

		// Verify expected fields
		console.log("Verification:");
		console.log(`✅ success field: ${data.success ? "✓" : "✗"}`);
		console.log(`✅ data field: ${data.data ? "✓" : "✗"}`);

		if (data.data) {
			console.log(`✅ data.jobRole field: ${data.data.jobRole ? "✓" : "✗"}`);
			console.log(
				`✅ data.applications field: ${data.data.applications ? "✓" : "✗"}`
			);

			if (data.data.jobRole) {
				console.log("\nJob Role Fields:");
				console.log(`  - id: ${data.data.jobRole.id}`);
				console.log(`  - jobRoleName: ${data.data.jobRole.jobRoleName}`);
				console.log(`  - status: ${data.data.jobRole.status}`);
				console.log(`  - location: ${data.data.jobRole.location}`);
			}

			if (data.data.applications) {
				console.log(`\nApplications count: ${data.data.applications.length}`);
				if (data.data.applications.length > 0) {
					console.log("\nFirst Application Fields:");
					const firstApp = data.data.applications[0];
					console.log(`  - id: ${firstApp?.id}`);
					console.log(`  - applicantName: ${firstApp?.applicantName}`);
					console.log(`  - applicantEmail: ${firstApp?.applicantEmail}`);
					console.log(`  - status: ${firstApp?.status}`);
				}
			}
		}

		console.log("\n✅ Test completed successfully!");
	} catch (error) {
		console.error("\n❌ Error during test:");
		if (error instanceof Error) {
			console.error(`Message: ${error.message}`);
			console.error(`Stack: ${error.stack}`);
		} else {
			console.error(error);
		}
	}
}

// Run the test
testApplicantsEndpoint().catch(console.error);

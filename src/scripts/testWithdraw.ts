#!/usr/bin/env tsx
/**
 * Test script to demonstrate withdraw application functionality
 * Run this after seeding the database and starting the server
 *
 * Usage: tsx src/scripts/testWithdraw.ts
 */

interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
}

interface JobApplication {
	id: number;
	jobRoleId: number;
	applicantName: string;
	applicantEmail: string;
	coverLetter?: string;
	resumeUrl?: string;
	hasCv: boolean;
	cvFileName?: string;
	cvMimeType?: string;
	status: string;
	submittedAt: string;
	updatedAt: string;
}

const BASE_URL = "http://localhost:8000/api";

async function testWithdrawApplication() {
	console.log("🧪 Testing Withdraw Application Endpoint\n");
	console.log("=".repeat(60));

	// Test case 1: Successful withdrawal
	console.log("\n✅ Test 1: Successful Withdrawal");
	console.log("-".repeat(60));
	try {
		const applicationId = 1; // Assuming application with ID 1 exists
		const userEmail = "john.doe@example.com"; // User who owns the application

		console.log(`📤 Withdrawing application ${applicationId}...`);
		console.log(`👤 User Email: ${userEmail}`);

		const response = await fetch(`${BASE_URL}/applications/${applicationId}`, {
			method: "DELETE",
			headers: {
				"X-User-Email": userEmail,
				"Content-Type": "application/json",
			},
		});

		const data = (await response.json()) as ApiResponse<JobApplication>;

		if (response.ok && data.success) {
			console.log("✅ Success!");
			console.log(`Status: ${response.status} ${response.statusText}`);
			console.log("\nApplication Details:");
			console.log(`  ID: ${data.data?.id}`);
			console.log(`  Status: ${data.data?.status}`);
			console.log(`  Updated At: ${data.data?.updatedAt}`);
		} else {
			console.log("❌ Failed!");
			console.log(`Status: ${response.status} ${response.statusText}`);
			console.log(`Message: ${data.message || data.error}`);
		}
	} catch (error) {
		console.error("❌ Error:", error);
	}

	// Test case 2: Missing authentication header
	console.log("\n\n❌ Test 2: Missing Authentication Header");
	console.log("-".repeat(60));
	try {
		const applicationId = 1;

		console.log(
			`📤 Attempting to withdraw application ${applicationId} without authentication...`
		);

		const response = await fetch(`${BASE_URL}/applications/${applicationId}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		});

		const data = (await response.json()) as ApiResponse<JobApplication>;

		console.log(`Status: ${response.status} ${response.statusText}`);
		console.log(`Expected: 401 Unauthorized`);
		console.log(`Message: ${data.message || data.error}`);
		if (response.status === 401) {
			console.log("✅ Correctly rejected unauthenticated request");
		} else {
			console.log("❌ Did not return expected 401 status");
		}
	} catch (error) {
		console.error("❌ Error:", error);
	}

	// Test case 3: Wrong user trying to withdraw
	console.log("\n\n❌ Test 3: Wrong User (Forbidden)");
	console.log("-".repeat(60));
	try {
		const applicationId = 1;
		const wrongUserEmail = "jane.smith@example.com"; // Different user

		console.log(`📤 Attempting to withdraw application ${applicationId}...`);
		console.log(`👤 User Email: ${wrongUserEmail} (not the owner)`);

		const response = await fetch(`${BASE_URL}/applications/${applicationId}`, {
			method: "DELETE",
			headers: {
				"X-User-Email": wrongUserEmail,
				"Content-Type": "application/json",
			},
		});

		const data = (await response.json()) as ApiResponse<JobApplication>;

		console.log(`Status: ${response.status} ${response.statusText}`);
		console.log(`Expected: 403 Forbidden`);
		console.log(`Message: ${data.message || data.error}`);

		if (response.status === 403) {
			console.log("✅ Correctly rejected unauthorized user");
		} else {
			console.log("❌ Did not return expected 403 status");
		}
	} catch (error) {
		console.error("❌ Error:", error);
	}

	// Test case 4: Invalid application ID
	console.log("\n\n❌ Test 4: Invalid Application ID");
	console.log("-".repeat(60));
	try {
		const invalidId = "abc"; // Invalid ID format
		const userEmail = "john.doe@example.com";

		console.log(
			`📤 Attempting to withdraw application with invalid ID: ${invalidId}...`
		);

		const response = await fetch(`${BASE_URL}/applications/${invalidId}`, {
			method: "DELETE",
			headers: {
				"X-User-Email": userEmail,
				"Content-Type": "application/json",
			},
		});

		const data = (await response.json()) as ApiResponse<JobApplication>;

		console.log(`Status: ${response.status} ${response.statusText}`);
		console.log(`Expected: 400 Bad Request`);
		console.log(`Message: ${data.message || data.error}`);
		if (response.status === 400) {
			console.log("✅ Correctly rejected invalid ID");
		} else {
			console.log("❌ Did not return expected 400 status");
		}
	} catch (error) {
		console.error("❌ Error:", error);
	}

	// Test case 5: Application not found
	console.log("\n\n❌ Test 5: Application Not Found");
	console.log("-".repeat(60));
	try {
		const nonExistentId = 99999;
		const userEmail = "john.doe@example.com";

		console.log(
			`📤 Attempting to withdraw non-existent application ${nonExistentId}...`
		);

		const response = await fetch(`${BASE_URL}/applications/${nonExistentId}`, {
			method: "DELETE",
			headers: {
				"X-User-Email": userEmail,
				"Content-Type": "application/json",
			},
		});

		const data = (await response.json()) as ApiResponse<JobApplication>;

		console.log(`Status: ${response.status} ${response.statusText}`);
		console.log(`Expected: 404 Not Found`);
		console.log(`Message: ${data.message || data.error}`);
		if (response.status === 404) {
			console.log("✅ Correctly returned 404 for non-existent application");
		} else {
			console.log("❌ Did not return expected 404 status");
		}
	} catch (error) {
		console.error("❌ Error:", error);
	}

	console.log(`\n${"=".repeat(60)}`);
	console.log("🧪 Withdraw Application Tests Complete\n");
	console.log("📝 Notes:");
	console.log("  - Make sure the server is running on http://localhost:8000");
	console.log("  - Make sure the database is seeded with test data");
	console.log(
		"  - Application ID 1 should exist and belong to john.doe@example.com"
	);
	console.log("  - Test 1 will change the application status to 'withdrawn'");
	console.log("  - Re-run the seed script to reset the database if needed");
}

// Run the tests
testWithdrawApplication().catch(console.error);

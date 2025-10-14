#!/usr/bin/env tsx
/**
 * Test script to demonstrate pagination functionality
 * Run this after seeding the database and starting the server
 */

async function testPagination() {
	const baseUrl = "http://localhost:8000/api/job-roles";

	console.log("🧪 Testing Job Roles API Pagination\n");

	// Test 1: Default pagination (should use page=1, limit=12)
	console.log("Test 1: Default pagination");
	try {
		const response1 = await fetch(baseUrl);
		const data1 = (await response1.json()) as any;
		console.log(`✅ Status: ${response1.status}`);
		console.log(
			`📄 Page: ${data1.data.pagination.currentPage}/${data1.data.pagination.totalPages}`
		);
		console.log(
			`📊 Count: ${data1.data.jobRoles.length} items (Total: ${data1.data.pagination.totalCount})`
		);
		console.log(
			`🔄 Has Next: ${data1.data.pagination.hasNext}, Has Previous: ${data1.data.pagination.hasPrevious}\n`
		);
	} catch (error) {
		console.log(`❌ Error: ${error}\n`);
	}

	// Test 2: Specific page and limit
	console.log("Test 2: Page 2 with limit 5");
	try {
		const response2 = await fetch(`${baseUrl}?page=2&limit=5`);
		const data2 = (await response2.json()) as any;
		console.log(`✅ Status: ${response2.status}`);
		console.log(
			`📄 Page: ${data2.data.pagination.currentPage}/${data2.data.pagination.totalPages}`
		);
		console.log(
			`📊 Count: ${data2.data.jobRoles.length} items (Total: ${data2.data.pagination.totalCount})`
		);
		console.log(
			`🔄 Has Next: ${data2.data.pagination.hasNext}, Has Previous: ${data2.data.pagination.hasPrevious}\n`
		);
	} catch (error) {
		console.log(`❌ Error: ${error}\n`);
	}

	// Test 3: Filter with pagination
	console.log("Test 3: Active jobs only, page 1, limit 3");
	try {
		const response3 = await fetch(`${baseUrl}?status=active&page=1&limit=3`);
		const data3 = (await response3.json()) as any;
		console.log(`✅ Status: ${response3.status}`);
		console.log(
			`📄 Page: ${data3.data.pagination.currentPage}/${data3.data.pagination.totalPages}`
		);
		console.log(
			`📊 Count: ${data3.data.jobRoles.length} items (Total: ${data3.data.pagination.totalCount})`
		);
		console.log(
			`🔄 Has Next: ${data3.data.pagination.hasNext}, Has Previous: ${data3.data.pagination.hasPrevious}\n`
		);
	} catch (error) {
		console.log(`❌ Error: ${error}\n`);
	}

	// Test 4: Page beyond available data (should return empty array)
	console.log("Test 4: Page beyond available data (page 999)");
	try {
		const response4 = await fetch(`${baseUrl}?page=999&limit=12`);
		const data4 = (await response4.json()) as any;
		console.log(`✅ Status: ${response4.status}`);
		console.log(
			`📄 Page: ${data4.data.pagination.currentPage}/${data4.data.pagination.totalPages}`
		);
		console.log(
			`📊 Count: ${data4.data.jobRoles.length} items (Total: ${data4.data.pagination.totalCount})`
		);
		console.log(
			`🔄 Has Next: ${data4.data.pagination.hasNext}, Has Previous: ${data4.data.pagination.hasPrevious}\n`
		);
	} catch (error) {
		console.log(`❌ Error: ${error}\n`);
	}

	// Test 5: Invalid page parameter (should return 400)
	console.log("Test 5: Invalid page parameter (page=0)");
	try {
		const response5 = await fetch(`${baseUrl}?page=0&limit=12`);
		const data5 = (await response5.json()) as any;
		console.log(`⚠️  Status: ${response5.status}`);
		console.log(`📋 Error: ${data5.error}\n`);
	} catch (error) {
		console.log(`❌ Error: ${error}\n`);
	}

	// Test 6: Invalid limit parameter (should return 400)
	console.log("Test 6: Invalid limit parameter (limit=101)");
	try {
		const response6 = await fetch(`${baseUrl}?page=1&limit=101`);
		const data6 = (await response6.json()) as any;
		console.log(`⚠️  Status: ${response6.status}`);
		console.log(`📋 Error: ${data6.error}\n`);
	} catch (error) {
		console.log(`❌ Error: ${error}\n`);
	}

	console.log("🎉 Pagination testing complete!");
}

// Run the test
testPagination().catch(console.error);

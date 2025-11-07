import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { App, type AppConfig } from "../index";

/**
 * Integration tests for authentication API endpoints
 * Tests HTTP status codes for user registration and login flows
 */

// Type definitions for API responses
interface ApiResponse {
	message?: string;
	error?: string;
	user?: {
		email: string;
		forename: string;
		surname: string;
		id?: string;
	};
	details?: unknown[];
}

// Test configuration
const TEST_PORT = 0; // Use 0 to let OS assign available port dynamically
let actualTestPort: number; // Will hold the actual port after server starts
const TEST_SERVER_CONFIG: AppConfig = {
	name: "Job App Backend",
	version: "1.0.0",
	environment: "test",
	port: TEST_PORT,
};

// Generate unique test emails to avoid database conflicts
// Uses timestamp and random string for better uniqueness in parallel tests
let emailCounter = 0;
const getUniqueEmail = (base: string): string => {
	emailCounter++;
	return `${base}-${Date.now()}-${emailCounter}-${Math.random().toString(36).substring(7)}@example.com`;
};

// Test data
const testUser = {
	email: getUniqueEmail("test-integration"),
	password: "SecurePassword123!",
	forename: "Integration",
	surname: "Tester",
};

let app: App;
let server: Server;

describe("Authentication Integration Tests - HTTP Status Codes", () => {
	beforeAll(async () => {
		// Start the test server
		app = new App(TEST_SERVER_CONFIG);
		server = app.getServer().listen(TEST_PORT);

		// Wait for server to be ready and capture the actual port
		await new Promise<void>((resolve, reject) => {
			server.on("listening", () => {
				const address = server.address();
				if (address && typeof address === "object") {
					actualTestPort = address.port;
				}
				resolve();
			});
			server.on("error", reject);
		});
	});

	afterAll(async () => {
		// Close the server
		return new Promise<void>((resolve, reject) => {
			server.close((err) => {
				if (err) reject(err);
				else resolve();
			});
		});
	});

	describe("POST /api/auth/register - User Registration", () => {
		it("should return 201 Created on successful registration", async () => {
			const response = await fetch(
				`http://localhost:${actualTestPort}/api/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(testUser),
				}
			);

			expect(response.status).toBe(201);

			const data = (await response.json()) as ApiResponse;
			expect(data).toHaveProperty("message", "User registered successfully");
			expect(data).toHaveProperty("user");
			expect(data.user).toHaveProperty("email", testUser.email);
			expect(data.user).toHaveProperty("forename", testUser.forename);
			expect(data.user).toHaveProperty("surname", testUser.surname);
		});

		it("should return 409 Conflict when user already exists", async () => {
			// Try to register with the same email
			const response = await fetch(
				`http://localhost:${actualTestPort}/api/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(testUser),
				}
			);

			expect(response.status).toBe(409);

			const data = (await response.json()) as ApiResponse;
			expect(data).toHaveProperty("error", "User already exists");
			expect(data).toHaveProperty(
				"message",
				"An account with this email already exists"
			);
		});

		it("should return 400 Bad Request on validation failure - invalid email", async () => {
			const invalidData = {
				email: "not-an-email",
				password: "ValidPassword123!",
				forename: "Test",
				surname: "User",
			};

			const response = await fetch(
				`http://localhost:${actualTestPort}/api/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(invalidData),
				}
			);

			expect(response.status).toBe(400);

			const data = (await response.json()) as ApiResponse;
			expect(data).toHaveProperty("error", "Validation failed");
			expect(data).toHaveProperty("details");
			expect(Array.isArray(data.details)).toBe(true);
		});

		it("should return 400 Bad Request on validation failure - weak password", async () => {
			const weakPasswordData = {
				email: "weakpass@example.com",
				password: "weak",
				forename: "Test",
				surname: "User",
			};

			const response = await fetch(
				`http://localhost:${actualTestPort}/api/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(weakPasswordData),
				}
			);

			expect(response.status).toBe(400);

			const data = (await response.json()) as ApiResponse;
			expect(data).toHaveProperty("error");
		});

		it("should return 400 Bad Request on missing required fields", async () => {
			const incompleteData = {
				email: "missing-fields@example.com",
				// missing password, forename, surname
			};

			const response = await fetch(
				`http://localhost:${actualTestPort}/api/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(incompleteData),
				}
			);

			expect(response.status).toBe(400);

			const data = (await response.json()) as ApiResponse;
			expect(data).toHaveProperty("error", "Validation failed");
		});
	});

	describe("POST /api/auth/login - User Login", () => {
		it("should return 200 OK on successful login with correct credentials", async () => {
			// First register a fresh user for this test
			const loginTestUser = {
				email: getUniqueEmail("login-test"),
				password: "LoginTest123!",
				forename: "Login",
				surname: "Tester",
			};

			const registerResponse = await fetch(
				`http://localhost:${actualTestPort}/api/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(loginTestUser),
				}
			);

			// Ensure registration was successful before attempting login
			expect(registerResponse.status).toBe(201);

			// Now attempt login
			const loginResponse = await fetch(
				`http://localhost:${actualTestPort}/api/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: loginTestUser.email,
						password: loginTestUser.password,
					}),
				}
			);

			expect(loginResponse.status).toBe(200);

			const data = (await loginResponse.json()) as ApiResponse;
			expect(data).toHaveProperty("message", "Login successful");
			expect(data).toHaveProperty("user");
			expect(data.user).toHaveProperty("email", loginTestUser.email);
			expect(data.user).toHaveProperty("forename", loginTestUser.forename);
		});

		it("should return 401 Unauthorized with invalid credentials", async () => {
			// First register a user for this test
			const invalidLoginUser = {
				email: getUniqueEmail("invalid-login-test"),
				password: "CorrectPassword123!",
				forename: "Invalid",
				surname: "Login",
			};

			await fetch(`http://localhost:${actualTestPort}/api/auth/register`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(invalidLoginUser),
			});

			// Try to login with wrong password
			const response = await fetch(
				`http://localhost:${actualTestPort}/api/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: invalidLoginUser.email,
						password: "WrongPassword123!",
					}),
				}
			);

			expect(response.status).toBe(401);

			const data = (await response.json()) as ApiResponse;
			expect(data).toHaveProperty("error", "Invalid credentials");
			expect(data).toHaveProperty("message", "Email or password is incorrect");
		});

		it("should return 401 Unauthorized when user does not exist", async () => {
			const response = await fetch(
				`http://localhost:${actualTestPort}/api/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: getUniqueEmail("nonexistent"),
						password: "SomePassword123!",
					}),
				}
			);

			expect(response.status).toBe(401);

			const data = (await response.json()) as ApiResponse;
			expect(data).toHaveProperty("error", "Invalid credentials");
		});

		it("should return 400 Bad Request on validation failure - missing email", async () => {
			const response = await fetch(
				`http://localhost:${actualTestPort}/api/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						password: "SomePassword123!",
						// missing email
					}),
				}
			);

			expect(response.status).toBe(400);

			const data = (await response.json()) as ApiResponse;
			expect(data).toHaveProperty("error", "Validation failed");
		});

		it("should return 400 Bad Request on validation failure - invalid email format", async () => {
			const response = await fetch(
				`http://localhost:${actualTestPort}/api/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: "invalid-email",
						password: "SomePassword123!",
					}),
				}
			);

			expect(response.status).toBe(400);

			const data = (await response.json()) as ApiResponse;
			expect(data).toHaveProperty("error", "Validation failed");
		});

		it("should return 400 Bad Request on validation failure - missing password", async () => {
			const response = await fetch(
				`http://localhost:${actualTestPort}/api/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: "test@example.com",
						// missing password
					}),
				}
			);

			expect(response.status).toBe(400);

			const data = (await response.json()) as ApiResponse;
			expect(data).toHaveProperty("error", "Validation failed");
		});
	});

	describe("Complete Registration and Login Flow", () => {
		it("should successfully complete full registration and login flow", async () => {
			const flowTestUser = {
				email: getUniqueEmail("flow-test"),
				password: "FlowTester123!",
				forename: "Flow",
				surname: "Tester",
			};

			// Step 1: Register user - expect 201
			const registerResponse = await fetch(
				`http://localhost:${actualTestPort}/api/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(flowTestUser),
				}
			);

			expect(registerResponse.status).toBe(201);
			const registerData = (await registerResponse.json()) as ApiResponse;
			expect(registerData.user?.email).toBe(flowTestUser.email);

			// Step 2: Login with registered credentials - expect 200
			const loginResponse = await fetch(
				`http://localhost:${actualTestPort}/api/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: flowTestUser.email,
						password: flowTestUser.password,
					}),
				}
			);

			expect(loginResponse.status).toBe(200);
			const loginData = (await loginResponse.json()) as ApiResponse;
			expect(loginData.user?.email).toBe(flowTestUser.email);
		});
	});
});

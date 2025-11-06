import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { App, type AppConfig } from "../index";
import type { Server } from "http";

/**
 * Integration tests for authentication API endpoints
 * Tests HTTP status codes for user registration and login flows
 */

// Test configuration
const TEST_PORT = 3001;
const TEST_SERVER_CONFIG: AppConfig = {
	name: "Job App Backend",
	version: "1.0.0",
	environment: "test",
	port: TEST_PORT,
};

// Generate unique test emails using timestamp to avoid database conflicts
const getUniqueEmail = (base: string): string => {
	return `${base}-${Date.now()}-${Math.random().toString(36).substring(7)}@example.com`;
};

// Test data
const testUser = {
	email: getUniqueEmail("test-integration"),
	password: "SecurePassword123!",
	forename: "Integration",
	surname: "Tester",
};

const anotherTestUser = {
	email: getUniqueEmail("another-test"),
	password: "AnotherSecure456!",
	forename: "Another",
	surname: "User",
};

const invalidTestUser = {
	email: "invalid-email",
	password: "weak",
	forename: "Invalid",
	surname: "User",
};

let app: App;
let server: Server;
let sessionCookie: string = "";

describe("Authentication Integration Tests - HTTP Status Codes", () => {
	beforeAll(async () => {
		// Start the test server
		app = new App(TEST_SERVER_CONFIG);
		server = app.getServer().listen(TEST_PORT);

		// Give the server a moment to start
		await new Promise((resolve) => setTimeout(resolve, 100));
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
				`http://localhost:${TEST_PORT}/api/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(testUser),
				}
			);

			expect(response.status).toBe(201);

			const data = await response.json() as any;
			expect(data).toHaveProperty("message", "User registered successfully");
			expect(data).toHaveProperty("user");
			expect(data.user).toHaveProperty("email", testUser.email);
			expect(data.user).toHaveProperty("forename", testUser.forename);
			expect(data.user).toHaveProperty("surname", testUser.surname);

			// Store session cookie for login tests
			const setCookie = response.headers.get("set-cookie");
			if (setCookie) {
				sessionCookie = setCookie.split(";")[0];
			}
		});

		it("should return 409 Conflict when user already exists", async () => {
			// Try to register with the same email
			const response = await fetch(
				`http://localhost:${TEST_PORT}/api/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(testUser),
				}
			);

			expect(response.status).toBe(409);

			const data = await response.json() as any;
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
				`http://localhost:${TEST_PORT}/api/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(invalidData),
				}
			);

			expect(response.status).toBe(400);

			const data = await response.json() as any;
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
				`http://localhost:${TEST_PORT}/api/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(weakPasswordData),
				}
			);

			expect(response.status).toBe(400);

			const data = await response.json() as any;
			expect(data).toHaveProperty("error");
		});

		it("should return 400 Bad Request on missing required fields", async () => {
			const incompleteData = {
				email: "missing-fields@example.com",
				// missing password, forename, surname
			};

			const response = await fetch(
				`http://localhost:${TEST_PORT}/api/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(incompleteData),
				}
			);

			expect(response.status).toBe(400);

			const data = await response.json() as any;
			expect(data).toHaveProperty("error", "Validation failed");
		});
	});

	describe("POST /api/auth/login - User Login", () => {
		it("should return 200 OK on successful login with correct credentials", async () => {
			// First register a fresh user for this test
			const loginTestUser = {
				email: "login-test@example.com",
				password: "LoginTest123!",
				forename: "Login",
				surname: "Tester",
			};

			await fetch(
				`http://localhost:${TEST_PORT}/api/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(loginTestUser),
				}
			);

			// Now attempt login
			const loginResponse = await fetch(
				`http://localhost:${TEST_PORT}/api/auth/login`,
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

			const data = await loginResponse.json() as any;
			expect(data).toHaveProperty("message", "Login successful");
			expect(data).toHaveProperty("user");
			expect(data.user).toHaveProperty("email", loginTestUser.email);
			expect(data.user).toHaveProperty("forename", loginTestUser.forename);
		});

		it("should return 401 Unauthorized with invalid credentials", async () => {
			const response = await fetch(
				`http://localhost:${TEST_PORT}/api/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: testUser.email,
						password: "WrongPassword123!",
					}),
				}
			);

			expect(response.status).toBe(401);

			const data = await response.json() as any;
			expect(data).toHaveProperty("error", "Invalid credentials");
			expect(data).toHaveProperty("message", "Email or password is incorrect");
		});

		it("should return 401 Unauthorized when user does not exist", async () => {
			const response = await fetch(
				`http://localhost:${TEST_PORT}/api/auth/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: "nonexistent@example.com",
						password: "SomePassword123!",
					}),
				}
			);

			expect(response.status).toBe(401);

			const data = await response.json() as any;
			expect(data).toHaveProperty("error", "Invalid credentials");
		});

		it("should return 400 Bad Request on validation failure - missing email", async () => {
			const response = await fetch(
				`http://localhost:${TEST_PORT}/api/auth/login`,
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

			const data = await response.json() as any;
			expect(data).toHaveProperty("error", "Validation failed");
		});

		it("should return 400 Bad Request on validation failure - invalid email format", async () => {
			const response = await fetch(
				`http://localhost:${TEST_PORT}/api/auth/login`,
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

			const data = await response.json() as any;
			expect(data).toHaveProperty("error", "Validation failed");
		});

		it("should return 400 Bad Request on validation failure - missing password", async () => {
			const response = await fetch(
				`http://localhost:${TEST_PORT}/api/auth/login`,
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

			const data = await response.json() as any;
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
				`http://localhost:${TEST_PORT}/api/auth/register`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(flowTestUser),
				}
			);

			expect(registerResponse.status).toBe(201);
			const registerData = await registerResponse.json() as any;
			expect(registerData.user.email).toBe(flowTestUser.email);

			// Step 2: Login with registered credentials - expect 200
			const loginResponse = await fetch(
				`http://localhost:${TEST_PORT}/api/auth/login`,
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
			const loginData = await loginResponse.json() as any;
			expect(loginData.user.email).toBe(flowTestUser.email);
		});
	});
});

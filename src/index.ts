/**
 * Main entry point for the Express application
 */

import cors from "cors";
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import { config } from "./config/index";
import apiRoutes from "./routes/index";

interface AppConfig {
	name: string;
	version: string;
	environment: string;
	port: number;
}

class App {
	private config: AppConfig;
	private server: Application;

	constructor(config: AppConfig) {
		this.config = config;
		this.server = express();
		this.setupMiddleware();
		this.setupRoutes();
	}

	private setupMiddleware(): void {
		// CORS configuration - allow credentials from frontend
		this.server.use(
			cors({
				origin: "http://localhost:3000",
				credentials: true,
				methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
				allowedHeaders: ["Content-Type", "Authorization"],
			})
		);

		// Add JSON parsing middleware
		this.server.use(express.json());

		// Add URL-encoded parsing middleware
		this.server.use(express.urlencoded({ extended: true }));
	}

	private setupRoutes(): void {
		// Hello World endpoint
		this.server.get("/", (_req: Request, res: Response) => {
			res.json({
				message: "Hello World!",
				app: this.config.name,
				version: this.config.version,
				environment: this.config.environment,
				timestamp: new Date().toISOString(),
			});
		});

		// API routes
		this.server.use("/api", apiRoutes);

		// (Debug route removed)
	}

	public start(): void {
		const server = this.server.listen(this.config.port);

		this.server.listen(this.config.port, () => {
			console.log(`🚀 Starting ${this.config.name} v${this.config.version}`);
			console.log(`📦 Environment: ${this.config.environment}`);
			console.log(`🌐 Server running on http://localhost:${this.config.port}`);
			console.log(
				"✅ Application is running with TypeScript, ES Modules, and Express!"
			);
		});

		// Handle server errors
		server.on("error", (error: Error) => {
			console.error("❌ Server error:", error);
			process.exit(1);
		});

		// Graceful shutdown handlers
		process.on("SIGTERM", () => {
			console.log("⚠️  SIGTERM received, shutting down gracefully...");
			server.close(() => {
				console.log("✅ Server closed");
				process.exit(0);
			});
		});

		process.on("SIGINT", () => {
			console.log("\n⚠️  SIGINT received, shutting down gracefully...");
			server.close(() => {
				console.log("✅ Server closed");
				process.exit(0);
			});
		});
	}

	public getConfig(): AppConfig {
		return { ...this.config };
	}

	public getServer(): Application {
		return this.server;
	}
}

// Application configuration
const appConfig: AppConfig = {
	name: config.app.name,
	version: config.app.version,
	environment: config.app.nodeEnv,
	port: config.server.port,
};

// Initialize and start the application
const app = new App(appConfig);

// Handle uncaught exceptions (avoid logging sensitive info)
process.on("uncaughtException", (error: unknown) => {
	if (error instanceof Error) {
		console.error("❌ Uncaught Exception:", error.message);
		if (error.stack) console.error(error.stack);
	} else {
		console.error("❌ Uncaught Exception: [non-Error thrown, redacted]");
	}
	process.exit(1);
});

// Handle unhandled promise rejections (avoid logging sensitive info)
process.on("unhandledRejection", (reason: unknown) => {
	if (reason instanceof Error) {
		console.error("❌ Unhandled Rejection:", reason.message);
		if (reason.stack) console.error(reason.stack);
	} else {
		console.error("❌ Unhandled Rejection: [non-Error reason, redacted]");
	}
	process.exit(1);
});

app.start();

export { App, type AppConfig };

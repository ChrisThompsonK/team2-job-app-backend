/**
 * Main entry point for the Express application
 */

import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import type { AppConfig } from "./config/index.js";
import { config } from "./config/index.js";
import {
	corsMiddleware,
	errorHandler,
	logger,
	notFoundHandler,
	requestLoggingMiddleware,
	securityMiddleware,
} from "./middleware/index.js";
import jobRoutes from "./routes/jobs.js";

class App {
	private appConfig: AppConfig;
	private server: Application;

	constructor(appConfig: AppConfig) {
		this.appConfig = appConfig;
		this.server = express();
		this.setupMiddleware();
		this.setupRoutes();
		this.setupErrorHandling();
	}

	private setupMiddleware(): void {
		// Security and CORS middleware
		this.server.use(securityMiddleware);
		this.server.use(corsMiddleware);

		// Logging middleware
		this.server.use(requestLoggingMiddleware);

		// Body parsing middleware
		this.server.use(express.json({ limit: "10mb" }));
		this.server.use(express.urlencoded({ extended: true, limit: "10mb" }));
	}

	private setupRoutes(): void {
		// Hello World endpoint
		this.server.get("/", (_req: Request, res: Response) => {
			res.json({
				message: "Job App Backend API",
				app: this.appConfig.name,
				version: this.appConfig.version,
				environment: this.appConfig.environment,
				timestamp: new Date().toISOString(),
				endpoints: {
					jobs: "/api/jobs",
					jobById: "/api/jobs/:id",
				},
			});
		});

		// Job routes - only 2 endpoints
		this.server.use("/api/jobs", jobRoutes);
	}

	private setupErrorHandling(): void {
		// 404 handler for unknown routes
		this.server.use(notFoundHandler);

		// Global error handler (must be last)
		this.server.use(errorHandler);
	}

	public start(): void {
		this.server.listen(this.appConfig.server.port, () => {
			logger.info(
				`🚀 Starting ${this.appConfig.name} v${this.appConfig.version}`
			);
			logger.info(`📦 Environment: ${this.appConfig.environment}`);
			logger.info(
				`🌐 Server running on http://localhost:${this.appConfig.server.port}`
			);
			logger.info(
				"✅ Application is running with TypeScript, ES Modules, and Express!"
			);
		});
	}

	public getConfig(): AppConfig {
		return this.appConfig;
	}

	public getServer(): Application {
		return this.server;
	}
}

// Initialize and start the application
const app = new App(config);
app.start();

export { App };

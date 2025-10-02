/**
 * Main entry point for the Express application
 */

import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import jobRoutes from "./routes/jobs.js";

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

		// Job routes
		this.server.use("/api/jobs", jobRoutes);
	}

	public start(): void {
		this.server.listen(this.config.port, () => {
			console.log(`🚀 Starting ${this.config.name} v${this.config.version}`);
			console.log(`📦 Environment: ${this.config.environment}`);
			console.log(`🌐 Server running on http://localhost:${this.config.port}`);
			console.log(
				"✅ Application is running with TypeScript, ES Modules, and Express!"
			);
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
	name: "team2-job-app-frontend",
	version: "1.0.0",
	environment: process.env["NODE_ENV"] ?? "development",
	port: parseInt(process.env["PORT"] ?? "3000", 10),
};

// Initialize and start the application
const app = new App(appConfig);
app.start();

export { App, type AppConfig };

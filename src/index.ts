/**
 * Main entry point for the Express application
 */

import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import { env } from "./config/env";
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
		// Add JSON parsing middleware
		this.server.use(express.json());

		// Add URL-encoded parsing middleware
		this.server.use(express.urlencoded({ extended: true }));

		// CORS middleware
		this.server.use((_req: Request, res: Response, next): void => {
			res.header("Access-Control-Allow-Origin", env.CORS_ORIGIN);
			res.header(
				"Access-Control-Allow-Methods",
				"GET, POST, PUT, DELETE, OPTIONS"
			);
			res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
			if (_req.method === "OPTIONS") {
				res.sendStatus(200);
				return;
			}
			next();
		});
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

		// Health check endpoint
		this.server.get("/health", (_req: Request, res: Response) => {
			res.json({
				status: "healthy",
				timestamp: new Date().toISOString(),
				environment: this.config.environment,
			});
		});

		// API routes
		this.server.use(env.API_PREFIX, apiRoutes);
	}

	public start(): void {
		this.server.listen(this.config.port, () => {
			console.log(`🚀 Starting ${this.config.name} v${this.config.version}`);
			console.log(`📦 Environment: ${this.config.environment}`);
			console.log(`🌐 Server running on http://localhost:${this.config.port}`);
			console.log(
				`🔗 API available at http://localhost:${this.config.port}${env.API_PREFIX}`
			);
			console.log(`📊 Log level: ${env.LOG_LEVEL}`);
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
	name: "team2-job-app-backend",
	version: "1.0.0",
	environment: env.NODE_ENV,
	port: env.PORT,
};

// Initialize and start the application
const app = new App(appConfig);
app.start();

export { App, type AppConfig };

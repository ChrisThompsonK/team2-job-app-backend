/**
 * Application middleware setup
 */

import cors from "cors";
import type { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import winston from "winston";
import { z } from "zod";
import { config } from "../config/index.js";
import type { ApiResponse, ErrorResponse } from "../types/api.js";

// Logger setup
export const logger = winston.createLogger({
	level: config.logging.level,
	format:
		config.logging.format === "json"
			? winston.format.combine(
					winston.format.timestamp(),
					winston.format.errors({ stack: true }),
					winston.format.json()
				)
			: winston.format.combine(
					winston.format.colorize(),
					winston.format.timestamp({ format: "HH:mm:ss" }),
					winston.format.printf(({ timestamp, level, message, ...meta }) => {
						return `${timestamp} [${level}]: ${message} ${
							Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ""
						}`;
					})
				),
	transports: [
		new winston.transports.Console(),
		...(config.logging.file
			? [new winston.transports.File({ filename: "logs/app.log" })]
			: []),
	],
});

// CORS middleware
export const corsMiddleware = cors({
	origin: config.server.cors.origin,
	credentials: config.server.cors.credentials,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization", "Accept"],
});

// Security middleware
export const securityMiddleware = helmet({
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			scriptSrc: ["'self'"],
			imgSrc: ["'self'", "data:", "https:"],
		},
	},
});

// Request logging middleware
export const requestLoggingMiddleware = morgan(
	config.environment === "production" ? "combined" : "dev",
	{
		stream: {
			write: (message: string) => logger.info(message.trim()),
		},
	}
);

// Request validation middleware factory
export const validateRequest = (schema: {
	query?: z.ZodSchema;
	params?: z.ZodSchema;
	body?: z.ZodSchema;
}) => {
	return (req: Request, res: Response, next: NextFunction): void => {
		try {
			if (schema.query) {
				const validatedQuery = schema.query.parse(req.query);
				// Replace the query object properties instead of reassigning
				Object.assign(req.query, validatedQuery);
			}
			if (schema.params) {
				const validatedParams = schema.params.parse(req.params);
				Object.assign(req.params, validatedParams);
			}
			if (schema.body) {
				req.body = schema.body.parse(req.body);
			}
			next();
		} catch (error) {
			if (error instanceof z.ZodError) {
				const errorResponse: ErrorResponse = {
					success: false,
					message: "Validation error",
					error: error.issues
						.map((e: any) => `${e.path.join(".")}: ${e.message}`)
						.join(", "),
					timestamp: new Date().toISOString(),
					path: req.path,
					statusCode: 400,
				};
				res.status(400).json(errorResponse);
				return;
			}
			next(error);
		}
	};
};

// Error handling middleware
export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	_next: NextFunction
): void => {
	logger.error("Unhandled error:", {
		error: err.message,
		stack: err.stack,
		url: req.url,
		method: req.method,
		params: req.params,
		query: req.query,
	});

	const errorResponse: ErrorResponse = {
		success: false,
		message:
			config.environment === "production"
				? "Internal server error"
				: err.message || "An unexpected error occurred",
		error: config.environment === "development" ? err.stack : undefined,
		timestamp: new Date().toISOString(),
		path: req.path,
		statusCode: err.statusCode || 500,
	};

	res.status(err.statusCode || 500).json(errorResponse);
};

// Not found middleware
export const notFoundHandler = (req: Request, res: Response): void => {
	const errorResponse: ErrorResponse = {
		success: false,
		message: `Route ${req.method} ${req.path} not found`,
		timestamp: new Date().toISOString(),
		path: req.path,
		statusCode: 404,
	};

	res.status(404).json(errorResponse);
};

// Response helper
export const sendResponse = <T>(
	res: Response,
	data?: T,
	message?: string,
	statusCode = 200
): void => {
	const response: ApiResponse<T> = {
		success: statusCode < 400,
		...(data !== undefined && { data }),
		...(message && { message }),
		timestamp: new Date().toISOString(),
	};

	res.status(statusCode).json(response);
};

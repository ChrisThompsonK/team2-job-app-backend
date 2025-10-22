import type { NextFunction, Request, Response } from "express";

/**
 * Extend Express Session type to include our custom properties
 */
declare module "express-session" {
	interface SessionData {
		userId: string;
		email: string;
		role: "Admin" | "Applicant";
	}
}

/**
 * Middleware: Require user to be authenticated
 * Returns 401 if no session exists
 */
export function requireAuth(
	req: Request,
	res: Response,
	next: NextFunction
): void {
	if (!req.session.userId) {
		res.status(401).json({
			error: "Unauthorized",
			message: "You must be logged in to access this resource",
		});
		return;
	}
	next();
}

/**
 * Middleware: Require user to have specific role(s)
 * Returns 401 if not authenticated, 403 if wrong role
 */
export function requireRole(...roles: Array<"Admin" | "Applicant">) {
	return (req: Request, res: Response, next: NextFunction): void => {
		if (!req.session.userId) {
			res.status(401).json({
				error: "Unauthorized",
				message: "You must be logged in",
			});
			return;
		}

		if (!req.session.role || !roles.includes(req.session.role)) {
			res.status(403).json({
				error: "Forbidden",
				message: "You do not have permission to access this resource",
			});
			return;
		}

		next();
	};
}

/**
 * Middleware: Require Admin role
 * Convenience wrapper around requireRole
 */
export const requireAdmin = requireRole("Admin");

/**
 * Middleware: Require Applicant role
 * Convenience wrapper around requireRole
 */
export const requireApplicant = requireRole("Applicant");

/**
 * Middleware: Optional authentication
 * Doesn't block request, just adds user info if available
 */
export function optionalAuth(
	_req: Request,
	_res: Response,
	next: NextFunction
): void {
	// User info available in req.session if logged in
	next();
}

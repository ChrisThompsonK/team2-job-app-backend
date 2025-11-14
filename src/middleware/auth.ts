import type { NextFunction, Request, Response } from "express";

declare module "express-session" {
	interface SessionData {
		userId: string;
		email: string;
		role: "Admin" | "Applicant";
	}
}

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

export const requireAdmin = requireRole("Admin");
export const requireApplicant = requireRole("Applicant");

export function optionalAuth(
	_req: Request,
	_res: Response,
	next: NextFunction
): void {
	next();
}

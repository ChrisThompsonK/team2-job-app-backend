/**
 * Extend express-session types to include user data
 */

import "express-session";
import type { PublicUser } from "../types/user";

declare module "express-session" {
	interface SessionData {
		user?: PublicUser;
	}
}

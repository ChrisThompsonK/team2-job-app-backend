import connectSqlite3 from "connect-sqlite3";
import session from "express-session";
import { config } from "../config/index";

const SQLiteStore = connectSqlite3(session);

/**
 * Express session middleware configured with SQLite store
 * Sessions are persisted to the main database.sqlite file
 */
export const sessionMiddleware = session({
	store: new SQLiteStore({
		db: "database.sqlite",
		dir: "./",
		table: "sessions", // Table name for session storage
	}) as session.Store,
	secret: config.session.secret,
	name: config.session.name,
	resave: false, // Don't save session if unmodified
	saveUninitialized: false, // Don't create session until something stored
	cookie: {
		maxAge: config.session.maxAge,
		httpOnly: config.session.httpOnly, // Prevent XSS attacks
		secure: config.session.secure, // HTTPS only in production
		sameSite: config.session.sameSite, // CSRF protection
	},
});

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { config } from "../config/index";
import * as schema from "./schema";

const sqlite = new Database(config.database.url);
export const db = drizzle(sqlite, { schema });

export type DB = typeof db;

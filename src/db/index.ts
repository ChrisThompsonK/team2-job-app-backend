import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
// Import schema when tables are defined: import * as schema from "./schema";

const sqlite = new Database("database.sqlite");
// Pass schema object when tables are created: export const db = drizzle(sqlite, { schema });
export const db = drizzle(sqlite);
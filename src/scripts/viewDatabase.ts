import { Database } from "sqlite3";

// Path to the SQLite database
const dbPath = "./database.sqlite";

// Connect to the SQLite database
const db = new Database(dbPath, (err) => {
	if (err) {
		console.error("Error connecting to the database:", err.message);
		process.exit(1);
	}
	console.log("Connected to the SQLite database.");
});

// Function to query all tables and display their contents
const viewDatabase = () => {
	db.serialize(() => {
		// Query to get all table names
		db.all(
			"SELECT name FROM sqlite_master WHERE type='table';",
			(err, tables: { name: string }[]) => {
				if (err) {
					console.error("Error fetching table names:", err.message);
					return;
				}

				if (tables.length === 0) {
					console.log("No tables found in the database.");
					return;
				}

				console.log("Tables in the database:");
				tables.forEach((table) => {
					console.log(`- ${table.name}`);

					// Query to get all rows from the table
					db.all(`SELECT * FROM ${table.name};`, (err, rows) => {
						if (err) {
							console.error(
								`Error fetching data from table ${table.name}:`,
								err.message
							);
							return;
						}

						console.log(`Data from table ${table.name}:`);
						console.table(rows);
					});
				});
			}
		);
	});
};

// Run the function
viewDatabase();

// Close the database connection when done
process.on("exit", () => {
	db.close((err) => {
		if (err) {
			console.error("Error closing the database connection:", err.message);
		} else {
			console.log("Database connection closed.");
		}
	});
});

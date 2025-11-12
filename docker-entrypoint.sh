#!/bin/sh
set -e

# Ensure database directory exists
mkdir -p /app/data

# Set database URL for both drizzle-kit and the application
export DATABASE_URL=/app/data/database.sqlite

# Create a temporary drizzle config with the correct path
cat > /app/drizzle-docker.config.ts << 'EOF'
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './dist/db/schema.js',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_URL || '/app/data/database.sqlite',
  },
});
EOF

# Run migrations using drizzle-kit push (creates tables from schema)
npx drizzle-kit push --config=drizzle-docker.config.ts

# Seed the database using compiled JavaScript
node dist/scripts/seedDatabase.js

# Start the application using compiled JavaScript
exec node dist/index.js

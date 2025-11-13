FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy application files
COPY . .

# Create data directory and set permissions
RUN mkdir -p /app/data && \
    addgroup -g 1001 nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD npx tsx -e "\
import Database from 'better-sqlite3';\
import { readFileSync, existsSync } from 'fs';\
const db = new Database(process.env.DATABASE_URL || './database.sqlite');\
['./drizzle/00_slow_gamma_corps.sql','./drizzle/0001_special_vertigo.sql','./drizzle/0002_naive_zuras.sql','./drizzle/0003_add_auth_and_applications.sql'].forEach(f => {\
  if (existsSync(f)) db.exec(readFileSync(f, 'utf-8'));\
});\
db.close();\
console.log('✅ Database initialized');\
" && \
if [ "$SEED_DATABASE" = "true" ]; then npx tsx src/scripts/seedDatabase.ts; fi && \
npx tsx src/index.ts

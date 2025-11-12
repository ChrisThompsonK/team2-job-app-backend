# Use Node.js 20 Alpine for small image size
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies (including tsx for running TypeScript)
COPY package*.json ./
RUN npm ci

# Copy source code, migrations, and configs
COPY src ./src
COPY drizzle ./drizzle
COPY drizzle.config.ts ./drizzle.config.ts
COPY tsconfig.json ./tsconfig.json
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# Create database directory with proper permissions
RUN mkdir -p /app/data && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the application port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["./docker-entrypoint.sh"]

# Production stage - run TypeScript with tsx
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files and install ALL dependencies (including tsx for TypeScript execution)
COPY package*.json ./
RUN npm ci

# Copy source code and configuration files
COPY src ./src
COPY drizzle ./drizzle
COPY drizzle.config.ts ./
COPY tsconfig.json ./

# Create database directory with proper permissions
RUN mkdir -p /app/data && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user for security
USER nodejs

# Expose the application port
EXPOSE 8000

# Health check to monitor container health
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application with initialization script and tsx (TypeScript execution)
CMD npx tsx src/scripts/docker-init.ts && npx tsx src/index.ts

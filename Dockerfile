# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application files
COPY package*.json tsconfig.json drizzle.config.ts ./
COPY drizzle/ ./drizzle/
COPY src/ ./src/

# Create non-root user and set permissions
RUN mkdir -p /app/data && \
    addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose application port
EXPOSE 8000

# Health check using curl
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/ || exit 1

CMD npx tsx src/index.ts
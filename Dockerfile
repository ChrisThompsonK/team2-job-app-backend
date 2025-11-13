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

CMD ["npx", "tsx", "src/index.ts"]

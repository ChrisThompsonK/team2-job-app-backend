# Docker Guide for team2-job-app-backend

## Quick Start

### Build the Docker Image

```bash
docker build -t team2-job-app-backend:latest .
```

### Run the Container

```bash
docker run -d \
  -p 8000:8000 \
  -e SESSION_SECRET="your-secure-secret-min-32-chars" \
  --name team2-backend \
  team2-job-app-backend:latest
```

Access the application at http://localhost:8000

### View Logs

```bash
docker logs -f team2-backend
```

### Stop and Remove Container

```bash
docker stop team2-backend
docker rm team2-backend
```

## Docker Architecture

### Single-Stage Build with TypeScript Runtime

The Dockerfile uses tsx to run TypeScript directly in production:

- **Base Image**: Uses `node:20-alpine` for small footprint
- **TypeScript Runtime**: Compiles TypeScript to JavaScript during the build stage and runs the compiled JavaScript with `node`
- **Database Initialization**: Automatically runs migrations and seeds data on startup
- **Security**: Runs as non-root user (nodejs:1001)
- **Health Checks**: Built-in health monitoring

### Startup Process

When the container starts, it automatically:
1. Creates the database directory
2. Runs Drizzle migrations to create tables
3. Seeds the database with sample data (75 job roles, 5 users)
4. Starts the Express server

### Image Features

- ✅ **Minimal Base Image**: Uses `node:20-alpine` (~795MB total)
- ✅ **Security**: Runs as non-root user (nodejs:1001)
- ✅ **Health Checks**: Built-in health monitoring
- ✅ **Auto-initialization**: Database migrations and seeding on startup
- ✅ **TypeScript Support**: Direct TypeScript execution with tsx

## Environment Variables

### Required Variables

- `SESSION_SECRET`: Secure random string (min 32 characters)
  ```bash
  # Generate with Node.js
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `8000` | Server port |
| `HOST` | `0.0.0.0` | Server host |
| `DATABASE_URL` | `/app/data/database.sqlite` | Database path |
| `SESSION_NAME` | `job_app_session` | Session cookie name |
| `SESSION_MAX_AGE` | `604800000` | Session duration (ms) |

## Data Persistence

### Database Storage

The SQLite database is created inside the container at `/app/data/database.sqlite`.

**Note**: Data is ephemeral by default. To persist data across container restarts, use a Docker volume:

```bash
docker run -d \
  -p 8000:8000 \
  -e SESSION_SECRET="your-secure-secret-min-32-chars" \
  -v job-app-data:/app/data \
  --name team2-backend \
  team2-job-app-backend:latest
```

### Backup Database

```bash
# Copy database from container
docker cp team2-backend:/app/data/database.sqlite ./backup/

# Restore database to container  
docker cp ./backup/database.sqlite team2-backend:/app/data/
docker restart team2-backend
```

## Development vs Production

### Development

Use the local development setup:
```bash
npm install
npm run dev
```

### Production

Use Docker for consistent deployments:
```bash
docker-compose up -d
```

## Image Registry

### Tag and Push to Registry

```bash
# Tag for Docker Hub
docker tag team2-job-app-backend:latest username/team2-job-app-backend:latest
docker tag team2-job-app-backend:latest username/team2-job-app-backend:1.0.0

# Push to Docker Hub
docker push username/team2-job-app-backend:latest
docker push username/team2-job-app-backend:1.0.0

# Tag for GitHub Container Registry (GHCR)
docker tag team2-job-app-backend:latest ghcr.io/username/team2-job-app-backend:latest
docker tag team2-job-app-backend:latest ghcr.io/username/team2-job-app-backend:1.0.0

# Push to GHCR (requires authentication)
docker push ghcr.io/username/team2-job-app-backend:latest
docker push ghcr.io/username/team2-job-app-backend:1.0.0
```

## Health Checks

The container includes a health check that verifies the API is responding:

```bash
# Check container health status
docker inspect --format='{{.State.Health.Status}}' team2-job-app-backend

# View health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' team2-job-app-backend
```

## Troubleshooting

### View Container Logs

```bash
# All logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100
```

### Access Container Shell

```bash
# Docker Compose
docker-compose exec backend sh

# Docker CLI
docker exec -it team2-job-app-backend sh
```

### Check Container Resource Usage

```bash
docker stats team2-job-app-backend
```

### Rebuild Image

```bash
# Force rebuild without cache
docker-compose build --no-cache

# Or with Docker CLI
docker build --no-cache -t team2-job-app-backend:latest .
```

## Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Generate secure SESSION_SECRET** - Use cryptographically random values
3. **Run as non-root user** - Already configured in Dockerfile
4. **Scan for vulnerabilities**:
   ```bash
   docker scan team2-job-app-backend:latest
   ```
5. **Keep base image updated**:
   ```bash
   docker pull node:20-alpine
   docker-compose build
   ```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build and Push Docker Image

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker build -t team2-job-app-backend:${{ github.sha }} .
      
      - name: Tag as latest
        run: docker tag team2-job-app-backend:${{ github.sha }} team2-job-app-backend:latest
      
      - name: Push to registry
        run: |
          echo "${{ secrets.GITHUB_TOKEN }}" | docker login ghcr.io -u ${{ github.actor }} --password-stdin
          docker push team2-job-app-backend:latest
```

## Production Deployment

### Environment Configuration

1. Create `.env.production` with secure values
2. Never use default secrets in production
3. Use secrets management (AWS Secrets Manager, Azure Key Vault, etc.)

### Deployment Checklist

- [ ] Secure `SESSION_SECRET` generated
- [ ] Database volume configured for persistence
- [ ] Health checks enabled
- [ ] Resource limits set (if using orchestration)
- [ ] Logging configured
- [ ] Monitoring enabled
- [ ] Backup strategy in place
- [ ] SSL/TLS configured (reverse proxy)

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

[![Code Quality](https://github.com/ChrisThompsonK/team2-job-app-backend/actions/workflows/code-quality.yml/badge.svg)](https://github.com/ChrisThompsonK/team2-job-app-backend/actions/workflows/code-quality.yml) [![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/) 

# Team 2 Job Roles Backend

A modern Node.js TypeScript REST API for managing job roles with full CRUD operations, built with Express, Drizzle ORM, and SQLite.

## 🚀 Features

### Core Technologies
- **TypeScript**: Full TypeScript support with strict type checking
- **Express.js**: Fast, unopinionated web framework for Node.js
- **Drizzle ORM**: Type-safe database ORM with SQLite
- **CORS Support**: Configured for frontend integration
- **ES Modules**: Modern JavaScript module system
- **tsx**: Fast TypeScript execution for development
- **Biome**: Ultra-fast formatter, linter, and code quality tools
- **Multer**: File upload middleware for handling CV attachments

### Authentication & Security
- **Session-Based Authentication**: Secure session management with express-session
- **Password Hashing**: bcrypt with 12 salt rounds for password security
- **User Roles**: Admin and Applicant role-based access control
- **SQLite Session Store**: Sessions persisted in main database
- **User ID Generation**: Sqids for unique, URL-safe user identifiers
- **Request Validation**: Zod schemas for runtime type validation
- **Secure Cookies**: httpOnly, secure, and sameSite cookie settings
- **Password Requirements**: Enforced strong password policies
- **CRON Jobs**: Automated session cleanup every hour

### Job Role Management
- **Complete CRUD Operations**: Create, Read, Update, Delete job roles
- **Advanced Search & Filtering**: Full-text search on job role names with multi-criteria filtering
- **Filter Options API**: Dynamic retrieval of available capabilities, locations, and bands
- **Advanced Filtering**: Filter by status, capability, location, and band
- **Pagination Support**: Efficient handling of large datasets with configurable page sizes
- **Data Validation**: Comprehensive input validation and error handling
- **RESTful API Design**: Clean, intuitive API endpoints

### Job Application Management
- **CV Upload System**: Secure file upload with support for PDF, DOC, and DOCX formats
- **Binary Storage**: CVs stored as base64-encoded data in SQLite database
- **File Validation**: Automatic validation of file types and size limits (5MB max)
- **Application Tracking**: Applications automatically set to "in progress" status on submission
- **Application Withdrawal**: Users can withdraw their own applications (changes status to "withdrawn")
- **Eligibility Verification**: Validates open positions and job role status before accepting applications
- **CV Download**: Retrieve uploaded CVs for review and processing
- **User Authorization**: Only application owners can withdraw their applications

### Database Features
- **SQLite Database**: Lightweight, serverless database with single file storage
- **Database Migrations**: Version-controlled schema changes with Drizzle
- **Data Seeding**: Sample data including test users for development
- **Type Safety**: Full TypeScript integration with database operations
- **Session Storage**: Sessions stored in main database.sqlite file
- **User Management**: Secure user accounts with authentication

## � Job Role API
```
├── src/
│   ├── config/              # Application configuration
│   │   └── index.ts         # Centralized config with env variables
│   ├── controllers/          # API controllers for business logic
│   │   ├── jobRoleController.ts
│   │   └── jobApplicationController.ts
│   ├── db/                   # Database configuration and schema
│   │   ├── index.ts         # Database connection setup
│   │   └── schema.ts        # Drizzle schema definitions
│   ├── jobs/                # Scheduled CRON jobs
│   │   └── cronJobs.ts      # Session cleanup and maintenance tasks
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # Authentication guards (requireAuth, requireRole)
│   │   ├── session.ts       # Session configuration
│   │   └── upload.ts        # Multer configuration for CV uploads
│   ├── repositories/        # Data access layer
│   │   ├── userRepository.ts        # User CRUD operations
│   │   ├── jobRoleRepository.ts
│   │   └── jobApplicationRepository.ts
│   ├── routes/              # Express route definitions
│   │   ├── index.ts         # Main router
│   │   ├── authRoutes.ts    # Authentication routes
│   │   ├── jobRoleRoutes.ts
│   │   └── jobApplicationRoutes.ts
│   ├── scripts/             # Utility scripts
│   │   └── seedDatabase.ts  # Database seeding with test users
│   ├── types/               # TypeScript type definitions
│   │   └── jobRole.ts
│   ├── utils/               # Utility functions
│   │   ├── password.ts      # Password hashing with bcrypt
│   │   ├── sqids.ts         # User ID generation
│   │   └── validation.ts    # Zod validation schemas
│   ├── __tests__/           # Test files
│   │   ├── auth.integration.test.ts  # Authentication HTTP status code tests
│   │   ├── jobApplication.test.ts
│   │   └── jobRole.test.ts
│   └── index.ts             # Main application entry point
├── drizzle/                 # Database migration files
├── dist/                    # Compiled JavaScript output
├── .env.example             # Environment variables template
├── database.sqlite          # SQLite database file (includes sessions)
├── package.json             # Project configuration
├── tsconfig.json           # TypeScript configuration
├── drizzle.config.ts       # Drizzle ORM configuration
├── vitest.config.ts        # Vitest testing configuration
├── biome.json              # Biome linter and formatter configuration
├── API_DOCUMENTATION.md    # Complete API documentation
└── CRON_JOBS.md            # CRON job documentation
```

## 🛠️ Available Scripts

### Development & Build
- **`npm run dev`**: Run the application in development mode with tsx
- **`npm run build`**: Compile TypeScript to JavaScript
- **`npm start`**: Run the compiled JavaScript application
- **`npm run type-check`**: Type check without emitting files

### Testing (Vitest)
- **`npm test`**: Run tests in watch mode
- **`npm run test:run`**: Run all tests once
- **`npm run test:watch`**: Run tests in watch mode
- **`npm run test:ui`**: Open Vitest UI for interactive testing
- **`npm run test:coverage`**: Run tests with coverage report

#### Integration Tests
- **`npm test -- src/__tests__/auth.integration.test.ts --reporter=verbose`**: Run authentication integration tests with verbose output
- **12 comprehensive tests** covering HTTP status codes for registration and login endpoints

### Code Quality (Biome)
- **`npm run lint`**: Check for linting issues
- **`npm run lint:fix`**: Fix linting issues automatically
- **`npm run format`**: Check code formatting
- **`npm run format:fix`**: Fix formatting issues automatically
- **`npm run check`**: Run both linting and formatting checks
- **`npm run check:fix`**: Fix both linting and formatting issues automatically

### Database Management (Drizzle)
- **`npm run db:generate`**: Generate migration files from schema changes
- **`npm run db:migrate`**: Run database migrations
- **`npm run db:push`**: Push schema changes directly to database
- **`npm run db:studio`**: Launch Drizzle Studio (database GUI)
- **`npm run db:seed`**: Populate database with sample data

## 🔧 Development

### Quick Start
1. **Install Dependencies**: `npm install`
2. **Setup Environment**: Copy `.env.example` to `.env` and configure
   ```bash
   cp .env.example .env
   ```
3. **Setup Database**: `npm run db:push`
4. **Seed Sample Data**: `npm run db:seed`
5. **Start Development**: `npm run dev`
6. **API Available**: `http://localhost:3000/api`

### Environment Configuration

This application uses environment variables for configuration. Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

#### Available Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | `8000` | No |
| `HOST` | Server host address | `localhost` | No |
| `NODE_ENV` | Environment mode (`development`, `production`, `test`) | `development` | No |
| `APP_NAME` | Application name | `team2-job-app-backend` | No |
| `APP_VERSION` | Application version | `1.0.0` | No |
| `DATABASE_URL` | Path to SQLite database file (includes sessions) | `./database.sqlite` | No |
| `DEBUG` | Enable debug mode (`true`/`false`) | `false` | No |
| `SESSION_SECRET` | Session secret key (min 32 chars, generate with crypto) | Random key | Yes (Production) |
| `SESSION_NAME` | Session cookie name | `job_app_session` | No |
| `SESSION_MAX_AGE` | Session max age in milliseconds | `604800000` (7 days) | No |
| `SEED_ADMIN_PASSWORD` | Admin password for database seeding | Default dev password | No |
| `SEED_APPLICANT_PASSWORD` | Applicant password for database seeding | Default dev password | No |

#### Configuration Best Practices

- ✅ **Never commit `.env` files** - They are already in `.gitignore`
- ✅ **Use `.env.example` as a template** - It documents all available variables
- ✅ **Provide sensible defaults** - The app works without a `.env` file for local development
- ✅ **Different configs per environment** - Use different values in dev, test, and production
- ✅ **Platform-specific in production** - Use Heroku, Vercel, or AWS environment variable tools instead of `.env` files

#### Debug Endpoint (Development Only)

When running in development mode, a debug endpoint is available:

```bash
GET http://localhost:3000/debug/config
```

This returns the current configuration (useful for troubleshooting).

### Development Workflow
1. **Development Mode**: Use `npm run dev` for fast development with tsx
2. **Database Changes**: 
   - Update schema in `src/db/schema.ts`
   - Run `npm run db:generate` to create migration
   - Run `npm run db:push` to apply changes
3. **Testing**: Run `npm test` for watch mode or `npm run test:run` for single run
4. **Type Checking**: Run `npm run type-check` to validate TypeScript
5. **Code Quality**: Use `npm run check:fix` to fix linting and formatting
6. **Database GUI**: Use `npm run db:studio` to explore data

### Code Quality Workflow
```bash
# Check and fix all code quality issues
npm run check:fix

# Or run individually
npm run lint:fix    # Fix linting issues
npm run format:fix  # Fix formatting issues
```

## 🐳 Docker Deployment

### Docker Image

This project includes a multi-stage Dockerfile optimized for production deployment.

#### Building the Docker Image

Build the image with version tags:

```bash
# Build with version and latest tags
docker build -t team2-job-app-backend:1.0.0 -t team2-job-app-backend:latest .

# Build with custom tag
docker build -t team2-job-app-backend:my-tag .
```

#### What the Build Does

1. **Stage 1: Builder**
   - Uses Node.js 20 Alpine for minimal size
   - Installs all dependencies (including dev dependencies)
   - Compiles TypeScript to JavaScript
   - Outputs compiled code to `dist/` directory

2. **Stage 2: Production**
   - Creates clean production image
   - Installs only production dependencies
   - Copies compiled code from builder stage
   - Copies database migration files
   - Creates non-root user for security
   - Sets up health checks

#### Running the Docker Container

```bash
# Run the container
docker run -p 3000:3000 team2-job-app-backend:latest

# Run with environment variables
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e SESSION_SECRET=your-secret-key \
  team2-job-app-backend:latest

# Run with a volume for persistent database
docker run -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -e DATABASE_URL=/app/data/database.sqlite \
  team2-job-app-backend:latest
```

#### Docker Image Details

- **Base Image**: `node:20-alpine`
- **Image Size**: ~505MB
- **Exposed Port**: 3000
- **Working Directory**: `/app`
- **Health Check**: HTTP GET to `/health` every 30s
- **User**: Non-root user `nodejs` (UID 1001, GID 1001)

#### Listing Built Images

```bash
# List all team2-job-app-backend images
docker images team2-job-app-backend

# Expected output:
# REPOSITORY              TAG       IMAGE ID       CREATED          SIZE
# team2-job-app-backend   1.0.0     2102c05d778c   X minutes ago    505MB
# team2-job-app-backend   latest    2102c05d778c   X minutes ago    505MB
```

#### Docker Best Practices

- ✅ **Multi-stage builds** - Reduces final image size by separating build and runtime
- ✅ **Alpine Linux** - Minimal base image for smaller size
- ✅ **Non-root user** - Improved security by running as `nodejs` user
- ✅ **Layer caching** - Dependencies installed before copying source code
- ✅ **Production dependencies only** - Runtime image excludes dev dependencies
- ✅ **Health checks** - Automatic container health monitoring

## 🧪 Testing

### Running Tests

#### All Tests
```bash
npm test           # Watch mode
npm run test:run   # Single run
```

#### Integration Tests (Authentication)
```bash
# Run with verbose output
npm test -- src/__tests__/auth.integration.test.ts --reporter=verbose

# Run in watch mode
npm test -- src/__tests__/auth.integration.test.ts
```

### Test Coverage
```bash
npm run test:coverage
```

### Test UI
```bash
npm run test:ui
```

### Integration Test Suite

The authentication integration test suite (`src/__tests__/auth.integration.test.ts`) provides comprehensive testing of HTTP status codes for user authentication endpoints:

#### Test Coverage
- **12 comprehensive tests** - All passing ✅
- **Real API calls** - Uses fetch to test actual HTTP requests
- **HTTP status codes** - Validates correct status codes (201, 200, 400, 401, 409)
- **Complete workflows** - Tests registration → login flows
- **Edge cases** - Handles null values, empty bodies, whitespace

#### Tests Included

**Registration Tests (5 tests)**
- `201 Created` - Successful user registration
- `409 Conflict` - Duplicate email attempts
- `400 Bad Request` - Invalid email, weak password, missing fields

**Login Tests (6 tests)**
- `200 OK` - Successful login with valid credentials
- `401 Unauthorized` - Invalid credentials or non-existent user
- `400 Bad Request` - Missing or invalid fields

**Workflow Tests (1 test)**
- Complete registration → login flow

#### Running Integration Tests

```bash
# Run with verbose output
npm test -- src/__tests__/auth.integration.test.ts --reporter=verbose

# Run in watch mode
npm test -- src/__tests__/auth.integration.test.ts

# Run with coverage
npm run test:coverage
```

#### Expected Results
```
✅ Test Files: 1 passed
✅ Tests: 12 passed
⏱️ Duration: varies depending on test suite size
```

### API Testing
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Get all job roles
curl http://localhost:3000/api/job-roles

# Search job roles by name
curl "http://localhost:3000/api/job-roles/search?search=engineer"

# Filter by status (Open positions only)
curl "http://localhost:3000/api/job-roles/search?status=Open"

# Search with status filter
curl "http://localhost:3000/api/job-roles/search?search=developer&status=Open"

# Search with multiple filters
curl "http://localhost:3000/api/job-roles/search?search=senior&capability=Engineering&location=Dublin,%20Ireland&band=Senior&status=Open"

# Get filter options for search form
curl http://localhost:3000/api/job-roles/capabilities
curl http://localhost:3000/api/job-roles/locations
curl http://localhost:3000/api/job-roles/bands

# Get specific job role
curl http://localhost:3000/api/job-roles/1

# Create a new job role
curl -X POST http://localhost:3000/api/job-roles \
  -H "Content-Type: application/json" \
  -d '{"jobRoleName":"Test Job","description":"Test Description",...}'

# Update an existing job role
curl -X PUT http://localhost:3000/api/job-roles/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"closed"}'
```

## 🏗️ Tech Stack

### Backend Framework
- **Node.js**: Runtime environment
- **TypeScript**: Type-safe JavaScript
- **Express.js**: Fast, unopinionated web framework
- **CORS**: Cross-Origin Resource Sharing support
- **Multer**: Middleware for handling multipart/form-data (file uploads)

### Authentication & Security
- **express-session**: Session management middleware
- **connect-sqlite3**: SQLite session store for express-session
- **bcrypt**: Password hashing (12 salt rounds)
- **Sqids**: Unique, URL-safe user ID generation
- **Zod**: Runtime type validation and schema validation
- **node-cron**: Scheduled tasks (session cleanup)

### Database
- **SQLite**: Lightweight, serverless database (single file storage)
- **Drizzle ORM**: Type-safe database ORM
- **better-sqlite3**: Fast SQLite driver for Node.js

### Development Tools
- **tsx**: TypeScript execution engine
- **Vitest**: Next generation testing framework
- **Biome**: Fast formatter, linter, and import organizer
- **ES Modules**: Modern module system

### API Features
- **RESTful Design**: Clean, intuitive API endpoints
- **JSON API**: Standard JSON request/response format
- **Error Handling**: Comprehensive error responses
- **Input Validation**: Request validation and sanitization

## � Job Application API

This API manages job roles with all required properties for a job portal:

### Job Role Properties
- **Job Role Name**: Position title
- **Description**: Job description
- **Responsibilities**: Key responsibilities
- **Job Spec Link**: SharePoint link to detailed job specification
- **Location**: Job location
- **Capability**: Department/capability area
- **Band**: Job level (Junior, Mid, Senior, etc.)
- **Closing Date**: Application deadline
- **Status**: Current status (active, closed, draft)
- **Number of Open Positions**: Available positions

### Available Endpoints

#### Authentication Endpoints
- `POST /api/auth/register` - Register new user account
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/logout` - Logout and destroy session (requires authentication)
- `GET /api/auth/me` - Get current authenticated user (requires authentication)

#### Job Role Endpoints
- `GET /api/job-roles` - Get all job roles (with filtering & pagination)
- `GET /api/job-roles/search` - Search and filter job roles with advanced criteria
- `GET /api/job-roles/capabilities` - Get list of distinct capabilities
- `GET /api/job-roles/locations` - Get list of distinct locations
- `GET /api/job-roles/bands` - Get list of distinct bands
- `GET /api/job-roles/:id` - Get specific job role
- `POST /api/job-roles` - Create new job role
- `PUT /api/job-roles/:id` - Update job role
- `DELETE /api/job-roles/:id` - Delete job role

#### System Endpoints
- `GET /api/health` - API health check

### Sample Data
The database comes pre-seeded with:

**Test Users** (5 accounts):
- **Admin**: `admin@example.com` (role: Admin)
- **Applicants**: 
  - `john.doe@example.com` (role: Applicant)
  - `jane.smith@example.com` (role: Applicant)
  - `bob.wilson@example.com` (role: Applicant)
  - `alice.johnson@example.com` (role: Applicant)

> **Note**: Default passwords are shown in the seed script output. For production, set `SEED_ADMIN_PASSWORD` and `SEED_APPLICANT_PASSWORD` environment variables.

**Sample Job Roles** (75 diverse roles):
- Senior Software Engineer (Engineering, London)
- Product Manager (Product, Manchester)  
- UX Designer (Design, Birmingham)
- Data Analyst (Analytics, Leeds)
- DevOps Engineer (Engineering, Remote)
- And 70 more roles across various capabilities, locations, and bands

### Job Applications API

The application system allows users to apply for job roles with CV upload:

#### Application Requirements
- **Eligibility Check**: Only roles with status "active" and `numberOfOpenPositions > 0` accept applications
- **CV Required**: All applications must include a CV file (PDF, DOC, or DOCX)
- **File Size Limit**: Maximum CV file size is 5MB
- **Status**: Applications are automatically set to "in progress" upon submission
- **Editable Applications**: Applications can be updated (cover letter/CV) while in "pending", "in progress", or "under_review" status

#### Application Endpoints
- `POST /api/applications` - Submit job application with CV (multipart/form-data)
- `GET /api/applications` - Get all applications (with filtering)
- `GET /api/applications/:id` - Get specific application
- `GET /api/applications/:id/cv` - Download application CV
- `GET /api/applications/user/:email` - Get all applications by user email (URL-encoded)
- `GET /api/applications/job-role/:jobRoleId` - Get applications for specific job role
- `PUT /api/applications/:id` - Update application cover letter and/or CV (multipart/form-data)
- `DELETE /api/applications/:id` - Withdraw application (requires X-User-Email header, changes status to "withdrawn")

#### Applying for a Job (multipart/form-data)
```bash
curl -X POST http://localhost:3000/api/applications \
  -F "cv=@/path/to/resume.pdf" \
  -F "jobRoleId=1" \
  -F "applicantName=John Doe" \
  -F "applicantEmail=john@example.com" \
  -F "coverLetter=I am interested in this position..."
```

#### Update an Application (multipart/form-data)
```bash
# Update cover letter only
curl -X PUT http://localhost:3000/api/applications/1 \
  -F "coverLetter=Updated cover letter text..."

# Update CV only
curl -X PUT http://localhost:3000/api/applications/1 \
  -F "cv=@/path/to/updated_resume.pdf"

# Update both
curl -X PUT http://localhost:3000/api/applications/1 \
  -F "coverLetter=Updated text..." \
  -F "cv=@/path/to/new_cv.pdf"
```

#### Get User's Applications
```bash
# Note: @ symbol must be URL-encoded as %40
curl "http://localhost:3000/api/applications/user/john.doe%40example.com"
```

#### Download CV
```bash
curl http://localhost:3000/api/applications/1/cv --output cv.pdf
```

#### Withdraw Application
```bash
# User must provide their email in the X-User-Email header
# Only the application owner can withdraw their own application
# Only applications with status 'pending', 'under_review', or 'in progress' can be withdrawn
curl -X DELETE http://localhost:3000/api/applications/42 \
  -H "X-User-Email: john.doe@example.com"
```

**Withdrawable Statuses:**
- `pending`
- `under_review`
- `in progress`

**Non-Withdrawable Statuses:**
- `withdrawn` (already withdrawn)
- `accepted` (application has been accepted)
- `rejected` (application has been rejected)

**Authentication via Header:**
- The `X-User-Email` header must contain the authenticated user's email address
- The frontend server should set this header after user authentication
- The email in the header must match the `applicantEmail` of the application

**Important Notes:**
- The application record remains in the database, only the status changes to "withdrawn"
- All other application data (name, email, CV, cover letter) remains unchanged
- Only the application owner (matching email) can withdraw their own application

📖 **Complete API Documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint documentation with examples.

## �📝 Configuration

The project uses modern TypeScript configuration with:
- ES2022 target and lib
- ESNext modules with bundler resolution
- Strict type checking enabled
- Source maps and declarations generated
- Comprehensive compiler options for better code quality

### Vitest Configuration
- **Environment**: Node.js testing environment
- **Globals**: Enabled (describe, it, expect available globally)
- **Coverage**: V8 provider with HTML/JSON/text reports
- **File Patterns**: Tests in `**/*.{test,spec}.{js,ts,tsx}` files
- **UI**: Interactive testing interface available

### Biome Configuration
- **Linting**: Recommended rules with TypeScript support
- **Formatting**: Tab indentation (2 spaces), 80-character line width
- **Code Style**: Double quotes, trailing commas (ES5), semicolons
- **File Coverage**: All files in `src/` directory
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

### Job Role Management
- **Complete CRUD Operations**: Create, Read, Update, Delete job roles
- **Advanced Filtering**: Filter by status, capability, location, and band
- **Pagination Support**: Efficient handling of large datasets
- **Data Validation**: Comprehensive input validation and error handling
- **RESTful API Design**: Clean, intuitive API endpoints

### Job Application Management
- **CV Upload System**: Secure file upload with support for PDF, DOC, and DOCX formats
- **Binary Storage**: CVs stored as base64-encoded data in SQLite database
- **File Validation**: Automatic validation of file types and size limits (5MB max)
- **Application Tracking**: Applications automatically set to "in progress" status on submission
- **Eligibility Verification**: Validates open positions and job role status before accepting applications
- **CV Download**: Retrieve uploaded CVs for review and processing

### Database Features
- **SQLite Database**: Lightweight, serverless database
- **Database Migrations**: Version-controlled schema changes
- **Data Seeding**: Sample data for development and testing
- **Type Safety**: Full TypeScript integration with database operations

### User Authentication & Authorization
- **User Management**: Complete user registration and login system
- **Password Security**: bcrypt password hashing (10 salt rounds, industry-standard secure hashing)
- **User Types**: Support for two user roles - `applicant` and `admin`
- **ID Security**: User IDs encoded with Sqids (unique, reversible, URL-safe, minimum 8 characters)
- **Email Validation**: RFC 5322 compliant email validation (rejects special characters, validates TLDs, checks length limits)
- **Password Strength**: Enforced password requirements (8+ chars, uppercase, lowercase, number, special char)
- **Last Login Tracking**: Automatic tracking of user login timestamps
- **Account Management**: User activation/deactivation support

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
│   ├── middleware/          # Express middleware
│   │   └── upload.ts        # Multer configuration for CV uploads
│   ├── repositories/        # Data access layer
│   │   ├── jobRoleRepository.ts
│   │   ├── jobApplicationRepository.ts
│   │   └── userRepository.ts           # User data access
│   ├── routes/              # Express route definitions
│   │   ├── index.ts         # Main router
│   │   ├── jobRoleRoutes.ts
│   │   ├── jobApplicationRoutes.ts
│   │   └── userRoutes.ts               # User authentication routes
│   ├── scripts/             # Utility scripts
│   │   └── seedDatabase.ts  # Database seeding script
│   ├── types/               # TypeScript type definitions
│   │   ├── jobRole.ts
│   │   └── user.ts                     # User type definitions
│   ├── utils/               # Utility functions
│   │   ├── auth.ts                     # Password hashing, ID encoding, validation
│   │   └── pagination.ts
│   ├── __tests__/           # Test files
│   │   ├── jobRole.test.ts
│   │   └── user.test.ts                # User authentication tests
│   └── index.ts             # Main application entry point
├── drizzle/                 # Database migration files
├── dist/                    # Compiled JavaScript output
├── .env.example             # Environment variables template
├── database.sqlite          # SQLite database file
├── package.json             # Project configuration
├── tsconfig.json           # TypeScript configuration
├── drizzle.config.ts       # Drizzle ORM configuration
├── vitest.config.ts        # Vitest testing configuration
├── biome.json              # Biome linter and formatter configuration
└── API_DOCUMENTATION.md    # Complete API documentation
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
| `PORT` | Server port number | `3000` | No |
| `HOST` | Server host address | `localhost` | No |
| `NODE_ENV` | Environment mode (`development`, `production`, `test`) | `development` | No |
| `APP_NAME` | Application name | `team2-job-app-backend` | No |
| `APP_VERSION` | Application version | `1.0.0` | No |
| `DATABASE_URL` | Path to SQLite database file | `./database.sqlite` | No |
| `DEBUG` | Enable debug mode (`true`/`false`) | `false` | No |

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

### API Testing
```bash
# Test health endpoint
curl http://localhost:3000/api/health

# Get all job roles
curl http://localhost:3000/api/job-roles

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

### Database
- **SQLite**: Lightweight, serverless database
- **Drizzle ORM**: Type-safe database ORM
- **better-sqlite3**: Fast SQLite driver for Node.js

### Security & Authentication
- **bcrypt**: Industry-standard password hashing algorithm (10 salt rounds)
- **Sqids**: Unique, reversible ID encoding (minimum 8 characters, URL-safe, profanity-free)
- **Email Validation**: RFC 5322 compliant email format validation with comprehensive checks
- **Password Strength Validation**: Enforced security requirements

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
- `GET /api/job-roles` - Get all job roles (with filtering & pagination)
- `GET /api/job-roles/:id` - Get specific job role
- `POST /api/job-roles` - Create new job role
- `PUT /api/job-roles/:id` - Update job role
- `GET /api/health` - API health check

### Sample Job Roles
The database comes pre-seeded with sample jobs including:
- Senior Software Engineer (Engineering, London)
- Product Manager (Product, Manchester)  
- UX Designer (Design, Birmingham)
- Data Analyst (Analytics, Leeds)
- DevOps Engineer (Engineering, Remote)

### Job Applications API

The application system allows users to apply for job roles with CV upload:

#### Application Requirements
- **Eligibility Check**: Only roles with status "active" and `numberOfOpenPositions > 0` accept applications
- **CV Required**: All applications must include a CV file (PDF, DOC, or DOCX)
- **File Size Limit**: Maximum CV file size is 5MB
- **Status**: Applications are automatically set to "in progress" upon submission

#### Application Endpoints
- `POST /api/applications` - Submit job application with CV (multipart/form-data)
- `GET /api/applications` - Get all applications (with filtering)
- `GET /api/applications/:id` - Get specific application
- `GET /api/applications/:id/cv` - Download application CV
- `PUT /api/applications/:id` - Update application status
- `DELETE /api/applications/:id` - Delete application
- `GET /api/applications/job-role/:jobRoleId` - Get applications for specific job role

#### Applying for a Job (multipart/form-data)
```bash
curl -X POST http://localhost:3000/api/applications \
  -F "cv=@/path/to/resume.pdf" \
  -F "jobRoleId=1" \
  -F "applicantName=John Doe" \
  -F "applicantEmail=john@example.com" \
  -F "coverLetter=I am interested in this position..."
```

#### Download CV
```bash
curl http://localhost:3000/api/applications/1/cv --output cv.pdf
```

### User Authentication API

The authentication system provides secure user registration and login with support for two user types:

#### User Types
- **Applicant**: Regular users who can apply for jobs
- **Admin**: Administrative users with elevated privileges

#### User Properties
- **Username**: Email address (unique, validated)
- **Password**: Securely hashed with Argon2id
- **User Type**: Role-based access (applicant/admin)
- **Forename & Surname**: User's name
- **Is Active**: Account status (active/inactive)
- **Created At**: Account creation timestamp
- **Updated At**: Last update timestamp
- **Last Login**: Last successful login timestamp

#### Security Features
- **Password Hashing**: bcrypt algorithm with 10 salt rounds for maximum security
- **Password Requirements**: Minimum 8 characters, uppercase, lowercase, number, special character
- **Email Validation**: RFC 5322 compliant format validation with:
  - Valid character restrictions (alphanumeric, dots, hyphens, underscores, plus signs)
  - No consecutive dots allowed
  - Local part max 64 characters, domain max 253 characters
  - Valid TLD requirements (2-63 letters only)
  - Rejects special characters like `!<>:"|{}_*()&^%$£` in domain
- **ID Encoding**: User IDs encoded with Sqids (reversible, unique, URL-safe, minimum 8 characters)
- **Duplicate Prevention**: Unique email constraint prevents duplicate accounts
- **ID Protection**: Real numeric IDs never exposed in API responses, only encoded Sqids

#### Authentication Endpoints
- `POST /api/users/register` - Register new user account
- `POST /api/users/login` - Authenticate user and update last login
- `GET /api/users/:id` - Get user by ID (returns safe user data without password)
- `GET /api/users` - Get all users (admin only - requires auth middleware)

#### Register a New User
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe@example.com",
    "password": "SecurePass123!",
    "forename": "John",
    "surname": "Doe",
    "userType": "applicant"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john.doe@example.com",
    "password": "SecurePass123!"
  }'
```

#### Response Example (Safe User Data)
```json
{
  "id": "gEUxq0mJ",
  "username": "john.doe@example.com",
  "forename": "John",
  "surname": "Doe",
  "userType": "applicant",
  "isActive": true,
  "createdAt": "2025-10-15T12:00:00.000Z",
  "lastLogin": "2025-10-15T14:30:00.000Z"
}
```

**Note**: The `id` field is a Sqids-encoded string (e.g., `"gEUxq0mJ"`) of the real numeric user ID. This provides security by:
- Creating unique, URL-safe identifiers for each user
- Preventing enumeration attacks and ID guessing
- Hiding the actual number of users in the system
- Being reversible for efficient database lookups (server-side only)

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
[![Code Quality](https://github.com/ChrisThompsonK/team2-job-app-backend/actions/workflows/code-quality.yml/badge.svg)](https://github.com/ChrisThompsonK/team2-job-app-backend/actions/workflows/code-quality.yml) [![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/) 

# Team 2 Job Roles Backend

A modern Node.js TypeScript REST API for managing job roles with full CRUD operations, built with Express, Drizzle ORM, and SQLite.

## 🚀 Features

### Core Technologies
- **TypeScript**: Full TypeScript support with strict type checking
- **Express.js**: Fast, unopinionated web framework for Node.js
- **Drizzle ORM**: Type-safe database ORM with SQLite
- **ES Modules**: Modern JavaScript module system
- **tsx**: Fast TypeScript execution for development
- **Biome**: Ultra-fast formatter, linter, and code quality tools

### Job Role Management
- **Complete CRUD Operations**: Create, Read, Update, Delete job roles
- **Advanced Filtering**: Filter by status, capability, location, and band
- **Pagination Support**: Efficient handling of large datasets
- **Data Validation**: Comprehensive input validation and error handling
- **RESTful API Design**: Clean, intuitive API endpoints

### Database Features
- **SQLite Database**: Lightweight, serverless database
- **Database Migrations**: Version-controlled schema changes
- **Data Seeding**: Sample data for development and testing
- **Type Safety**: Full TypeScript integration with database operations

## � Job Role API
```
├── src/
│   ├── controllers/          # API controllers for business logic
│   │   └── jobRoleController.ts
│   ├── db/                   # Database configuration and schema
│   │   ├── index.ts         # Database connection setup
│   │   └── schema.ts        # Drizzle schema definitions
│   ├── routes/              # Express route definitions
│   │   ├── index.ts         # Main router
│   │   └── jobRoleRoutes.ts
│   ├── scripts/             # Utility scripts
│   │   └── seedDatabase.ts  # Database seeding script
│   ├── types/               # TypeScript type definitions
│   │   └── jobRole.ts
│   └── index.ts             # Main application entry point
├── drizzle/                 # Database migration files
├── dist/                    # Compiled JavaScript output
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
2. **Setup Database**: `npm run db:push`
3. **Seed Sample Data**: `npm run db:seed`
4. **Start Development**: `npm run dev`
5. **API Available**: `http://localhost:3000/api`

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
curl http://localhost:3000/api/jobs

# Get active jobs only
curl http://localhost:3000/api/jobs/active

# Create a new job role
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{"jobRoleName":"Test Job","description":"Test Description",...}'
```

## 🏗️ Tech Stack

### Backend Framework
- **Node.js**: Runtime environment
- **TypeScript**: Type-safe JavaScript
- **Express.js**: Fast, unopinionated web framework

### Database
- **SQLite**: Lightweight, serverless database
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
- `GET /api/jobs` - Get all job roles (with filtering & pagination)
- `GET /api/jobs/active` - Get only active job roles
- `GET /api/jobs/:id` - Get specific job role
- `POST /api/jobs` - Create new job role
- `PUT /api/jobs/:id` - Update job role
- `DELETE /api/jobs/:id` - Delete job role
- `GET /api/health` - API health check

### Sample Job Roles
The database comes pre-seeded with sample jobs including:
- Senior Software Engineer (Engineering, London)
- Product Manager (Product, Manchester)  
- UX Designer (Design, Birmingham)
- Data Analyst (Analytics, Leeds)
- DevOps Engineer (Engineering, Remote)

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
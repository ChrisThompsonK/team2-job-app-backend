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

### User Authentication & Management
- **User Registration**: Register new users with encrypted passwords (bcrypt)
- **User Login**: Authenticate users with username and password
- **Password Security**: Bcrypt encryption with 10 salt rounds
- **Username Uniqueness**: No duplicate usernames allowed
- **Automatic Timestamps**: CreatedAt and UpdatedAt fields auto-generated
- **Default User Role**: All new users default to "Applicant" role
- **User Management**: Admin features for viewing all users

### Future Enhancements
> **Note**: JWT token-based authentication and role-based authorization will be added in future sprints.

## 📦 Job Role API
```
├── src/
│   ├── config/              # Application configuration
│   │   └── index.ts         # Centralized config with env variables
│   ├── controllers/          # API controllers for business logic
│   │   ├── jobRoleController.ts
│   │   ├── jobApplicationController.ts
│   │   └── userController.ts
│   ├── db/                   # Database configuration and schema
│   │   ├── index.ts         # Database connection setup
│   │   └── schema.ts        # Drizzle schema definitions
│   ├── middleware/          # Express middleware
│   │   └── upload.ts        # Multer configuration for CV uploads
│   ├── repositories/        # Data access layer
│   │   ├── jobRoleRepository.ts
│   │   ├── jobApplicationRepository.ts
│   │   └── userRepository.ts
│   ├── routes/              # Express route definitions
│   │   ├── index.ts         # Main router
│   │   ├── jobRoleRoutes.ts
│   │   ├── jobApplicationRoutes.ts
│   │   └── userRoutes.ts
│   ├── scripts/             # Utility scripts
│   │   └── seedDatabase.ts  # Database seeding script
│   ├── types/               # TypeScript type definitions
│   │   ├── jobRole.ts
│   │   └── user.ts
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

- **File Coverage**: All files in `src/` directory

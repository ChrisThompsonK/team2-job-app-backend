[![Code Quality](https://github.com/ChrisThompsonK/team2-job-app-backend/actions/workflows/code-quality.yml/badge.svg)](https://github.com/ChrisThompsonK/team2-job-app-backend/actions/workflows/code-quality.yml) [![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/) 

# Team 2 Job App Backend

A modern Node.js TypeScript backend application with ES modules support.

## 🚀 Features

- **TypeScript**: Full TypeScript support with strict type checking
- **ES Modules**: Modern JavaScript module system
- **tsx**: Fast TypeScript execution for development
- **Modern Node.js**: Latest JavaScript features (ES2022)
- **Biome**: Ultra-fast formatter, linter, and code quality tools
- **Strict Configuration**: Comprehensive TypeScript compiler options

## 📦 Project Structure
```
├── src/
│   └── index.ts          # Main application entry point
├── dist/                 # Compiled JavaScript output
├── package.json          # Project configuration
├── tsconfig.json         # TypeScript configuration
├── vitest.config.ts      # Vitest testing configuration
├── biome.json           # Biome linter and formatter configuration
└── .gitignore           # Git ignore rules
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

## 🔧 Development

1. **Development Mode**: Use `npm run dev` for fast development with tsx
2. **Testing**: Run `npm test` for watch mode or `npm run test:run` for single run
3. **Type Checking**: Run `npm run type-check` to validate TypeScript without compilation
4. **Code Quality**: Use `npm run check:fix` to automatically fix linting and formatting issues
5. **Production Build**: Use `npm run build` to compile for production

### Code Quality Workflow
```bash
# Check and fix all code quality issues
npm run check:fix

# Or run individually
npm run lint:fix    # Fix linting issues
npm run format:fix  # Fix formatting issues
```

## 🏗️ Tech Stack

- **Node.js**: Runtime environment
- **TypeScript**: Type-safe JavaScript
- **Express**: Fast web framework for Node.js
- **Vitest**: Next generation testing framework
- **tsx**: TypeScript execution engine
- **ES Modules**: Modern module system
- **Biome**: Fast formatter, linter, and import organizer

## 📝 Configuration

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
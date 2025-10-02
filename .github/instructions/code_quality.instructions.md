---
applyTo: '**'
---

# Code Quality Instructions

## Overview
These are the coding guidelines and quality standards that must be followed when generating code, answering questions, or reviewing changes in this project.

## Pre-Commit Quality Checks

### Biome Validation Required
Before considering any task complete and ready to commit, you MUST run biome checks to ensure code quality and consistency:

1. **Format Check**: Run `npm run format:check` or `npx biome format --check .` to verify code formatting
2. **Lint Check**: Run `npm run lint` or `npx biome lint .` to check for linting issues
3. **Fix Issues**: If any issues are found, run `npm run format` or `npx biome format --write .` and `npx biome lint --apply .` to automatically fix them
4. **Verify Clean State**: Re-run the checks to ensure all issues are resolved

### Task Completion Criteria
A task is only considered ready to commit when:
- All biome format checks pass without errors
- All biome lint checks pass without errors
- Code follows the project's established patterns and conventions
- Any auto-fixable issues have been resolved

### Implementation Workflow
1. Write/modify code according to requirements
2. Run biome format and lint checks
3. Fix any identified issues
4. Verify all checks pass
5. Only then consider the task complete

This ensures consistent code quality and prevents formatting/linting issues from being committed to the repository.
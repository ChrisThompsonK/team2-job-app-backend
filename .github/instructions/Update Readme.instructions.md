---
applyTo: '**'
---

# README Update Instructions

## Overview
These instructions ensure that the project's README.md file is kept up-to-date with any changes made to the project structure, dependencies, features, or configuration.

## Mandatory README Updates

### When to Update the README
The README.md file MUST be updated after ANY of the following changes:

1. **New Dependencies**: Adding or removing npm packages
2. **New Features**: Adding new functionality or capabilities
3. **Project Structure Changes**: Adding, removing, or reorganizing directories/files
4. **Configuration Changes**: Updates to TypeScript, Biome, Vitest, or other tool configurations
5. **New Scripts**: Adding or modifying npm scripts in package.json
6. **Technology Stack Changes**: Adding, removing, or upgrading major technologies
7. **Build Process Changes**: Modifications to build, deployment, or development workflows
8. **Environment or Setup Changes**: Changes that affect how developers set up or run the project

### Required README Sections to Update

When making changes, ensure these sections are updated as needed:

#### 🚀 Features Section
- Add new capabilities, libraries, or tools
- Update descriptions of existing features
- Include version information for major dependencies

#### 📦 Project Structure Section
- Reflect any new directories or important files
- Update the file tree representation
- Document purpose of new directories

#### 🛠️ Available Scripts Section
- Add new npm scripts with descriptions
- Update existing script descriptions if functionality changes
- Group scripts logically (Development, Testing, Code Quality, etc.)

#### 🔧 Development Section
- Update development workflow instructions
- Add setup steps for new tools or dependencies
- Include any new development commands or processes

#### 🏗️ Tech Stack Section
- Add new technologies, libraries, or frameworks
- Update version information for major changes
- Remove deprecated or unused technologies

#### 📝 Configuration Section
- Document new configuration files or significant changes
- Update tool-specific configuration details
- Include any new development environment requirements

### Update Process Workflow

1. **Before Task Completion**: Always check if changes affect the README
2. **Identify Impact**: Determine which sections need updates based on changes made
3. **Update Content**: Modify relevant sections with accurate, current information
4. **Verify Completeness**: Ensure all new features, dependencies, or changes are documented
5. **Test Instructions**: Verify that setup and development instructions are still accurate

### Quality Standards for README Updates

- **Accuracy**: All information must be current and correct
- **Completeness**: Don't leave out important details that affect usage
- **Clarity**: Use clear, concise language that's easy to understand
- **Consistency**: Maintain the existing format and style of the README
- **Usefulness**: Include practical information that helps developers use the project

### Examples of Changes Requiring README Updates

#### Adding a New Library (e.g., daisyUI)
- Update "Features" to mention UI component library
- Add to "Tech Stack" section
- Update project structure if new directories are created
- Add any new build or development commands
- Update development workflow if UI development process changes

#### Adding New npm Scripts
- Add script to "Available Scripts" section with description
- Update development workflow if it affects the development process
- Group scripts appropriately (Development, Testing, etc.)

#### Configuration File Changes
- Update "Configuration" section with new settings
- Document any new environment variables or setup requirements
- Update development setup instructions if needed

## Task Completion Criteria

A task is only considered complete when:
1. All code changes have been implemented successfully
2. All quality checks (linting, formatting, tests) pass
3. **The README.md has been updated to reflect all changes made**
4. The updated README accurately represents the current state of the project

## Failure to Update README

If the README is not updated after project changes:
- The task is considered incomplete
- Documentation debt accumulates, making the project harder to understand
- New developers may struggle with outdated setup instructions
- The project's professional appearance and maintainability suffer

**Remember: Documentation is as important as the code itself. Keep the README current with every change.**

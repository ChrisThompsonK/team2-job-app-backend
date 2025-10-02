---
applyTo: '**'
---

# Dependency Management Instructions

## Overview
These instructions ensure proper dependency management and troubleshooting when issues arise during development or when commands fail to execute properly.

## Dependency Troubleshooting Workflow

### When Commands Fail or Dependencies Are Missing
If any npm scripts fail, modules are not found, or dependency-related errors occur, follow this systematic approach:

1. **Clean Install Dependencies**
   ```bash
   # Remove existing node_modules and package-lock.json
   rm -rf node_modules package-lock.json
   
   # Fresh install of all dependencies
   npm install
   ```

2. **Update Dependencies to Latest Versions**
   ```bash
   # Check for outdated packages
   npm outdated
   
   # Update all dependencies to their latest versions
   npm update
   
   # For major version updates, use:
   npx npm-check-updates -u
   npm install
   ```

3. **Verify Installation**
   ```bash
   # Check that all dependencies are properly installed
   npm ls
   
   # Run a basic health check
   npm run type-check
   ```

### Pre-Task Dependency Validation
Before starting any development task, ensure dependencies are properly set up:

1. **Check Node.js and npm versions**
   ```bash
   node --version
   npm --version
   ```

2. **Verify package.json integrity**
   ```bash
   npm install --dry-run
   ```

3. **Run dependency audit**
   ```bash
   npm audit
   npm audit fix
   ```

### Common Dependency Issues and Solutions

#### Module Not Found Errors
- **Symptom**: `Cannot find module 'xyz'` or `Module not found`
- **Solution**: 
  ```bash
  npm install
  # If specific package: npm install <package-name>
  ```

#### Version Conflicts
- **Symptom**: Peer dependency warnings or version conflicts
- **Solution**:
  ```bash
  npm install --legacy-peer-deps
  # Or force resolution: npm install --force
  ```

#### TypeScript Declaration Issues
- **Symptom**: TypeScript errors about missing type declarations
- **Solution**:
  ```bash
  npm install @types/<package-name> --save-dev
  ```

#### Cache Issues
- **Symptom**: Persistent install failures or corrupted packages
- **Solution**:
  ```bash
  npm cache clean --force
  rm -rf node_modules package-lock.json
  npm install
  ```

### Development Environment Setup Checklist

When setting up or troubleshooting the development environment:

- [ ] Node.js version is compatible (check `.nvmrc` if exists)
- [ ] All dependencies installed: `npm install`
- [ ] No security vulnerabilities: `npm audit`
- [ ] TypeScript compilation works: `npm run type-check`
- [ ] Linting passes: `npm run lint`
- [ ] Tests can run: `npm run test`
- [ ] Build process works: `npm run build`

### Dependency Update Strategy

#### Regular Maintenance
- **Weekly**: Run `npm outdated` to check for updates
- **Monthly**: Run `npm update` for minor/patch updates
- **Quarterly**: Consider major version updates with `npx npm-check-updates`

#### Before Major Changes
1. Create a backup branch
2. Update dependencies
3. Run full test suite
4. Verify all scripts work
5. Test application functionality

### Emergency Dependency Reset
If the project becomes completely broken due to dependency issues:

```bash
# Nuclear option - complete reset
rm -rf node_modules package-lock.json
git checkout package.json package-lock.json  # Reset to last known good state
npm install
npm audit fix
npm run test  # Verify everything works
```

## Task Completion Requirements

Any task involving code changes must verify:
1. All dependencies are properly installed
2. No missing module errors
3. All npm scripts execute successfully
4. No security vulnerabilities remain
5. Project builds and runs without dependency-related errors

This ensures a stable development environment and prevents dependency-related issues from blocking development progress.
---
applyTo: '**'
---

# Task Completion Instructions

## Overview
These instructions define how tasks should be completed and what artifacts should be created during development work.

## Task Completion Guidelines

### Do NOT Create Unnecessary Documentation
- **DO NOT** create markdown files summarizing completed tasks unless explicitly requested
- **DO NOT** create change logs or summary documents after completing work
- **DO NOT** generate documentation files to describe what was done

### Focus on Code and Required Updates
When completing a task, ONLY:
1. Implement the requested code changes
2. Run quality checks (biome format/lint)
3. Update the README.md if the changes affect it (per README update instructions)
4. Update existing documentation files if they become outdated due to changes

### What to Create
- **Code files**: When implementing features or fixes
- **Test files**: When adding testable functionality
- **Configuration files**: When needed for tools or build processes
- **README updates**: When project structure, dependencies, or features change

### What NOT to Create
- **Task summaries**: No markdown files documenting what was done
- **Change logs**: Unless part of an official CHANGELOG.md maintenance task
- **Completion reports**: No summary documents after finishing work
- **Process documentation**: Unless explicitly requested by the user

## Communication Style

### After Task Completion
- Provide a brief verbal summary of what was done
- Confirm that quality checks passed
- Note any important considerations or follow-up items
- **DO NOT** offer to create or actually create summary markdown files

### Task Status Updates
Use clear, concise messages:
- ✅ "Task complete. All quality checks passed."
- ✅ "Implementation finished. README updated to reflect changes."
- ❌ "Task complete. I've created a summary document..." (DON'T DO THIS)

## Exceptions

Create documentation ONLY when:
1. **User explicitly requests**: "Create a document describing..."
2. **New feature documentation**: User guides, API docs for new features
3. **Architecture decisions**: When documenting significant design choices (ADRs)
4. **Official changelog**: Maintaining project CHANGELOG.md

## Summary

**Keep it simple**: Write code, run checks, update README if needed, report completion verbally. No extra documentation unless specifically requested.

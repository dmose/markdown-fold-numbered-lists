# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Test Commands
- `npm run compile` - Build the extension
- `npm run watch` - Watch and auto-compile changes
- `npm run lint` - Run ESLint
- `npm run test` - Run all tests
- `npx mocha -g "test name" out/test/suite/*.js` - Run a single test
- `npm run pretest` - Compile and lint before testing

## Code Style Guidelines
- Use TypeScript strict mode with explicit types
- Prefer ES2022 features and syntax
- Indentation: Use 4 spaces (based on existing code)
- Use named exports (`export function`) 
- Group imports at top, starting with external modules
- Use PascalCase for classes, camelCase for variables/functions
- Use VSCode-specific patterns like registerX for extension APIs
- Error handling: Prefer early returns and explicit conditional checks
- Follow the VSCode Extension API patterns for provider implementations
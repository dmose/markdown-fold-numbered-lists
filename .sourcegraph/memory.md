# VSCode Extension Development Memory

## Build & Test Commands
- `npm run compile` - Build the extension
- `npm run watch` - Watch and auto-compile
- `npm run lint` - Run ESLint
- `npm run test` - Run all tests
- `npx mocha -g "test name" out/test/suite/*.js` - Run a specific test
- `npm run pretest` - Compile and lint before testing

## Code Style Guidelines
- TypeScript: Strict mode with explicit types
- Syntax: Prefer ES2022 features
- Formatting: 2 spaces indentation
- Exports: Use named exports (`export function`)
- Imports: Group at top, external modules first
- Naming: PascalCase for classes, camelCase for variables/functions
- VSCode Patterns: Use `registerX` for extension APIs
- Error Handling: Early returns and explicit conditional checks
- Follow VSCode Extension API patterns for providers
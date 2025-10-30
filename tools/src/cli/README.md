# CLI Framework

This directory contains the unified CLI framework for the monorepo development workflow.

## Architecture

The CLI framework is built using Commander.js and provides:

- **Command Registry**: Centralized command registration and discovery
- **Error Handling**: Comprehensive error handling with suggestions
- **Progress Indicators**: Spinners and progress bars for long-running operations
- **Interactive Prompts**: User input collection for complex operations
- **Logging**: Structured logging with different levels

## Structure

```
cli/
├── framework/           # Core CLI framework
│   ├── cli-app.ts      # Main CLI application
│   ├── command-registry.ts  # Command registration system
│   └── error-handler.ts     # Error handling utilities
├── commands/           # Command implementations
│   ├── health.ts       # Workspace health checks
│   ├── validate.ts     # Configuration validation
│   ├── dev.ts         # Development commands (placeholder)
│   ├── build.ts       # Build commands (placeholder)
│   ├── create.ts      # Creation commands (placeholder)
│   ├── test.ts        # Testing commands (placeholder)
│   ├── config.ts      # Configuration management
│   └── deploy.ts      # Deployment commands (placeholder)
└── utils/             # Shared utilities
    ├── logger.ts      # Logging utilities
    ├── spinner.ts     # Progress indicators
    └── prompts.ts     # Interactive prompts
```

## Usage

The CLI is designed to be run from the tools directory:

```bash
# Show help
npm run cli -- --help

# Run health check
npm run cli -- health

# Validate configuration
npm run cli -- validate

# Development commands (to be implemented)
npm run cli -- dev carat-central --platform mobile
npm run cli -- create-app my-app --template web
npm run cli -- build --production
```

## Command Implementation

Commands are registered using the CommandRegistry system:

```typescript
export function registerMyCommand(registry: CommandRegistry): void {
  registry.register({
    name: 'my-command',
    description: 'Description of the command',
    arguments: [
      {
        name: 'arg1',
        description: 'First argument',
        required: true
      }
    ],
    options: [
      {
        flags: '--option <value>',
        description: 'Command option'
      }
    ],
    examples: [
      'monorepo my-command example'
    ],
    handler: async (args, options) => {
      // Command implementation
    }
  });
}
```

## Features Implemented

### ✅ Completed
- CLI framework with command discovery and routing
- Command registration system with help documentation
- Shared utilities for logging, progress indicators, and error handling
- Health check command
- Configuration validation command
- Configuration management command

### 🚧 Placeholders (to be implemented in later subtasks)
- Development commands (subtask 2.2)
- Creation and scaffolding commands (subtask 2.3)
- Build and deployment commands (subtask 2.4)
- Test commands (subtask 2.4)

## Error Handling

The framework provides comprehensive error handling with:
- Structured error types (validation, configuration, dependency errors)
- Automatic error recovery suggestions
- Debug information in development mode
- Graceful shutdown on SIGINT/SIGTERM

## Logging

Multiple log levels are supported:
- DEBUG: Detailed debugging information
- INFO: General information
- WARN: Warning messages
- ERROR: Error messages

Use `--verbose`, `--quiet`, or `--debug` flags to control output level.
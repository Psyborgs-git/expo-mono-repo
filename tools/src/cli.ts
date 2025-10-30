#!/usr/bin/env node

import { CLIApp } from './cli/framework';
import { registerCommands } from './cli/commands';
import { LogLevel } from './cli/utils/logger';

async function main() {
  // Create CLI application
  const cli = new CLIApp({
    name: 'monorepo',
    version: '1.0.0',
    description: 'Unified CLI for monorepo development workflow',
    logLevel: LogLevel.INFO
  });

  // Register all commands
  await registerCommands(cli.getRegistry());

  // Add custom help text
  cli.addHelpText('after', `
For more information about a specific command, run:
  $ monorepo <command> --help

Examples:
  $ monorepo dev carat-central --platform mobile
  $ monorepo build --app vloop --production
  $ monorepo create-app my-new-app --template web
  $ monorepo health
`);

  // Run the CLI
  await cli.run();
}

if (require.main === module) {
  main().catch((error) => {
    console.error('CLI startup failed:', error);
    process.exit(1);
  });
}
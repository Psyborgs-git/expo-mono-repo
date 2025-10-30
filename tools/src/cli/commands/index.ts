/**
 * CLI commands for monorepo operations
 */
import { CommandRegistry } from '../framework';
import { registerHealthCommand } from './health';
import { registerValidateCommand } from './validate';
import { registerDevCommand } from './dev';
import { registerBuildCommand } from './build';
import { registerCreateCommand } from './create';
import { registerTestCommand } from './test';
import { registerConfigCommand } from './config';
import { registerDeployCommand } from './deploy';

export * from './dev';
export * from './build';
export * from './create';
export * from './test';
export * from './config';
export * from './deploy';
export * from './health';
export * from './validate';

/**
 * Register all commands with the CLI framework
 */
export async function registerCommands(registry: CommandRegistry): Promise<void> {
  // Core workspace commands
  registerHealthCommand(registry);
  registerValidateCommand(registry);
  
  // Development commands (will be implemented in subtask 2.2)
  registerDevCommand(registry);
  
  // Creation commands (will be implemented in subtask 2.3)
  registerCreateCommand(registry);
  
  // Build commands (will be implemented in subtask 2.4)
  registerBuildCommand(registry);
  
  // Test commands (will be implemented in subtask 2.4)
  registerTestCommand(registry);
  
  // Deploy commands (will be implemented in subtask 2.4)
  registerDeployCommand(registry);
  
  // Configuration commands
  registerConfigCommand(registry);
}
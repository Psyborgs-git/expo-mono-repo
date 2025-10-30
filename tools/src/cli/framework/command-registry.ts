/**
 * Command registry for CLI framework
 */
import { Command } from 'commander';
import { logger } from '../utils/logger';

export interface CommandDefinition {
  name: string;
  description: string;
  aliases?: string[];
  options?: CommandOption[];
  arguments?: CommandArgument[];
  handler: (args: any, options: any) => Promise<void>;
  examples?: string[];
}

export interface CommandOption {
  flags: string;
  description: string;
  defaultValue?: any;
}

export interface CommandArgument {
  name: string;
  description: string;
  required?: boolean;
}

export class CommandRegistry {
  private commands: Map<string, CommandDefinition> = new Map();
  private program: Command;

  constructor(program: Command) {
    this.program = program;
  }

  /**
   * Register a command with the CLI framework
   */
  register(definition: CommandDefinition): void {
    this.commands.set(definition.name, definition);
    
    const command = this.program
      .command(definition.name)
      .description(definition.description);

    // Add aliases
    if (definition.aliases) {
      definition.aliases.forEach(alias => command.alias(alias));
    }

    // Add arguments
    if (definition.arguments) {
      definition.arguments.forEach(arg => {
        const argSyntax = arg.required ? `<${arg.name}>` : `[${arg.name}]`;
        command.argument(argSyntax, arg.description);
      });
    }

    // Add options
    if (definition.options) {
      definition.options.forEach(opt => {
        command.option(opt.flags, opt.description, opt.defaultValue);
      });
    }

    // Add examples to help
    if (definition.examples) {
      const exampleText = definition.examples
        .map(example => `  $ ${example}`)
        .join('\n');
      command.addHelpText('after', `\nExamples:\n${exampleText}`);
    }

    // Set action handler
    command.action(async (...args) => {
      try {
        const options = args.pop(); // Last argument is always options
        const commandArgs = args;
        
        logger.debug(`Executing command: ${definition.name}`);
        await definition.handler(commandArgs, options);
      } catch (error) {
        logger.error(`Command '${definition.name}' failed: ${error instanceof Error ? error.message : error}`);
        process.exit(1);
      }
    });
  }

  /**
   * Get all registered commands
   */
  getCommands(): CommandDefinition[] {
    return Array.from(this.commands.values());
  }

  /**
   * Get a specific command by name
   */
  getCommand(name: string): CommandDefinition | undefined {
    return this.commands.get(name);
  }

  /**
   * Check if a command exists
   */
  hasCommand(name: string): boolean {
    return this.commands.has(name);
  }
}
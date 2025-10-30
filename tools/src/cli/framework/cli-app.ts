/**
 * Main CLI application framework
 */
import { Command } from 'commander';
import { CommandRegistry } from './command-registry';
import { logger, LogLevel } from '../utils/logger';
import { ErrorHandler } from './error-handler';
import chalk from 'chalk';

export interface CLIConfig {
  name: string;
  version: string;
  description: string;
  logLevel?: LogLevel;
}

export class CLIApp {
  private program: Command;
  private registry: CommandRegistry;
  private errorHandler: ErrorHandler;
  private config: CLIConfig;

  constructor(config: CLIConfig) {
    this.config = config;
    this.program = new Command();
    this.registry = new CommandRegistry(this.program);
    this.errorHandler = new ErrorHandler();
    
    this.setupProgram();
    this.setupGlobalOptions();
    this.setupErrorHandling();
  }

  private setupProgram(): void {
    this.program
      .name(this.config.name)
      .version(this.config.version)
      .description(this.config.description)
      .configureHelp({
        sortSubcommands: true,
        subcommandTerm: (cmd) => cmd.name() + ' ' + cmd.usage(),
      });
  }

  private setupGlobalOptions(): void {
    this.program
      .option('-v, --verbose', 'Enable verbose logging')
      .option('-q, --quiet', 'Suppress non-error output')
      .option('--debug', 'Enable debug logging')
      .hook('preAction', (thisCommand) => {
        const options = thisCommand.opts();
        
        if (options.debug) {
          logger.setLevel(LogLevel.DEBUG);
        } else if (options.verbose) {
          logger.setLevel(LogLevel.INFO);
        } else if (options.quiet) {
          logger.setLevel(LogLevel.ERROR);
        } else if (this.config.logLevel !== undefined) {
          logger.setLevel(this.config.logLevel);
        }
      });
  }

  private setupErrorHandling(): void {
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      this.errorHandler.handleUncaughtException(error);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason) => {
      this.errorHandler.handleUnhandledRejection(reason);
    });

    // Handle SIGINT (Ctrl+C)
    process.on('SIGINT', () => {
      logger.info('\nReceived SIGINT, shutting down gracefully...');
      process.exit(0);
    });

    // Handle SIGTERM
    process.on('SIGTERM', () => {
      logger.info('Received SIGTERM, shutting down gracefully...');
      process.exit(0);
    });
  }

  /**
   * Get the command registry
   */
  getRegistry(): CommandRegistry {
    return this.registry;
  }

  /**
   * Get the Commander program
   */
  getProgram(): Command {
    return this.program;
  }

  /**
   * Add a custom help section
   */
  addHelpText(position: 'before' | 'after', text: string): void {
    this.program.addHelpText(position, text);
  }

  /**
   * Parse command line arguments and execute
   */
  async run(argv?: string[]): Promise<void> {
    try {
      // Show banner for main help
      if (!argv || argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
        this.showBanner();
      }

      await this.program.parseAsync(argv);
    } catch (error) {
      this.errorHandler.handleCommandError(error);
      process.exit(1);
    }
  }

  private showBanner(): void {
    const banner = `
${chalk.cyan.bold('🚀 Monorepo Development Tools')}
${chalk.gray('Unified CLI for managing your monorepo workspace')}
`;
    console.log(banner);
  }

  /**
   * Show usage information
   */
  showHelp(): void {
    this.program.help();
  }

  /**
   * Get version information
   */
  getVersion(): string {
    return this.config.version;
  }
}
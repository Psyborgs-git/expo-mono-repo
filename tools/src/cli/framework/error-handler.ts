/**
 * Error handling for CLI framework
 */
import { logger } from '../utils/logger';
import chalk from 'chalk';

export interface CLIError extends Error {
  code?: string;
  exitCode?: number;
  suggestions?: string[];
}

export class ErrorHandler {
  /**
   * Handle command execution errors
   */
  handleCommandError(error: any): void {
    if (error instanceof Error) {
      const cliError = error as CLIError;
      
      logger.error(`Command failed: ${cliError.message}`);
      
      if (cliError.code) {
        logger.debug(`Error code: ${cliError.code}`);
      }
      
      if (cliError.suggestions && cliError.suggestions.length > 0) {
        console.log(chalk.yellow('\n💡 Suggestions:'));
        cliError.suggestions.forEach(suggestion => {
          console.log(chalk.yellow(`  • ${suggestion}`));
        });
      }
      
      if (process.env.DEBUG || process.env.NODE_ENV === 'development') {
        console.log(chalk.gray('\nStack trace:'));
        console.log(chalk.gray(cliError.stack));
      }
    } else {
      logger.error(`Command failed with unknown error: ${error}`);
    }
  }

  /**
   * Handle uncaught exceptions
   */
  handleUncaughtException(error: Error): void {
    logger.error('Uncaught exception occurred:');
    logger.error(error.message);
    
    if (process.env.DEBUG || process.env.NODE_ENV === 'development') {
      console.error(error.stack);
    }
    
    process.exit(1);
  }

  /**
   * Handle unhandled promise rejections
   */
  handleUnhandledRejection(reason: any): void {
    logger.error('Unhandled promise rejection:');
    logger.error(reason instanceof Error ? reason.message : String(reason));
    
    if (reason instanceof Error && (process.env.DEBUG || process.env.NODE_ENV === 'development')) {
      console.error(reason.stack);
    }
    
    process.exit(1);
  }

  /**
   * Create a CLI error with suggestions
   */
  static createError(message: string, options: {
    code?: string;
    exitCode?: number;
    suggestions?: string[];
  } = {}): CLIError {
    const error = new Error(message) as CLIError;
    error.code = options.code;
    error.exitCode = options.exitCode || 1;
    error.suggestions = options.suggestions;
    return error;
  }

  /**
   * Create a validation error
   */
  static createValidationError(message: string, suggestions: string[] = []): CLIError {
    return this.createError(message, {
      code: 'VALIDATION_ERROR',
      suggestions: [
        ...suggestions,
        'Run with --help to see available options',
        'Check your configuration files for errors'
      ]
    });
  }

  /**
   * Create a configuration error
   */
  static createConfigError(message: string, suggestions: string[] = []): CLIError {
    return this.createError(message, {
      code: 'CONFIG_ERROR',
      suggestions: [
        ...suggestions,
        'Verify your monorepo.config.json file',
        'Run "monorepo validate" to check configuration'
      ]
    });
  }

  /**
   * Create a dependency error
   */
  static createDependencyError(message: string, suggestions: string[] = []): CLIError {
    return this.createError(message, {
      code: 'DEPENDENCY_ERROR',
      suggestions: [
        ...suggestions,
        'Run "npm install" or "pnpm install" to install dependencies',
        'Check if all required packages are installed'
      ]
    });
  }
}
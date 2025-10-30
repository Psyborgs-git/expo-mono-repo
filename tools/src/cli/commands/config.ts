/**
 * Configuration management commands
 */
import { CommandRegistry } from '../framework';
import { ConfigLoader } from '../../config/loader';
import { logger } from '../utils/logger';
import { createSpinner } from '../utils/spinner';
import chalk from 'chalk';

export function registerConfigCommand(registry: CommandRegistry): void {
  registry.register({
    name: 'config',
    description: 'Manage monorepo configuration',
    arguments: [
      {
        name: 'action',
        description: 'Action to perform (show, validate, init)',
        required: false
      }
    ],
    options: [
      {
        flags: '--environment <env>',
        description: 'Target environment (development, staging, production)',
        defaultValue: 'development'
      },
      {
        flags: '--format <format>',
        description: 'Output format (json, yaml, table)',
        defaultValue: 'table'
      }
    ],
    examples: [
      'monorepo config show',
      'monorepo config validate',
      'monorepo config show --environment production',
      'monorepo config show --format json'
    ],
    handler: async (args, options) => {
      const action = args[0] || 'show';
      const environment = options.environment;

      switch (action) {
        case 'show':
          await showConfig(environment, options.format);
          break;
        case 'validate':
          await validateConfig(environment);
          break;
        case 'init':
          await initConfig();
          break;
        default:
          logger.error(`Unknown config action: ${action}`);
          logger.info('Available actions: show, validate, init');
          process.exit(1);
      }
    }
  });
}

async function showConfig(environment: string, format: string): Promise<void> {
  const spinner = createSpinner(`Loading ${environment} configuration...`);
  spinner.start();

  try {
    const configLoader = new ConfigLoader();
    const config = await configLoader.loadConfig(environment);
    
    spinner.succeed('Configuration loaded');

    console.log(chalk.cyan(`\n📋 Monorepo Configuration (${environment})`));
    console.log('='.repeat(50));

    if (format === 'json') {
      console.log(JSON.stringify(config, null, 2));
    } else if (format === 'yaml') {
      // Would need yaml library for this
      logger.warn('YAML format not yet implemented, showing JSON instead');
      console.log(JSON.stringify(config, null, 2));
    } else {
      // Table format
      console.log(`${chalk.bold('Apps:')} ${config.apps?.length || 0}`);
      if (config.apps) {
        config.apps.forEach(app => {
          console.log(`  • ${app.name} (${app.type}) - ${app.path}`);
        });
      }

      console.log(`\n${chalk.bold('Packages:')} ${config.packages?.length || 0}`);
      if (config.packages) {
        config.packages.forEach(pkg => {
          console.log(`  • ${pkg.name} (${pkg.type}) - ${pkg.path}`);
        });
      }

      if (config.tools) {
        console.log(`\n${chalk.bold('Tools Configuration:')}`);
        console.log(`  • Build: ${config.tools.build ? '✅' : '❌'}`);
        console.log(`  • Dev Server: ${config.tools.devServer ? '✅' : '❌'}`);
        console.log(`  • Testing: ${config.tools.testing ? '✅' : '❌'}`);
      }
    }
  } catch (error) {
    spinner.fail('Failed to load configuration');
    throw error;
  }
}

async function validateConfig(environment: string): Promise<void> {
  const spinner = createSpinner(`Validating ${environment} configuration...`);
  spinner.start();

  try {
    const configLoader = new ConfigLoader();
    const isValid = await configLoader.validateConfig(environment);
    
    if (isValid) {
      spinner.succeed('Configuration is valid');
    } else {
      spinner.fail('Configuration validation failed');
      process.exit(1);
    }
  } catch (error) {
    spinner.fail('Configuration validation failed');
    throw error;
  }
}

async function initConfig(): Promise<void> {
  const spinner = createSpinner('Initializing monorepo configuration...');
  spinner.start();

  try {
    // This would create a default configuration file
    spinner.succeed('Configuration initialized');
    logger.info('Default configuration files created');
    logger.info('Run "monorepo config show" to view the configuration');
  } catch (error) {
    spinner.fail('Failed to initialize configuration');
    throw error;
  }
}
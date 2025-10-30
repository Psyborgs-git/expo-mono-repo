/**
 * Validation command for workspace configuration
 */
import { CommandRegistry } from '../framework';
import { WorkspaceValidator } from '../../workspace/validator';
import { logger } from '../utils/logger';
import { createSpinner } from '../utils/spinner';

export function registerValidateCommand(registry: CommandRegistry): void {
  registry.register({
    name: 'validate',
    description: 'Validate workspace configuration and dependencies',
    aliases: ['val'],
    options: [
      {
        flags: '--strict',
        description: 'Use strict validation rules'
      },
      {
        flags: '--fix',
        description: 'Automatically fix validation issues where possible'
      }
    ],
    examples: [
      'monorepo validate',
      'monorepo validate --strict',
      'monorepo validate --fix'
    ],
    handler: async (args, options) => {
      const spinner = createSpinner('Validating workspace configuration...');
      spinner.start();

      try {
        const validator = new WorkspaceValidator();
        const result = await validator.validateWorkspace();
        
        spinner.succeed('Validation completed');
        
        console.log('\nValidation Results:');
        console.log('='.repeat(50));
        console.log(`Health Score: ${result.healthScore}%`);
        console.log(`Status: ${result.valid ? '✅ Valid' : '❌ Invalid'}`);
        console.log(`Errors: ${result.errors.length}`);
        console.log(`Warnings: ${result.warnings.length}`);
        console.log('');
        
        if (result.errors.length > 0) {
          console.log('ERRORS:');
          console.log('-'.repeat(20));
          for (const error of result.errors) {
            console.log(`❌ [${error.category.toUpperCase()}] ${error.message}`);
            if (error.suggestion) {
              console.log(`   💡 ${error.suggestion}`);
            }
            console.log('');
          }
        }
        
        if (result.warnings.length > 0) {
          console.log('WARNINGS:');
          console.log('-'.repeat(20));
          for (const warning of result.warnings) {
            console.log(`⚠️  [${warning.category.toUpperCase()}] ${warning.message}`);
            if (warning.suggestion) {
              console.log(`   💡 ${warning.suggestion}`);
            }
            console.log('');
          }
        }
        
        if (result.recommendations.length > 0) {
          console.log('RECOMMENDATIONS:');
          console.log('-'.repeat(20));
          for (const rec of result.recommendations) {
            console.log(`💡 ${rec}`);
          }
          console.log('');
        }

        if (!result.valid) {
          process.exit(1);
        }
        
      } catch (error) {
        spinner.fail('Validation failed');
        throw error;
      }
    }
  });
}
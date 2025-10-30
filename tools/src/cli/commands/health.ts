/**
 * Health check command for workspace validation
 */
import { CommandRegistry } from '../framework';
import { WorkspaceHealthChecker } from '../../workspace/health-check';
import { logger } from '../utils/logger';
import { createSpinner } from '../utils/spinner';

export function registerHealthCommand(registry: CommandRegistry): void {
  registry.register({
    name: 'health',
    description: 'Run comprehensive workspace health check',
    aliases: ['check'],
    options: [
      {
        flags: '--fix',
        description: 'Automatically fix issues where possible'
      },
      {
        flags: '--detailed',
        description: 'Show detailed information for all checks'
      }
    ],
    examples: [
      'monorepo health',
      'monorepo health --fix',
      'monorepo health --detailed'
    ],
    handler: async (args, options) => {
      const spinner = createSpinner('Running workspace health check...');
      spinner.start();

      try {
        const healthChecker = new WorkspaceHealthChecker();
        const result = await healthChecker.runHealthCheck();
        
        spinner.succeed('Health check completed');
        
        console.log('\n' + result.summary);
        console.log('\nDetailed Results:');
        console.log('='.repeat(50));
        
        for (const check of result.checks) {
          const statusIcon = check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌';
          console.log(`${statusIcon} ${check.name}: ${check.message}`);
          
          if (options.detailed || check.status !== 'pass') {
            if (check.details) {
              console.log(`   Details: ${check.details}`);
            }
            
            if (check.fix) {
              console.log(`   💡 Fix: ${check.fix}`);
            }
          }
          
          console.log('');
        }

        // Show summary statistics
        const passed = result.checks.filter(c => c.status === 'pass').length;
        const warned = result.checks.filter(c => c.status === 'warn').length;
        const failed = result.checks.filter(c => c.status === 'fail').length;
        
        console.log('Summary:');
        console.log(`  ✅ Passed: ${passed}`);
        console.log(`  ⚠️  Warnings: ${warned}`);
        console.log(`  ❌ Failed: ${failed}`);
        
        if (failed > 0) {
          process.exit(1);
        }
        
      } catch (error) {
        spinner.fail('Health check failed');
        throw error;
      }
    }
  });
}
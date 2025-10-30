import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { WorkspaceValidator } from './validator';
import { ConfigLoader } from '../config/loader';

export interface HealthCheckResult {
  status: 'healthy' | 'warning' | 'error';
  score: number;
  checks: HealthCheck[];
  summary: string;
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  details?: string;
  fix?: string;
}

export class WorkspaceHealthChecker {
  private rootDir: string;
  private validator: WorkspaceValidator;
  private configLoader: ConfigLoader;

  constructor(rootDir: string = process.cwd()) {
    this.rootDir = rootDir;
    this.validator = new WorkspaceValidator(rootDir);
    this.configLoader = new ConfigLoader(rootDir);
  }

  /**
   * Run comprehensive health check
   */
  async runHealthCheck(): Promise<HealthCheckResult> {
    const checks: HealthCheck[] = [];

    // Run all health checks
    await this.checkBasicStructure(checks);
    await this.checkDependencies(checks);
    await this.checkConfiguration(checks);
    await this.checkDevelopmentEnvironment(checks);
    await this.checkBuildSystem(checks);

    // Calculate overall status and score
    const failedChecks = checks.filter(c => c.status === 'fail').length;
    const warningChecks = checks.filter(c => c.status === 'warn').length;
    const passedChecks = checks.filter(c => c.status === 'pass').length;

    const score = Math.round((passedChecks / checks.length) * 100);
    
    let status: 'healthy' | 'warning' | 'error';
    if (failedChecks > 0) {
      status = 'error';
    } else if (warningChecks > 0) {
      status = 'warning';
    } else {
      status = 'healthy';
    }

    const summary = this.generateSummary(status, score, failedChecks, warningChecks, passedChecks);

    return {
      status,
      score,
      checks,
      summary
    };
  }

  /**
   * Check basic monorepo structure
   */
  private async checkBasicStructure(checks: HealthCheck[]): Promise<void> {
    // Check root package.json
    const packageJsonPath = join(this.rootDir, 'package.json');
    if (existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        
        if (packageJson.workspaces && packageJson.workspaces.length > 0) {
          checks.push({
            name: 'Workspace Configuration',
            status: 'pass',
            message: 'Workspaces are properly configured',
            details: `Found ${packageJson.workspaces.length} workspace patterns`
          });
        } else {
          checks.push({
            name: 'Workspace Configuration',
            status: 'fail',
            message: 'No workspaces configured in package.json',
            fix: 'Add workspaces array to package.json'
          });
        }
      } catch (error) {
        checks.push({
          name: 'Root Package.json',
          status: 'fail',
          message: 'Invalid package.json syntax',
          fix: 'Fix JSON syntax errors in package.json'
        });
      }
    } else {
      checks.push({
        name: 'Root Package.json',
        status: 'fail',
        message: 'No package.json found in root directory',
        fix: 'Create a package.json file in the monorepo root'
      });
    }

    // Check required directories
    const requiredDirs = ['apps', 'packages'];
    for (const dir of requiredDirs) {
      const dirPath = join(this.rootDir, dir);
      if (existsSync(dirPath)) {
        checks.push({
          name: `${dir} Directory`,
          status: 'pass',
          message: `${dir} directory exists`,
        });
      } else {
        checks.push({
          name: `${dir} Directory`,
          status: 'fail',
          message: `${dir} directory is missing`,
          fix: `Create the ${dir} directory`
        });
      }
    }
  }

  /**
   * Check dependency health
   */
  private async checkDependencies(checks: HealthCheck[]): Promise<void> {
    try {
      const config = await this.configLoader.loadConfig();
      
      // Check for dependency version consistency
      const dependencyVersions = new Map<string, Set<string>>();
      
      for (const app of config.apps) {
        const packageJsonPath = join(this.rootDir, app.path, 'package.json');
        if (existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
          this.collectDependencyVersions(packageJson, dependencyVersions);
        }
      }

      for (const pkg of config.packages) {
        const packageJsonPath = join(this.rootDir, pkg.path, 'package.json');
        if (existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
          this.collectDependencyVersions(packageJson, dependencyVersions);
        }
      }

      const inconsistentDeps = Array.from(dependencyVersions.entries())
        .filter(([_, versions]) => versions.size > 1);

      if (inconsistentDeps.length === 0) {
        checks.push({
          name: 'Dependency Versions',
          status: 'pass',
          message: 'All dependencies have consistent versions',
        });
      } else {
        checks.push({
          name: 'Dependency Versions',
          status: 'warn',
          message: `${inconsistentDeps.length} dependencies have version mismatches`,
          details: inconsistentDeps.map(([dep, versions]) => 
            `${dep}: ${Array.from(versions).join(', ')}`
          ).join('\n'),
          fix: 'Standardize dependency versions across packages'
        });
      }

    } catch (error) {
      checks.push({
        name: 'Dependency Analysis',
        status: 'fail',
        message: 'Failed to analyze dependencies',
        details: String(error),
        fix: 'Check configuration and package.json files'
      });
    }
  }

  /**
   * Check configuration health
   */
  private async checkConfiguration(checks: HealthCheck[]): Promise<void> {
    // Check for monorepo configuration
    const configFiles = [
      'monorepo.config.json',
      'monorepo.config.js',
      '.monoreporc.json'
    ];

    const hasConfig = configFiles.some(file => existsSync(join(this.rootDir, file)));
    
    if (hasConfig) {
      checks.push({
        name: 'Monorepo Configuration',
        status: 'pass',
        message: 'Monorepo configuration file found',
      });
    } else {
      checks.push({
        name: 'Monorepo Configuration',
        status: 'warn',
        message: 'No dedicated monorepo configuration found',
        fix: 'Create a monorepo.config.json file for better tooling support'
      });
    }

    // Check TypeScript configuration
    const tsconfigPath = join(this.rootDir, 'tsconfig.base.json');
    if (existsSync(tsconfigPath)) {
      checks.push({
        name: 'TypeScript Configuration',
        status: 'pass',
        message: 'Base TypeScript configuration found',
      });
    } else {
      checks.push({
        name: 'TypeScript Configuration',
        status: 'warn',
        message: 'No base TypeScript configuration found',
        fix: 'Create tsconfig.base.json for shared TypeScript settings'
      });
    }
  }

  /**
   * Check development environment
   */
  private async checkDevelopmentEnvironment(checks: HealthCheck[]): Promise<void> {
    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion >= 18) {
      checks.push({
        name: 'Node.js Version',
        status: 'pass',
        message: `Node.js ${nodeVersion} is supported`,
      });
    } else {
      checks.push({
        name: 'Node.js Version',
        status: 'warn',
        message: `Node.js ${nodeVersion} is outdated`,
        fix: 'Upgrade to Node.js 18 or later'
      });
    }

    // Check package manager
    const packageManager = this.detectPackageManager();
    if (packageManager === 'pnpm') {
      checks.push({
        name: 'Package Manager',
        status: 'pass',
        message: 'Using pnpm (recommended for monorepos)',
      });
    } else {
      checks.push({
        name: 'Package Manager',
        status: 'warn',
        message: `Using ${packageManager}`,
        fix: 'Consider switching to pnpm for better monorepo support'
      });
    }
  }

  /**
   * Check build system health
   */
  private async checkBuildSystem(checks: HealthCheck[]): Promise<void> {
    try {
      const config = await this.configLoader.loadConfig();
      
      // Check if packages have build scripts
      let packagesWithBuild = 0;
      
      for (const pkg of config.packages) {
        const packageJsonPath = join(this.rootDir, pkg.path, 'package.json');
        if (existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
          if (packageJson.scripts?.build) {
            packagesWithBuild++;
          }
        }
      }

      if (packagesWithBuild === config.packages.length) {
        checks.push({
          name: 'Package Build Scripts',
          status: 'pass',
          message: 'All packages have build scripts',
        });
      } else {
        checks.push({
          name: 'Package Build Scripts',
          status: 'warn',
          message: `${config.packages.length - packagesWithBuild} packages missing build scripts`,
          fix: 'Add build scripts to all packages'
        });
      }

    } catch (error) {
      checks.push({
        name: 'Build System Check',
        status: 'fail',
        message: 'Failed to check build system',
        details: String(error)
      });
    }
  }

  /**
   * Generate health check summary
   */
  private generateSummary(
    status: 'healthy' | 'warning' | 'error',
    score: number,
    failed: number,
    warnings: number,
    passed: number
  ): string {
    const statusEmoji = {
      healthy: '✅',
      warning: '⚠️',
      error: '❌'
    };

    const lines = [
      `${statusEmoji[status]} Workspace Health: ${status.toUpperCase()} (${score}%)`,
      '',
      `Checks: ${passed} passed, ${warnings} warnings, ${failed} failed`
    ];

    if (status === 'error') {
      lines.push('', '🔧 Critical issues need immediate attention');
    } else if (status === 'warning') {
      lines.push('', '💡 Some improvements recommended');
    } else {
      lines.push('', '🎉 Workspace is in excellent health!');
    }

    return lines.join('\n');
  }

  /**
   * Collect dependency versions from package.json
   */
  private collectDependencyVersions(packageJson: any, versionMap: Map<string, Set<string>>): void {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    for (const [name, version] of Object.entries(deps)) {
      if (typeof version === 'string') {
        if (!versionMap.has(name)) {
          versionMap.set(name, new Set());
        }
        versionMap.get(name)!.add(version);
      }
    }
  }

  /**
   * Detect package manager
   */
  private detectPackageManager(): 'npm' | 'yarn' | 'pnpm' {
    if (existsSync(join(this.rootDir, 'pnpm-lock.yaml'))) {
      return 'pnpm';
    }
    
    if (existsSync(join(this.rootDir, 'yarn.lock'))) {
      return 'yarn';
    }
    
    return 'npm';
  }
}
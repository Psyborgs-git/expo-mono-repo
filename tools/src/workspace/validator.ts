import { existsSync, readFileSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { ConfigValidator, ValidationError, ValidationResult } from '../config/validator';
import { ConfigLoader } from '../config/loader';
import { MonorepoConfig } from '../config/schema';

export interface WorkspaceValidationResult extends ValidationResult {
  healthScore: number;
  recommendations: string[];
}

export class WorkspaceValidator extends ConfigValidator {
  constructor(rootDir: string = process.cwd()) {
    super(rootDir);
  }

  /**
   * Comprehensive workspace validation
   */
  async validateWorkspace(): Promise<WorkspaceValidationResult> {
    const configResult = await this.validateConfig();
    const errors = [...configResult.errors];
    const warnings = [...configResult.warnings];
    const recommendations: string[] = [];

    try {
      const config = await this.configLoader.loadConfig();

      // Additional workspace-specific validations
      await this.validateWorkspaceIntegrity(config, errors, warnings, recommendations);
      await this.validateDevelopmentEnvironment(errors, warnings, recommendations);
      await this.validateBuildTools(config, errors, warnings, recommendations);

    } catch (error) {
      errors.push({
        type: 'error',
        category: 'config',
        message: `Workspace validation failed: ${error}`,
        suggestion: 'Check your monorepo configuration and structure'
      });
    }

    const healthScore = this.calculateHealthScore(errors, warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      healthScore,
      recommendations
    };
  }

  /**
   * Validate workspace integrity
   */
  private async validateWorkspaceIntegrity(
    config: MonorepoConfig, 
    errors: ValidationError[], 
    warnings: ValidationError[],
    recommendations: string[]
  ): Promise<void> {
    // Check for consistent dependency versions
    await this.validateDependencyVersions(config, warnings, recommendations);
    
    // Check for proper workspace references
    this.validateWorkspaceReferences(config, errors, warnings);
    
    // Check for orphaned packages
    this.validateOrphanedPackages(config, warnings, recommendations);
  } 
 /**
   * Validate development environment setup
   */
  private async validateDevelopmentEnvironment(
    errors: ValidationError[], 
    warnings: ValidationError[],
    recommendations: string[]
  ): Promise<void> {
    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
      warnings.push({
        type: 'warning',
        category: 'environment',
        message: `Node.js version ${nodeVersion} is outdated`,
        suggestion: 'Upgrade to Node.js 18 or later for better performance and security'
      });
    }

    // Check package manager
    const packageManager = this.detectPackageManager();
    if (packageManager === 'npm') {
      recommendations.push('Consider using pnpm or yarn for better monorepo support');
    }

    // Check for required global tools
    await this.validateGlobalTools(warnings, recommendations);
  }

  /**
   * Validate build tools and configuration
   */
  private async validateBuildTools(
    config: MonorepoConfig,
    errors: ValidationError[], 
    warnings: ValidationError[],
    recommendations: string[]
  ): Promise<void> {
    // Check TypeScript configuration
    await this.validateTypeScriptSetup(errors, warnings, recommendations);
    
    // Check linting setup
    await this.validateLintingSetup(warnings, recommendations);
    
    // Check testing setup
    await this.validateTestingSetup(warnings, recommendations);
  }

  /**
   * Validate dependency versions across packages
   */
  private async validateDependencyVersions(
    config: MonorepoConfig,
    warnings: ValidationError[],
    recommendations: string[]
  ): Promise<void> {
    const dependencyVersions = new Map<string, Set<string>>();

    // Collect all dependency versions
    for (const app of config.apps) {
      const packageJsonPath = join(process.cwd(), app.path, 'package.json');
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        this.collectDependencyVersions(packageJson, dependencyVersions);
      }
    }

    for (const pkg of config.packages) {
      const packageJsonPath = join(process.cwd(), pkg.path, 'package.json');
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
        this.collectDependencyVersions(packageJson, dependencyVersions);
      }
    }

    // Check for version mismatches
    for (const [dep, versions] of dependencyVersions) {
      if (versions.size > 1) {
        warnings.push({
          type: 'warning',
          category: 'dependency',
          message: `Dependency '${dep}' has multiple versions: ${Array.from(versions).join(', ')}`,
          suggestion: 'Standardize dependency versions across the monorepo'
        });
      }
    }
  }

  /**
   * Validate workspace references
   */
  private validateWorkspaceReferences(
    config: MonorepoConfig,
    errors: ValidationError[],
    warnings: ValidationError[]
  ): void {
    const packageNames = new Set(config.packages.map(pkg => pkg.name));

    for (const app of config.apps) {
      for (const dep of app.dependencies) {
        if (dep.startsWith('@bdt/') && !packageNames.has(dep)) {
          errors.push({
            type: 'error',
            category: 'dependency',
            message: `App '${app.name}' references non-existent package '${dep}'`,
            suggestion: 'Remove the dependency or create the missing package'
          });
        }
      }
    }
  }

  /**
   * Check for orphaned packages
   */
  private validateOrphanedPackages(
    config: MonorepoConfig,
    warnings: ValidationError[],
    recommendations: string[]
  ): void {
    const usedPackages = new Set<string>();

    // Collect used packages
    for (const app of config.apps) {
      app.dependencies.forEach(dep => usedPackages.add(dep));
    }

    for (const pkg of config.packages) {
      pkg.dependencies.forEach(dep => usedPackages.add(dep));
    }

    // Find orphaned packages
    for (const pkg of config.packages) {
      if (!usedPackages.has(pkg.name)) {
        warnings.push({
          type: 'warning',
          category: 'structure',
          message: `Package '${pkg.name}' is not used by any app or package`,
          suggestion: 'Consider removing unused packages or add them as dependencies'
        });
      }
    }
  }

  /**
   * Validate global development tools
   */
  private async validateGlobalTools(
    warnings: ValidationError[],
    recommendations: string[]
  ): Promise<void> {
    const requiredTools = ['expo-cli', 'typescript'];
    const { execSync } = await import('child_process');

    for (const tool of requiredTools) {
      try {
        execSync(`which ${tool}`, { stdio: 'ignore' });
      } catch {
        warnings.push({
          type: 'warning',
          category: 'environment',
          message: `Global tool '${tool}' is not installed`,
          suggestion: `Install ${tool} globally: npm install -g ${tool}`
        });
      }
    }
  }

  /**
   * Validate TypeScript setup
   */
  private async validateTypeScriptSetup(
    errors: ValidationError[],
    warnings: ValidationError[],
    recommendations: string[]
  ): Promise<void> {
    const tsconfigPath = join(process.cwd(), 'tsconfig.base.json');
    
    if (!existsSync(tsconfigPath)) {
      warnings.push({
        type: 'warning',
        category: 'config',
        message: 'No base TypeScript configuration found',
        suggestion: 'Create a tsconfig.base.json for shared TypeScript configuration'
      });
    } else {
      try {
        const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));
        
        if (!tsconfig.compilerOptions?.paths) {
          recommendations.push('Add path mapping to tsconfig.base.json for better import resolution');
        }
      } catch (error) {
        errors.push({
          type: 'error',
          category: 'config',
          message: `Invalid tsconfig.base.json: ${error}`,
          suggestion: 'Fix the JSON syntax in tsconfig.base.json'
        });
      }
    }
  }

  /**
   * Validate linting setup
   */
  private async validateLintingSetup(
    warnings: ValidationError[],
    recommendations: string[]
  ): Promise<void> {
    const eslintConfigPath = join(process.cwd(), '.eslintrc.js');
    const eslintConfigJsonPath = join(process.cwd(), '.eslintrc.json');
    
    if (!existsSync(eslintConfigPath) && !existsSync(eslintConfigJsonPath)) {
      recommendations.push('Add ESLint configuration for consistent code quality');
    }

    const prettierConfigPath = join(process.cwd(), '.prettierrc');
    if (!existsSync(prettierConfigPath)) {
      recommendations.push('Add Prettier configuration for consistent code formatting');
    }
  }

  /**
   * Validate testing setup
   */
  private async validateTestingSetup(
    warnings: ValidationError[],
    recommendations: string[]
  ): Promise<void> {
    const jestConfigPath = join(process.cwd(), 'jest.config.js');
    const vitestConfigPath = join(process.cwd(), 'vitest.config.ts');
    
    if (!existsSync(jestConfigPath) && !existsSync(vitestConfigPath)) {
      recommendations.push('Add testing framework configuration (Jest or Vitest)');
    }
  }

  /**
   * Calculate workspace health score
   */
  private calculateHealthScore(errors: ValidationError[], warnings: ValidationError[]): number {
    const maxScore = 100;
    const errorPenalty = 10;
    const warningPenalty = 2;
    
    const penalty = (errors.length * errorPenalty) + (warnings.length * warningPenalty);
    return Math.max(0, maxScore - penalty);
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
    if (existsSync(join(process.cwd(), 'pnpm-lock.yaml'))) {
      return 'pnpm';
    }
    
    if (existsSync(join(process.cwd(), 'yarn.lock'))) {
      return 'yarn';
    }
    
    return 'npm';
  }
}
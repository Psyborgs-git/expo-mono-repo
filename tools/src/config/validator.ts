import { existsSync, readFileSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { MonorepoConfig, AppConfig, PackageConfig } from './schema';
import { ConfigLoader } from './loader';

export interface ValidationError {
  type: 'error' | 'warning';
  category: 'config' | 'dependency' | 'structure' | 'environment';
  message: string;
  path?: string;
  suggestion?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export class ConfigValidator {
  private rootDir: string;
  protected configLoader: ConfigLoader;

  constructor(rootDir: string = process.cwd()) {
    this.rootDir = resolve(rootDir);
    this.configLoader = new ConfigLoader(rootDir);
  }

  /**
   * Validate the entire monorepo configuration
   */
  async validateConfig(): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    try {
      const config = await this.configLoader.loadConfig();

      // Validate basic structure
      this.validateBasicStructure(config, errors, warnings);

      // Validate applications
      for (const app of config.apps) {
        await this.validateApp(app, errors, warnings);
      }

      // Validate packages
      for (const pkg of config.packages) {
        await this.validatePackage(pkg, errors, warnings);
      }

      // Validate dependencies
      await this.validateDependencies(config, errors, warnings);

      // Validate workspace structure
      this.validateWorkspaceStructure(config, errors, warnings);

    } catch (error) {
      errors.push({
        type: 'error',
        category: 'config',
        message: `Failed to load configuration: ${error}`,
        suggestion: 'Check your configuration file syntax and structure'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Validate basic monorepo structure
   */
  private validateBasicStructure(config: MonorepoConfig, errors: ValidationError[], warnings: ValidationError[]): void {
    // Check required directories exist
    const requiredDirs = ['apps', 'packages'];
    
    for (const dir of requiredDirs) {
      const dirPath = join(this.rootDir, dir);
      if (!existsSync(dirPath)) {
        errors.push({
          type: 'error',
          category: 'structure',
          message: `Required directory '${dir}' does not exist`,
          path: dirPath,
          suggestion: `Create the '${dir}' directory in your monorepo root`
        });
      }
    }

    // Check package.json exists
    const packageJsonPath = join(this.rootDir, 'package.json');
    if (!existsSync(packageJsonPath)) {
      errors.push({
        type: 'error',
        category: 'structure',
        message: 'Root package.json not found',
        path: packageJsonPath,
        suggestion: 'Create a package.json file in your monorepo root'
      });
    }

    // Validate workspace configuration
    if (!config.workspaces || config.workspaces.length === 0) {
      warnings.push({
        type: 'warning',
        category: 'config',
        message: 'No workspaces configured',
        suggestion: 'Add workspace patterns to your package.json or monorepo config'
      });
    }
  }

  /**
   * Validate individual application configuration
   */
  private async validateApp(app: AppConfig, errors: ValidationError[], warnings: ValidationError[]): Promise<void> {
    const appPath = join(this.rootDir, app.path);

    // Check if app directory exists
    if (!existsSync(appPath)) {
      errors.push({
        type: 'error',
        category: 'structure',
        message: `App directory '${app.path}' does not exist`,
        path: appPath,
        suggestion: `Create the app directory or update the path in configuration`
      });
      return;
    }

    // Check if app has package.json
    const packageJsonPath = join(appPath, 'package.json');
    if (!existsSync(packageJsonPath)) {
      errors.push({
        type: 'error',
        category: 'structure',
        message: `App '${app.name}' is missing package.json`,
        path: packageJsonPath,
        suggestion: 'Create a package.json file for the application'
      });
      return;
    }

    // Validate package.json content
    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      if (packageJson.name !== app.name) {
        warnings.push({
          type: 'warning',
          category: 'config',
          message: `App name mismatch: config says '${app.name}', package.json says '${packageJson.name}'`,
          path: packageJsonPath,
          suggestion: 'Ensure app names are consistent between config and package.json'
        });
      }

      // Validate app type based on dependencies
      this.validateAppType(app, packageJson, errors, warnings);

    } catch (error) {
      errors.push({
        type: 'error',
        category: 'structure',
        message: `Invalid package.json in app '${app.name}': ${error}`,
        path: packageJsonPath,
        suggestion: 'Fix the JSON syntax in the package.json file'
      });
    }

    // Check for required app files based on type
    this.validateAppFiles(app, appPath, errors, warnings);
  }

  /**
   * Validate individual package configuration
   */
  private async validatePackage(pkg: PackageConfig, errors: ValidationError[], warnings: ValidationError[]): Promise<void> {
    const packagePath = join(this.rootDir, pkg.path);

    // Check if package directory exists
    if (!existsSync(packagePath)) {
      errors.push({
        type: 'error',
        category: 'structure',
        message: `Package directory '${pkg.path}' does not exist`,
        path: packagePath,
        suggestion: 'Create the package directory or update the path in configuration'
      });
      return;
    }

    // Check if package has package.json
    const packageJsonPath = join(packagePath, 'package.json');
    if (!existsSync(packageJsonPath)) {
      errors.push({
        type: 'error',
        category: 'structure',
        message: `Package '${pkg.name}' is missing package.json`,
        path: packageJsonPath,
        suggestion: 'Create a package.json file for the package'
      });
      return;
    }

    // Validate package.json content
    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      
      if (packageJson.name !== pkg.name) {
        warnings.push({
          type: 'warning',
          category: 'config',
          message: `Package name mismatch: config says '${pkg.name}', package.json says '${packageJson.name}'`,
          path: packageJsonPath,
          suggestion: 'Ensure package names are consistent between config and package.json'
        });
      }

      // Check main entry point exists
      if (packageJson.main) {
        const mainPath = join(packagePath, packageJson.main);
        if (!existsSync(mainPath)) {
          errors.push({
            type: 'error',
            category: 'structure',
            message: `Package '${pkg.name}' main entry point '${packageJson.main}' does not exist`,
            path: mainPath,
            suggestion: 'Create the main entry point file or update the main field in package.json'
          });
        }
      }

      // Check TypeScript configuration for TypeScript packages
      if (packageJson.types || existsSync(join(packagePath, 'tsconfig.json'))) {
        this.validateTypeScriptPackage(pkg, packagePath, errors, warnings);
      }

    } catch (error) {
      errors.push({
        type: 'error',
        category: 'structure',
        message: `Invalid package.json in package '${pkg.name}': ${error}`,
        path: packageJsonPath,
        suggestion: 'Fix the JSON syntax in the package.json file'
      });
    }
  }

  /**
   * Validate app type consistency
   */
  private validateAppType(app: AppConfig, packageJson: any, errors: ValidationError[], warnings: ValidationError[]): void {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (app.type === 'mobile') {
      if (!deps.expo && !deps['react-native']) {
        warnings.push({
          type: 'warning',
          category: 'config',
          message: `Mobile app '${app.name}' is missing Expo or React Native dependencies`,
          suggestion: 'Add expo or react-native to dependencies for mobile apps'
        });
      }
    } else if (app.type === 'web') {
      if (!deps['react-dom'] && !deps.next && !deps.vite) {
        warnings.push({
          type: 'warning',
          category: 'config',
          message: `Web app '${app.name}' is missing web framework dependencies`,
          suggestion: 'Add react-dom, next, or vite to dependencies for web apps'
        });
      }
    }
  }

  /**
   * Validate required app files
   */
  private validateAppFiles(app: AppConfig, appPath: string, errors: ValidationError[], warnings: ValidationError[]): void {
    const requiredFiles: Record<string, string[]> = {
      mobile: ['App.tsx', 'app.config.ts'],
      web: ['index.html', 'src/main.tsx']
    };

    const files = requiredFiles[app.type] || [];
    
    for (const file of files) {
      const filePath = join(appPath, file);
      if (!existsSync(filePath)) {
        warnings.push({
          type: 'warning',
          category: 'structure',
          message: `App '${app.name}' is missing recommended file '${file}'`,
          path: filePath,
          suggestion: `Create the '${file}' file for proper ${app.type} app structure`
        });
      }
    }
  }

  /**
   * Validate TypeScript package configuration
   */
  private validateTypeScriptPackage(pkg: PackageConfig, packagePath: string, errors: ValidationError[], warnings: ValidationError[]): void {
    const tsconfigPath = join(packagePath, 'tsconfig.json');
    
    if (!existsSync(tsconfigPath)) {
      warnings.push({
        type: 'warning',
        category: 'structure',
        message: `TypeScript package '${pkg.name}' is missing tsconfig.json`,
        path: tsconfigPath,
        suggestion: 'Create a tsconfig.json file for TypeScript packages'
      });
      return;
    }

    try {
      const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf-8'));
      
      if (!tsconfig.compilerOptions?.declaration) {
        warnings.push({
          type: 'warning',
          category: 'config',
          message: `Package '${pkg.name}' should generate TypeScript declarations`,
          path: tsconfigPath,
          suggestion: 'Set "declaration": true in tsconfig.json compilerOptions'
        });
      }
    } catch (error) {
      errors.push({
        type: 'error',
        category: 'structure',
        message: `Invalid tsconfig.json in package '${pkg.name}': ${error}`,
        path: tsconfigPath,
        suggestion: 'Fix the JSON syntax in the tsconfig.json file'
      });
    }
  }

  /**
   * Validate dependencies across the monorepo
   */
  private async validateDependencies(config: MonorepoConfig, errors: ValidationError[], warnings: ValidationError[]): Promise<void> {
    const allPackages = new Set(config.packages.map(pkg => pkg.name));
    
    // Check for circular dependencies
    const dependencyGraph = new Map<string, Set<string>>();
    
    // Build dependency graph
    for (const pkg of config.packages) {
      dependencyGraph.set(pkg.name, new Set(pkg.dependencies.filter(dep => allPackages.has(dep))));
    }
    
    for (const app of config.apps) {
      dependencyGraph.set(app.name, new Set(app.dependencies.filter(dep => allPackages.has(dep))));
    }
    
    // Detect circular dependencies
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    const detectCycle = (node: string, path: string[]): boolean => {
      if (recursionStack.has(node)) {
        const cycleStart = path.indexOf(node);
        const cycle = path.slice(cycleStart).concat(node);
        errors.push({
          type: 'error',
          category: 'dependency',
          message: `Circular dependency detected: ${cycle.join(' -> ')}`,
          suggestion: 'Remove circular dependencies between packages'
        });
        return true;
      }
      
      if (visited.has(node)) {
        return false;
      }
      
      visited.add(node);
      recursionStack.add(node);
      
      const dependencies = dependencyGraph.get(node) || new Set();
      for (const dep of dependencies) {
        if (detectCycle(dep, [...path, node])) {
          return true;
        }
      }
      
      recursionStack.delete(node);
      return false;
    };
    
    for (const node of dependencyGraph.keys()) {
      if (!visited.has(node)) {
        detectCycle(node, []);
      }
    }
  }

  /**
   * Validate workspace structure
   */
  private validateWorkspaceStructure(config: MonorepoConfig, errors: ValidationError[], warnings: ValidationError[]): void {
    // Check if workspace patterns match actual structure
    for (const pattern of config.workspaces) {
      if (pattern.includes('*')) {
        const baseDir = pattern.replace('/*', '');
        const basePath = join(this.rootDir, baseDir);
        
        if (!existsSync(basePath)) {
          warnings.push({
            type: 'warning',
            category: 'structure',
            message: `Workspace pattern '${pattern}' points to non-existent directory '${baseDir}'`,
            path: basePath,
            suggestion: `Create the '${baseDir}' directory or update the workspace pattern`
          });
        }
      }
    }
  }

  /**
   * Generate a validation report
   */
  generateReport(result: ValidationResult): string {
    const lines: string[] = [];
    
    lines.push('='.repeat(50));
    lines.push('MONOREPO CONFIGURATION VALIDATION REPORT');
    lines.push('='.repeat(50));
    lines.push('');
    
    if (result.valid) {
      lines.push('✅ Configuration is valid!');
    } else {
      lines.push('❌ Configuration has errors that need to be fixed.');
    }
    
    lines.push('');
    lines.push(`Errors: ${result.errors.length}`);
    lines.push(`Warnings: ${result.warnings.length}`);
    lines.push('');
    
    if (result.errors.length > 0) {
      lines.push('ERRORS:');
      lines.push('-'.repeat(20));
      
      for (const error of result.errors) {
        lines.push(`❌ [${error.category.toUpperCase()}] ${error.message}`);
        if (error.path) {
          lines.push(`   Path: ${error.path}`);
        }
        if (error.suggestion) {
          lines.push(`   💡 ${error.suggestion}`);
        }
        lines.push('');
      }
    }
    
    if (result.warnings.length > 0) {
      lines.push('WARNINGS:');
      lines.push('-'.repeat(20));
      
      for (const warning of result.warnings) {
        lines.push(`⚠️  [${warning.category.toUpperCase()}] ${warning.message}`);
        if (warning.path) {
          lines.push(`   Path: ${warning.path}`);
        }
        if (warning.suggestion) {
          lines.push(`   💡 ${warning.suggestion}`);
        }
        lines.push('');
      }
    }
    
    return lines.join('\n');
  }
}
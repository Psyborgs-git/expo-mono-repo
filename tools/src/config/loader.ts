import { readFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';
import { MonorepoConfig, MonorepoConfigSchema, EnvironmentConfig, EnvironmentConfigSchema, Environment } from './schema';

/**
 * Configuration file names to search for
 */
const CONFIG_FILES = [
  'monorepo.config.json',
  'monorepo.config.js',
  '.monoreporc.json',
  '.monoreporc.js',
];

/**
 * Environment-specific configuration file patterns
 */
const ENV_CONFIG_PATTERNS = [
  'monorepo.{env}.config.json',
  'monorepo.{env}.config.js',
  '.monoreporc.{env}.json',
  '.monoreporc.{env}.js',
];

export class ConfigLoader {
  private rootDir: string;
  private cache = new Map<string, any>();

  constructor(rootDir: string = process.cwd()) {
    this.rootDir = resolve(rootDir);
  }

  /**
   * Load the main monorepo configuration
   */
  async loadConfig(): Promise<MonorepoConfig> {
    const cacheKey = 'main-config';
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let config: Partial<MonorepoConfig> = {};

    // Try to load from configuration files
    for (const configFile of CONFIG_FILES) {
      const configPath = join(this.rootDir, configFile);
      if (existsSync(configPath)) {
        const fileConfig = await this.loadConfigFile(configPath);
        config = { ...config, ...fileConfig };
        break;
      }
    }

    // Load from package.json if no dedicated config file found
    if (Object.keys(config).length === 0) {
      config = await this.loadFromPackageJson();
    }

    // Auto-discover apps and packages if not specified
    if (!config.apps || config.apps.length === 0) {
      config.apps = await this.discoverApps();
    }

    if (!config.packages || config.packages.length === 0) {
      config.packages = await this.discoverPackages();
    }

    // Validate and parse the configuration
    const validatedConfig = MonorepoConfigSchema.parse(config);
    
    this.cache.set(cacheKey, validatedConfig);
    return validatedConfig;
  }

  /**
   * Load environment-specific configuration
   */
  async loadEnvironmentConfig(environment: Environment): Promise<EnvironmentConfig> {
    const cacheKey = `env-config-${environment}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    let config: Partial<EnvironmentConfig> = { environment };

    // Try to load environment-specific configuration files
    for (const pattern of ENV_CONFIG_PATTERNS) {
      const configFile = pattern.replace('{env}', environment);
      const configPath = join(this.rootDir, configFile);
      
      if (existsSync(configPath)) {
        const fileConfig = await this.loadConfigFile(configPath);
        config = { ...config, ...fileConfig };
        break;
      }
    }

    const validatedConfig = EnvironmentConfigSchema.parse(config);
    
    this.cache.set(cacheKey, validatedConfig);
    return validatedConfig;
  }

  /**
   * Merge main config with environment-specific config
   */
  async loadMergedConfig(environment?: Environment): Promise<MonorepoConfig> {
    const mainConfig = await this.loadConfig();
    
    if (!environment) {
      return mainConfig;
    }

    const envConfig = await this.loadEnvironmentConfig(environment);
    
    // Deep merge configurations
    return this.deepMerge(mainConfig, {
      apps: mainConfig.apps.map(app => ({
        ...app,
        environment: { ...app.environment, ...envConfig.apps[app.name] || {} }
      })),
      packages: mainConfig.packages.map(pkg => ({
        ...pkg,
        ...envConfig.packages[pkg.name] || {}
      })),
      tools: {
        ...mainConfig.tools,
        build: { ...mainConfig.tools.build, ...envConfig.build },
      }
    });
  }

  /**
   * Load configuration from a specific file
   */
  private async loadConfigFile(configPath: string): Promise<any> {
    try {
      if (configPath.endsWith('.json')) {
        const content = readFileSync(configPath, 'utf-8');
        return JSON.parse(content);
      } else if (configPath.endsWith('.js')) {
        // Dynamic import for JS config files
        const module = await import(configPath);
        return module.default || module;
      }
    } catch (error) {
      throw new Error(`Failed to load config from ${configPath}: ${error}`);
    }
    
    return {};
  }

  /**
   * Load configuration from package.json
   */
  private async loadFromPackageJson(): Promise<Partial<MonorepoConfig>> {
    const packageJsonPath = join(this.rootDir, 'package.json');
    
    if (!existsSync(packageJsonPath)) {
      throw new Error('No package.json found in root directory');
    }

    try {
      const content = readFileSync(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(content);
      
      return {
        name: packageJson.name || 'monorepo',
        version: packageJson.version || '0.1.0',
        workspaces: packageJson.workspaces || ['apps/*', 'packages/*'],
        packageManager: this.detectPackageManager(),
        // Extract monorepo-specific config if present
        ...packageJson.monorepo || {}
      };
    } catch (error) {
      throw new Error(`Failed to load package.json: ${error}`);
    }
  }

  /**
   * Auto-discover applications in the apps directory
   */
  private async discoverApps(): Promise<any[]> {
    const appsDir = join(this.rootDir, 'apps');
    if (!existsSync(appsDir)) {
      return [];
    }

    const { readdirSync, statSync } = await import('fs');
    const apps = [];

    try {
      const entries = readdirSync(appsDir);
      
      for (const entry of entries) {
        const appPath = join(appsDir, entry);
        const packageJsonPath = join(appPath, 'package.json');
        
        if (statSync(appPath).isDirectory() && existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
          
          apps.push({
            name: packageJson.name || entry,
            type: this.detectAppType(appPath),
            path: `apps/${entry}`,
            dependencies: Object.keys(packageJson.dependencies || {}),
            platforms: this.detectPlatforms(appPath),
          });
        }
      }
    } catch (error) {
      console.warn(`Failed to discover apps: ${error}`);
    }

    return apps;
  }

  /**
   * Auto-discover packages in the packages directory
   */
  private async discoverPackages(): Promise<any[]> {
    const packagesDir = join(this.rootDir, 'packages');
    if (!existsSync(packagesDir)) {
      return [];
    }

    const { readdirSync, statSync } = await import('fs');
    const packages = [];

    try {
      const entries = readdirSync(packagesDir);
      
      for (const entry of entries) {
        const packagePath = join(packagesDir, entry);
        const packageJsonPath = join(packagePath, 'package.json');
        
        if (statSync(packagePath).isDirectory() && existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
          
          packages.push({
            name: packageJson.name || entry,
            type: this.detectPackageType(entry, packagePath),
            path: `packages/${entry}`,
            dependencies: Object.keys(packageJson.dependencies || {}),
            peerDependencies: Object.keys(packageJson.peerDependencies || {}),
            exports: packageJson.exports ? Object.keys(packageJson.exports) : [packageJson.main || 'index.js'],
          });
        }
      }
    } catch (error) {
      console.warn(`Failed to discover packages: ${error}`);
    }

    return packages;
  }

  /**
   * Detect application type based on dependencies and structure
   */
  private detectAppType(appPath: string): 'mobile' | 'web' {
    const packageJsonPath = join(appPath, 'package.json');
    
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
      const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      if (deps.expo || deps['react-native']) {
        return 'mobile';
      }
      
      if (deps['react-dom'] || deps.next || deps.vite) {
        return 'web';
      }
    }
    
    return 'mobile'; // Default to mobile for Expo monorepo
  }

  /**
   * Detect supported platforms for an app
   */
  private detectPlatforms(appPath: string): string[] {
    const appType = this.detectAppType(appPath);
    
    if (appType === 'mobile') {
      return ['mobile'];
    }
    
    return ['web'];
  }

  /**
   * Detect package type based on name and structure
   */
  private detectPackageType(name: string, packagePath: string): string {
    if (name.includes('ui') || name.includes('design')) {
      return 'ui';
    }
    
    if (name.includes('component')) {
      return 'component';
    }
    
    if (name.includes('network') || name.includes('api')) {
      return 'network';
    }
    
    return 'utility';
  }

  /**
   * Detect package manager being used
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

  /**
   * Deep merge two objects
   */
  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    }
    
    return result;
  }

  /**
   * Clear the configuration cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}
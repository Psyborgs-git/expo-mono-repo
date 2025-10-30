import { ConfigLoader } from './loader';
import { ConfigValidator } from './validator';
import { MonorepoConfig, Environment } from './schema';

/**
 * Utility functions for working with monorepo configuration
 */
export class ConfigUtils {
  private static loader = new ConfigLoader();
  private static validator = new ConfigValidator();

  /**
   * Get configuration for a specific environment
   */
  static async getConfig(environment?: Environment): Promise<MonorepoConfig> {
    return environment 
      ? await this.loader.loadMergedConfig(environment)
      : await this.loader.loadConfig();
  }

  /**
   * Validate the current configuration
   */
  static async validateConfig() {
    return await this.validator.validateConfig();
  }

  /**
   * Get configuration for a specific app
   */
  static async getAppConfig(appName: string, environment?: Environment) {
    const config = await this.getConfig(environment);
    return config.apps.find(app => app.name === appName);
  }

  /**
   * Get configuration for a specific package
   */
  static async getPackageConfig(packageName: string) {
    const config = await this.getConfig();
    return config.packages.find(pkg => pkg.name === packageName);
  }

  /**
   * Get all apps of a specific type
   */
  static async getAppsByType(type: 'mobile' | 'web', environment?: Environment) {
    const config = await this.getConfig(environment);
    return config.apps.filter(app => app.type === type);
  }

  /**
   * Get all packages of a specific type
   */
  static async getPackagesByType(type: string) {
    const config = await this.getConfig();
    return config.packages.filter(pkg => pkg.type === type);
  }

  /**
   * Check if an app exists
   */
  static async hasApp(appName: string): Promise<boolean> {
    const config = await this.getConfig();
    return config.apps.some(app => app.name === appName);
  }

  /**
   * Check if a package exists
   */
  static async hasPackage(packageName: string): Promise<boolean> {
    const config = await this.getConfig();
    return config.packages.some(pkg => pkg.name === packageName);
  }

  /**
   * Get dependency graph for packages
   */
  static async getDependencyGraph() {
    const config = await this.getConfig();
    const graph = new Map<string, string[]>();
    
    // Add package dependencies
    for (const pkg of config.packages) {
      const internalDeps = pkg.dependencies.filter(dep => 
        config.packages.some(p => p.name === dep)
      );
      graph.set(pkg.name, internalDeps);
    }
    
    // Add app dependencies
    for (const app of config.apps) {
      const internalDeps = app.dependencies.filter(dep => 
        config.packages.some(p => p.name === dep)
      );
      graph.set(app.name, internalDeps);
    }
    
    return graph;
  }

  /**
   * Clear configuration cache
   */
  static clearCache(): void {
    this.loader.clearCache();
  }
}
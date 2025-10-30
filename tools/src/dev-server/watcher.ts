import { EventEmitter } from 'events';
import { watch, FSWatcher } from 'chokidar';
import { join, relative, resolve } from 'path';
import { existsSync } from 'fs';
import { ConfigLoader } from '../config/loader';
import { MonorepoConfig, PackageConfig } from '../config/schema';

export interface FileChangeEvent {
  type: 'add' | 'change' | 'unlink';
  path: string;
  relativePath: string;
  packageName?: string;
  affectedApps: string[];
  timestamp: Date;
}

export interface PackageChangeEvent {
  packageName: string;
  packagePath: string;
  changedFiles: string[];
  dependentApps: string[];
  timestamp: Date;
}

export interface WatcherOptions {
  rootDir?: string;
  ignored?: string[];
  debounceMs?: number;
  includeNodeModules?: boolean;
}

/**
 * File watcher for development with package change detection and hot reload coordination
 */
export class FileWatcher extends EventEmitter {
  private watchers = new Map<string, FSWatcher>();
  private config: MonorepoConfig | null = null;
  private configLoader: ConfigLoader;
  private rootDir: string;
  private options: WatcherOptions;
  private debounceTimers = new Map<string, NodeJS.Timeout>();
  private packageDependencyGraph = new Map<string, string[]>();

  constructor(options: WatcherOptions = {}) {
    super();
    this.rootDir = resolve(options.rootDir || process.cwd());
    this.configLoader = new ConfigLoader(this.rootDir);
    this.options = {
      debounceMs: 300,
      includeNodeModules: false,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/.cache/**',
        '**/coverage/**',
        '**/.expo/**',
        '**/.tamagui/**',
      ],
      ...options,
    };
  }

  /**
   * Initialize the watcher by loading configuration and setting up watchers
   */
  async initialize(): Promise<void> {
    this.config = await this.configLoader.loadConfig();
    this.buildDependencyGraph();
    await this.setupWatchers();
    this.emit('initialized', { packagesCount: this.config.packages.length });
  }

  /**
   * Start watching for file changes
   */
  async start(): Promise<void> {
    if (!this.config) {
      throw new Error('Watcher not initialized. Call initialize() first.');
    }

    // Start all watchers
    for (const [packageName, watcher] of this.watchers) {
      watcher.on('ready', () => {
        this.emit('watcherReady', { packageName });
      });
    }

    this.emit('started');
  }

  /**
   * Stop all watchers
   */
  async stop(): Promise<void> {
    const closePromises = Array.from(this.watchers.values()).map(watcher => 
      watcher.close()
    );

    await Promise.all(closePromises);
    this.watchers.clear();
    
    // Clear debounce timers
    for (const timer of this.debounceTimers.values()) {
      clearTimeout(timer);
    }
    this.debounceTimers.clear();

    this.emit('stopped');
  }

  /**
   * Add a custom watch path
   */
  addWatchPath(path: string, packageName?: string): void {
    const absolutePath = resolve(this.rootDir, path);
    
    if (!existsSync(absolutePath)) {
      throw new Error(`Watch path does not exist: ${absolutePath}`);
    }

    const watcherKey = packageName || path;
    
    if (this.watchers.has(watcherKey)) {
      return; // Already watching
    }

    const watcher = watch(absolutePath, {
      ignored: this.options.ignored,
      ignoreInitial: true,
      persistent: true,
    });

    this.setupWatcherEvents(watcher, packageName);
    this.watchers.set(watcherKey, watcher);
  }

  /**
   * Remove a watch path
   */
  removeWatchPath(packageName: string): void {
    const watcher = this.watchers.get(packageName);
    if (watcher) {
      watcher.close();
      this.watchers.delete(packageName);
    }
  }

  /**
   * Get dependency graph for packages
   */
  getDependencyGraph(): Map<string, string[]> {
    return new Map(this.packageDependencyGraph);
  }

  /**
   * Get apps that depend on a specific package
   */
  getDependentApps(packageName: string): string[] {
    if (!this.config) return [];

    return this.config.apps
      .filter(app => app.dependencies.includes(packageName))
      .map(app => app.name);
  }

  /**
   * Setup watchers for all packages
   */
  private async setupWatchers(): Promise<void> {
    if (!this.config) return;

    for (const pkg of this.config.packages) {
      const packagePath = join(this.rootDir, pkg.path);
      
      if (existsSync(packagePath)) {
        const watcher = watch(join(packagePath, 'src'), {
          ignored: this.options.ignored,
          ignoreInitial: true,
          persistent: true,
        });

        this.setupWatcherEvents(watcher, pkg.name);
        this.watchers.set(pkg.name, watcher);
      }
    }
  }

  /**
   * Setup event listeners for a watcher
   */
  private setupWatcherEvents(watcher: FSWatcher, packageName?: string): void {
    watcher.on('add', (path) => this.handleFileChange('add', path, packageName));
    watcher.on('change', (path) => this.handleFileChange('change', path, packageName));
    watcher.on('unlink', (path) => this.handleFileChange('unlink', path, packageName));
    
    watcher.on('error', (error) => {
      this.emit('error', { packageName, error });
    });
  }

  /**
   * Handle file change events with debouncing
   */
  private handleFileChange(type: 'add' | 'change' | 'unlink', filePath: string, packageName?: string): void {
    const relativePath = relative(this.rootDir, filePath);
    
    // Determine which package this file belongs to if not specified
    if (!packageName) {
      packageName = this.getPackageForFile(filePath);
    }

    const affectedApps = packageName ? this.getDependentApps(packageName) : [];

    const changeEvent: FileChangeEvent = {
      type,
      path: filePath,
      relativePath,
      packageName,
      affectedApps,
      timestamp: new Date(),
    };

    // Emit immediate file change event
    this.emit('fileChange', changeEvent);

    // Debounce package change events
    if (packageName) {
      this.debouncePackageChange(packageName, changeEvent);
    }
  }

  /**
   * Debounce package change events to avoid excessive rebuilds
   */
  private debouncePackageChange(packageName: string, changeEvent: FileChangeEvent): void {
    // Clear existing timer
    const existingTimer = this.debounceTimers.get(packageName);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      this.emitPackageChange(packageName, [changeEvent]);
      this.debounceTimers.delete(packageName);
    }, this.options.debounceMs);

    this.debounceTimers.set(packageName, timer);
  }

  /**
   * Emit package change event
   */
  private emitPackageChange(packageName: string, changes: FileChangeEvent[]): void {
    if (!this.config) return;

    const pkg = this.config.packages.find(p => p.name === packageName);
    if (!pkg) return;

    const packageChangeEvent: PackageChangeEvent = {
      packageName,
      packagePath: join(this.rootDir, pkg.path),
      changedFiles: changes.map(c => c.relativePath),
      dependentApps: this.getDependentApps(packageName),
      timestamp: new Date(),
    };

    this.emit('packageChange', packageChangeEvent);
  }

  /**
   * Determine which package a file belongs to
   */
  private getPackageForFile(filePath: string): string | undefined {
    if (!this.config) return undefined;

    const relativePath = relative(this.rootDir, filePath);
    
    for (const pkg of this.config.packages) {
      if (relativePath.startsWith(pkg.path)) {
        return pkg.name;
      }
    }

    return undefined;
  }

  /**
   * Build dependency graph for packages and apps
   */
  private buildDependencyGraph(): void {
    if (!this.config) return;

    this.packageDependencyGraph.clear();

    // Build package dependencies
    for (const pkg of this.config.packages) {
      const dependencies = pkg.dependencies.filter(dep => 
        this.config!.packages.some(p => p.name === dep)
      );
      this.packageDependencyGraph.set(pkg.name, dependencies);
    }

    // Add app dependencies
    for (const app of this.config.apps) {
      const dependencies = app.dependencies.filter(dep => 
        this.config!.packages.some(p => p.name === dep)
      );
      this.packageDependencyGraph.set(app.name, dependencies);
    }
  }
}

/**
 * Hot Module Reload coordinator for packages and apps
 */
export class HMRCoordinator extends EventEmitter {
  private fileWatcher: FileWatcher;
  private rootDir: string;
  private config: MonorepoConfig | null = null;
  private configLoader: ConfigLoader;

  constructor(rootDir: string = process.cwd()) {
    super();
    this.rootDir = rootDir;
    this.configLoader = new ConfigLoader(rootDir);
    this.fileWatcher = new FileWatcher({ rootDir });
    this.setupWatcherListeners();
  }

  /**
   * Initialize the HMR coordinator
   */
  async initialize(): Promise<void> {
    this.config = await this.configLoader.loadConfig();
    await this.fileWatcher.initialize();
    this.emit('initialized');
  }

  /**
   * Start HMR coordination
   */
  async start(): Promise<void> {
    await this.fileWatcher.start();
    this.emit('started');
  }

  /**
   * Stop HMR coordination
   */
  async stop(): Promise<void> {
    await this.fileWatcher.stop();
    this.emit('stopped');
  }

  /**
   * Trigger rebuild for a specific package
   */
  async triggerPackageRebuild(packageName: string): Promise<void> {
    if (!this.config) return;

    const pkg = this.config.packages.find(p => p.name === packageName);
    if (!pkg) {
      throw new Error(`Package not found: ${packageName}`);
    }

    this.emit('packageRebuildTriggered', { packageName });

    try {
      // Execute build command if specified
      if (pkg.buildCommand) {
        const { spawn } = require('child_process');
        const packagePath = join(this.rootDir, pkg.path);
        
        await new Promise<void>((resolve, reject) => {
          const [command, ...args] = pkg.buildCommand!.split(' ');
          const process = spawn(command, args, {
            cwd: packagePath,
            stdio: 'pipe',
          });

          process.on('exit', (code) => {
            if (code === 0) {
              resolve();
            } else {
              reject(new Error(`Build failed with code ${code}`));
            }
          });

          process.on('error', reject);
        });
      }

      this.emit('packageRebuilt', { packageName });
    } catch (error) {
      this.emit('packageRebuildFailed', { packageName, error });
      throw error;
    }
  }

  /**
   * Get file watcher instance
   */
  getFileWatcher(): FileWatcher {
    return this.fileWatcher;
  }

  /**
   * Setup listeners for file watcher events
   */
  private setupWatcherListeners(): void {
    this.fileWatcher.on('packageChange', async (event: PackageChangeEvent) => {
      this.emit('packageChanged', event);

      // Trigger rebuild for changed package
      try {
        await this.triggerPackageRebuild(event.packageName);
        
        // Notify dependent apps about the change
        for (const appName of event.dependentApps) {
          this.emit('appShouldReload', { 
            appName, 
            changedPackage: event.packageName,
            changedFiles: event.changedFiles,
          });
        }
      } catch (error) {
        this.emit('error', { packageName: event.packageName, error });
      }
    });

    this.fileWatcher.on('fileChange', (event: FileChangeEvent) => {
      this.emit('fileChanged', event);
    });

    this.fileWatcher.on('error', (error) => {
      this.emit('error', error);
    });
  }
}
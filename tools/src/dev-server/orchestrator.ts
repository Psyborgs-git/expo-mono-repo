import { EventEmitter } from 'events';
import { DevServerManager } from './manager';
import { HMRCoordinator } from './watcher';
import { DevMonitor, StatusDashboard } from './monitor';

export interface OrchestratorOptions {
  rootDir?: string;
  autoStart?: boolean;
  monitoringEnabled?: boolean;
  dashboardEnabled?: boolean;
}

/**
 * Main orchestrator that coordinates all development server functionality
 */
export class DevOrchestrator extends EventEmitter {
  private serverManager: DevServerManager;
  private hmrCoordinator: HMRCoordinator;
  private monitor: DevMonitor | null = null;
  private dashboard: StatusDashboard | null = null;
  private options: OrchestratorOptions;
  private initialized = false;

  constructor(options: OrchestratorOptions = {}) {
    super();
    this.options = {
      autoStart: true,
      monitoringEnabled: true,
      dashboardEnabled: true,
      ...options,
    };

    const rootDir = options.rootDir || process.cwd();
    
    this.serverManager = new DevServerManager(rootDir);
    this.hmrCoordinator = new HMRCoordinator(rootDir);

    if (this.options.monitoringEnabled) {
      this.monitor = new DevMonitor(this.serverManager, this.hmrCoordinator);
      
      if (this.options.dashboardEnabled) {
        this.dashboard = new StatusDashboard(this.monitor);
      }
    }

    this.setupEventListeners();
  }

  /**
   * Initialize the orchestrator
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize components in order
      await this.serverManager.initialize();
      await this.hmrCoordinator.initialize();

      if (this.options.autoStart) {
        await this.hmrCoordinator.start();
        
        if (this.monitor) {
          this.monitor.start();
        }
        
        if (this.dashboard) {
          this.dashboard.start();
        }
      }

      this.initialized = true;
      this.emit('initialized');
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  /**
   * Start development for a specific app
   */
  async startApp(appName: string, options?: { port?: number; env?: Record<string, string> }): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const server = await this.serverManager.startApp(appName, options);
      this.emit('appStarted', { appName, server });
    } catch (error) {
      this.emit('appStartFailed', { appName, error });
      throw error;
    }
  }

  /**
   * Stop development for a specific app
   */
  async stopApp(appName: string): Promise<void> {
    try {
      await this.serverManager.stopApp(appName);
      this.emit('appStopped', { appName });
    } catch (error) {
      this.emit('appStopFailed', { appName, error });
      throw error;
    }
  }

  /**
   * Start development for multiple apps
   */
  async startApps(appNames: string[]): Promise<void> {
    const startPromises = appNames.map(appName => 
      this.startApp(appName).catch(error => ({ appName, error }))
    );

    const results = await Promise.all(startPromises);
    const failures = results.filter(result => result && 'error' in result);

    if (failures.length > 0) {
      this.emit('multipleAppStartFailed', { failures });
    }

    this.emit('multipleAppsStarted', { 
      successful: appNames.length - failures.length,
      failed: failures.length,
    });
  }

  /**
   * Stop all running apps
   */
  async stopAll(): Promise<void> {
    try {
      await this.serverManager.stopAll();
      this.emit('allAppsStopped');
    } catch (error) {
      this.emit('stopAllFailed', { error });
      throw error;
    }
  }

  /**
   * Restart a specific app
   */
  async restartApp(appName: string): Promise<void> {
    try {
      const server = await this.serverManager.restartApp(appName);
      this.emit('appRestarted', { appName, server });
    } catch (error) {
      this.emit('appRestartFailed', { appName, error });
      throw error;
    }
  }

  /**
   * Get status of all running apps
   */
  getStatus() {
    return {
      initialized: this.initialized,
      runningApps: this.serverManager.getRunningApps(),
      availableApps: this.serverManager.getAvailableApps(),
      monitoringEnabled: this.options.monitoringEnabled,
      dashboardEnabled: this.options.dashboardEnabled,
    };
  }

  /**
   * Get server manager instance
   */
  getServerManager(): DevServerManager {
    return this.serverManager;
  }

  /**
   * Get HMR coordinator instance
   */
  getHMRCoordinator(): HMRCoordinator {
    return this.hmrCoordinator;
  }

  /**
   * Get monitor instance
   */
  getMonitor(): DevMonitor | null {
    return this.monitor;
  }

  /**
   * Get dashboard instance
   */
  getDashboard(): StatusDashboard | null {
    return this.dashboard;
  }

  /**
   * Shutdown the orchestrator
   */
  async shutdown(): Promise<void> {
    try {
      // Stop all apps
      await this.stopAll();

      // Stop monitoring
      if (this.dashboard) {
        this.dashboard.stop();
      }

      if (this.monitor) {
        this.monitor.stop();
      }

      // Stop HMR coordination
      await this.hmrCoordinator.stop();

      this.initialized = false;
      this.emit('shutdown');
    } catch (error) {
      this.emit('shutdownFailed', { error });
      throw error;
    }
  }

  /**
   * Setup event listeners for cross-component communication
   */
  private setupEventListeners(): void {
    // Forward server manager events
    this.serverManager.on('serverStarted', (event) => {
      this.emit('serverStarted', event);
    });

    this.serverManager.on('serverStopped', (event) => {
      this.emit('serverStopped', event);
    });

    this.serverManager.on('serverStatusChange', (event) => {
      this.emit('serverStatusChange', event);
    });

    // Forward HMR coordinator events
    this.hmrCoordinator.on('packageChanged', (event) => {
      this.emit('packageChanged', event);
    });

    this.hmrCoordinator.on('appShouldReload', (event) => {
      this.emit('appShouldReload', event);
    });

    // Forward monitor events if enabled
    if (this.monitor) {
      this.monitor.on('errorThresholdExceeded', (event) => {
        this.emit('errorThresholdExceeded', event);
      });

      this.monitor.on('healthCheckFailed', (event) => {
        this.emit('healthCheckFailed', event);
      });
    }
  }
}
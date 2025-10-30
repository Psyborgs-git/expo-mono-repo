import { EventEmitter } from 'events';
import { DevServerManager, ServerInfo } from './manager';
import { HMRCoordinator, FileChangeEvent, PackageChangeEvent } from './watcher';
import { LogEntry } from './server';

export interface MonitoringConfig {
  logRetentionMs?: number;
  maxLogsPerApp?: number;
  errorThreshold?: number;
  healthCheckIntervalMs?: number;
}

export interface AggregatedLogEntry extends LogEntry {
  appName: string;
}

export interface ErrorReport {
  appName: string;
  errorCount: number;
  lastError: Date;
  errors: Array<{
    message: string;
    timestamp: Date;
    stack?: string;
  }>;
}

export interface PerformanceMetrics {
  appName: string;
  startupTime?: number;
  buildTime?: number;
  memoryUsage?: number;
  cpuUsage?: number;
  lastUpdated: Date;
}

export interface DashboardData {
  servers: ServerInfo[];
  logs: AggregatedLogEntry[];
  errors: ErrorReport[];
  performance: PerformanceMetrics[];
  fileChanges: FileChangeEvent[];
  packageChanges: PackageChangeEvent[];
  timestamp: Date;
}

/**
 * Development logging and monitoring system
 */
export class DevMonitor extends EventEmitter {
  private serverManager: DevServerManager;
  private hmrCoordinator: HMRCoordinator;
  private config: MonitoringConfig;
  
  private aggregatedLogs: AggregatedLogEntry[] = [];
  private errorReports = new Map<string, ErrorReport>();
  private performanceMetrics = new Map<string, PerformanceMetrics>();
  private recentFileChanges: FileChangeEvent[] = [];
  private recentPackageChanges: PackageChangeEvent[] = [];
  
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private logCleanupInterval: NodeJS.Timeout | null = null;

  constructor(
    serverManager: DevServerManager,
    hmrCoordinator: HMRCoordinator,
    config: MonitoringConfig = {}
  ) {
    super();
    this.serverManager = serverManager;
    this.hmrCoordinator = hmrCoordinator;
    this.config = {
      logRetentionMs: 24 * 60 * 60 * 1000, // 24 hours
      maxLogsPerApp: 1000,
      errorThreshold: 10,
      healthCheckIntervalMs: 30000, // 30 seconds
      ...config,
    };

    this.setupEventListeners();
  }

  /**
   * Start monitoring
   */
  start(): void {
    // Start health check interval
    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, this.config.healthCheckIntervalMs);

    // Start log cleanup interval
    this.logCleanupInterval = setInterval(() => {
      this.cleanupOldLogs();
    }, 60000); // Every minute

    this.emit('started');
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    if (this.logCleanupInterval) {
      clearInterval(this.logCleanupInterval);
      this.logCleanupInterval = null;
    }

    this.emit('stopped');
  }

  /**
   * Get current dashboard data
   */
  getDashboardData(): DashboardData {
    return {
      servers: this.serverManager.getRunningApps(),
      logs: this.getRecentLogs(100),
      errors: Array.from(this.errorReports.values()),
      performance: Array.from(this.performanceMetrics.values()),
      fileChanges: this.recentFileChanges.slice(-50),
      packageChanges: this.recentPackageChanges.slice(-20),
      timestamp: new Date(),
    };
  }

  /**
   * Get logs for a specific app
   */
  getAppLogs(appName: string, limit: number = 100): AggregatedLogEntry[] {
    return this.aggregatedLogs
      .filter(log => log.appName === appName)
      .slice(-limit);
  }

  /**
   * Get error report for a specific app
   */
  getAppErrors(appName: string): ErrorReport | undefined {
    return this.errorReports.get(appName);
  }

  /**
   * Get performance metrics for a specific app
   */
  getAppPerformance(appName: string): PerformanceMetrics | undefined {
    return this.performanceMetrics.get(appName);
  }

  /**
   * Get recent logs across all apps
   */
  getRecentLogs(limit: number = 100): AggregatedLogEntry[] {
    return this.aggregatedLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogEntry['level'], limit: number = 100): AggregatedLogEntry[] {
    return this.aggregatedLogs
      .filter(log => log.level === level)
      .slice(-limit);
  }

  /**
   * Search logs by message content
   */
  searchLogs(query: string, limit: number = 100): AggregatedLogEntry[] {
    const regex = new RegExp(query, 'i');
    return this.aggregatedLogs
      .filter(log => regex.test(log.message))
      .slice(-limit);
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.aggregatedLogs = [];
    this.emit('logsCleared');
  }

  /**
   * Clear logs for a specific app
   */
  clearAppLogs(appName: string): void {
    this.aggregatedLogs = this.aggregatedLogs.filter(log => log.appName !== appName);
    this.emit('appLogsCleared', { appName });
  }

  /**
   * Export logs to JSON
   */
  exportLogs(): string {
    return JSON.stringify({
      logs: this.aggregatedLogs,
      errors: Array.from(this.errorReports.entries()),
      performance: Array.from(this.performanceMetrics.entries()),
      exportedAt: new Date().toISOString(),
    }, null, 2);
  }

  /**
   * Setup event listeners for server manager and HMR coordinator
   */
  private setupEventListeners(): void {
    // Server manager events
    this.serverManager.on('serverLog', (event) => {
      this.handleServerLog(event);
    });

    this.serverManager.on('serverStarted', (event) => {
      this.recordPerformanceMetric(event.appName, 'startup');
      this.addLog(event.appName, 'info', `Server started on ${event.url}`);
    });

    this.serverManager.on('serverStopped', (event) => {
      this.addLog(event.appName, 'info', 'Server stopped');
    });

    this.serverManager.on('serverStatusChange', (event) => {
      this.addLog(event.appName, 'info', `Status changed from ${event.from} to ${event.to}`);
    });

    // HMR coordinator events
    this.hmrCoordinator.on('fileChanged', (event: FileChangeEvent) => {
      this.recentFileChanges.push(event);
      if (this.recentFileChanges.length > 100) {
        this.recentFileChanges = this.recentFileChanges.slice(-100);
      }
      this.emit('fileChanged', event);
    });

    this.hmrCoordinator.on('packageChanged', (event: PackageChangeEvent) => {
      this.recentPackageChanges.push(event);
      if (this.recentPackageChanges.length > 50) {
        this.recentPackageChanges = this.recentPackageChanges.slice(-50);
      }
      this.addLog('system', 'info', `Package ${event.packageName} changed`);
      this.emit('packageChanged', event);
    });

    this.hmrCoordinator.on('packageRebuilt', (event) => {
      this.recordPerformanceMetric(event.packageName, 'build');
      this.addLog('system', 'info', `Package ${event.packageName} rebuilt`);
    });

    this.hmrCoordinator.on('packageRebuildFailed', (event) => {
      this.recordError(event.packageName, `Build failed: ${event.error.message}`);
    });

    this.hmrCoordinator.on('appShouldReload', (event) => {
      this.addLog(event.appName, 'info', `Reloading due to ${event.changedPackage} changes`);
    });
  }

  /**
   * Handle server log events
   */
  private handleServerLog(event: any): void {
    const logEntry: AggregatedLogEntry = {
      ...event,
      appName: event.appName,
    };

    this.aggregatedLogs.push(logEntry);

    // Limit logs per app
    const appLogs = this.aggregatedLogs.filter(log => log.appName === event.appName);
    if (appLogs.length > this.config.maxLogsPerApp!) {
      const excess = appLogs.length - this.config.maxLogsPerApp!;
      this.aggregatedLogs = this.aggregatedLogs.filter(log => 
        log.appName !== event.appName || appLogs.indexOf(log) >= excess
      );
    }

    // Track errors
    if (event.level === 'error') {
      this.recordError(event.appName, event.message);
    }

    this.emit('logAdded', logEntry);
  }

  /**
   * Add a log entry
   */
  private addLog(appName: string, level: LogEntry['level'], message: string): void {
    const logEntry: AggregatedLogEntry = {
      timestamp: new Date(),
      level,
      message,
      source: 'monitor',
      appName,
    };

    this.aggregatedLogs.push(logEntry);
    this.emit('logAdded', logEntry);
  }

  /**
   * Record an error for an app
   */
  private recordError(appName: string, message: string, stack?: string): void {
    let errorReport = this.errorReports.get(appName);
    
    if (!errorReport) {
      errorReport = {
        appName,
        errorCount: 0,
        lastError: new Date(),
        errors: [],
      };
      this.errorReports.set(appName, errorReport);
    }

    errorReport.errorCount++;
    errorReport.lastError = new Date();
    errorReport.errors.push({
      message,
      timestamp: new Date(),
      stack,
    });

    // Keep only last 50 errors per app
    if (errorReport.errors.length > 50) {
      errorReport.errors = errorReport.errors.slice(-50);
    }

    this.emit('errorRecorded', { appName, message });

    // Emit alert if error threshold exceeded
    if (errorReport.errorCount >= this.config.errorThreshold!) {
      this.emit('errorThresholdExceeded', { appName, errorCount: errorReport.errorCount });
    }
  }

  /**
   * Record performance metrics
   */
  private recordPerformanceMetric(appName: string, type: 'startup' | 'build'): void {
    let metrics = this.performanceMetrics.get(appName);
    
    if (!metrics) {
      metrics = {
        appName,
        lastUpdated: new Date(),
      };
      this.performanceMetrics.set(appName, metrics);
    }

    const now = Date.now();
    
    if (type === 'startup') {
      // Record startup time (simplified - would need more sophisticated timing)
      metrics.startupTime = 5000; // Placeholder
    } else if (type === 'build') {
      // Record build time (simplified - would need more sophisticated timing)
      metrics.buildTime = 2000; // Placeholder
    }

    metrics.lastUpdated = new Date();
    this.emit('performanceUpdated', { appName, type });
  }

  /**
   * Perform health check on all running servers
   */
  private async performHealthCheck(): Promise<void> {
    try {
      const healthStatus = await this.serverManager.getHealthStatus();
      
      for (const [appName, health] of Object.entries(healthStatus)) {
        if (health.status === 'error') {
          this.recordError(appName, `Health check failed: ${health.error || 'Unknown error'}`);
        }
      }

      this.emit('healthCheckCompleted', healthStatus);
    } catch (error) {
      this.emit('healthCheckFailed', error);
    }
  }

  /**
   * Clean up old logs based on retention policy
   */
  private cleanupOldLogs(): void {
    const cutoffTime = Date.now() - this.config.logRetentionMs!;
    const initialCount = this.aggregatedLogs.length;
    
    this.aggregatedLogs = this.aggregatedLogs.filter(log => 
      log.timestamp.getTime() > cutoffTime
    );

    const removedCount = initialCount - this.aggregatedLogs.length;
    
    if (removedCount > 0) {
      this.emit('logsCleanedUp', { removedCount });
    }
  }
}

/**
 * Status dashboard for development servers
 */
export class StatusDashboard {
  private monitor: DevMonitor;
  private updateInterval: NodeJS.Timeout | null = null;
  private subscribers = new Set<(data: DashboardData) => void>();

  constructor(monitor: DevMonitor) {
    this.monitor = monitor;
  }

  /**
   * Start the dashboard with automatic updates
   */
  start(updateIntervalMs: number = 1000): void {
    this.updateInterval = setInterval(() => {
      this.broadcastUpdate();
    }, updateIntervalMs);
  }

  /**
   * Stop the dashboard
   */
  stop(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Subscribe to dashboard updates
   */
  subscribe(callback: (data: DashboardData) => void): () => void {
    this.subscribers.add(callback);
    
    // Send initial data
    callback(this.monitor.getDashboardData());
    
    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Get current dashboard data
   */
  getCurrentData(): DashboardData {
    return this.monitor.getDashboardData();
  }

  /**
   * Broadcast update to all subscribers
   */
  private broadcastUpdate(): void {
    const data = this.monitor.getDashboardData();
    
    for (const callback of this.subscribers) {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in dashboard subscriber:', error);
      }
    }
  }
}
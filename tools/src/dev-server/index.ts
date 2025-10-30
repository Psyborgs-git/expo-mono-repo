/**
 * Development server management for monorepo applications
 */
export * from './manager';
export * from './server';
export * from './watcher';
export * from './monitor';
export * from './orchestrator';

// Re-export key types for convenience
export type {
  DevServerOptions,
  LogEntry,
  ServerStatus,
  PortAllocation,
  ServerInfo,
} from './server';
export type { DevServerManager } from './manager';
export type {
  FileChangeEvent,
  PackageChangeEvent,
  WatcherOptions,
  FileWatcher,
  HMRCoordinator,
} from './watcher';
export type {
  MonitoringConfig,
  AggregatedLogEntry,
  ErrorReport,
  PerformanceMetrics,
  DashboardData,
  DevMonitor,
  StatusDashboard,
} from './monitor';
export type {
  OrchestratorOptions,
  DevOrchestrator,
} from './orchestrator';
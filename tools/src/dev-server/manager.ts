import { EventEmitter } from "events";
import { DevServer, LogEntry, ServerStatus } from "./server";
import { ConfigLoader } from "../config/loader";
import { AppConfig, MonorepoConfig } from "../config/schema";

export interface PortAllocation {
  port: number;
  appName: string;
  inUse: boolean;
}

export interface ServerInfo {
  appName: string;
  appType: "mobile" | "web";
  status: ServerStatus;
  port: number;
  url: string;
  uptime: number;
  logs: LogEntry[];
}

/**
 * Development server manager for orchestrating multiple app servers
 */
export class DevServerManager extends EventEmitter {
  private servers = new Map<string, DevServer>();
  private portAllocations = new Map<number, PortAllocation>();
  private config: MonorepoConfig | null = null;
  private configLoader: ConfigLoader;
  private rootDir: string;

  constructor(rootDir: string = process.cwd()) {
    super();
    this.rootDir = rootDir;
    this.configLoader = new ConfigLoader(rootDir);
    this.initializePortRange();
  }

  /**
   * Initialize the manager by loading configuration
   */
  async initialize(): Promise<void> {
    this.config = await this.configLoader.loadConfig();
    this.emit("initialized", { appsCount: this.config.apps.length });
  }

  /**
   * Start a development server for an app
   */
  async startApp(
    appName: string,
    options: { port?: number; env?: Record<string, string> } = {}
  ): Promise<DevServer> {
    if (!this.config) {
      throw new Error("Manager not initialized. Call initialize() first.");
    }

    // Check if server is already running
    if (this.servers.has(appName)) {
      const existingServer = this.servers.get(appName)!;
      if (existingServer.isRunning) {
        throw new Error(`Server for ${appName} is already running`);
      }
    }

    // Find app configuration
    const appConfig = this.config.apps.find((app) => app.name === appName);
    if (!appConfig) {
      throw new Error(`App configuration not found for: ${appName}`);
    }

    // Allocate port
    const port = await this.allocatePort(
      appName,
      options.port || appConfig.port
    );

    // Create and start server
    const server = new DevServer({
      app: appConfig,
      rootDir: this.rootDir,
      port,
      env: options.env,
    });

    // Set up event listeners
    this.setupServerListeners(server);

    // Store server reference
    this.servers.set(appName, server);

    try {
      await server.start();
      this.emit("serverStarted", { appName, port, url: server.url });
      return server;
    } catch (error) {
      // Clean up on failure
      this.servers.delete(appName);
      this.releasePort(port);
      throw error;
    }
  }

  /**
   * Stop a development server
   */
  async stopApp(appName: string): Promise<void> {
    const server = this.servers.get(appName);
    if (!server) {
      throw new Error(`No server found for app: ${appName}`);
    }

    await server.stop();
    this.servers.delete(appName);
    this.releasePort(server.port);
    this.emit("serverStopped", { appName });
  }

  /**
   * Restart a development server
   */
  async restartApp(appName: string): Promise<DevServer> {
    const server = this.servers.get(appName);
    if (!server) {
      throw new Error(`No server found for app: ${appName}`);
    }

    await server.restart();
    this.emit("serverRestarted", { appName });
    return server;
  }

  /**
   * Stop all running servers
   */
  async stopAll(): Promise<void> {
    const stopPromises = Array.from(this.servers.keys()).map((appName) =>
      this.stopApp(appName).catch((error) =>
        console.error(`Failed to stop ${appName}:`, error)
      )
    );

    await Promise.all(stopPromises);
    this.emit("allServersStopped");
  }

  /**
   * Get information about all running servers
   */
  getRunningApps(): ServerInfo[] {
    return Array.from(this.servers.values()).map((server) => ({
      appName: server.appName,
      appType: server.appType,
      status: server.status,
      port: server.port,
      url: server.url,
      uptime: server.uptime,
      logs: server.logs.slice(-50), // Last 50 logs
    }));
  }

  /**
   * Get server instance for an app
   */
  getServer(appName: string): DevServer | undefined {
    return this.servers.get(appName);
  }

  /**
   * Check if an app server is running
   */
  isAppRunning(appName: string): boolean {
    const server = this.servers.get(appName);
    return server ? server.isRunning : false;
  }

  /**
   * Get available apps from configuration
   */
  getAvailableApps(): AppConfig[] {
    return this.config?.apps || [];
  }

  /**
   * Get health status of all servers
   */
  async getHealthStatus(): Promise<Record<string, any>> {
    const healthPromises = Array.from(this.servers.entries()).map(
      async ([appName, server]) => {
        try {
          const health = await server.getHealth();
          return [appName, health];
        } catch (error) {
          return [appName, { status: "error", error: error.message }];
        }
      }
    );

    const healthResults = await Promise.all(healthPromises);
    return Object.fromEntries(healthResults);
  }

  /**
   * Allocate a port for an app
   */
  private async allocatePort(
    appName: string,
    preferredPort?: number
  ): Promise<number> {
    // If preferred port is specified and available, use it
    if (preferredPort && !this.portAllocations.has(preferredPort)) {
      if (await this.isPortAvailable(preferredPort)) {
        this.portAllocations.set(preferredPort, {
          port: preferredPort,
          appName,
          inUse: true,
        });
        return preferredPort;
      }
    }

    // Find next available port
    for (const [port, allocation] of this.portAllocations) {
      if (!allocation.inUse && (await this.isPortAvailable(port))) {
        allocation.inUse = true;
        allocation.appName = appName;
        return port;
      }
    }

    throw new Error(`No available ports for app: ${appName}`);
  }

  /**
   * Release a port allocation
   */
  private releasePort(port: number): void {
    const allocation = this.portAllocations.get(port);
    if (allocation) {
      allocation.inUse = false;
      allocation.appName = "";
    }
  }

  /**
   * Check if a port is available
   */
  private async isPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const { createServer } = require("net");
      const server = createServer();

      server.listen(port, () => {
        server.once("close", () => resolve(true));
        server.close();
      });

      server.on("error", () => resolve(false));
    });
  }

  /**
   * Initialize port allocation range
   */
  private initializePortRange(): void {
    // Mobile apps: 8081-8090
    for (let port = 8081; port <= 8090; port++) {
      this.portAllocations.set(port, {
        port,
        appName: "",
        inUse: false,
      });
    }

    // Web apps: 3000-3010
    for (let port = 3000; port <= 3010; port++) {
      this.portAllocations.set(port, {
        port,
        appName: "",
        inUse: false,
      });
    }
  }

  /**
   * Set up event listeners for a server
   */
  private setupServerListeners(server: DevServer): void {
    server.on("statusChange", (event) => {
      this.emit("serverStatusChange", {
        appName: server.appName,
        ...event,
      });
    });

    server.on("log", (logEntry) => {
      this.emit("serverLog", {
        appName: server.appName,
        ...logEntry,
      });
    });
  }
}

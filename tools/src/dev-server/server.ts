import { EventEmitter } from 'events';
import { spawn, ChildProcess } from 'child_process';
import { join } from 'path';
import { AppConfig } from '../config/schema';

export interface DevServerOptions {
  app: AppConfig;
  rootDir: string;
  port?: number;
  env?: Record<string, string>;
}

export interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source: string;
}

export type ServerStatus = 'starting' | 'running' | 'stopping' | 'stopped' | 'error';

/**
 * Development server implementation for individual apps
 */
export class DevServer extends EventEmitter {
  public readonly appName: string;
  public readonly appType: 'mobile' | 'web';
  public readonly port: number;
  public readonly url: string;
  
  private process: ChildProcess | null = null;
  private _status: ServerStatus = 'stopped';
  private _logs: LogEntry[] = [];
  private startTime: Date | null = null;
  private options: DevServerOptions;

  constructor(options: DevServerOptions) {
    super();
    this.options = options;
    this.appName = options.app.name;
    this.appType = options.app.type;
    this.port = options.port || options.app.port || this.getDefaultPort();
    this.url = this.buildUrl();
  }

  /**
   * Get current server status
   */
  get status(): ServerStatus {
    return this._status;
  }

  /**
   * Get server logs
   */
  get logs(): LogEntry[] {
    return [...this._logs];
  }

  /**
   * Get server uptime in milliseconds
   */
  get uptime(): number {
    return this.startTime ? Date.now() - this.startTime.getTime() : 0;
  }

  /**
   * Check if server is running
   */
  get isRunning(): boolean {
    return this._status === 'running';
  }

  /**
   * Start the development server
   */
  async start(): Promise<void> {
    if (this._status === 'running' || this._status === 'starting') {
      throw new Error(`Server for ${this.appName} is already ${this._status}`);
    }

    this.setStatus('starting');
    this.startTime = new Date();

    try {
      await this.spawnProcess();
      this.log('info', `Development server started on port ${this.port}`);
    } catch (error) {
      this.setStatus('error');
      this.log('error', `Failed to start server: ${error}`);
      throw error;
    }
  }

  /**
   * Stop the development server
   */
  async stop(): Promise<void> {
    if (this._status === 'stopped' || this._status === 'stopping') {
      return;
    }

    this.setStatus('stopping');
    this.log('info', 'Stopping development server...');

    if (this.process) {
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          if (this.process) {
            this.process.kill('SIGKILL');
          }
          resolve();
        }, 5000);

        this.process!.once('exit', () => {
          clearTimeout(timeout);
          this.process = null;
          this.setStatus('stopped');
          this.log('info', 'Development server stopped');
          resolve();
        });

        this.process!.kill('SIGTERM');
      });
    }

    this.setStatus('stopped');
  }

  /**
   * Restart the development server
   */
  async restart(): Promise<void> {
    this.log('info', 'Restarting development server...');
    await this.stop();
    await this.start();
  }

  /**
   * Get health status of the server
   */
  async getHealth(): Promise<{ status: string; uptime: number; port: number; url: string }> {
    return {
      status: this._status,
      uptime: this.uptime,
      port: this.port,
      url: this.url,
    };
  }

  /**
   * Spawn the development server process
   */
  private async spawnProcess(): Promise<void> {
    const { app, rootDir, env = {} } = this.options;
    const appPath = join(rootDir, app.path);
    
    // Determine command and arguments based on app type and configuration
    const { command, args } = this.getStartCommand();

    // Set up environment variables
    const processEnv = {
      ...process.env,
      ...env,
      PORT: this.port.toString(),
      NODE_ENV: 'development',
      ...app.environment,
    };

    this.log('debug', `Starting process: ${command} ${args.join(' ')}`);

    return new Promise((resolve, reject) => {
      this.process = spawn(command, args, {
        cwd: appPath,
        env: processEnv,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      // Handle process output
      this.process.stdout?.on('data', (data) => {
        const message = data.toString().trim();
        if (message) {
          this.log('info', message);
          
          // Check for server ready indicators
          if (this.isServerReady(message)) {
            this.setStatus('running');
            resolve();
          }
        }
      });

      this.process.stderr?.on('data', (data) => {
        const message = data.toString().trim();
        if (message) {
          this.log('error', message);
        }
      });

      // Handle process events
      this.process.on('error', (error) => {
        this.log('error', `Process error: ${error.message}`);
        this.setStatus('error');
        reject(error);
      });

      this.process.on('exit', (code, signal) => {
        this.log('info', `Process exited with code ${code} and signal ${signal}`);
        this.process = null;
        
        if (this._status !== 'stopping') {
          this.setStatus('error');
        }
      });

      // Timeout for server startup
      setTimeout(() => {
        if (this._status === 'starting') {
          this.log('warn', 'Server startup timeout - assuming ready');
          this.setStatus('running');
          resolve();
        }
      }, 30000); // 30 second timeout
    });
  }

  /**
   * Get start command and arguments for the app
   */
  private getStartCommand(): { command: string; args: string[] } {
    const { app } = this.options;

    if (app.startCommand) {
      const parts = app.startCommand.split(' ');
      return {
        command: parts[0],
        args: parts.slice(1),
      };
    }

    // Default commands based on app type
    if (app.type === 'mobile') {
      return {
        command: 'npx',
        args: ['expo', 'start', '--port', this.port.toString(), '--clear'],
      };
    } else {
      return {
        command: 'npm',
        args: ['run', 'dev', '--', '--port', this.port.toString()],
      };
    }
  }

  /**
   * Check if server is ready based on output message
   */
  private isServerReady(message: string): boolean {
    const readyIndicators = [
      'Metro waiting on',
      'Server running on',
      'Local:',
      'ready -',
      'compiled successfully',
      'Development server running',
    ];

    return readyIndicators.some(indicator => 
      message.toLowerCase().includes(indicator.toLowerCase())
    );
  }

  /**
   * Get default port based on app type
   */
  private getDefaultPort(): number {
    return this.appType === 'mobile' ? 8081 : 3000;
  }

  /**
   * Build server URL
   */
  private buildUrl(): string {
    const protocol = this.appType === 'web' ? 'http' : 'exp';
    return `${protocol}://localhost:${this.port}`;
  }

  /**
   * Set server status and emit event
   */
  private setStatus(status: ServerStatus): void {
    const previousStatus = this._status;
    this._status = status;
    
    if (previousStatus !== status) {
      this.emit('statusChange', { from: previousStatus, to: status });
    }
  }

  /**
   * Add log entry and emit event
   */
  private log(level: LogEntry['level'], message: string): void {
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      source: this.appName,
    };

    this._logs.push(entry);
    
    // Keep only last 1000 log entries
    if (this._logs.length > 1000) {
      this._logs = this._logs.slice(-1000);
    }

    this.emit('log', entry);
  }
}
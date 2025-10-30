import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { ConfigLoader } from '../config/loader';
import { MonorepoConfig } from '../config/schema';

export interface DependencyGraph {
  nodes: DependencyNode[];
  edges: DependencyEdge[];
  cycles: string[][];
  orphans: string[];
}

export interface DependencyNode {
  id: string;
  name: string;
  type: 'app' | 'package';
  path: string;
  version?: string;
}

export interface DependencyEdge {
  from: string;
  to: string;
  type: 'dependency' | 'devDependency' | 'peerDependency';
  version?: string;
}

export interface DependencyAnalysis {
  graph: DependencyGraph;
  issues: DependencyIssue[];
  recommendations: string[];
}

export interface DependencyIssue {
  type: 'circular' | 'missing' | 'version-mismatch' | 'unused';
  severity: 'error' | 'warning';
  message: string;
  affected: string[];
  suggestion: string;
}

export class DependencyAnalyzer {
  private rootDir: string;
  private configLoader: ConfigLoader;

  constructor(rootDir: string = process.cwd()) {
    this.rootDir = rootDir;
    this.configLoader = new ConfigLoader(rootDir);
  }

  /**
   * Analyze dependencies across the monorepo
   */
  async analyzeDependencies(): Promise<DependencyAnalysis> {
    const config = await this.configLoader.loadConfig();
    const graph = await this.buildDependencyGraph(config);
    const issues = this.detectIssues(graph, config);
    const recommendations = this.generateRecommendations(graph, issues);

    return {
      graph,
      issues,
      recommendations
    };
  }

  /**
   * Build dependency graph from configuration
   */
  private async buildDependencyGraph(config: MonorepoConfig): Promise<DependencyGraph> {
    const nodes: DependencyNode[] = [];
    const edges: DependencyEdge[] = [];

    // Add package nodes
    for (const pkg of config.packages) {
      const packageJsonPath = join(this.rootDir, pkg.path, 'package.json');
      let version = '0.0.0';
      
      if (existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
          version = packageJson.version || '0.0.0';
        } catch (error) {
          // Use default version if package.json is invalid
        }
      }

      nodes.push({
        id: pkg.name,
        name: pkg.name,
        type: 'package',
        path: pkg.path,
        version
      });
    }

    // Add app nodes
    for (const app of config.apps) {
      const packageJsonPath = join(this.rootDir, app.path, 'package.json');
      let version = '0.0.0';
      
      if (existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
          version = packageJson.version || '0.0.0';
        } catch (error) {
          // Use default version if package.json is invalid
        }
      }

      nodes.push({
        id: app.name,
        name: app.name,
        type: 'app',
        path: app.path,
        version
      });
    }

    // Add dependency edges
    await this.addDependencyEdges(config, edges);

    // Detect cycles
    const cycles = this.detectCycles(nodes, edges);

    // Find orphaned packages
    const orphans = this.findOrphans(nodes, edges);

    return {
      nodes,
      edges,
      cycles,
      orphans
    };
  }

  /**
   * Add dependency edges to the graph
   */
  private async addDependencyEdges(config: MonorepoConfig, edges: DependencyEdge[]): Promise<void> {
    // Process packages
    for (const pkg of config.packages) {
      const packageJsonPath = join(this.rootDir, pkg.path, 'package.json');
      
      if (existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
          
          // Add dependency edges
          this.addEdgesFromDependencies(pkg.name, packageJson.dependencies, 'dependency', edges);
          this.addEdgesFromDependencies(pkg.name, packageJson.devDependencies, 'devDependency', edges);
          this.addEdgesFromDependencies(pkg.name, packageJson.peerDependencies, 'peerDependency', edges);
          
        } catch (error) {
          // Skip invalid package.json files
        }
      }
    }

    // Process apps
    for (const app of config.apps) {
      const packageJsonPath = join(this.rootDir, app.path, 'package.json');
      
      if (existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
          
          // Add dependency edges
          this.addEdgesFromDependencies(app.name, packageJson.dependencies, 'dependency', edges);
          this.addEdgesFromDependencies(app.name, packageJson.devDependencies, 'devDependency', edges);
          
        } catch (error) {
          // Skip invalid package.json files
        }
      }
    }
  }

  /**
   * Add edges from dependencies object
   */
  private addEdgesFromDependencies(
    from: string,
    dependencies: Record<string, string> | undefined,
    type: 'dependency' | 'devDependency' | 'peerDependency',
    edges: DependencyEdge[]
  ): void {
    if (!dependencies) return;

    for (const [name, version] of Object.entries(dependencies)) {
      // Only include workspace dependencies
      if (name.startsWith('@bdt/') || version.startsWith('workspace:')) {
        edges.push({
          from,
          to: name,
          type,
          version
        });
      }
    }
  }

  /**
   * Detect circular dependencies
   */
  private detectCycles(nodes: DependencyNode[], edges: DependencyEdge[]): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const adjacencyList = new Map<string, string[]>();

    // Build adjacency list
    for (const edge of edges) {
      if (!adjacencyList.has(edge.from)) {
        adjacencyList.set(edge.from, []);
      }
      adjacencyList.get(edge.from)!.push(edge.to);
    }

    const dfs = (node: string, path: string[]): void => {
      if (recursionStack.has(node)) {
        // Found a cycle
        const cycleStart = path.indexOf(node);
        if (cycleStart !== -1) {
          const cycle = path.slice(cycleStart).concat(node);
          cycles.push(cycle);
        }
        return;
      }

      if (visited.has(node)) {
        return;
      }

      visited.add(node);
      recursionStack.add(node);

      const neighbors = adjacencyList.get(node) || [];
      for (const neighbor of neighbors) {
        dfs(neighbor, [...path, node]);
      }

      recursionStack.delete(node);
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        dfs(node.id, []);
      }
    }

    return cycles;
  }

  /**
   * Find orphaned packages (not used by any app or package)
   */
  private findOrphans(nodes: DependencyNode[], edges: DependencyEdge[]): string[] {
    const referenced = new Set<string>();
    
    // Collect all referenced packages
    for (const edge of edges) {
      referenced.add(edge.to);
    }

    // Find packages that are not referenced
    const orphans: string[] = [];
    for (const node of nodes) {
      if (node.type === 'package' && !referenced.has(node.id)) {
        orphans.push(node.id);
      }
    }

    return orphans;
  }

  /**
   * Detect dependency issues
   */
  private detectIssues(graph: DependencyGraph, config: MonorepoConfig): DependencyIssue[] {
    const issues: DependencyIssue[] = [];

    // Circular dependency issues
    for (const cycle of graph.cycles) {
      issues.push({
        type: 'circular',
        severity: 'error',
        message: `Circular dependency detected: ${cycle.join(' → ')}`,
        affected: cycle,
        suggestion: 'Refactor packages to remove circular dependencies'
      });
    }

    // Orphaned package issues
    for (const orphan of graph.orphans) {
      issues.push({
        type: 'unused',
        severity: 'warning',
        message: `Package '${orphan}' is not used by any app or package`,
        affected: [orphan],
        suggestion: 'Remove unused package or add it as a dependency where needed'
      });
    }

    // Missing dependency issues
    this.detectMissingDependencies(graph, issues);

    // Version mismatch issues
    this.detectVersionMismatches(graph, config, issues);

    return issues;
  }

  /**
   * Detect missing dependencies
   */
  private detectMissingDependencies(graph: DependencyGraph, issues: DependencyIssue[]): void {
    const nodeIds = new Set(graph.nodes.map(n => n.id));

    for (const edge of graph.edges) {
      if (!nodeIds.has(edge.to)) {
        issues.push({
          type: 'missing',
          severity: 'error',
          message: `Package '${edge.from}' depends on missing package '${edge.to}'`,
          affected: [edge.from, edge.to],
          suggestion: `Create package '${edge.to}' or remove the dependency`
        });
      }
    }
  }

  /**
   * Detect version mismatches
   */
  private detectVersionMismatches(graph: DependencyGraph, config: MonorepoConfig, issues: DependencyIssue[]): void {
    const externalDeps = new Map<string, Set<string>>();

    // Collect external dependency versions
    for (const app of config.apps) {
      const packageJsonPath = join(this.rootDir, app.path, 'package.json');
      if (existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
          this.collectExternalDependencies(packageJson, externalDeps);
        } catch (error) {
          // Skip invalid package.json files
        }
      }
    }

    for (const pkg of config.packages) {
      const packageJsonPath = join(this.rootDir, pkg.path, 'package.json');
      if (existsSync(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
          this.collectExternalDependencies(packageJson, externalDeps);
        } catch (error) {
          // Skip invalid package.json files
        }
      }
    }

    // Check for version mismatches
    for (const [dep, versions] of externalDeps) {
      if (versions.size > 1) {
        issues.push({
          type: 'version-mismatch',
          severity: 'warning',
          message: `Dependency '${dep}' has multiple versions: ${Array.from(versions).join(', ')}`,
          affected: [dep],
          suggestion: 'Standardize the version across all packages'
        });
      }
    }
  }

  /**
   * Collect external dependencies (non-workspace)
   */
  private collectExternalDependencies(packageJson: any, depMap: Map<string, Set<string>>): void {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

    for (const [name, version] of Object.entries(deps)) {
      if (typeof version === 'string' && !name.startsWith('@bdt/') && !version.startsWith('workspace:')) {
        if (!depMap.has(name)) {
          depMap.set(name, new Set());
        }
        depMap.get(name)!.add(version);
      }
    }
  }

  /**
   * Generate recommendations based on analysis
   */
  private generateRecommendations(graph: DependencyGraph, issues: DependencyIssue[]): string[] {
    const recommendations: string[] = [];

    if (graph.cycles.length > 0) {
      recommendations.push('Resolve circular dependencies to improve build reliability');
    }

    if (graph.orphans.length > 0) {
      recommendations.push('Remove or utilize orphaned packages to reduce maintenance overhead');
    }

    const versionMismatches = issues.filter(i => i.type === 'version-mismatch').length;
    if (versionMismatches > 0) {
      recommendations.push('Standardize dependency versions to avoid potential conflicts');
    }

    const missingDeps = issues.filter(i => i.type === 'missing').length;
    if (missingDeps > 0) {
      recommendations.push('Fix missing dependencies to prevent runtime errors');
    }

    if (recommendations.length === 0) {
      recommendations.push('Dependency structure looks good! Consider regular dependency audits.');
    }

    return recommendations;
  }
}
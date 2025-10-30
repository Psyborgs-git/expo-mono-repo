import { z } from 'zod';

/**
 * Platform types supported by the monorepo
 */
export const PlatformSchema = z.enum(['mobile', 'web', 'both']);
export type Platform = z.infer<typeof PlatformSchema>;

/**
 * Environment types
 */
export const EnvironmentSchema = z.enum(['development', 'staging', 'production']);
export type Environment = z.infer<typeof EnvironmentSchema>;

/**
 * Package configuration schema
 */
export const PackageConfigSchema = z.object({
  name: z.string(),
  type: z.enum(['component', 'utility', 'ui', 'network']),
  path: z.string(),
  exports: z.array(z.string()).optional(),
  dependencies: z.array(z.string()).default([]),
  peerDependencies: z.array(z.string()).default([]),
  buildCommand: z.string().optional(),
  testCommand: z.string().optional(),
});

export type PackageConfig = z.infer<typeof PackageConfigSchema>;

/**
 * Application configuration schema
 */
export const AppConfigSchema = z.object({
  name: z.string(),
  type: z.enum(['mobile', 'web']),
  path: z.string(),
  dependencies: z.array(z.string()).default([]),
  platforms: z.array(PlatformSchema).default(['mobile']),
  environment: z.record(z.string(), z.any()).default({}),
  buildCommand: z.string().optional(),
  startCommand: z.string().optional(),
  testCommand: z.string().optional(),
  port: z.number().optional(),
});

export type AppConfig = z.infer<typeof AppConfigSchema>;

/**
 * Build configuration schema
 */
export const BuildConfigSchema = z.object({
  outputDir: z.string().default('dist'),
  sourceMap: z.boolean().default(true),
  minify: z.boolean().default(false),
  analyze: z.boolean().default(false),
  parallel: z.boolean().default(true),
  cache: z.boolean().default(true),
  cacheDir: z.string().default('.cache'),
});

export type BuildConfig = z.infer<typeof BuildConfigSchema>;

/**
 * Development server configuration schema
 */
export const DevServerConfigSchema = z.object({
  port: z.number().default(3000),
  host: z.string().default('localhost'),
  open: z.boolean().default(true),
  hot: z.boolean().default(true),
  liveReload: z.boolean().default(true),
  watchPackages: z.boolean().default(true),
});

export type DevServerConfig = z.infer<typeof DevServerConfigSchema>;

/**
 * Test configuration schema
 */
export const TestConfigSchema = z.object({
  framework: z.enum(['jest', 'vitest']).default('jest'),
  coverage: z.boolean().default(true),
  coverageThreshold: z.number().default(80),
  watchMode: z.boolean().default(false),
  parallel: z.boolean().default(true),
});

export type TestConfig = z.infer<typeof TestConfigSchema>;

/**
 * Tools configuration schema
 */
export const ToolsConfigSchema = z.object({
  cli: z.object({
    name: z.string().default('bdt'),
    version: z.string().default('0.1.0'),
  }).default({}),
  build: BuildConfigSchema.default({}),
  devServer: DevServerConfigSchema.default({}),
  test: TestConfigSchema.default({}),
});

export type ToolsConfig = z.infer<typeof ToolsConfigSchema>;

/**
 * Main monorepo configuration schema
 */
export const MonorepoConfigSchema = z.object({
  name: z.string(),
  version: z.string().default('0.1.0'),
  apps: z.array(AppConfigSchema).default([]),
  packages: z.array(PackageConfigSchema).default([]),
  tools: ToolsConfigSchema.default({}),
  workspaces: z.array(z.string()).default(['apps/*', 'packages/*', 'tools']),
  packageManager: z.enum(['npm', 'yarn', 'pnpm']).default('pnpm'),
});

export type MonorepoConfig = z.infer<typeof MonorepoConfigSchema>;

/**
 * Environment-specific configuration schema
 */
export const EnvironmentConfigSchema = z.object({
  environment: EnvironmentSchema,
  apps: z.record(z.string(), z.any()).default({}),
  packages: z.record(z.string(), z.any()).default({}),
  build: z.record(z.string(), z.any()).default({}),
  deploy: z.record(z.string(), z.any()).default({}),
});

export type EnvironmentConfig = z.infer<typeof EnvironmentConfigSchema>;
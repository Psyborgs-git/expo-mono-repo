const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/**
 * Base Metro configuration for monorepo apps
 * @param {string} projectRoot - The root directory of the app
 * @param {string} workspaceRoot - The root directory of the monorepo
 */
module.exports = function getBaseMetroConfig(projectRoot, workspaceRoot) {
  const config = getDefaultConfig(projectRoot);

  // Watch all files in the monorepo
  config.watchFolders = [workspaceRoot];

  // Allow imports from workspace packages
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ];

  // Support for monorepo structure
  config.resolver.disableHierarchicalLookup = true;

  return config;
};

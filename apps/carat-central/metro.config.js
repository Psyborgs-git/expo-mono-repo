const { getDefaultConfig } = require('expo/metro-config')
const { withTamagui } = require('@tamagui/metro-plugin')
const path = require('path')

// Find the project and workspace directories
const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot, { isCSSEnabled: true })

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot]

// 2. Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

// 3. Ensure mjs is resolvable
config.resolver.sourceExts.push('mjs')

module.exports = withTamagui(config, {
  components: ['tamagui', '@bdt/ui', '@bdt/components'],
  config: './tamagui.config.ts',
  outputCSS: './tamagui-web.css'
})

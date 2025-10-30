const { getDefaultConfig } = require('expo/metro-config')
const { withTamagui } = require('@tamagui/metro-plugin')
const config = getDefaultConfig(__dirname, { isCSSEnabled: true })
config.resolver.sourceExts.push('mjs')
module.exports = withTamagui(config, {
  components: ['tamagui', '@bdt/ui', '@bdt/components'],
  config: './tamagui.config.ts',
  outputCSS: './tamagui-web.css'
})

import { createTamagui } from '@tamagui/core'
import { defaultConfig } from '@tamagui/config/v4'
import { tokens } from './src/tokens'
import { headingFont, bodyFont, monoFont } from './src/fonts'
import { lightTheme, darkTheme, componentThemes } from './src/themes'

// Create Tamagui configuration
export const tamaguiConfig = createTamagui({
  ...defaultConfig,

  // Fonts
  fonts: {
    heading: headingFont,
    body: bodyFont,
    mono: monoFont,
  },

  // Tokens
  tokens: {
    ...defaultConfig.tokens,
    ...tokens,
  },

  // Themes
  themes: {
    light: lightTheme,
    dark: darkTheme,
    ...componentThemes,
  },

  // Settings
  settings: {
    allowedStyleValues: 'strict',
    autocompleteSpecificTokens: 'except-special',
  },

  // Media queries for responsive design
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
})

export type Conf = typeof tamaguiConfig

// Re-add module augmentation after tamagui is installed
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig

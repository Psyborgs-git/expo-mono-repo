// Starter Tamagui config for new apps
// Copy this file to apps/<your-app>/tamagui.config.ts and customize theme tokens as needed.

import { TamaguiConfig } from 'tamagui';
// Prefer importing shared tokens/themes from the workspace UI package
// import { tokens, themes, shorthands, themes as sharedThemes } from '@bdt/ui/tamagui.config';

const config: TamaguiConfig = {
  // Example minimal config — extend or replace with values from @bdt/ui
  animations: {},
  tokens: {
    // Pull tokens from @bdt/ui where possible. These are placeholders:
    color: {
      background: '#fff',
      text: '#111',
      primary: '#0b5fff',
      success: '#0bbf66',
      error: '#ff4d4f',
    },
    size: {
      $1: 8,
      $2: 12,
      $3: 16,
      $4: 20,
      $5: 24,
    },
  },
  themes: {
    // Define per-app theme overrides here if needed
    light: {},
    dark: {},
  },
  shorthands: {},
  fonts: {
    // Example:
    body: {
      family: 'System',
      size: 14,
      lineHeight: 20,
    },
  },
  // other Tamagui options can go here
};

export default config;

# Create a new Expo app (monorepo-friendly)

This guide shows a reproducible, zsh-friendly flow to add a new Expo + Tamagui app to this monorepo. It assumes you want the new app to use the shared `@bdt/ui` tokens and `@bdt/components` library.

1. Initialize the app

```bash
# From the repo root
pnpm install # ensure dependencies are present
cd apps
expo init my-new-app
# When prompted, choose: tabs (TypeScript)
cd my-new-app
```

2. Update package name and workspace

Open `apps/my-new-app/package.json` and set the package name and workspace fields:

```json
{
  "name": "@bdt/my-new-app",
  "version": "0.0.0",
  "private": true,
  "main": "./index.js",
  "license": "MIT",
  "scripts": {
    "start": "expo start",
    "web": "expo start --web",
    "ios": "expo run:ios",
    "android": "expo run:android",
    "type-check": "tsc --noEmit"
  }
}
```

3. Install runtime dependencies in the app (zsh)

```bash
# From repo root (recommended)
pnpm --filter @bdt/my-new-app add react react-native expo tamagui @bdt/ui @bdt/components
# Add dev deps
pnpm --filter @bdt/my-new-app add -D typescript @tamagui/core @tamagui/metro-plugin @tamagui/babel-plugin
```

4. Add Tamagui config

Copy the starter Tamagui config into the app and update to import tokens from `@bdt/ui`:

```bash
cp tools/templates/tamagui.config.ts apps/my-new-app/tamagui.config.ts
```

Edit `apps/my-new-app/tamagui.config.ts` to import shared tokens from `@bdt/ui` where appropriate.

5. Add per-app theme file

Create `apps/my-new-app/src/theme.ts` and export any app-specific overrides (colors, spacing, fonts) – import base tokens from `@bdt/ui`.

6. Wire Metro/Babel for Tamagui

Copy `apps/carat-central/metro.config.js` and `apps/carat-central/babel.config.js` as a starting point and update the component list to reference `@bdt/ui` and `@bdt/components` (this repo uses `withTamagui(...)` and `@tamagui/babel-plugin`).

7. Start the app

```bash
pnpm --filter @bdt/my-new-app start
```

Notes & troubleshooting

- Do NOT edit the `pnpm-lock.yaml` manually; run `pnpm install` to regenerate it.
- If you see import errors for `@bdt/*`, ensure `tsconfig.base.json` has path mappings and run `pnpm -w -r -F @bdt/my-new-app install` from the repo root.
- For CI, add a new entry in the root pipeline only after verifying local build and test passes.

If you'd like, I can create a small script under `tools/` to scaffold the new app automatically using these steps.
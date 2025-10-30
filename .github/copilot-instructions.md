<!-- .github/copilot-instructions.md - guidance for AI coding agents working in this repository -->
# Repo snapshot for AI copilots

This mono-repo contains multiple Expo apps (React Native + Web) with a shared design system and network layer. Use the notes below to work productively and safely in the codebase.

Your ROLE:
You are an expert full-stack developer familiar with React Native, Expo, Tamagui, TypeScript, GraphQL/Apollo, and monorepo setups using pnpm workspaces. You write clean, well-documented, and maintainable code. You follow best practices for React Native and Expo development. Also youre an expert human behavioral scientist and a world renowned product designer that has been building amazing and addictive products thats help users fulfill their tasks with minimal cognitive load. You understand how to create intuitive user interfaces that enhance user experience and engagement building AI native apps.

- Monorepo layout: apps/* (Expo apps), packages/* (shared packages), tools/* (dev tooling). See `README.md` for a high-level diagram.
- Key packages:
  - `packages/ui` — tokens, themes and `tamagui.config.ts` (see `packages/ui/src/tokens.ts`, `packages/ui/src/themes.ts`).
  - `packages/components` — shared UI components. Add new components under `packages/components/src/` and export them from `packages/components/src/index.ts`.
  - `packages/network` — GraphQL/Apollo client, auth and hooks (entry: `packages/network/src/apollo-client.ts`, `packages/network/src/auth/`).

Developer workflows (explicit commands and examples)
- Install: `pnpm install`
- Start an app (root scripts):
  - `pnpm start:carat-central` — starts `apps/carat-central`
  - `pnpm start:vloop`, `pnpm start:parallax`
- Use pnpm filtering for per-package actions (important pattern):
  - Run script inside a package: `pnpm --filter @bdt/carat-central start`
  - Add dependency to specific package: `pnpm --filter @bdt/carat-central add <pkg>`
- Platform builds (examples):
  - iOS simulator: `pnpm --filter @bdt/carat-central ios`
  - Android: `pnpm --filter @bdt/carat-central android`
  - Web: `pnpm --filter @bdt/carat-central web`

Project-specific conventions and important patterns
- Tamagui is the design system — theme values are in `packages/ui`. UI components must use semantic tokens (e.g. `$background`, `$color`) rather than hard-coded colors.
- When adding or changing tokens/themes, update `packages/ui/src/tokens.ts` and `packages/ui/src/themes.ts` and ensure `tamagui.config.ts` is consistent.
- Shared components live in `packages/components/src/*`. Adding a component requires:
  1. creating the component file (e.g. `Badge.tsx`)
  2. exporting it from `packages/components/src/index.ts`
  3. running type-checks / tests for that package via pnpm filter
- GraphQL: schemas live under `graphql/` (e.g. `graphql/carat-central/schema.gql`). The network layer is in `packages/network`. Look for `codegen.ts` under apps to find local code generation helpers.
- Auth: token handling & refresh lives in `packages/network/src/auth` and the app-level `contexts` (e.g. `apps/carat-central/contexts/AuthContext.tsx`). Prefer using `AuthManager`/`useAuth` hooks from the network package.

Testing and CI
- Unit tests: `pnpm test` (root) or `pnpm --filter @bdt/components test` for package-level runs. App Jest configs live in `apps/*/jest.config.js` (see `apps/carat-central/jest.config.js`).
- E2E: Detox is used for some apps (`apps/*/e2e`); see `apps/carat-central/DEVELOPMENT.md` for Detox commands.
- CI: GitHub Actions runs lint, format, type-check and tests. See `.github/workflows/ci.yml` for exact matrix and Node versions.

Debugging and common troubleshooting
- Metro cache issues: restart with `pnpm start --clear` or `pnpm --filter <pkg> start -- --clear`
- Mobile debugging: React Native Debugger, Flipper are used — app-level README and `DEVELOPMENT.md` mention recommended setup.
- TypeScript: run `pnpm type-check` (root) or `pnpm --filter <pkg> run type-check`.

Files to inspect for intent and examples (start here)
- `README.md` (root) — high level overview and quick-start commands
- `apps/carat-central/DEVELOPMENT.md` — per-app run/test/debug commands and conventions
- `packages/ui/tamagui.config.ts` and `packages/ui/src/*` — theming and tokens
- `packages/components/src/*` — component patterns and exports
- `packages/network/src/apollo-client.ts`, `packages/network/src/auth` — network/auth patterns
- `graphql/*` — GraphQL schemas and contract surface

What to avoid
- Do not change global scripts or workspace layout without updating `README.md` and top-level scripts — CI and contributors rely on root scripts and pnpm filters.
- Avoid hard-coded color/spacing values in components — prefer tokens from `packages/ui`.

How to propose code changes
- Make a feature branch, run `pnpm lint && pnpm test && pnpm type-check`, and open a PR that updates docs if you change public APIs or tokens.

Component templates (copy-paste ready)

Add a new component file under `packages/components/src/` and export it from `packages/components/src/index.ts`.

Example component: `packages/components/src/Badge.tsx`

```tsx
import React from 'react';
import { XStack, Text } from 'tamagui';

export type BadgeProps = {
  children?: React.ReactNode;
  style?: any;
};

export const Badge = ({ children, ...props }: BadgeProps) => (
  <XStack backgroundColor="$primary" padding="$2" borderRadius="$2" {...props}>
    <Text color="$onPrimary" fontSize="$2">{children}</Text>
  </XStack>
);
```

Export from `packages/components/src/index.ts`:

```ts
export { Badge } from './Badge';
```

Standard test/run command for the package:

```bash
pnpm --filter @bdt/components test
```

Checklist: adding a new component

1. Create `packages/components/src/MyComponent.tsx` using tokens from `@bdt/ui`.
2. Export it from `packages/components/src/index.ts`.
3. Add/update unit tests in `packages/components/__tests__/`.
4. Run `pnpm --filter @bdt/components test` and `pnpm --filter @bdt/components type-check`.
5. Open PR, link design/token changes if relevant.

Checklist: releases & adding new apps

- Releasing a package (high-level)
  1. Bump version in the package's `package.json` and update CHANGELOG.md.
  2. Run full checks: `pnpm lint && pnpm test && pnpm type-check`.
  3. Run monorepo build: `pnpm -w -r run build`.
  4. Create a release branch and open a PR for review.
  5. Merge, tag the release (e.g. `git tag vX.Y.Z`) and push the tag.
  6. If publishing to npm/private registry, run `pnpm publish --filter <package>` (follow your registry rules).

- Adding a new Expo app (standardized procedure)
  1. From the workspace root, run:

```bash
expo init apps/<app-name>
```

     When prompted choose the "tabs (TypeScript)" template (or run the interactive CLI and select "tabs (TypeScript)").
  2. Open `apps/<app-name>/package.json` and set the name to `@bdt/<app-name>` and ensure it fits workspace conventions.
  3. Install workspace dependencies via pnpm (from repo root):

```bash
pnpm --filter @bdt/<app-name> add react react-native expo tamagui @bdt/ui
```

     (Prefer adding shared dependencies at the workspace root when appropriate.)
  4. Copy an existing Tamagui setup: `apps/carat-central/tamagui.config.ts` -> `apps/<app-name>/tamagui.config.ts` and update app-specific theme tokens in `apps/<app-name>/src/theme.ts` which should import base tokens from `@bdt/ui/src/tokens.ts` and override values as needed.
  5. Add start scripts in root `package.json` (follow existing pattern):

```json
"start:<app-name>": "pnpm --filter @bdt/<app-name> start"
```

  6. Commit, run `pnpm install`, and verify the app starts with:

```bash
pnpm start:<app-name>
```

Stricter rules: files an agent MUST NOT edit

- Do not edit CI workflows in `.github/workflows/` unless explicitly asked — these are curated for the org's CI matrix.
- Do not modify `pnpm-workspace.yaml`, `monorepo.*.config.json`, or root `package.json` scripts without a maintainer review — they affect all apps and CI.
- Avoid editing generated GraphQL artifacts under `**/src/generated/` or files created by codegen; instead update schema/queries and re-run codegen.
- Never commit secrets — do not create or modify `.env` files with real credentials. If a missing `.env` is needed, create `.env.example` and ask a human to populate secrets.
- Do not change `packages/ui/src/tokens.ts` or theme files without following the token migration steps and updating `packages/ui/tamagui.config.ts` — token changes are breaking and require a coordinated release.
- Avoid editing `pnpm-lock.yaml` manually or `node_modules/`.

Quick references and files to inspect
- `README.md` (root) — high level overview and quick-start commands
- `apps/carat-central/DEVELOPMENT.md` — per-app run/test/debug commands and conventions
- `packages/ui/tamagui.config.ts` and `packages/ui/src/*` — theming and tokens
- `packages/components/src/*` — component patterns and exports
- `packages/network/src/apollo-client.ts`, `packages/network/src/auth` — network/auth patterns
- `graphql/*` — GraphQL schemas and contract surface

If anything here is unclear or you want more granular examples (component template, codegen steps, CI matrix), ask and I will expand with concrete file-level examples.

If anything here is unclear or you want more granular examples (component template, codegen steps, CI matrix), ask and I will expand with concrete file-level examples.

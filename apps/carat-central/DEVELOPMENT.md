# Carat Central - Development Guide

## Development Setup

### Prerequisites

- Node.js 18+ and pnpm
- Expo CLI (`pnpm add -g @expo/cli`)
- iOS Simulator (macOS) or Android Emulator
- VS Code with recommended extensions

### Getting Started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start the development server**

   ```bash
   pnpm start
   ```

3. **Run on specific platforms**
   ```bash
   pnpm ios     # iOS Simulator
   pnpm android # Android Emulator
   pnpm web     # Web browser
   ```

## Development Tools

### Code Quality

- **ESLint**: Linting with TypeScript, React, and React Native rules
- **Prettier**: Code formatting with consistent style
- **TypeScript**: Strict type checking enabled

```bash
# Lint code
pnpm lint
pnpm lint:fix

# Format code
pnpm format
pnpm format:check

# Type checking
pnpm type-check
```

### Testing

#### Unit Tests (Jest + React Native Testing Library)

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

#### E2E Tests (Detox)

```bash
# iOS
pnpm detox:build:ios
pnpm detox:test:ios

# Android
pnpm detox:build:android
pnpm detox:test:android
```

### Project Structure

```
apps/carat-central/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab navigation
│   ├── (modals)/          # Modal screens
│   └── _layout.tsx        # Root layout
├── components/            # App-specific components
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── __tests__/            # Unit tests
├── e2e/                  # E2E tests
└── constants/            # App constants
```

### Environment Configuration

1. Copy `.env.example` to `.env`
2. Update environment variables as needed
3. Restart the development server

### VS Code Setup

The project includes VS Code configuration for:

- Auto-formatting on save
- ESLint integration
- TypeScript support
- Recommended extensions

### Debugging

1. **React Native Debugger**: Use React Native Debugger for advanced debugging
2. **Flipper**: Network requests, Redux state, and performance monitoring
3. **VS Code Debugger**: Set breakpoints directly in VS Code

### Common Commands

```bash
# Development
pnpm start                 # Start Expo dev server
pnpm start:clear          # Start with cleared cache

# Code Quality
pnpm lint                 # Run ESLint
pnpm format               # Format with Prettier
pnpm type-check           # TypeScript checking

# Testing
pnpm test                 # Run unit tests
pnpm test:coverage        # Run tests with coverage
pnpm detox:test:ios       # Run E2E tests on iOS

# Build
pnpm build:ios            # Build for iOS
pnpm build:android        # Build for Android
pnpm build:web            # Build for web
```

### Troubleshooting

#### Common Issues

1. **Metro bundler cache issues**

   ```bash
   pnpm start --clear
   ```

2. **iOS Simulator not starting**

   ```bash
   xcrun simctl list devices
   ```

3. **Android emulator issues**

   ```bash
   adb devices
   adb reverse tcp:8081 tcp:8081
   ```

4. **TypeScript errors**
   ```bash
   pnpm type-check
   ```

#### Performance Issues

- Use React DevTools Profiler
- Monitor bundle size with `expo export`
- Check for memory leaks in long-running screens

### Contributing

1. Create a feature branch
2. Make changes with tests
3. Run quality checks: `pnpm lint && pnpm test && pnpm type-check`
4. Submit a pull request

### CI/CD

The project uses GitHub Actions for:

- Automated testing on multiple Node.js versions
- Code quality checks (lint, format, type-check)
- Build verification
- Coverage reporting

See `.github/workflows/ci.yml` for the complete pipeline.

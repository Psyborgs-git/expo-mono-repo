#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { mkdir, writeFile, readFile, copyFile } from 'fs/promises';
import { join, resolve } from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

interface AppConfig {
  name: string;
  displayName: string;
  description: string;
  template: 'basic' | 'auth-flow' | 'chat' | 'dashboard';
  includeAuth: boolean;
  includeGraphQL: boolean;
  includePushNotifications: boolean;
  packageManager: 'pnpm' | 'npm' | 'yarn';
}

const program = new Command();

program
  .name('create-app')
  .description('Create a new Expo app in the monorepo')
  .version('1.0.0')
  .action(async () => {
    console.log(chalk.cyan.bold('\n🚀 Expo App Factory - Create New App\n'));

    try {
      const answers = await inquirer.prompt<AppConfig>([
        {
          type: 'input',
          name: 'name',
          message: 'App name (kebab-case):',
          validate: (input: string) => {
            if (!/^[a-z][a-z0-9-]*$/.test(input)) {
              return 'App name must be lowercase with hyphens (e.g., my-app)';
            }
            const appPath = join(process.cwd(), 'apps', input);
            if (existsSync(appPath)) {
              return `App "${input}" already exists in apps/ directory`;
            }
            return true;
          },
        },
        {
          type: 'input',
          name: 'displayName',
          message: 'Display name (shown in app):',
          default: (answers: Partial<AppConfig>) =>
            answers.name
              ?.split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' '),
        },
        {
          type: 'input',
          name: 'description',
          message: 'App description:',
          default: 'A new Expo app',
        },
        {
          type: 'list',
          name: 'template',
          message: 'Choose a template:',
          choices: [
            {
              name: 'Basic - Simple tabs navigation',
              value: 'basic',
            },
            {
              name: 'Auth Flow - Login, signup, and protected routes',
              value: 'auth-flow',
            },
            {
              name: 'Chat - Real-time messaging interface',
              value: 'chat',
            },
            {
              name: 'Dashboard - Data-heavy analytics app',
              value: 'dashboard',
            },
          ],
        },
        {
          type: 'confirm',
          name: 'includeAuth',
          message: 'Include authentication?',
          default: (answers: Partial<AppConfig>) => answers.template === 'auth-flow',
          when: (answers: Partial<AppConfig>) => answers.template !== 'auth-flow',
        },
        {
          type: 'confirm',
          name: 'includeGraphQL',
          message: 'Include GraphQL with Apollo Client?',
          default: true,
        },
        {
          type: 'confirm',
          name: 'includePushNotifications',
          message: 'Include push notifications setup?',
          default: false,
        },
        {
          type: 'list',
          name: 'packageManager',
          message: 'Package manager:',
          choices: ['pnpm', 'npm', 'yarn'],
          default: 'pnpm',
        },
      ]);

      // Auto-enable auth for auth-flow template
      if (answers.template === 'auth-flow') {
        answers.includeAuth = true;
      }

      await createApp(answers);
    } catch (error) {
      if (error && typeof error === 'object' && 'isTtyError' in error) {
        console.error(chalk.red('Prompt could not be rendered in this environment'));
      } else {
        console.error(chalk.red('Error creating app:'), error);
      }
      process.exit(1);
    }
  });

async function createApp(config: AppConfig) {
  const spinner = ora('Creating app...').start();
  const appPath = join(process.cwd(), 'apps', config.name);

  try {
    // Create app directory structure
    spinner.text = 'Creating directory structure...';
    await createDirectoryStructure(appPath, config);

    // Generate configuration files
    spinner.text = 'Generating configuration files...';
    await generateConfigFiles(appPath, config);

    // Generate source files
    spinner.text = 'Generating app source files...';
    await generateSourceFiles(appPath, config);

    // Install dependencies
    spinner.text = 'Installing dependencies...';
    await installDependencies(appPath, config.packageManager);

    spinner.succeed(chalk.green(`✨ App "${config.displayName}" created successfully!`));

    // Print next steps
    printNextSteps(config);
  } catch (error) {
    spinner.fail(chalk.red('Failed to create app'));
    console.error(error);
    process.exit(1);
  }
}

async function createDirectoryStructure(appPath: string, config: AppConfig) {
  const dirs = [
    appPath,
    join(appPath, 'app'),
    join(appPath, 'app', '(tabs)'),
    join(appPath, 'assets'),
    join(appPath, 'components'),
    join(appPath, 'contexts'),
    join(appPath, 'hooks'),
    join(appPath, 'utils'),
    join(appPath, '__tests__'),
  ];

  if (config.includeAuth) {
    dirs.push(join(appPath, 'app', '(auth)'));
  }

  if (config.template === 'chat') {
    dirs.push(join(appPath, 'app', 'chat'));
  }

  for (const dir of dirs) {
    await mkdir(dir, { recursive: true });
  }
}

async function generateConfigFiles(appPath: string, config: AppConfig) {
  // package.json
  const packageJson = {
    name: `@bdt/${config.name}`,
    version: '1.0.0',
    description: config.description,
    main: 'expo-router/entry',
    private: true,
    scripts: {
      start: 'expo start',
      android: 'expo start --android',
      ios: 'expo start --ios',
      web: 'expo start --web',
      test: 'jest',
      'type-check': 'tsc --noEmit',
      lint: 'eslint .',
      format: 'prettier --write "**/*.{ts,tsx,js,jsx,json,md}"',
    },
    dependencies: {
      expo: '~54.0.0',
      react: '19.1.0',
      'react-native': '0.81.5',
      'expo-router': '^6.0.13',
      tamagui: '*',
      '@bdt/ui': 'workspace:*',
      '@bdt/components': 'workspace:*',
      ...(config.includeGraphQL && {
        '@bdt/network': 'workspace:*',
        '@apollo/client': '^3.11.0',
        graphql: '^16.9.0',
      }),
      ...(config.includePushNotifications && {
        'expo-notifications': '~0.30.0',
        'expo-device': '~7.0.0',
      }),
    },
    devDependencies: {
      '@types/react': '^18.2.79',
      '@types/react-native': '^0.73.0',
      typescript: '^5.9.3',
      jest: '^29.7.0',
      '@testing-library/react-native': '^12.9.0',
    },
  };

  await writeFile(join(appPath, 'package.json'), JSON.stringify(packageJson, null, 2));

  // app.config.ts
  const appConfig = `import { ExpoConfig, ConfigContext } from 'expo/config';

const config = ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: '${config.displayName}',
  slug: '${config.name}',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  scheme: '${config.name}',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.bdt.${config.name.replace(/-/g, '')}',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    package: 'com.bdt.${config.name.replace(/-/g, '')}',
  },
  web: {
    bundler: 'metro',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    ${config.includePushNotifications ? "'expo-notifications'," : ''}
  ],
  experiments: {
    typedRoutes: true,
  },
});

export default config;
`;

  await writeFile(join(appPath, 'app.config.ts'), appConfig);

  // tsconfig.json
  const tsConfig = {
    extends: '../../tsconfig.base.json',
    compilerOptions: {
      strict: true,
      paths: {
        '@/*': ['./*'],
      },
    },
    include: ['**/*.ts', '**/*.tsx', '.expo/types/**/*.ts', 'expo-env.d.ts'],
    exclude: ['node_modules'],
  };

  await writeFile(join(appPath, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));

  // tamagui.config.ts
  const tamaguiConfig = `import { config } from '@bdt/ui';

export type Conf = typeof config;

export default config;
`;

  await writeFile(join(appPath, 'tamagui.config.ts'), tamaguiConfig);

  // expo-env.d.ts
  const expoEnv = `/// <reference types="expo/types" />
`;

  await writeFile(join(appPath, 'expo-env.d.ts'), expoEnv);

  // babel.config.js
  const babelConfig = `module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
`;

  await writeFile(join(appPath, 'babel.config.js'), babelConfig);

  // metro.config.js
  const metroConfig = `const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

module.exports = config;
`;

  await writeFile(join(appPath, 'metro.config.js'), metroConfig);

  // jest.config.js
  const jestConfig = `module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
`;

  await writeFile(join(appPath, 'jest.config.js'), jestConfig);

  // jest.setup.js
  const jestSetup = `import '@testing-library/react-native/extend-expect';
`;

  await writeFile(join(appPath, 'jest.setup.js'), jestSetup);

  // .gitignore
  const gitignore = `# Expo
.expo/
dist/
web-build/

# Dependencies
node_modules/

# Environment
.env
.env.local
.env.*.local

# OS
.DS_Store

# IDE
.vscode/
.idea/

# Testing
coverage/

# Misc
*.log
*.tgz
.turbo
`;

  await writeFile(join(appPath, '.gitignore'), gitignore);
}

async function generateSourceFiles(appPath: string, config: AppConfig) {
  // app/_layout.tsx
  const rootLayout = `import { Stack } from 'expo-router';
import { TamaguiProvider } from 'tamagui';
import config from '../tamagui.config';
${config.includeGraphQL ? "import { ApolloProvider } from '../contexts/ApolloProvider';" : ''}

export default function RootLayout() {
  return (
    <TamaguiProvider config={config}>
      ${config.includeGraphQL ? '<ApolloProvider>' : ''}
        <Stack screenOptions={{ headerShown: false }}>
          ${config.includeAuth ? "<Stack.Screen name='(auth)' />" : ''}
          <Stack.Screen name="(tabs)" />
        </Stack>
      ${config.includeGraphQL ? '</ApolloProvider>' : ''}
    </TamaguiProvider>
  );
}
`;

  await writeFile(join(appPath, 'app', '_layout.tsx'), rootLayout);

  // app/index.tsx
  const indexScreen = `import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)" />;
}
`;

  await writeFile(join(appPath, 'app', 'index.tsx'), indexScreen);

  // Generate template-specific files
  if (config.template === 'auth-flow') {
    await generateAuthFlowTemplate(appPath);
  } else if (config.template === 'chat') {
    await generateChatTemplate(appPath);
  } else if (config.template === 'dashboard') {
    await generateDashboardTemplate(appPath);
  } else {
    await generateBasicTemplate(appPath);
  }

  // Generate contexts
  if (config.includeGraphQL) {
    await generateApolloContext(appPath);
  }

  if (config.includeAuth) {
    await generateAuthContext(appPath);
  }

  // Generate README
  const readme = `# ${config.displayName}

${config.description}

## Development

\`\`\`bash
# Start the development server
${config.packageManager} start

# Start on specific platform
${config.packageManager} ios
${config.packageManager} android
${config.packageManager} web
\`\`\`

## Testing

\`\`\`bash
${config.packageManager} test
${config.packageManager} run type-check
\`\`\`

## Template

This app was created with the **${config.template}** template.

### Features

- ✅ Expo Router for navigation
- ✅ Tamagui for styling
- ✅ Shared components from @bdt/components
${config.includeAuth ? '- ✅ Authentication flow' : ''}
${config.includeGraphQL ? '- ✅ GraphQL with Apollo Client' : ''}
${config.includePushNotifications ? '- ✅ Push notifications' : ''}

## Project Structure

\`\`\`
app/              # Expo Router app directory
  (tabs)/         # Tab navigation screens
${config.includeAuth ? '  (auth)/         # Auth screens (login, signup)' : ''}
  _layout.tsx     # Root layout with providers
components/       # App-specific components
contexts/         # React contexts
hooks/            # Custom hooks
utils/            # Utility functions
\`\`\`
`;

  await writeFile(join(appPath, 'README.md'), readme);
}

async function generateBasicTemplate(appPath: string) {
  // (tabs)/_layout.tsx
  const tabsLayout = `import { Tabs } from 'expo-router';
import { Home, Settings } from '@tamagui/lucide-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings color={color} />,
        }}
      />
    </Tabs>
  );
}
`;

  await writeFile(join(appPath, 'app', '(tabs)', '_layout.tsx'), tabsLayout);

  // (tabs)/index.tsx
  const homeScreen = `import { YStack, Text, H1, Button } from 'tamagui';

export default function HomeScreen() {
  return (
    <YStack flex={1} alignItems="center" justifyContent="center" padding="$4" gap="$4">
      <H1>Welcome! 👋</H1>
      <Text fontSize="$5" color="$textWeak">
        Your new Expo app is ready to go!
      </Text>
      <Button size="$4" backgroundColor="$primary" color="white">
        Get Started
      </Button>
    </YStack>
  );
}
`;

  await writeFile(join(appPath, 'app', '(tabs)', 'index.tsx'), homeScreen);

  // (tabs)/settings.tsx
  const settingsScreen = `import { YStack, Text, H2 } from 'tamagui';

export default function SettingsScreen() {
  return (
    <YStack flex={1} padding="$4" gap="$4">
      <H2>Settings</H2>
      <Text>Configure your app settings here.</Text>
    </YStack>
  );
}
`;

  await writeFile(join(appPath, 'app', '(tabs)', 'settings.tsx'), settingsScreen);
}

async function generateAuthFlowTemplate(appPath: string) {
  // (auth)/_layout.tsx
  const authLayout = `import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
    </Stack>
  );
}
`;

  await writeFile(join(appPath, 'app', '(auth)', '_layout.tsx'), authLayout);

  // (auth)/login.tsx
  const loginScreen = `import { YStack } from 'tamagui';
import { LoginForm } from '@bdt/components';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = async (data: { email: string; password: string; rememberMe: boolean }) => {
    console.log('Login:', data);
    // TODO: Implement actual authentication
    router.replace('/(tabs)');
  };

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" padding="$4" backgroundColor="$background">
      <LoginForm
        onSubmit={handleLogin}
        onSignUp={() => router.push('/(auth)/signup')}
        onForgotPassword={() => console.log('Forgot password')}
      />
    </YStack>
  );
}
`;

  await writeFile(join(appPath, 'app', '(auth)', 'login.tsx'), loginScreen);

  // (auth)/signup.tsx
  const signupScreen = `import { YStack } from 'tamagui';
import { SignupForm } from '@bdt/components';
import { useRouter } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();

  const handleSignup = async (data: any) => {
    console.log('Signup:', data);
    // TODO: Implement actual registration
    router.replace('/(tabs)');
  };

  return (
    <YStack flex={1} alignItems="center" justifyContent="center" padding="$4" backgroundColor="$background">
      <SignupForm
        onSubmit={handleSignup}
        onSignIn={() => router.back()}
      />
    </YStack>
  );
}
`;

  await writeFile(join(appPath, 'app', '(auth)', 'signup.tsx'), signupScreen);

  // Generate basic tabs
  await generateBasicTemplate(appPath);
}

async function generateChatTemplate(appPath: string) {
  // (tabs)/_layout.tsx with chat
  const tabsLayout = `import { Tabs } from 'expo-router';
import { MessageSquare, Users, Settings } from '@tamagui/lucide-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color }) => <MessageSquare color={color} />,
        }}
      />
      <Tabs.Screen
        name="contacts"
        options={{
          title: 'Contacts',
          tabBarIcon: ({ color }) => <Users color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings color={color} />,
        }}
      />
    </Tabs>
  );
}
`;

  await writeFile(join(appPath, 'app', '(tabs)', '_layout.tsx'), tabsLayout);

  // (tabs)/index.tsx - Chat list
  const chatListScreen = `import { YStack, Text, H2 } from 'tamagui';

export default function ChatsScreen() {
  return (
    <YStack flex={1} padding="$4" gap="$4">
      <H2>Chats</H2>
      <Text>Your conversations will appear here.</Text>
    </YStack>
  );
}
`;

  await writeFile(join(appPath, 'app', '(tabs)', 'index.tsx'), chatListScreen);

  // (tabs)/contacts.tsx
  const contactsScreen = `import { YStack, Text, H2 } from 'tamagui';

export default function ContactsScreen() {
  return (
    <YStack flex={1} padding="$4" gap="$4">
      <H2>Contacts</H2>
      <Text>Your contacts will appear here.</Text>
    </YStack>
  );
}
`;

  await writeFile(join(appPath, 'app', '(tabs)', 'contacts.tsx'), contactsScreen);

  // (tabs)/settings.tsx
  const settingsScreen = `import { YStack, Text, H2 } from 'tamagui';

export default function SettingsScreen() {
  return (
    <YStack flex={1} padding="$4" gap="$4">
      <H2>Settings</H2>
      <Text>Configure your chat settings here.</Text>
    </YStack>
  );
}
`;

  await writeFile(join(appPath, 'app', '(tabs)', 'settings.tsx'), settingsScreen);
}

async function generateDashboardTemplate(appPath: string) {
  // (tabs)/_layout.tsx
  const tabsLayout = `import { Tabs } from 'expo-router';
import { BarChart3, TrendingUp, Settings } from '@tamagui/lucide-icons';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <BarChart3 color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color }) => <TrendingUp color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings color={color} />,
        }}
      />
    </Tabs>
  );
}
`;

  await writeFile(join(appPath, 'app', '(tabs)', '_layout.tsx'), tabsLayout);

  // (tabs)/index.tsx
  const dashboardScreen = `import { YStack, Text, H1, XStack, Card } from 'tamagui';

export default function DashboardScreen() {
  return (
    <YStack flex={1} padding="$4" gap="$4">
      <H1>Dashboard</H1>
      <XStack gap="$3">
        <Card flex={1} padding="$4" backgroundColor="$blue5">
          <Text fontSize="$2" color="$textWeak">Total Users</Text>
          <Text fontSize="$8" fontWeight="bold">1,234</Text>
        </Card>
        <Card flex={1} padding="$4" backgroundColor="$green5">
          <Text fontSize="$2" color="$textWeak">Revenue</Text>
          <Text fontSize="$8" fontWeight="bold">$12.5K</Text>
        </Card>
      </XStack>
    </YStack>
  );
}
`;

  await writeFile(join(appPath, 'app', '(tabs)', 'index.tsx'), dashboardScreen);

  // (tabs)/analytics.tsx
  const analyticsScreen = `import { YStack, Text, H2 } from 'tamagui';

export default function AnalyticsScreen() {
  return (
    <YStack flex={1} padding="$4" gap="$4">
      <H2>Analytics</H2>
      <Text>Detailed analytics and charts will appear here.</Text>
    </YStack>
  );
}
`;

  await writeFile(join(appPath, 'app', '(tabs)', 'analytics.tsx'), analyticsScreen);

  // (tabs)/settings.tsx
  const settingsScreen = `import { YStack, Text, H2 } from 'tamagui';

export default function SettingsScreen() {
  return (
    <YStack flex={1} padding="$4" gap="$4">
      <H2>Settings</H2>
      <Text>Configure your dashboard settings here.</Text>
    </YStack>
  );
}
`;

  await writeFile(join(appPath, 'app', '(tabs)', 'settings.tsx'), settingsScreen);
}

async function generateApolloContext(appPath: string) {
  const apolloProvider = `import { ApolloClient, InMemoryCache, ApolloProvider as ApolloProviderBase, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { ReactNode } from 'react';

const httpLink = createHttpLink({
  uri: process.env.EXPO_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Get auth token from storage
  // const token = await AsyncStorage.getItem('authToken');
  
  return {
    headers: {
      ...headers,
      // authorization: token ? \`Bearer \${token}\` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export function ApolloProvider({ children }: { children: ReactNode }) {
  return <ApolloProviderBase client={client}>{children}</ApolloProviderBase>;
}
`;

  await writeFile(join(appPath, 'contexts', 'ApolloProvider.tsx'), apolloProvider);
}

async function generateAuthContext(appPath: string) {
  const authContext = `import { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // TODO: Implement actual login logic
    console.log('Login:', email, password);
    setUser({ id: '1', email, name: 'User' });
  };

  const logout = async () => {
    // TODO: Implement actual logout logic
    setUser(null);
  };

  const signup = async (email: string, password: string, name: string) => {
    // TODO: Implement actual signup logic
    console.log('Signup:', email, password, name);
    setUser({ id: '1', email, name });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
`;

  await writeFile(join(appPath, 'contexts', 'AuthContext.tsx'), authContext);
}

async function installDependencies(appPath: string, packageManager: string) {
  const commands: Record<string, string> = {
    pnpm: 'pnpm install',
    npm: 'npm install',
    yarn: 'yarn install',
  };

  try {
    execSync(commands[packageManager], {
      cwd: appPath,
      stdio: 'inherit',
    });
  } catch (error) {
    console.warn(chalk.yellow('\nWarning: Failed to install dependencies automatically.'));
    console.log(chalk.cyan(`Please run: cd apps/${appPath.split('/').pop()} && ${commands[packageManager]}`));
  }
}

function printNextSteps(config: AppConfig) {
  const appName = config.name;
  console.log(chalk.cyan.bold('\n📋 Next Steps:\n'));
  console.log(chalk.white(`1. Navigate to your app:`));
  console.log(chalk.gray(`   cd apps/${appName}\n`));
  console.log(chalk.white(`2. Start the development server:`));
  console.log(chalk.gray(`   ${config.packageManager} start\n`));
  console.log(chalk.white(`3. Run on a platform:`));
  console.log(chalk.gray(`   ${config.packageManager} ios`));
  console.log(chalk.gray(`   ${config.packageManager} android`));
  console.log(chalk.gray(`   ${config.packageManager} web\n`));

  if (config.includeGraphQL) {
    console.log(chalk.yellow('⚠️  GraphQL Setup:'));
    console.log(chalk.gray('   Update EXPO_PUBLIC_GRAPHQL_ENDPOINT in .env file\n'));
  }

  if (config.includeAuth) {
    console.log(chalk.yellow('⚠️  Auth Setup:'));
    console.log(chalk.gray('   Implement actual auth logic in contexts/AuthContext.tsx\n'));
  }

  console.log(chalk.green.bold('✨ Happy coding!\n'));
}

program.parse();

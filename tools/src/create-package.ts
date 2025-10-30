#!/usr/bin/env node
import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { execSync } from 'child_process';

interface PackageConfig {
  name: string;
  displayName: string;
  description: string;
  type: 'component' | 'utility' | 'expo-module';
  packageManager: 'pnpm' | 'npm' | 'yarn';
}

const program = new Command();

program
  .name('create-package')
  .description('Create a new package in the monorepo')
  .version('1.0.0')
  .action(async () => {
    console.log(chalk.cyan.bold('\n📦 Expo Monorepo - Create New Package\n'));

    try {
      const answers = await inquirer.prompt<PackageConfig>([
        {
          type: 'input',
          name: 'name',
          message: 'Package name (kebab-case):',
          validate: (input: string) => {
            if (!/^[a-z][a-z0-9-]*$/.test(input)) {
              return 'Package name must be lowercase with hyphens (e.g., my-package)';
            }
            const packagePath = join(process.cwd(), 'packages', input);
            if (existsSync(packagePath)) {
              return `Package "${input}" already exists in packages/ directory`;
            }
            return true;
          },
        },
        {
          type: 'input',
          name: 'displayName',
          message: 'Display name:',
          default: (answers: Partial<PackageConfig>) =>
            answers.name
              ?.split('-')
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' '),
        },
        {
          type: 'input',
          name: 'description',
          message: 'Package description:',
          default: 'A new package',
        },
        {
          type: 'list',
          name: 'type',
          message: 'Package type:',
          choices: [
            {
              name: 'Component Library - UI components',
              value: 'component',
            },
            {
              name: 'Utility - Helper functions and utilities',
              value: 'utility',
            },
            {
              name: 'Expo Module - Native module with iOS/Android code',
              value: 'expo-module',
            },
          ],
        },
        {
          type: 'list',
          name: 'packageManager',
          message: 'Package manager:',
          choices: ['pnpm', 'npm', 'yarn'],
          default: 'pnpm',
        },
      ]);

      await createPackage(answers);
    } catch (error) {
      if (error && typeof error === 'object' && 'isTtyError' in error) {
        console.error(chalk.red('Prompt could not be rendered in this environment'));
      } else {
        console.error(chalk.red('Error creating package:'), error);
      }
      process.exit(1);
    }
  });

async function createPackage(config: PackageConfig) {
  const spinner = ora('Creating package...').start();
  const packagePath = join(process.cwd(), 'packages', config.name);

  try {
    // Create directory structure
    spinner.text = 'Creating directory structure...';
    await createDirectoryStructure(packagePath, config);

    // Generate configuration files
    spinner.text = 'Generating configuration files...';
    await generateConfigFiles(packagePath, config);

    // Generate source files
    spinner.text = 'Generating source files...';
    await generateSourceFiles(packagePath, config);

    // Initialize expo module if needed
    if (config.type === 'expo-module') {
      spinner.text = 'Initializing Expo module...';
      await initializeExpoModule(packagePath, config);
    }

    // Install dependencies
    spinner.text = 'Installing dependencies...';
    await installDependencies(packagePath, config.packageManager);

    spinner.succeed(chalk.green(`✨ Package "${config.displayName}" created successfully!`));

    // Print next steps
    printNextSteps(config);
  } catch (error) {
    spinner.fail(chalk.red('Failed to create package'));
    console.error(error);
    process.exit(1);
  }
}

async function createDirectoryStructure(packagePath: string, config: PackageConfig) {
  const dirs = [
    packagePath,
    join(packagePath, 'src'),
    join(packagePath, '__tests__'),
  ];

  if (config.type === 'expo-module') {
    dirs.push(
      join(packagePath, 'android'),
      join(packagePath, 'ios'),
      join(packagePath, 'android', 'src', 'main', 'java'),
      join(packagePath, 'ios', 'Podfile'),
    );
  }

  for (const dir of dirs) {
    await mkdir(dir, { recursive: true });
  }
}

async function generateConfigFiles(packagePath: string, config: PackageConfig) {
  // package.json
  const packageJson: any = {
    name: `@bdt/${config.name}`,
    version: '0.1.0',
    description: config.description,
    main: config.type === 'expo-module' ? 'build/index.js' : 'src/index.ts',
    types: 'src/index.ts',
    private: true,
    scripts: {
      build: 'tsc -p tsconfig.json',
      'type-check': 'tsc --noEmit',
      lint: 'eslint src --ext .ts,.tsx',
      test: 'jest',
      clean: 'rm -rf build node_modules',
    },
    dependencies: {},
    devDependencies: {
      '@types/react': '^18.2.79',
      typescript: '^5.9.3',
      jest: '^29.7.0',
    },
    peerDependencies: {
      react: '*',
    },
  };

  if (config.type === 'component') {
    packageJson.dependencies = {
      tamagui: '*',
      '@bdt/ui': 'workspace:*',
    };
    packageJson.peerDependencies = {
      ...packageJson.peerDependencies,
      'react-native': '*',
    };
  }

  if (config.type === 'expo-module') {
    packageJson.scripts.prebuild = 'expo-module prebuild';
    packageJson.dependencies = {
      expo: '~54.0.0',
    };
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      'expo-modules-core': '^2.2.1',
    };
  }

  await writeFile(join(packagePath, 'package.json'), JSON.stringify(packageJson, null, 2));

  // tsconfig.json
  const tsConfig = {
    extends: '../../tsconfig.base.json',
    compilerOptions: {
      outDir: './build',
      rootDir: './src',
      declaration: true,
      declarationMap: true,
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'build', '__tests__'],
  };

  await writeFile(join(packagePath, 'tsconfig.json'), JSON.stringify(tsConfig, null, 2));

  // .gitignore
  const gitignore = `# Build
build/
dist/

# Dependencies
node_modules/

# Testing
coverage/

# OS
.DS_Store

# IDE
.vscode/
.idea/

# Misc
*.log
*.tgz
`;

  await writeFile(join(packagePath, '.gitignore'), gitignore);

  // README.md
  const readme = `# @bdt/${config.name}

${config.description}

## Installation

This package is part of the monorepo and is automatically linked.

\`\`\`tsx
import { /* exports */ } from '@bdt/${config.name}';
\`\`\`

## Usage

${config.type === 'component' ? `
\`\`\`tsx
import { YourComponent } from '@bdt/${config.name}';

function App() {
  return <YourComponent />;
}
\`\`\`
` : config.type === 'utility' ? `
\`\`\`tsx
import { yourUtility } from '@bdt/${config.name}';

const result = yourUtility();
\`\`\`
` : `
\`\`\`tsx
import * as ${config.name.replace(/-/g, '')} from '@bdt/${config.name}';

// Use your native module
\`\`\`
`}

## Development

\`\`\`bash
# Build
pnpm build

# Type check
pnpm type-check

# Test
pnpm test

# Lint
pnpm lint
\`\`\`

## License

MIT
`;

  await writeFile(join(packagePath, 'README.md'), readme);
}

async function generateSourceFiles(packagePath: string, config: PackageConfig) {
  if (config.type === 'component') {
    // Component library structure
    await mkdir(join(packagePath, 'src', 'components'), { recursive: true });
    
    const exampleComponent = `import React from 'react';
import { YStack, Text } from 'tamagui';

export interface ExampleProps {
  title: string;
  children?: React.ReactNode;
}

export const Example: React.FC<ExampleProps> = ({ title, children }) => {
  return (
    <YStack padding="$4" backgroundColor="$background" borderRadius="$3">
      <Text fontSize="$5" fontWeight="bold" color="$color">
        {title}
      </Text>
      {children}
    </YStack>
  );
};
`;
    
    await writeFile(join(packagePath, 'src', 'components', 'Example.tsx'), exampleComponent);
    
    const indexFile = `export { Example } from './components/Example';
export type { ExampleProps } from './components/Example';
`;
    
    await writeFile(join(packagePath, 'src', 'index.ts'), indexFile);
  } else if (config.type === 'utility') {
    // Utility package structure
    const exampleUtil = `/**
 * Example utility function
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Example async utility
 */
export async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}
`;
    
    await writeFile(join(packagePath, 'src', 'utils.ts'), exampleUtil);
    
    const indexFile = `export * from './utils';
`;
    
    await writeFile(join(packagePath, 'src', 'index.ts'), indexFile);
  } else if (config.type === 'expo-module') {
    // Expo module structure
    const moduleName = config.name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    
    const indexFile = `import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module
import ${moduleName}Module from './${moduleName}Module';

export function hello(): string {
  return ${moduleName}Module.hello();
}

export async function getValueAsync(key: string): Promise<any> {
  return await ${moduleName}Module.getValueAsync(key);
}

export async function setValueAsync(key: string, value: string): Promise<void> {
  return await ${moduleName}Module.setValueAsync(key, value);
}
`;
    
    await writeFile(join(packagePath, 'src', 'index.ts'), indexFile);
  }

  // Test file
  const testFile = `describe('@bdt/${config.name}', () => {
  it('should be defined', () => {
    expect(true).toBe(true);
  });
});
`;
  
  await writeFile(join(packagePath, '__tests__', 'index.test.ts'), testFile);
}

async function initializeExpoModule(packagePath: string, config: PackageConfig) {
  const moduleName = config.name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');

  // expo-module.config.json
  const expoModuleConfig = {
    platforms: ['ios', 'android'],
    ios: {
      modules: [`${moduleName}Module`],
    },
    android: {
      modules: [`expo.modules.${config.name.replace(/-/g, '')}.${moduleName}Module`],
    },
  };

  await writeFile(
    join(packagePath, 'expo-module.config.json'),
    JSON.stringify(expoModuleConfig, null, 2)
  );

  // iOS module stub
  const iosModule = `import ExpoModulesCore

public class ${moduleName}Module: Module {
  public func definition() -> ModuleDefinition {
    Name("${moduleName}")

    Function("hello") {
      return "Hello from ${moduleName}!"
    }

    AsyncFunction("getValueAsync") { (key: String) -> String? in
      // Implement your native iOS code here
      return UserDefaults.standard.string(forKey: key)
    }

    AsyncFunction("setValueAsync") { (key: String, value: String) in
      // Implement your native iOS code here
      UserDefaults.standard.set(value, forKey: key)
    }
  }
}
`;

  await writeFile(join(packagePath, 'ios', `${moduleName}Module.swift`), iosModule);

  // Android module stub
  const packageName = config.name.replace(/-/g, '');
  const androidPath = join(
    packagePath,
    'android',
    'src',
    'main',
    'java',
    'expo',
    'modules',
    packageName
  );
  await mkdir(androidPath, { recursive: true });

  const androidModule = `package expo.modules.${packageName}

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ${moduleName}Module : Module() {
  override fun definition() = ModuleDefinition {
    Name("${moduleName}")

    Function("hello") {
      "Hello from ${moduleName}!"
    }

    AsyncFunction("getValueAsync") { key: String ->
      // Implement your native Android code here
      context.getSharedPreferences("${moduleName}", 0).getString(key, null)
    }

    AsyncFunction("setValueAsync") { key: String, value: String ->
      // Implement your native Android code here
      context.getSharedPreferences("${moduleName}", 0).edit().putString(key, value).apply()
    }
  }
}
`;

  await writeFile(join(androidPath, `${moduleName}Module.kt`), androidModule);

  // build.gradle for Android
  const buildGradle = `apply plugin: 'com.android.library'
apply plugin: 'kotlin-android'

group = 'expo.modules.${packageName}'
version = '0.1.0'

android {
  namespace 'expo.modules.${packageName}'
  compileSdkVersion 34

  defaultConfig {
    minSdkVersion 21
    targetSdkVersion 34
  }

  compileOptions {
    sourceCompatibility JavaVersion.VERSION_17
    targetCompatibility JavaVersion.VERSION_17
  }

  kotlinOptions {
    jvmTarget = '17'
  }
}

dependencies {
  implementation project(':expo-modules-core')
  implementation "org.jetbrains.kotlin:kotlin-stdlib-jdk7:\${kotlinVersion}"
}
`;

  await writeFile(join(packagePath, 'android', 'build.gradle'), buildGradle);
}

async function installDependencies(packagePath: string, packageManager: string) {
  const commands: Record<string, string> = {
    pnpm: 'pnpm install',
    npm: 'npm install',
    yarn: 'yarn install',
  };

  try {
    execSync(commands[packageManager], {
      cwd: packagePath,
      stdio: 'inherit',
    });
  } catch (error) {
    console.warn(chalk.yellow('\nWarning: Failed to install dependencies automatically.'));
    console.log(chalk.cyan(`Please run: cd packages/${packagePath.split('/').pop()} && ${commands[packageManager]}`));
  }
}

function printNextSteps(config: PackageConfig) {
  const packageName = config.name;
  console.log(chalk.cyan.bold('\n📋 Next Steps:\n'));
  console.log(chalk.white(`1. Navigate to your package:`));
  console.log(chalk.gray(`   cd packages/${packageName}\n`));
  
  if (config.type === 'expo-module') {
    console.log(chalk.white(`2. Build the module:`));
    console.log(chalk.gray(`   pnpm build\n`));
    console.log(chalk.white(`3. Use in an app:`));
    console.log(chalk.gray(`   import { hello } from '@bdt/${packageName}';`));
    console.log(chalk.gray(`   console.log(hello());\n`));
    console.log(chalk.yellow('⚠️  Expo Module Setup:'));
    console.log(chalk.gray('   - Implement native code in ios/ and android/ directories'));
    console.log(chalk.gray('   - Run `expo prebuild` in the app to generate native projects'));
    console.log(chalk.gray('   - Test on physical device or simulator\n'));
  } else if (config.type === 'component') {
    console.log(chalk.white(`2. Add components:`));
    console.log(chalk.gray(`   Edit src/components/ and export from src/index.ts\n`));
    console.log(chalk.white(`3. Use in an app:`));
    console.log(chalk.gray(`   import { Example } from '@bdt/${packageName}';`));
    console.log(chalk.gray(`   <Example title="Hello" />\n`));
  } else {
    console.log(chalk.white(`2. Add utilities:`));
    console.log(chalk.gray(`   Edit src/utils.ts and export from src/index.ts\n`));
    console.log(chalk.white(`3. Use in an app:`));
    console.log(chalk.gray(`   import { formatDate } from '@bdt/${packageName}';`));
    console.log(chalk.gray(`   formatDate(new Date());\n`));
  }

  console.log(chalk.green.bold('✨ Happy coding!\n'));
}

program.parse();

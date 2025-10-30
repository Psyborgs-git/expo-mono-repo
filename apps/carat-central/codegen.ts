import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: '../../graphql/carat-central/schema.gql',
  documents: ['src/**/*.graphql', 'src/**/*.gql'],
  generates: {
    'src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
        skipTypename: false,
        enumsAsTypes: true,
        constEnums: true,
        futureProofEnums: true,
        dedupeOperationSuffix: true,
        omitOperationSuffix: false,
        exportFragmentSpreadSubTypes: true,
        nonOptionalTypename: true,
        avoidOptionals: {
          field: true,
          inputValue: false,
          object: false,
          defaultValue: false,
        },
        scalars: {
          DateTime: 'string',
          JSON: 'any',
        },
      },
    },
    'src/generated/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: 'graphql.ts',
      },
      plugins: ['typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
};

export default config;
module.exports = {
  extends: ['plugin:import/recommended', 'plugin:import/typescript'],
  plugins: ['import', 'unused-imports'],
  root: true,
  ignorePatterns: ['**/dist/**'],
  env: {
    browser: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  overrides: [
    {
      files: '*.ts',
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:@typescript-eslint/strict',
      ],
      parserOptions: {
        project: './tsconfig.json',
      },
      rules: {
        '@typescript-eslint/ban-types': [
          'error',
          {
            types: {
              // un-ban a type that's banned by default
              Object: false,
              '{}': false,
            },
            extendDefaults: true,
          },
        ],
      },
    },
    {
      files: '**.vue',
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
  rules: {
    eqeqeq: 'error',
    semi: ['error', 'always'],
    'no-unreachable': 'error',
    'object-shorthand': [1, 'always', { avoidExplicitReturnArrows: true }],
    'unused-imports/no-unused-imports': 'error',
    'prefer-const': 'error',
    '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    'import/order': [
      'error',
      {
        distinctGroup: false,
        alphabetize: {
          order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
          orderImportKind: 'asc',
          caseInsensitive: true /* ignore case. Options: [true, false] */,
        },
        pathGroups: [
          {
            pattern: '@/.*',
            group: 'internal',
          },
        ],
        'newlines-between': 'always',
        groups: [
          'builtin', // Built-in types are first
          'external',
          ['sibling', 'parent'], // Then sibling and parent types. They can be mingled together
          'internal',
          'index', // Then the index file
          'object',
        ],
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/extensions': ['.js', '.ts', '.mjs'],
    'import/resolver': {
      typescript: {
        project: ['tsconfig.json'],
      },
      node: {
        project: ['tsconfig.json'],
      },
    },
  },
};

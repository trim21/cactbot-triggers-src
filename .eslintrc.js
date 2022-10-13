module.exports = {
  extends: ['plugin:import/recommended', 'plugin:import/typescript'],
  parser: '@typescript-eslint/parser',
  plugins: ['import', '@typescript-eslint', 'unused-imports'],
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
  rules: {
    semi: ['error', 'always'],
    'no-unreachable': 'error',
    'object-shorthand': [1, 'always', { avoidExplicitReturnArrows: true }],
    'unused-imports/no-unused-imports': 'error',
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
          caseInsensitive: true /* ignore case. Options: [true, false] */,
        },
        'newlines-between': 'always',
        groups: [
          'builtin', // Built-in types are first
          'external',
          ['sibling', 'parent'], // Then sibling and parent types. They can be mingled together
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
    'import/extensions': ['.js', '.ts'],
    'import/resolver': {
      typescript: true,
      node: true,
    },
  },
};

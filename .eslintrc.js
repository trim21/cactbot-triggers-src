module.exports = {
  extends: ['plugin:import/recommended', 'plugin:import/typescript'],
  parser: '@typescript-eslint/parser',
  plugins: ['import', '@typescript-eslint', 'unused-imports'],
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'unused-imports/no-unused-imports': 'error',
    'import/order': [
      'error',
      {
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

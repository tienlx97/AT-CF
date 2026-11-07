import js from '@eslint/js';
import next from 'eslint-config-next';
import eslintConfigPrettier from 'eslint-config-prettier';
import packageJsonPlugin from 'eslint-plugin-package-json';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

const config = [
  js.configs.recommended,
  ...next,
  {
    ...packageJsonPlugin.configs.recommended,
    files: ['package.json'],
    rules: {
      'package-json/order-properties': 'error',
      'package-json/sort-collections': 'error',
      'package-json/no-empty-fields': 'error',
      'package-json/no-redundant-files': 'error',
      'package-json/no-redundant-publishConfig': 'error',
      'package-json/unique-dependencies': 'error',
      'package-json/specify-peers-locally': 'error',
      'package-json/require-name': 'error',
      'package-json/require-version': 'error',
      'package-json/valid-name': 'error',
      'package-json/valid-version': 'error',
      'package-json/valid-dependencies': 'error',
      'package-json/valid-devDependencies': 'error',
      'package-json/valid-engines': 'error',
      'package-json/valid-scripts': 'error',
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    // Convention: React components (files containing JSX) live in `.jsx`,
    // plain logic (hooks without JSX, config, api clients, schemas, types)
    // stays `.js`.
    files: ['src/**/*.js'],
    rules: {
      'react/jsx-filename-extension': ['error', { extensions: ['.jsx'] }],
    },
  },
  eslintConfigPrettier,
  {
    ignores: [
      '.next/**',
      '.next-*/**',
      'node_modules/**',
      'harness/**',
      '.agents/**',
      '.claude/**',
    ],
  },
];

export default config;

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
  {
    // Colour comes only from the Tailwind brand tokens (openspec/project.md,
    // ADR-0005). Hex values live in src/app/globals.css `@theme` and their JS
    // mirror src/shared/config/brand.js.
    files: ['src/**/*.js', 'src/**/*.jsx'],
    ignores: ['src/shared/config/brand.js'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Literal[value=/(^#[0-9a-fA-F]{3,8}$)|(\\[#[0-9a-fA-F]{3,8}\\])/]',
          message:
            'Hex colour in source. Use a brand token class (bg-brand, text-brand-ink, bg-surface-alt) or BRAND_COLORS from @/shared/config/brand.',
        },
        {
          selector: 'TemplateElement[value.raw=/(^#[0-9a-fA-F]{3,8}$)|(\\[#[0-9a-fA-F]{3,8}\\])/]',
          message:
            'Hex colour in source. Use a brand token class (bg-brand, text-brand-ink, bg-surface-alt) or BRAND_COLORS from @/shared/config/brand.',
        },
      ],
    },
  },
  eslintConfigPrettier,  {
    ignores: [
      '.next/**',
      '.next-*/**',
      'node_modules/**',
      'harness/**',
      '.agents/**',
      '.claude/**',
      'out/**',
      'media-src/**',
    ],
  },
];

export default config;

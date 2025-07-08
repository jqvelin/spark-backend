import stylistic from '@stylistic/eslint-plugin';
import parser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    ignores: ['./dist/*'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@stylistic': stylistic,
      'import': importPlugin
    },
    rules: {
      'no-unused-vars': ['error'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/object-curly-newline': ['error', {
        'ObjectExpression': 'always'
      }],
      '@stylistic/object-curly-newline': ['error', {
        'ObjectExpression': 'always'
      }],
      '@stylistic/object-property-newline': ['error'],
      '@stylistic/key-spacing': ['error', {
        afterColon: true
      }],
      '@stylistic/padded-blocks': ['error', {
        blocks: 'never'
      }],

      '@stylistic/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
      '@stylistic/jsx-max-props-per-line': ['error', {
        maximum: 1,
        when: 'multiline'
      }],

      'import/newline-after-import': ['error'],
      'import/order': ['error', {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'object',
          'type'
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before'
          },
          {
            pattern: '@/**',
            group: 'internal'
          }
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        }
      }]
    }
  }
]);

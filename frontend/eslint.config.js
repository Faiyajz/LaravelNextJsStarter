import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'coverage']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['src/modules/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@/modules/admin/*',
            '@/modules/auth/*',
            '@/modules/buyer/*',
            '@/modules/public/*',
            '@/routes/*',
          ],
        },
      ],
    },
  },
  {
    files: ['src/modules/auth/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@/modules/admin/*',
            '@/modules/buyer/*',
            '@/modules/public/*',
            '@/modules/shared/*',
          ],
        },
      ],
    },
  },
  {
    files: ['src/modules/admin/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@/modules/buyer/*',
            '@/modules/public/*',
            '@/modules/auth/*',
            '@/modules/shared/*',
          ],
        },
      ],
    },
  },
  {
    files: ['src/modules/buyer/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@/modules/admin/*',
            '@/modules/public/*',
            '@/modules/auth/*',
            '@/modules/shared/*',
          ],
        },
      ],
    },
  },
  {
    files: ['src/modules/public/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            '@/modules/admin/*',
            '@/modules/auth/*',
            '@/modules/buyer/*',
            '@/modules/shared/*',
          ],
        },
      ],
    },
  },
  {
    files: ['src/routes/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['@/modules/*/*', '@/modules/*/*/*'],
        },
      ],
    },
  },
  {
    files: ['**/*.{test,spec}.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.vitest,
      },
    },
    rules: {
      'no-restricted-imports': 'off',
    },
  },
])

import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

const config = [
    {
        ignores: ['.next/**', 'node_modules/**', 'public/sw.js', 'test-api-list.ts'],
    },
    ...compat.config({
        extends: ['next/core-web-vitals'],
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint'],
        rules: {
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
            'prefer-const': 'error',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
        },
    }),
];

export default config;

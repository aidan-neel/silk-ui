import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';
const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
    includeIgnoreFile(gitignorePath),
    js.configs.recommended,
    ...ts.configs.recommended,
    ...svelte.configs.recommended,
    prettier,
    ...svelte.configs.prettier,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },
    {
        files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
        ignores: ['eslint.config.js', 'svelte.config.js'],

        languageOptions: {
            parserOptions: {
                projectService: true,
                extraFileExtensions: ['.svelte'],
                parser: ts.parser,
                svelteConfig
            }
        }
    },
    {
        rules: {
            // The docs site intentionally renders trusted markdown / syntax-highlighted
            // HTML via {@html}; this is by design, not an XSS risk here.
            'svelte/no-at-html-tags': 'off',
            // Keyed {#each} is preferred but not enforced as a hard gate; surfaced as a
            // warning to be cleaned up incrementally.
            'svelte/require-each-key': 'warn',
            // Stylistic Svelte 5 preferences that require non-mechanical refactors
            // (prop-synced state, route resolution); surfaced as warnings to address
            // incrementally rather than blocking merges.
            'svelte/prefer-writable-derived': 'warn',
            'svelte/no-navigation-without-resolve': 'warn',
            // Docs render multi-line code samples via `code={`…\n…`}` template
            // literals; the escapes (newlines/quotes) make a plain attribute
            // impractical, so allow escaped-string mustaches. Bare `{'string'}`
            // is still flagged.
            'svelte/no-useless-mustaches': ['error', { ignoreStringEscape: true }],
            // Allow underscore-prefixed bindings/args to be intentionally unused
            // (e.g. `{#each items as _, i}` where only the index is needed).
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_'
                }
            ]
        }
    }
);

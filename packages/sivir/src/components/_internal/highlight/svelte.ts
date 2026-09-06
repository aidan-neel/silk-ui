import type { HLJSApi, Language, Mode } from 'highlight.js';

/**
 * Svelte template grammar for highlight.js.
 *
 * Markup, entities, and comments fall through to the XML grammar, except
 * `<!-- -->` comments are matched explicitly so `{` inside them never opens
 * an expression. Svelte additions layer on top: `<script>` blocks highlight
 * as TypeScript, `<style>` blocks as CSS, `{ … }` expressions highlight
 * as TypeScript inside a `template-variable`
 * span, and `{#if}` / `{:else}` / `{@html}` control tags get `template-tag`
 * and `keyword` scopes. Bare `import`, `export`, and `let`/`const`/`var`
 * statements at line starts (docs snippets omit `<script>` tags) and `//`
 * comments highlight as TypeScript too. Expression modes recurse through
 * `self` so nested braces (object literals, ternaries) stay balanced.
 */
export function svelte(hljs: HLJSApi): Language {
    const regex = hljs.regex;
    const TAG_NAME_RE = regex.concat(
        /[\p{L}_]/u,
        regex.optional(/[\p{L}0-9_.-]*:/u),
        /[\p{L}0-9_.-]*/u
    );
    // XML attribute names plus Svelte directive modifiers (`|local`) and
    // namespaced directives (`bind:value`, `on:click`, `use:action`).
    const SVELTE_IDENT_RE = /[\p{L}0-9._:|-]+/u;

    // `${ … }` inside template strings. Contents flush through TypeScript;
    // nested braces recurse through the expression mode below.
    const SUBST: Mode = {
        className: 'subst',
        begin: /\$\{/,
        end: /\}/,
        subLanguage: 'typescript',
        contains: []
    };
    const TEMPLATE_STRING: Mode = {
        className: 'string',
        begin: /`/,
        end: /`/,
        contains: [hljs.BACKSLASH_ESCAPE, SUBST]
    };
    // `{ … }` template expression. String modes come first so braces inside
    // quotes never terminate the expression early; `self` keeps nested
    // braces (object literals, ternaries, arrow bodies) balanced.
    const EXPRESSION: Mode = {
        className: 'template-variable',
        begin: /\{/,
        end: /\}/,
        subLanguage: 'typescript',
        contains: [hljs.QUOTE_STRING_MODE, hljs.APOS_STRING_MODE, TEMPLATE_STRING, 'self']
    };
    SUBST.contains = [EXPRESSION];

    const TAG_INTERNALS: Mode = {
        endsWithParent: true,
        illegal: /</,
        relevance: 0,
        contains: [
            EXPRESSION,
            {
                className: 'attr',
                begin: SVELTE_IDENT_RE,
                relevance: 0
            },
            {
                begin: /=\s*/,
                relevance: 0,
                contains: [
                    EXPRESSION,
                    {
                        className: 'string',
                        endsParent: true,
                        variants: [
                            { begin: /"/, end: /"/ },
                            { begin: /'/, end: /'/ },
                            { begin: /[^\s"'=<>`]+/ }
                        ]
                    }
                ]
            }
        ]
    };
    // Svelte block, branch, closing, and tag directives. They precede the
    // generic expression so `{` followed by `#`, `:`, `/`, or `@` matches
    // here first.
    const BLOCK_OPEN: Mode = {
        begin: [/\{#/, /\s*/, /(if|each|await|key|snippet)/],
        beginScope: { 1: 'template-tag', 3: 'keyword' },
        end: /\}/,
        endScope: 'template-tag',
        subLanguage: 'typescript',
        contains: [EXPRESSION]
    };
    const BLOCK_MID: Mode = {
        begin: [/\{:/, /\s*/, /(else|then|catch)/],
        beginScope: { 1: 'template-tag', 3: 'keyword' },
        end: /\}/,
        endScope: 'template-tag',
        subLanguage: 'typescript',
        contains: [EXPRESSION]
    };
    const BLOCK_CLOSE: Mode = {
        begin: [/\{\//, /\s*/, /(if|each|await|key|snippet)/],
        beginScope: { 1: 'template-tag', 3: 'keyword' },
        end: /\}/,
        endScope: 'template-tag'
    };
    const AT_TAG: Mode = {
        begin: [/\{@/, /\s*/, /(html|debug|const|render|attach)/],
        beginScope: { 1: 'template-tag', 3: 'keyword' },
        end: /\}/,
        endScope: 'template-tag',
        subLanguage: 'typescript',
        contains: [EXPRESSION]
    };

    // Bare script statements. Docs snippets show imports and state without
    // `<script>` tags, so these line-anchored modes catch them at the top
    // level. The anchor keeps prose safe: only a line starting with the
    // keyword opens the mode. Interiors flush through TypeScript, which
    // handles nesting natively; the mode ends at `;` or just before markup.
    const STATEMENT_END = /;|(?=\n\s*<)/;
    const STATEMENT: Mode[] = [
        {
            begin: [/^\s*/, /import\b/],
            beginScope: { 2: 'keyword' },
            end: STATEMENT_END,
            subLanguage: 'typescript'
        },
        {
            begin: [/^\s*/, /export\b/],
            beginScope: { 2: 'keyword' },
            end: STATEMENT_END,
            subLanguage: 'typescript'
        },
        {
            begin: [/^\s*/, /(let|const|var)\b(?=[^=\n]*=)/],
            beginScope: { 2: 'keyword' },
            end: STATEMENT_END,
            subLanguage: 'typescript'
        }
    ];

    return {
        name: 'Svelte',
        aliases: ['svelte'],
        case_insensitive: false,
        unicodeRegex: true,
        subLanguage: 'xml',
        contains: [
            hljs.COMMENT('<!--', '-->', { relevance: 10 }),
            hljs.COMMENT('//', '$'),
            hljs.COMMENT('/\\*', '\\*/'),
            {
                className: 'tag',
                begin: /<script(?=\s|>)/,
                end: />/,
                keywords: { name: 'script' },
                contains: [TAG_INTERNALS],
                starts: {
                    end: /<\/script>/,
                    returnEnd: true,
                    subLanguage: ['typescript', 'javascript', 'xml']
                }
            },
            {
                className: 'tag',
                begin: /<style(?=\s|>)/,
                end: />/,
                keywords: { name: 'style' },
                contains: [TAG_INTERNALS],
                starts: {
                    end: /<\/style>/,
                    returnEnd: true,
                    subLanguage: ['css', 'xml']
                }
            },
            {
                className: 'tag',
                begin: regex.concat(
                    /</,
                    regex.lookahead(regex.concat(TAG_NAME_RE, regex.either(/\/>/, />/, /\s/)))
                ),
                end: /\/?>/,
                contains: [
                    {
                        className: 'name',
                        begin: TAG_NAME_RE,
                        relevance: 0,
                        starts: TAG_INTERNALS
                    }
                ]
            },
            {
                className: 'tag',
                begin: regex.concat(/<\//, regex.lookahead(regex.concat(TAG_NAME_RE, />/))),
                contains: [
                    {
                        className: 'name',
                        begin: TAG_NAME_RE,
                        relevance: 0
                    },
                    {
                        begin: />/,
                        relevance: 0,
                        endsParent: true
                    }
                ]
            },
            BLOCK_OPEN,
            BLOCK_MID,
            BLOCK_CLOSE,
            AT_TAG,
            ...STATEMENT,
            EXPRESSION
        ]
    };
}

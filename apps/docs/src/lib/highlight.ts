/**
 * Tiny themeable syntax highlighter.
 *
 * Emits `<span class="tok-...">` tokens so the host page can paint them with
 * CSS variables that follow the active theme.
 */

const KEYWORDS_JS = new Set([
    'import',
    'export',
    'from',
    'default',
    'const',
    'let',
    'var',
    'function',
    'return',
    'if',
    'else',
    'new',
    'class',
    'extends',
    'implements',
    'interface',
    'type',
    'enum',
    'true',
    'false',
    'null',
    'undefined',
    'as',
    'in',
    'of',
    'for',
    'while',
    'do',
    'switch',
    'case',
    'break',
    'continue',
    'try',
    'catch',
    'finally',
    'throw',
    'this',
    'super',
    'void',
    'async',
    'await',
    'typeof',
    'instanceof',
    'static',
    'public',
    'private',
    'protected',
    'readonly',
    'satisfies'
]);

const KEYWORDS_SVELTE = new Set([
    ...KEYWORDS_JS,
    'each',
    'then',
    'snippet',
    'render',
    'key',
    'html',
    'debug'
]);

function escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function tok(cls: string, text: string): string {
    return `<span class="tok-${cls}">${escapeHtml(text)}</span>`;
}

type ClassifyFn = (m: RegExpMatchArray) => string | null;

function scan(code: string, re: RegExp, classify: ClassifyFn): string {
    let out = '';
    let last = 0;
    for (const m of code.matchAll(re)) {
        if (m.index === undefined || m[0].length === 0) continue;
        const cls = classify(m);
        if (cls === null) continue;
        out += escapeHtml(code.slice(last, m.index));
        out += tok(cls, m[0]);
        last = m.index + m[0].length;
    }
    out += escapeHtml(code.slice(last));
    return out;
}

function highlightTs(code: string): string {
    const re =
        /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b[A-Z][A-Za-z0-9_]*\b)|(\b[a-zA-Z_$][\w$]*\b)|(\b\d+(?:\.\d+)?\b)/g;
    return scan(code, re, (m) => {
        if (m[1]) return 'comment';
        if (m[2]) return 'string';
        if (m[3]) return 'type';
        if (m[4]) return KEYWORDS_JS.has(m[4]) ? 'keyword' : null;
        return 'number';
    });
}

function highlightCss(code: string): string {
    const re =
        /(\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(@[\w-]+)|(--[\w-]+)|(#[0-9a-fA-F]{3,8}\b)|(\b\d+(?:\.\d+)?(?:px|rem|em|%|s|ms|deg|fr|vh|vw|pt|ch)?\b)|([a-zA-Z-]+(?=\s*:))|(\b(?:rgb|rgba|hsl|hsla|color-mix|var|calc|linear-gradient|radial-gradient|conic-gradient|cubic-bezier|min|max|clamp)(?=\()|in srgb|in oklch)/g;
    return scan(code, re, (m) => {
        if (m[1]) return 'comment';
        if (m[2]) return 'string';
        if (m[3]) return 'keyword';
        if (m[4]) return 'variable';
        if (m[5]) return 'number';
        if (m[6]) return 'number';
        if (m[7]) return 'attr';
        return 'fn';
    });
}

function highlightSvelte(code: string): string {
    const re =
        /(<!--[\s\S]*?-->|\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(<\/?[A-Za-z][\w.-]*|\/?>)|(\{[#:/@]\w+)|(\b[a-zA-Z][\w-]*(?==))|(\b[A-Z][A-Za-z0-9_]*\b)|(\b[a-zA-Z_$][\w$]*\b)|(\b\d+(?:\.\d+)?\b)/g;
    return scan(code, re, (m) => {
        if (m[1]) return 'comment';
        if (m[2]) return 'string';
        if (m[3]) return 'tag';
        if (m[4]) return 'keyword';
        if (m[5]) return 'attr';
        if (m[6]) return 'type';
        if (m[7]) return KEYWORDS_SVELTE.has(m[7]) ? 'keyword' : null;
        return 'number';
    });
}

function highlightShell(code: string): string {
    const re =
        /(^|\s)(#[^\n]*)|("(?:[^"\\]|\\.)*"|'[^']*')|(\$\w+|\$\{[^}]+\})|(\s(?:--?[\w-]+))|(^|[\n;&|`])\s*([\w./-]+)/gm;
    return scan(code, re, (m) => {
        if (m[2]) return 'comment';
        if (m[3]) return 'string';
        if (m[4]) return 'variable';
        if (m[5]) return 'attr';
        if (m[7]) return 'keyword';
        return null;
    });
}

function highlightJson(code: string): string {
    const re = /("(?:[^"\\]|\\.)*")(\s*:)?|(\b(?:true|false|null)\b)|(-?\b\d+(?:\.\d+)?\b)/g;
    return scan(code, re, (m) => {
        if (m[1]) return m[2] ? 'attr' : 'string';
        if (m[3]) return 'keyword';
        return 'number';
    });
}

/**
 * Highlight a code string for a given language. Returns HTML-safe markup
 * with `tok-*` spans. Unknown languages fall back to escaped plain text.
 */
export function highlight(code: string, lang: string = 'txt'): string {
    switch (lang) {
        case 'css':
            return highlightCss(code);
        case 'svelte':
        case 'html':
            return highlightSvelte(code);
        case 'ts':
        case 'tsx':
        case 'typescript':
        case 'js':
        case 'jsx':
        case 'javascript':
            return highlightTs(code);
        case 'shell':
        case 'sh':
        case 'bash':
            return highlightShell(code);
        case 'json':
            return highlightJson(code);
        default:
            return escapeHtml(code);
    }
}

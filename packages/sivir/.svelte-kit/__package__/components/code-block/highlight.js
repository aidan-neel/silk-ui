import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import go from 'highlight.js/lib/languages/go';
import java from 'highlight.js/lib/languages/java';
/**
 * Curated language set. Keeps the bundle lean while covering the common cases,
 * including every language shown in the component's reference design.
 */
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import markdown from 'highlight.js/lib/languages/markdown';
import php from 'highlight.js/lib/languages/php';
import python from 'highlight.js/lib/languages/python';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
let registered = false;
function ensureRegistered() {
    if (registered) {
        return;
    }
    registered = true;
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('typescript', typescript);
    hljs.registerLanguage('python', python);
    hljs.registerLanguage('java', java);
    hljs.registerLanguage('go', go);
    hljs.registerLanguage('csharp', csharp);
    hljs.registerLanguage('c', c);
    hljs.registerLanguage('cpp', cpp);
    hljs.registerLanguage('rust', rust);
    hljs.registerLanguage('ruby', ruby);
    hljs.registerLanguage('php', php);
    hljs.registerLanguage('bash', bash);
    hljs.registerLanguage('json', json);
    hljs.registerLanguage('yaml', yaml);
    hljs.registerLanguage('css', css);
    hljs.registerLanguage('xml', xml);
    hljs.registerLanguage('sql', sql);
    hljs.registerLanguage('markdown', markdown);
}
/**
 * Friendly aliases mapped onto the canonical names registered above.
 *
 * Svelte and Vue have no dedicated grammar in this bundle. TypeScript (with
 * JSX) colours both their import lines and their component markup well, which
 * covers the snippets these docs show.
 */
const ALIASES = {
    js: 'javascript',
    jsx: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    svelte: 'typescript',
    vue: 'typescript',
    py: 'python',
    rb: 'ruby',
    'c#': 'csharp',
    cs: 'csharp',
    'c++': 'cpp',
    golang: 'go',
    rs: 'rust',
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash',
    yml: 'yaml',
    html: 'xml',
    svg: 'xml',
    md: 'markdown'
};
function escapeHtml(input) {
    return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
const PM_RUNNERS = new Set(['bun', 'bunx', 'pnpm', 'npm', 'npx', 'yarn']);
const PM_SUBCOMMANDS = new Set([
    'add',
    'i',
    'install',
    'dlx',
    'x',
    'exec',
    'create',
    'init',
    'run',
    'remove',
    'rm',
    'uninstall'
]);
/**
 * Minimal highlighter for single-line package-manager commands (`bunx …`,
 * `bun add …`, …). Highlight.js's bash grammar emits no tokens for these
 * plain one-liners, leaving InstallCommand tabs monochrome, so this wraps the
 * runner, subcommand, flags, and package args in the same `hljs-*` classes
 * the code-block surface already themes. Only runs when `code` starts with a
 * known runner; anything else stays escaped plain text.
 */
function highlightPmCommand(code) {
    if (!/^\s*(bunx?|pnpm|npm|npx|yarn)\b/.test(code)) {
        return escapeHtml(code);
    }
    let seen = 0;
    let prev = '';
    let out = '';
    for (const part of code.split(/(\s+)/)) {
        if (part === '' || /^\s+$/.test(part)) {
            out += escapeHtml(part);
            continue;
        }
        let cls = null;
        if (seen === 0 && PM_RUNNERS.has(part)) {
            cls = 'built_in';
        }
        else if (PM_SUBCOMMANDS.has(part)) {
            cls = 'keyword';
        }
        else if (/^--?[\w-]+($|=)/.test(part)) {
            cls = 'attr';
        }
        else if (PM_SUBCOMMANDS.has(prev) ||
            part.startsWith('@') ||
            part.includes('/') ||
            /\.(js|ts|tsx|jsx|mjs|cjs|json|svelte)$/.test(part)) {
            cls = 'string';
        }
        out += cls ? `<span class="hljs-${cls}">${escapeHtml(part)}</span>` : escapeHtml(part);
        prev = part;
        seen += 1;
    }
    return out;
}
/**
 * Highlights `code` for `lang`, returning an HTML string of `hljs-*` token
 * spans. Synchronous (works during SSR). Unknown languages fall back to
 * escaped plain text so nothing ever throws or renders raw markup.
 */
export function highlight(code, lang) {
    ensureRegistered();
    const key = (lang ?? '').toLowerCase().trim();
    const resolved = ALIASES[key] ?? key;
    if (resolved && hljs.getLanguage(resolved)) {
        try {
            const value = hljs.highlight(code, { language: resolved, ignoreIllegals: true }).value;
            if (resolved === 'bash' && !value.includes('hljs-')) {
                return highlightPmCommand(code);
            }
            return value;
        }
        catch {
            return escapeHtml(code);
        }
    }
    return escapeHtml(code);
}

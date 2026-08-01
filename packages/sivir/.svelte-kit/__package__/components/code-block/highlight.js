import hljs from 'highlight.js/lib/core';
/**
 * Curated language set. Keeps the bundle lean while covering the common cases,
 * including every language shown in the component's reference design.
 */
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import go from 'highlight.js/lib/languages/go';
import csharp from 'highlight.js/lib/languages/csharp';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import rust from 'highlight.js/lib/languages/rust';
import ruby from 'highlight.js/lib/languages/ruby';
import php from 'highlight.js/lib/languages/php';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';
import sql from 'highlight.js/lib/languages/sql';
import markdown from 'highlight.js/lib/languages/markdown';
let registered = false;
function ensureRegistered() {
    if (registered)
        return;
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
            return hljs.highlight(code, { language: resolved, ignoreIllegals: true }).value;
        }
        catch {
            return escapeHtml(code);
        }
    }
    return escapeHtml(code);
}

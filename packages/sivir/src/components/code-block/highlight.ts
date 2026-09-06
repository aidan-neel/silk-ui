import { pythonPlus, svelte } from '@sivir-ui/svelte/components/_internal/highlight';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import css from 'highlight.js/lib/languages/css';
import dart from 'highlight.js/lib/languages/dart';
import diff from 'highlight.js/lib/languages/diff';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import elixir from 'highlight.js/lib/languages/elixir';
import go from 'highlight.js/lib/languages/go';
import graphql from 'highlight.js/lib/languages/graphql';
import haskell from 'highlight.js/lib/languages/haskell';
import http from 'highlight.js/lib/languages/http';
import ini from 'highlight.js/lib/languages/ini';
import java from 'highlight.js/lib/languages/java';
/**
 * Curated language set. Covers the languages documentation and LLM output
 * most often show; anything else falls back to escaped plain text.
 */
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import kotlin from 'highlight.js/lib/languages/kotlin';
import less from 'highlight.js/lib/languages/less';
import lua from 'highlight.js/lib/languages/lua';
import makefile from 'highlight.js/lib/languages/makefile';
import markdown from 'highlight.js/lib/languages/markdown';
import perl from 'highlight.js/lib/languages/perl';
import php from 'highlight.js/lib/languages/php';
import powershell from 'highlight.js/lib/languages/powershell';
import protobuf from 'highlight.js/lib/languages/protobuf';
import r from 'highlight.js/lib/languages/r';
import ruby from 'highlight.js/lib/languages/ruby';
import rust from 'highlight.js/lib/languages/rust';
import scala from 'highlight.js/lib/languages/scala';
import scss from 'highlight.js/lib/languages/scss';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import swift from 'highlight.js/lib/languages/swift';
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
    hljs.registerLanguage('python', pythonPlus);
    hljs.registerLanguage('java', java);
    hljs.registerLanguage('go', go);
    hljs.registerLanguage('csharp', csharp);
    hljs.registerLanguage('c', c);
    hljs.registerLanguage('cpp', cpp);
    hljs.registerLanguage('rust', rust);
    hljs.registerLanguage('ruby', ruby);
    hljs.registerLanguage('php', php);
    hljs.registerLanguage('bash', bash);
    hljs.registerLanguage('shell', shell);
    hljs.registerLanguage('json', json);
    hljs.registerLanguage('yaml', yaml);
    hljs.registerLanguage('css', css);
    hljs.registerLanguage('scss', scss);
    hljs.registerLanguage('less', less);
    hljs.registerLanguage('xml', xml);
    hljs.registerLanguage('sql', sql);
    hljs.registerLanguage('markdown', markdown);
    hljs.registerLanguage('svelte', svelte);
    hljs.registerLanguage('diff', diff);
    hljs.registerLanguage('dockerfile', dockerfile);
    hljs.registerLanguage('graphql', graphql);
    hljs.registerLanguage('http', http);
    hljs.registerLanguage('ini', ini);
    hljs.registerLanguage('kotlin', kotlin);
    hljs.registerLanguage('lua', lua);
    hljs.registerLanguage('makefile', makefile);
    hljs.registerLanguage('perl', perl);
    hljs.registerLanguage('powershell', powershell);
    hljs.registerLanguage('protobuf', protobuf);
    hljs.registerLanguage('r', r);
    hljs.registerLanguage('scala', scala);
    hljs.registerLanguage('swift', swift);
    hljs.registerLanguage('dart', dart);
    hljs.registerLanguage('elixir', elixir);
    hljs.registerLanguage('haskell', haskell);
}

/**
 * Friendly aliases mapped onto the canonical names registered above.
 *
 * Vue has no dedicated grammar in this bundle. TypeScript (with JSX) colours
 * its import lines and component markup well, which covers the snippets
 * these docs show.
 */
const ALIASES: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
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
    console: 'shell',
    yml: 'yaml',
    html: 'xml',
    svg: 'xml',
    md: 'markdown',
    patch: 'diff',
    dockerfile: 'dockerfile',
    ex: 'elixir',
    exs: 'elixir',
    hs: 'haskell',
    gql: 'graphql',
    kt: 'kotlin',
    kts: 'kotlin',
    pl: 'perl',
    ps1: 'powershell',
    proto: 'protobuf',
    r: 'r',
    toml: 'ini'
};

function escapeHtml(input: string): string {
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
function highlightPmCommand(code: string): string {
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
        let cls: string | null = null;
        if (seen === 0 && PM_RUNNERS.has(part)) {
            cls = 'built_in';
        } else if (PM_SUBCOMMANDS.has(part)) {
            cls = 'keyword';
        } else if (/^--?[\w-]+($|=)/.test(part)) {
            cls = 'attr';
        } else if (
            PM_SUBCOMMANDS.has(prev) ||
            part.startsWith('@') ||
            part.includes('/') ||
            /\.(js|ts|tsx|jsx|mjs|cjs|json|svelte)$/.test(part)
        ) {
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
export function highlight(code: string, lang?: string): string {
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
        } catch {
            return escapeHtml(code);
        }
    }
    return escapeHtml(code);
}

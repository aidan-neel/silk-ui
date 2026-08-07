import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export type Violation = { file: string; line: number; rule: string; text: string };

const RULES: { rule: string; re: RegExp }[] = [
    // hex colors anywhere
    { rule: 'no-literal-color', re: /#[0-9a-fA-F]{3,8}\b/ },
    // px/rem/em literals inside a Tailwind arbitrary value: [...2px...] / [...0.5rem...]
    { rule: 'no-literal-length', re: /\[[^\]]*\d+(?:\.\d+)?(?:px|rem|em)[^\]]*\]/ },
    // direct Tier-1 primitive reference (only neutral, blue, space, success, warning, error)
    {
        rule: 'no-primitive-leak',
        re: /var\(\s*--sivir-(?:neutral|blue|space|success|warning|error)\b/
    }
];

export function lintSource(file: string, source: string): Violation[] {
    // File-level opt-out: a `token-lint-disable-file` directive anywhere skips the
    // whole file. For components inherently built on raw literals (e.g. a color
    // picker manipulating hex/gradient values) per-line annotations are noise.
    if (source.includes('token-lint-disable-file')) return [];
    const out: Violation[] = [];
    const lines = source.split('\n');
    const disabledFor = (line: string, prev: string, rule: string) => {
        const onLine = line.includes('token-lint-disable-line');
        const onPrev = prev.includes('token-lint-disable-next-line');
        const appliesTo = (s: string) => {
            if (!s.includes('token-lint-disable')) return false;
            // Check if it explicitly names this rule
            if (new RegExp(`token-lint-disable[a-z-]*\\s+[^\\n]*\\b${rule}\\b`).test(s))
                return true;
            // Check if it names ANY rule: look for pattern like "disable-line no-something"
            // Extract what comes after the directive - should be a valid rule name pattern
            const match = s.match(/token-lint-disable[a-z-]*\s+([a-z][a-z0-9-]*)/);
            if (match?.[1]) {
                // It looks like a rule name, and it doesn't match our rule, so not disabled
                return false;
            }
            // Otherwise it's a global disable
            return true;
        };
        return (onLine && appliesTo(line)) || (onPrev && appliesTo(prev));
    };
    // Remove var(...) groups (innermost-first to handle nesting) so a length/color
    // that only appears as a var() FALLBACK -- e.g. var(--font-size-body, 16px) --
    // is not treated as a hardcoded literal. Primitive-leak still tests the raw line.
    const stripVars = (s: string) => {
        let prev = s;
        do {
            prev = s;
            s = s.replace(/var\([^()]*\)/g, '');
        } while (s !== prev);
        return s;
    };
    lines.forEach((text, i) => {
        const prev = i > 0 ? lines[i - 1] : '';
        const stripped = stripVars(text);
        for (const { rule, re } of RULES) {
            const target = rule === 'no-primitive-leak' ? text : stripped;
            if (re.test(target) && !disabledFor(text, prev, rule))
                out.push({ file, line: i + 1, rule, text: text.trim() });
        }
    });
    return out;
}

function walk(dir: string, acc: string[] = []): string[] {
    for (const name of readdirSync(dir)) {
        const p = join(dir, name);
        if (statSync(p).isDirectory()) walk(p, acc);
        else if (/\.(svelte|ts)$/.test(name) && !name.endsWith('.test.ts')) acc.push(p);
    }
    return acc;
}

export function lintTree(root: string): Violation[] {
    return walk(root).flatMap((f) => lintSource(f, readFileSync(f, 'utf8')));
}

// `bun tools/token-lint/index.ts [root...]` prints violations; exits 0 in report mode.
// Accepts MULTIPLE roots so batch checks cover every directory passed (not just the first).
if (import.meta.main) {
    const roots = process.argv.slice(2);
    if (roots.length === 0) roots.push('packages/sivir/src/components');
    const v = roots.flatMap((r) => lintTree(r));
    for (const x of v) console.log(`${x.file}:${x.line} [${x.rule}] ${x.text}`);
    console.log(`\n${v.length} violations (report mode — enforced in Plan 2)`);
}

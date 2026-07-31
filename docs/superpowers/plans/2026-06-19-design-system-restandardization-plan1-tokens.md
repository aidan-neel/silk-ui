# Token Foundation & Theme Engine — Implementation Plan (Plan 1 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Sivir's flat ~280-variable token soup with a strict 3-tier token system (primitive → semantic → component) whose default renders the Notion-like neutral aesthetic, and add a constrained ~10-field theme engine alongside the old one.

**Architecture:** Rewrite `packages/sivir/src/ui.css` into three clearly-tiered sections — Tier 1 primitives (the only hand-picked values), Tier 2 semantic tokens (existing public names, new values, mode-aware), Tier 3 component tokens (derived from Tier 2 by recipe). Add a new `themes/theme.ts` engine (new `Theme` type + `themeToCss` v2) **additively** — the old `presets.ts` surface stays so the Studio (rebuilt in Plan 3) keeps compiling. Add a token-lint tool used for enforcement in Plan 2.

**Tech Stack:** Svelte 5, Tailwind v4 (`@theme`), `tailwind-variants`, TypeScript, Vitest, Bun.

**Build-safety rule for this plan:** Every task must leave `bun run check` (turbo type-check) with **no new errors beyond the documented baseline**. We only _change CSS values_ and _add_ TS; we do **not** delete any exported TS symbol in Plan 1. The aggressive cull (spec §8: delete styles/transitions/old presets) lands in Plan 3.

> **Baseline (captured 2026-06-20, commit `3ad4c63`):** `bun run check` already reports **3 errors**, all caused by the user's uncommitted WIP removing the `primary` variant from `input/variants.ts`:
>
> - `apps/docs/tests/unit/sivir/input.test.ts:67` — `variant: 'primary'` not assignable
> - `apps/docs/tests/unit/sivir/themes.presets.test.ts:382` — `input({ variant: 'primary' })` not assignable
> - (one more from the same root cause)
>
> These are **not** ours to fix in Plan 1 (input is migrated in Plan 2; the input `primary`→`outline`/`ghost` change is the user's in-flight work). A task is build-safe if it does not push the error count above 3. Task 7 may incidentally resolve the `themes.presets.test.ts:382` one while loosening that file.

**Reference:** spec at `docs/superpowers/specs/2026-06-19-design-system-restandardization-design.md` (§4 tokens, §6 engine, §9 sequencing).

---

## File structure

| File                                                | Responsibility                                                                       | Action      |
| --------------------------------------------------- | ------------------------------------------------------------------------------------ | ----------- |
| `packages/sivir/src/ui.css`                         | The 3-tier token layer + base/keyframes/reduced-motion/cursor                        | **Rewrite** |
| `packages/sivir/src/themes/theme.ts`                | New constrained engine: `Theme` type, `DEFAULT_THEME`, scale tables, `themeToCss` v2 | **Create**  |
| `packages/sivir/src/themes/theme.test.ts`           | Vitest unit tests for the new engine                                                 | **Create**  |
| `tools/token-lint/index.ts`                         | Scans component source for hardcoded literals / Tier-1 leaks; returns violations     | **Create**  |
| `tools/token-lint/index.test.ts`                    | Vitest tests for the linter against fixtures                                         | **Create**  |
| `packages/sivir/src/themes/builtin-presets.ts`      | Expose the single new default (additively)                                           | **Modify**  |
| `apps/docs/src/routes/themes/[name].css/+server.ts` | Serve custom-theme CSS via v2 engine                                                 | **Modify**  |
| `apps/docs/tests/unit/sivir/themes.presets.test.ts` | Loosen assertions tied to retired default values                                     | **Modify**  |

> `ui.css` stays a single file (matches the existing pattern; splitting `@theme` across `@import`ed files adds Tailwind-v4 build risk for no real gain here). Tiers are delineated by comment banners inside it.

> **TEST LOCATION (corrected 2026-06-20):** All Vitest tests for `@sivir-ui/svelte` MUST live under `apps/docs/tests/unit/sivir/` — that's the only path the vitest `unit` project scans (`tests/unit/**/*.test.ts`, cwd = `apps/docs`). Tests placed under `packages/sivir/src/**` are silently NOT collected. So: `ui-css.test.ts` → `apps/docs/tests/unit/sivir/ui-css.test.ts`; `theme.test.ts` → `apps/docs/tests/unit/sivir/theme.test.ts`; `builtin-presets.test.ts` → `apps/docs/tests/unit/sivir/builtin-presets.test.ts`. Tests that read a source file as text resolve it via `resolve(process.cwd(), '../../packages/sivir/src/<file>')`; tests that import code use the `@sivir-ui/svelte/...` alias (e.g. `@sivir-ui/svelte/themes/theme`). Run with `cd apps/docs && bunx vitest run --project unit`.

---

## Task 1: Token-lint tool (the enforcement harness)

A small linter we build now and _enforce_ in Plan 2. It scans a list of source files and flags raw hex colors, raw `px`/`rem` length literals inside Tailwind arbitrary values (`[...]`), and direct use of Tier-1 primitives (`--sivir-*`). It is unit-tested against fixtures, **not** the real components (which still contain literals until Plan 2).

**Files:**

- Create: `tools/token-lint/index.ts`
- Test: `tools/token-lint/index.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// tools/token-lint/index.test.ts
import { describe, expect, it } from 'vitest';
import { lintSource } from './index';

describe('lintSource', () => {
	it('flags a hardcoded hex color', () => {
		const v = lintSource('a.svelte', 'class="bg-[#ff0000]"');
		expect(v).toHaveLength(1);
		expect(v[0].rule).toBe('no-literal-color');
	});

	it('flags a hardcoded px length in an arbitrary value', () => {
		const v = lintSource('a.svelte', 'class="h-[2px]"');
		expect(v.map((x) => x.rule)).toContain('no-literal-length');
	});

	it('flags direct use of a Tier-1 primitive', () => {
		const v = lintSource('a.svelte', 'class="text-[var(--sivir-neutral-900)]"');
		expect(v.map((x) => x.rule)).toContain('no-primitive-leak');
	});

	it('passes clean token-only usage', () => {
		const v = lintSource('a.svelte', 'class="bg-[var(--color-card)] rounded-[var(--radius-lg)]"');
		expect(v).toEqual([]);
	});

	it('reports the correct line number for a violation on a later line', () => {
		// only scans the text it is handed; reports 1-based line numbers
		const v = lintSource('a.svelte', 'line1\nclass="h-[8px]"');
		expect(v[0].line).toBe(2);
	});
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /home/aidan/silk/apps/docs && bunx vitest run ../../tools/token-lint/index.test.ts`
Expected: FAIL — `Cannot find module './index'`.

- [ ] **Step 3: Write minimal implementation**

```ts
// tools/token-lint/index.ts
export type Violation = { file: string; line: number; rule: string; text: string };

const RULES: { rule: string; re: RegExp }[] = [
	// hex colors anywhere
	{ rule: 'no-literal-color', re: /#[0-9a-fA-F]{3,8}\b/ },
	// px/rem/em literals inside a Tailwind arbitrary value: [...2px...] / [...0.5rem...]
	{ rule: 'no-literal-length', re: /\[[^\]]*\d+(?:\.\d+)?(?:px|rem|em)[^\]]*\]/ },
	// direct Tier-1 primitive reference
	{ rule: 'no-primitive-leak', re: /var\(\s*--sivir-[a-z0-9-]+/ }
];

export function lintSource(file: string, source: string): Violation[] {
	const out: Violation[] = [];
	source.split('\n').forEach((text, i) => {
		for (const { rule, re } of RULES) {
			if (re.test(text)) out.push({ file, line: i + 1, rule, text: text.trim() });
		}
	});
	return out;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd /home/aidan/silk/apps/docs && bunx vitest run ../../tools/token-lint/index.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Add a CLI entry that scans the component tree in report mode**

```ts
// append to tools/token-lint/index.ts
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

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

// `bun tools/token-lint/index.ts <root>` prints violations; exits 0 in report mode.
if (import.meta.main) {
	const root = process.argv[2] ?? 'packages/sivir/src/components';
	const v = lintTree(root);
	for (const x of v) console.log(`${x.file}:${x.line} [${x.rule}] ${x.text}`);
	console.log(`\n${v.length} violations (report mode — enforced in Plan 2)`);
}
```

- [ ] **Step 6: Run report mode to capture the Plan 2 worklist**

Run: `cd /home/aidan/silk && bun tools/token-lint/index.ts packages/sivir/src/components > /tmp/token-lint-baseline.txt; tail -1 /tmp/token-lint-baseline.txt`
Expected: prints a non-zero violation count (the literals Plan 2 will remove). This is informational; do not fail the build.

- [ ] **Step 7: Commit**

```bash
cd /home/aidan/silk
git add tools/token-lint
git commit -m "feat(tokens): add token-lint tool (report mode)"
```

---

## Task 2: Rewrite `ui.css` — Tier 1 primitives

Replace the existing `@theme`/`.dark` color+token soup with the tiered system. This task writes **Tier 1 only** (primitives), plus carries over the structural blocks. Tier 2 and Tier 3 follow in Tasks 3–4 (we build the file up in order, committing per tier).

**Files:**

- Modify: `packages/sivir/src/ui.css` (full rewrite, done across Tasks 2–4)
- Test: `packages/sivir/src/themes/ui-css.test.ts` (presence assertions; created here)

- [ ] **Step 1: Write the failing presence test**

```ts
// packages/sivir/src/themes/ui-css.test.ts
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const css = readFileSync(fileURLToPath(new URL('../ui.css', import.meta.url)), 'utf8');

describe('ui.css Tier 1 primitives', () => {
	it('defines the 13-step neutral ramp', () => {
		for (const step of [0, 25, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900]) {
			expect(css).toContain(`--sivir-neutral-${step}:`);
		}
	});
	it('defines the blue ramp and the 4px space unit', () => {
		expect(css).toContain('--sivir-blue-500:');
		expect(css).toContain('--sivir-space-unit: 4px');
	});
	it('overrides the neutral ramp under .dark', () => {
		const darkBlock = css.slice(css.indexOf('.dark'));
		expect(darkBlock).toContain('--sivir-neutral-0: #0d0d0d');
	});
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd /home/aidan/silk/apps/docs && bunx vitest run ../../packages/sivir/src/themes/ui-css.test.ts`
Expected: FAIL — current `ui.css` has no `--sivir-*` primitives.

- [ ] **Step 3: Rewrite the top of `ui.css` with Tier-1 primitives**

Replace lines 1–281 (the `@theme { … }` block) with the header + Tier 1. Keep `@import 'tailwindcss';`, `@source`, and `@custom-variant dark`.

```css
@import 'tailwindcss';
@source "./**/*.{svelte,ts}";
@custom-variant dark (&:where(.dark, .dark *));

/* ============================================================
   TIER 1 — PRIMITIVES (the only hand-picked values)
   Brandless scales. Components must NEVER reference these.
   ============================================================ */
@theme {
	/* Fonts */
	--font-sans: 'Inter', sans-serif;
	--font-mono: 'Geist Mono', monospace;
	--font-header: var(--font-sans);

	/* Neutral ramp — LIGHT (cool-neutral default) */
	--sivir-neutral-0: #ffffff;
	--sivir-neutral-25: #fbfbfa;
	--sivir-neutral-50: #f7f7f5;
	--sivir-neutral-100: #f0f0ee;
	--sivir-neutral-150: #e8e8e6;
	--sivir-neutral-200: #e2e2df;
	--sivir-neutral-300: #d4d4d0;
	--sivir-neutral-400: #b4b4ae;
	--sivir-neutral-500: #8f8f88;
	--sivir-neutral-600: #6f6f68;
	--sivir-neutral-700: #52524c;
	--sivir-neutral-800: #33332e;
	--sivir-neutral-900: #1c1c19;

	/* Accent (blue) ramp — used sparingly */
	--sivir-blue-50: #eef4ff;
	--sivir-blue-100: #dbe8ff;
	--sivir-blue-500: #4a8cff;
	--sivir-blue-600: #3b7af0;
	--sivir-blue-ring: rgb(74 140 255 / 0.4);

	/* Status hues */
	--sivir-success: #3f9b6b;
	--sivir-warning: #c98a2b;
	--sivir-error: #d05050;

	/* Spacing scale (multiples of the density-driven unit) */
	--sivir-space-unit: 4px;
	--sivir-space-1: calc(var(--sivir-space-unit) * 1);
	--sivir-space-2: calc(var(--sivir-space-unit) * 2);
	--sivir-space-3: calc(var(--sivir-space-unit) * 3);
	--sivir-space-4: calc(var(--sivir-space-unit) * 4);
	--sivir-space-5: calc(var(--sivir-space-unit) * 5);
	--sivir-space-6: calc(var(--sivir-space-unit) * 6);
	--sivir-space-8: calc(var(--sivir-space-unit) * 8);
	--sivir-space-10: calc(var(--sivir-space-unit) * 10);

	/* Radius scale (default) */
	--radius-sm: 4px;
	--radius-md: 6px;
	--radius-lg: 8px;
	--radius-xl: 12px;

	/* Type scale */
	--text-xs: 12px;
	--text-sm: 14px;
	--text-base: 14px;
	--font-size-header: 18px;
	--font-size-body: 14px;
	--font-size-label: 13px;
	--font-size-button: 14px;
	--font-size-badge: 12px;
	--font-weight-header: 600;
	--font-weight-body: 400;
	--font-weight-label: 500;
	--font-weight-button: 500;
	--font-weight-badge: 500;
	--tracking-header: -0.015em;
	--tracking-body: 0em;
	--tracking-label: 0em;
	--tracking-button: 0em;
	--tracking-badge: 0em;

	/* Elevation scale (borders-first) */
	--elevation-0: none;
	--elevation-1: 0 1px 2px rgb(0 0 0 / 0.04);
	--elevation-float: 0 8px 24px -8px rgb(0 0 0 / 0.12), 0 2px 6px rgb(0 0 0 / 0.06);

	/* Motion scale (default feel) */
	--motion-duration-hover: 140ms;
	--motion-duration-menu: 120ms;
	--motion-duration-panel: 180ms;
	--motion-duration-sheet: 220ms;
	--motion-duration-overlay: 120ms;
	--motion-duration-tooltip: 120ms;
	--motion-duration-toast-in: 320ms;
	--motion-duration-toast-out: 240ms;
	--motion-panel-x: 0px;
	--motion-panel-y: 4px;
	--motion-panel-blur: 0px;
	--motion-panel-scale-start: 0.99;
	--motion-sheet-offset: 132px;
	--motion-overlay-blur: 0px;
	--motion-panel-easing: cubic-bezier(0.22, 1, 0.36, 1);
	--motion-easing-hover: cubic-bezier(0.22, 1, 0.36, 1);

	--border-size: 1px;
	--ui-cursor-interactive: pointer;
```

> Tier 1 stays open (no closing `}`) — Tasks 3–4 append Tier 2 and Tier 3 inside the same `@theme` block, then close it. The `.dark` primitive overrides come in Step 4 below.

- [ ] **Step 4: Add the `.dark` Tier-1 overrides**

Immediately after Tier 3 closes the `@theme` block (Task 4), the dark block begins. For now, draft the dark primitive overrides at the top of the `.dark { … }` block:

```css
.dark {
	/* TIER 1 — dark neutral ramp + accent */
	--sivir-neutral-0: #0d0d0d;
	--sivir-neutral-25: #141414;
	--sivir-neutral-50: #1a1a1a;
	--sivir-neutral-100: #212121;
	--sivir-neutral-150: #282828;
	--sivir-neutral-200: #303030;
	--sivir-neutral-300: #3a3a3a;
	--sivir-neutral-400: #4a4a4a;
	--sivir-neutral-500: #6b6b6b;
	--sivir-neutral-600: #8a8a8a;
	--sivir-neutral-700: #a8a8a8;
	--sivir-neutral-800: #d0d0d0;
	--sivir-neutral-900: #ededed;

	--sivir-blue-50: #13233d;
	--sivir-blue-100: #1c3357;
	--sivir-blue-500: #5b9bff;
	--sivir-blue-600: #4a8cff;
	--sivir-blue-ring: rgb(91 155 255 / 0.45);

	--sivir-success: #4caf7d;
	--sivir-warning: #e0a23c;
	--sivir-error: #e06464;
```

> Leave `.dark` open; Tier-2 dark overrides append in Task 3.

- [ ] **Step 5: Run the presence test (will still fail on Tier-2/3 absence — that's expected)**

Run: `cd /home/aidan/silk/apps/docs && bunx vitest run ../../packages/sivir/src/themes/ui-css.test.ts`
Expected: the three Tier-1 assertions PASS. (File won't build until Tasks 3–4 close the blocks; do not run the app build yet.)

- [ ] **Step 6: Commit (WIP — file intentionally not yet closed)**

```bash
cd /home/aidan/silk
git add packages/sivir/src/ui.css packages/sivir/src/themes/ui-css.test.ts
git commit -m "feat(tokens): Tier 1 primitives in ui.css [WIP, closed in next tasks]"
```

---

## Task 3: `ui.css` — Tier 2 semantic tokens

Map the existing **public** token names (`--color-*`, etc.) to Tier-1 steps, mode-aware. Components keep referencing these names, so component churn is minimized.

**Files:**

- Modify: `packages/sivir/src/ui.css`
- Modify: `packages/sivir/src/themes/ui-css.test.ts`

- [ ] **Step 1: Add failing Tier-2 assertions**

```ts
// append inside packages/sivir/src/themes/ui-css.test.ts
describe('ui.css Tier 2 semantic', () => {
	it('maps semantic color tokens to neutral/blue primitives', () => {
		expect(css).toContain('--color-background: var(--sivir-neutral-25)');
		expect(css).toContain('--color-card: var(--sivir-neutral-0)');
		expect(css).toContain('--color-primary: var(--sivir-blue-500)');
		expect(css).toContain('--color-ring: var(--sivir-blue-ring)');
	});
	it('aliases retired names to their replacements', () => {
		expect(css).toContain('--color-destructive: var(--color-error)');
		expect(css).toContain('--color-modal: var(--color-panel)');
		expect(css).toContain('--color-info: var(--color-primary)');
	});
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd /home/aidan/silk/apps/docs && bunx vitest run ../../packages/sivir/src/themes/ui-css.test.ts`
Expected: FAIL on the new `describe('ui.css Tier 2 semantic')` block.

- [ ] **Step 3: Append Tier 2 to the `@theme` block (light)**

Append after the Tier-1 light primitives, before Tier 3:

```css
	/* ============================================================
	   TIER 2 — SEMANTIC (public names; the component contract)
	   ============================================================ */
	--color-background: var(--sivir-neutral-25);
	--color-card: var(--sivir-neutral-0);
	--color-panel: var(--sivir-neutral-0);
	--color-muted: var(--sivir-neutral-50);
	--color-secondary: var(--sivir-neutral-100);
	--color-border: var(--sivir-neutral-200);
	--color-border-strong: var(--sivir-neutral-300);
	--color-input: var(--sivir-neutral-300);
	--color-foreground: var(--sivir-neutral-900);
	--color-foreground-muted: var(--sivir-neutral-500);
	--color-foreground-opposite: var(--sivir-neutral-0);
	--color-foreground-btn: #ffffff;
	--color-primary: var(--sivir-blue-500);
	--color-primary-hover: var(--sivir-blue-600);
	--color-on-primary: #ffffff;
	--color-accent-tint: var(--sivir-blue-50);
	--color-ring: var(--sivir-blue-ring);
	--color-success: var(--sivir-success);
	--color-warning: var(--sivir-warning);
	--color-error: var(--sivir-error);
	--color-overlay: rgb(20 20 20 / 0.2);

	/* Retired-name aliases (so existing components keep resolving) */
	--color-destructive: var(--color-error);
	--color-modal: var(--color-panel);
	--color-info: var(--color-primary);
	--color-alternate: var(--sivir-neutral-800);
	--color-accent: var(--color-muted);
	--color-floating-panel: var(--color-panel);
	--color-floating-panel-foreground: var(--color-foreground);
	--color-panel-foreground: var(--color-foreground);
	--color-overlay-bg: var(--color-background);
	--color-tooltip: var(--sivir-neutral-900);
	--color-tooltip-foreground: var(--sivir-neutral-0);
	--color-field: var(--color-card);
	--color-field-hover: var(--color-muted);
	--color-field-focus: var(--color-card);
	--color-field-foreground: var(--color-foreground);
	--color-field-placeholder: var(--color-foreground-muted);
}
```

> The closing `}` above ends the `@theme` block. (Tier 3 will be inserted _before_ this close in Task 4 — when doing Task 4, move this `}` down past the Tier-3 block.)

- [ ] **Step 4: Append Tier 2 dark overrides inside `.dark`**

After the Tier-1 dark primitives in the `.dark` block:

```css
	/* TIER 2 — dark semantic remap */
	--color-background: var(--sivir-neutral-25);
	--color-card: var(--sivir-neutral-50);
	--color-panel: var(--sivir-neutral-100);
	--color-muted: var(--sivir-neutral-0);
	--color-secondary: var(--sivir-neutral-100);
	--color-foreground-opposite: var(--sivir-neutral-0);
	--color-overlay: rgb(0 0 0 / 0.55);
	--color-tooltip: var(--sivir-neutral-900);
	--color-tooltip-foreground: var(--sivir-neutral-0);
	--color-field: var(--color-secondary);
}
```

> This `}` closes `.dark`. (Tier-3 has no dark-specific overrides except elevation, handled in Task 4 — when doing Task 4, insert the elevation override before this close.)

- [ ] **Step 5: Run the Tier-2 test**

Run: `cd /home/aidan/silk/apps/docs && bunx vitest run ../../packages/sivir/src/themes/ui-css.test.ts`
Expected: Tier-1 and Tier-2 assertions PASS.

- [ ] **Step 6: Commit**

```bash
cd /home/aidan/silk
git add packages/sivir/src/ui.css packages/sivir/src/themes/ui-css.test.ts
git commit -m "feat(tokens): Tier 2 semantic tokens + retired-name aliases"
```

---

## Task 4: `ui.css` — Tier 3 derived component tokens + structural blocks

Derive every component token from Tier 2 by recipe (no hand-authored per-variant shadow soup), and carry over the base layer, keyframes, reduced-motion, and cursor rule. This task **closes the file** so it builds.

**Files:**

- Modify: `packages/sivir/src/ui.css`
- Modify: `packages/sivir/src/themes/ui-css.test.ts`

- [ ] **Step 1: Add failing Tier-3 + structural assertions**

```ts
// append inside packages/sivir/src/themes/ui-css.test.ts
describe('ui.css Tier 3 + structure', () => {
	it('derives button tokens from semantic tokens (no fancy shadow tokens)', () => {
		expect(css).toContain('--button-primary-bg: var(--color-primary)');
		expect(css).toContain('--button-secondary-bg: var(--color-secondary)');
		expect(css).not.toContain('--button-primary-shadow');
		expect(css).not.toContain('--button-fancy-highlight');
	});
	it('sizes controls from the spacing scale', () => {
		expect(css).toContain('--size-control-md: var(--sivir-space-');
		expect(css).toContain('--button-height: var(--size-control-md)');
	});
	it('keeps base layer, keyframes and reduced-motion', () => {
		expect(css).toContain('@layer base');
		expect(css).toContain('@keyframes skeleton-loading');
		expect(css).toContain('prefers-reduced-motion: reduce');
	});
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd /home/aidan/silk/apps/docs && bunx vitest run ../../packages/sivir/src/themes/ui-css.test.ts`
Expected: FAIL on the Tier-3 block.

- [ ] **Step 3: Insert Tier 3 inside `@theme` (before the `}` that closed it in Task 3)**

```css
	/* ============================================================
	   TIER 3 — COMPONENT TOKENS (DERIVED from Tier 2 by recipe)
	   ============================================================ */
	/* Control sizing (from spacing scale) */
	--size-control-sm: var(--sivir-space-8); /* 32px */
	--size-control-md: calc(var(--sivir-space-8) + var(--sivir-space-1)); /* 36px */
	--size-control-lg: var(--sivir-space-10); /* 40px */
	--size-icon-md: var(--sivir-space-8);
	--space-control-x: var(--sivir-space-3);
	--space-panel: var(--sivir-space-3);
	--space-menu-item-x: var(--sivir-space-2);

	/* Button */
	--button-height: var(--size-control-md);
	--button-padding-x: var(--sivir-space-4);
	--button-gap: var(--sivir-space-2);
	--button-primary-bg: var(--color-primary);
	--button-primary-foreground: var(--color-on-primary);
	--button-primary-hover-bg: var(--color-primary-hover);
	--button-primary-border: transparent;
	--button-secondary-bg: var(--color-secondary);
	--button-secondary-foreground: var(--color-foreground);
	--button-secondary-border: var(--color-border);
	--button-secondary-hover-bg: var(--color-border);
	--button-ghost-bg: transparent;
	--button-ghost-border: transparent;
	--button-ghost-foreground: var(--color-foreground);
	--button-ghost-hover-bg: color-mix(in srgb, var(--color-foreground) 6%, transparent);
	--button-outlined-bg: transparent;
	--button-outlined-foreground: var(--color-foreground);
	--button-outlined-hover-bg: var(--color-muted);
	--button-outlined-flat-shadow: inset 0 0 0 1px var(--color-border);
	--button-outlined-fancy-shadow: var(--button-outlined-flat-shadow);
	--button-destructive-bg: var(--color-error);
	--button-destructive-foreground: #ffffff;
	--button-destructive-border: transparent;
	--button-destructive-hover-bg: color-mix(in srgb, var(--color-error) 88%, black);
	/* haptic retired -> flat */
	--haptic-press-y: 0px;

	/* Badge */
	--badge-padding-x: var(--sivir-space-2);
	--badge-padding-y: 2px;

	/* Field / input */
	--field-height: var(--size-control-md);
	--field-padding-x: var(--sivir-space-3);
	--field-padding-y: 0rem;
	--field-bg: var(--color-card);
	--field-border: var(--color-input);
	--field-focus-border: var(--color-primary);
	--field-placeholder: var(--color-foreground-muted);
	--field-disabled-opacity: 0.55;
	--field-outlined-shadow: inset 0 0 0 1px var(--color-border);

	/* Panel / card / menu / tooltip */
	--panel-padding: var(--sivir-space-3);
	--panel-shadow: var(--elevation-float);
	--card-padding: var(--sivir-space-6);
	--card-bg: var(--color-card);
	--card-shadow: var(--elevation-1);
	--tooltip-padding-y: var(--sivir-space-1);
	--tooltip-padding-x: var(--sivir-space-2);
	--tooltip-shadow: var(--elevation-float);
	--menu-item-height: var(--sivir-space-8);
	--menu-item-padding-x: var(--space-menu-item-x);
	--menu-item-foreground: var(--color-foreground);
	--floating-menu-item-foreground: var(--color-foreground);
	--menu-item-hover-bg: color-mix(in srgb, var(--color-foreground) 6%, transparent);
	--floating-menu-item-hover-bg: var(--menu-item-hover-bg);
	--menu-item-active-bg: var(--color-accent-tint);
	--floating-menu-item-active-bg: var(--menu-item-active-bg);
	--menu-label-foreground: var(--color-foreground-muted);
	--menu-padding: var(--sivir-space-1);
	--menu-search-padding: var(--sivir-space-3);
	--menu-label-padding-x: var(--sivir-space-2);
	--menu-label-padding-y: var(--sivir-space-1);

	/* Controls: switch / checkbox / separator / skeleton */
	--separator-color: var(--color-border);
	--separator-thickness: 1px;
	--switch-track-bg: color-mix(in srgb, var(--color-foreground) 18%, var(--color-background));
	--switch-track-active-bg: var(--color-primary);
	--switch-thumb-bg: #ffffff;
	--size-switch-track: var(--sivir-space-10);
	--size-switch-thumb: 14px;
	--switch-track-padding: 2px;
	--checkbox-size: var(--sivir-space-4);
	--checkbox-bg: var(--color-field);
	--checkbox-checked-bg: var(--color-primary);
	--checkbox-checked-foreground: var(--color-on-primary);
	--toast-bg: var(--color-panel);
	--toast-shadow: var(--elevation-float);
	--skeleton-base: var(--color-secondary);
	--skeleton-highlight: var(--color-muted);

	/* Component padding carried for existing components (Plan 2 tokenizes the rest) */
	--tabs-trigger-padding-x: var(--sivir-space-3);
	--tabs-trigger-padding-y: var(--sivir-space-2);
	--tabs-list-padding: 3px;
	--tabs-indicator-height: 2px;
	--progress-height: var(--sivir-space-2);
	--toast-padding-x: var(--sivir-space-4);
	--toast-padding-y: var(--sivir-space-4);
	--toast-progress-height: 2px;
	--calendar-padding: var(--sivir-space-3);
	--calendar-grid-gap: var(--sivir-space-1);
	--color-picker-padding: var(--sivir-space-2);
	--color-picker-width: 244px;
	--color-picker-area-height: 148px;
	--modal-padding: var(--sivir-space-4);
	--modal-title-description-gap: var(--sivir-space-1);
	--modal-section-gap: var(--sivir-space-4);
	--sheet-body-padding: var(--sivir-space-4);
	--sheet-header-padding-bottom: var(--sivir-space-6);
	--textarea-min-height: 7rem;
	--textarea-padding-y: var(--sivir-space-2);
	--breadcrumb-gap: var(--sivir-space-2);
	--toggle-padding-sm: var(--sivir-space-2);
	--toggle-padding-md: var(--sivir-space-3);
	--toggle-padding-lg: var(--sivir-space-4);
	--shortcut-font-size: 11px;
	--slider-thumb-size: 16px;
	--slider-thumb-border: 2px;
	--slider-track-height: var(--sivir-space-1);
	--slider-transition-duration: 120ms;
	--toast-icon-size: var(--sivir-space-6);
	--toast-close-size: var(--sivir-space-5);
	--outline-shadow: none;
}
```

- [ ] **Step 4: Add the dark elevation override (before `.dark` closes)**

Inside the `.dark` block, before its closing `}`:

```css
/* Borders-first dark: flat cards/panels, float only on overlays */
--elevation-1: none;
--card-shadow: var(--elevation-0);
--panel-shadow: var(--elevation-float);
--switch-track-bg: color-mix(in srgb, var(--color-foreground) 24%, var(--color-background));
```

- [ ] **Step 5: Append the structural blocks (carried from old `ui.css`, unchanged)**

After the `.dark` block, append the `@layer base { … }` (border-color, `.border`, the `[data-ui]` transition rules, the menu-item height rules), the `@keyframes skeleton-loading`, the `@media (prefers-reduced-motion: reduce)` block, and the button `cursor` rule — copy them verbatim from the pre-rewrite `ui.css` (git history `git show HEAD~4:packages/sivir/src/ui.css` lines 406–487).

- [ ] **Step 6: Run the full ui.css test**

Run: `cd /home/aidan/silk/apps/docs && bunx vitest run ../../packages/sivir/src/themes/ui-css.test.ts`
Expected: all describe blocks PASS.

- [ ] **Step 7: Build the library to prove the CSS is valid**

Run: `cd /home/aidan/silk && bun run build --filter=@sivir/docs 2>&1 | tail -20`
Expected: build succeeds (Tailwind compiles ui.css). If it fails on an unclosed block, fix the brace nesting from Tasks 2–4.

- [ ] **Step 8: Commit**

```bash
cd /home/aidan/silk
git add packages/sivir/src/ui.css packages/sivir/src/themes/ui-css.test.ts
git commit -m "feat(tokens): Tier 3 derived component tokens; ui.css 3-tier complete"
```

---

## Task 5: New constrained engine `theme.ts`

The ~10-field `Theme` type + `themeToCss` v2 that emits _override_ CSS from the 6 controls (the baked default already lives in `ui.css`). **Additive** — does not touch `presets.ts`.

**Files:**

- Create: `packages/sivir/src/themes/theme.ts`
- Test: `apps/docs/tests/unit/sivir/theme.test.ts` (vitest unit project — see TEST LOCATION note)

- [ ] **Step 1: Write the failing tests**

```ts
// apps/docs/tests/unit/sivir/theme.test.ts
import { describe, expect, it } from 'vitest';
import { DEFAULT_THEME, themeToCss } from '@sivir-ui/svelte/themes/theme';

describe('DEFAULT_THEME', () => {
	it('uses Inter, soft blue brand, default scales', () => {
		expect(DEFAULT_THEME.fontSans).toBe('Inter');
		expect(DEFAULT_THEME.brand).toBe('#4a8cff');
		expect(DEFAULT_THEME.radius).toBe('default');
		expect(DEFAULT_THEME.density).toBe('default');
		expect(DEFAULT_THEME.motion).toBe('default');
	});
});

describe('themeToCss', () => {
	const css = themeToCss(DEFAULT_THEME);
	it('emits a :root, .dark shared block with fonts, radii, brand ramp, motion', () => {
		expect(css).toContain('--font-sans: Inter');
		expect(css).toContain('--radius-lg: 8px');
		expect(css).toContain('--sivir-blue-500: #4a8cff');
		expect(css).toContain('--sivir-space-unit: 4px');
		expect(css).toContain('--motion-duration-panel: 180ms');
	});
	it('derives the brand ramp via oklch from the brand hex', () => {
		const c = themeToCss({ ...DEFAULT_THEME, brand: '#22cc88' });
		expect(c).toContain('--sivir-blue-500: #22cc88');
		expect(c).toContain('--sivir-blue-600: oklch(from #22cc88');
		expect(c).toContain('--sivir-blue-ring: oklch(from #22cc88 l c h / 0.4)');
	});
	it('maps radius preset "sharp" to the sharp scale', () => {
		expect(themeToCss({ ...DEFAULT_THEME, radius: 'sharp' })).toContain('--radius-lg: 4px');
	});
	it('maps density "compact" to a smaller space unit', () => {
		expect(themeToCss({ ...DEFAULT_THEME, density: 'compact' })).toContain(
			'--sivir-space-unit: 3.5px'
		);
	});
	it('maps motion "none" to zeroed durations', () => {
		expect(themeToCss({ ...DEFAULT_THEME, motion: 'none' })).toContain(
			'--motion-duration-panel: 0ms'
		);
	});
	it('emits a true-gray neutral override only for non-cool temperatures', () => {
		expect(themeToCss(DEFAULT_THEME)).not.toContain('color-mix(in srgb, #e2e2df'); // cool => no override
		const warm = themeToCss({ ...DEFAULT_THEME, neutral: 'warm' });
		expect(warm).toContain('--sivir-neutral-200:');
	});
});
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd /home/aidan/silk/apps/docs && bunx vitest run --project unit sivir/theme.test.ts`
Expected: FAIL — `Cannot find module './theme'`.

- [ ] **Step 3: Implement `theme.ts`**

```ts
// packages/sivir/src/themes/theme.ts

export type NeutralTemp = 'cool' | 'true' | 'warm';
export type RadiusScale = 'sharp' | 'default' | 'rounded';
export type Density = 'compact' | 'default' | 'comfortable';
export type MotionFeel = 'none' | 'subtle' | 'default' | 'expressive';

/** The constrained theme contract — ~10 fields. Replaces the ~91-field ThemeDraft. */
export type Theme = {
	slug: string;
	name: string;
	description: string;
	publisher?: string;
	/** Primary/accent color as hex; the full blue ramp is derived from it. */
	brand: string;
	neutral: NeutralTemp;
	radius: RadiusScale;
	density: Density;
	motion: MotionFeel;
	fontSans: string;
	fontMono: string;
	fontHeader: string;
};

export const DEFAULT_THEME: Theme = {
	slug: 'default',
	name: 'Default',
	description: 'Sivir default — a calm, neutral, Notion-like system.',
	publisher: 'Sivir UI',
	brand: '#4a8cff',
	neutral: 'cool',
	radius: 'default',
	density: 'default',
	motion: 'default',
	fontSans: 'Inter',
	fontMono: 'Geist Mono',
	fontHeader: 'Inter'
};

const RADII: Record<RadiusScale, [string, string, string, string]> = {
	sharp: ['2px', '3px', '4px', '6px'],
	default: ['4px', '6px', '8px', '12px'],
	rounded: ['6px', '10px', '14px', '20px']
};

const DENSITY_UNIT: Record<Density, string> = {
	compact: '3.5px',
	default: '4px',
	comfortable: '4.5px'
};

type MotionSet = {
	hover: string;
	menu: string;
	panel: string;
	sheet: string;
	overlay: string;
	tooltip: string;
	toastIn: string;
	toastOut: string;
	easing: string;
};
const MOTION: Record<MotionFeel, MotionSet> = {
	none: {
		hover: '0ms',
		menu: '0ms',
		panel: '0ms',
		sheet: '0ms',
		overlay: '0ms',
		tooltip: '0ms',
		toastIn: '0ms',
		toastOut: '0ms',
		easing: 'linear'
	},
	subtle: {
		hover: '100ms',
		menu: '80ms',
		panel: '130ms',
		sheet: '160ms',
		overlay: '90ms',
		tooltip: '80ms',
		toastIn: '240ms',
		toastOut: '180ms',
		easing: 'cubic-bezier(0.25,0.1,0.25,1)'
	},
	default: {
		hover: '140ms',
		menu: '120ms',
		panel: '180ms',
		sheet: '220ms',
		overlay: '120ms',
		tooltip: '120ms',
		toastIn: '320ms',
		toastOut: '240ms',
		easing: 'cubic-bezier(0.22,1,0.36,1)'
	},
	expressive: {
		hover: '200ms',
		menu: '160ms',
		panel: '260ms',
		sheet: '300ms',
		overlay: '160ms',
		tooltip: '160ms',
		toastIn: '400ms',
		toastOut: '300ms',
		easing: 'cubic-bezier(0.34,1.2,0.64,1)'
	}
};

/** Neutral tint applied via color-mix over the baked cool ramp. 'cool' is the baked default (no override). */
const NEUTRAL_TINT: Record<NeutralTemp, string | null> = {
	cool: null,
	true: '#808080', // pull toward pure gray
	warm: '#8a5a2b' // pull toward warm
};
const NEUTRAL_STEPS = [0, 25, 50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 900];

function brandRamp(hex: string): string[] {
	return [
		`--sivir-blue-500: ${hex};`,
		`--sivir-blue-600: oklch(from ${hex} calc(l - 0.06) c h);`,
		`--sivir-blue-100: oklch(from ${hex} calc(l + 0.28) calc(c * 0.5) h);`,
		`--sivir-blue-50: oklch(from ${hex} calc(l + 0.36) calc(c * 0.35) h);`,
		`--sivir-blue-ring: oklch(from ${hex} l c h / 0.4);`
	];
}

function neutralOverride(temp: NeutralTemp): string[] {
	const tint = NEUTRAL_TINT[temp];
	if (!tint) return [];
	// Re-tint each step relative to itself; the baked value is read via the var.
	return NEUTRAL_STEPS.map(
		(n) => `--sivir-neutral-${n}: color-mix(in srgb, var(--sivir-neutral-${n}) 94%, ${tint});`
	);
}

function block(selector: string, decls: string[]): string {
	if (decls.length === 0) return '';
	return `${selector} {\n${decls.map((d) => `\t${d}`).join('\n')}\n}\n`;
}

/**
 * Emits override CSS for a custom theme. The baked default lives in ui.css, so
 * an unmodified DEFAULT_THEME still emits a (harmless, identical) override block.
 */
export function themeToCss(theme: Theme): string {
	const [rsm, rmd, rlg, rxl] = RADII[theme.radius];
	const m = MOTION[theme.motion];
	const shared = [
		`--font-sans: ${theme.fontSans};`,
		`--font-mono: ${theme.fontMono};`,
		`--font-header: ${theme.fontHeader};`,
		`--radius-sm: ${rsm};`,
		`--radius-md: ${rmd};`,
		`--radius-lg: ${rlg};`,
		`--radius-xl: ${rxl};`,
		`--sivir-space-unit: ${DENSITY_UNIT[theme.density]};`,
		`--motion-duration-hover: ${m.hover};`,
		`--motion-duration-menu: ${m.menu};`,
		`--motion-duration-panel: ${m.panel};`,
		`--motion-duration-sheet: ${m.sheet};`,
		`--motion-duration-overlay: ${m.overlay};`,
		`--motion-duration-tooltip: ${m.tooltip};`,
		`--motion-duration-toast-in: ${m.toastIn};`,
		`--motion-duration-toast-out: ${m.toastOut};`,
		`--motion-panel-easing: ${m.easing};`,
		`--motion-easing-hover: ${m.easing};`,
		...brandRamp(theme.brand)
	];
	return (
		block(':root,\n.dark', shared) +
		block(':root', neutralOverride(theme.neutral)) +
		block('.dark', neutralOverride(theme.neutral))
	);
}
```

- [ ] **Step 4: Run tests to verify pass**

Run: `cd /home/aidan/silk/apps/docs && bunx vitest run --project unit sivir/theme.test.ts`
Expected: PASS (all cases).

- [ ] **Step 5: Commit**

```bash
cd /home/aidan/silk
git add packages/sivir/src/themes/theme.ts apps/docs/tests/unit/sivir/theme.test.ts
git commit -m "feat(themes): constrained Theme engine (themeToCss v2), additive"
```

---

## Task 6: Reseed the single default theme + serve via v2

Expose the new default as the one built-in, and wire the live custom-theme CSS route to v2. Keep old exports intact (no deletions).

**Files:**

- Modify: `packages/sivir/src/themes/builtin-presets.ts`
- Modify: `apps/docs/src/routes/themes/[name].css/+server.ts`

- [ ] **Step 1: Inspect both files**

Run: `cd /home/aidan/silk && sed -n '1,40p' packages/sivir/src/themes/builtin-presets.ts && echo '---' && cat apps/docs/src/routes/themes/\[name\].css/+server.ts`
Expected: see how built-ins are aggregated and how the route serializes a theme to CSS.

- [ ] **Step 2: Add a v2 export to `builtin-presets.ts` (additive)**

Append (do not remove existing exports):

```ts
import { DEFAULT_THEME, type Theme } from './theme';

/** Plan 1: the single constrained default. The old preset array stays until Plan 3. */
export const defaultTheme: Theme = DEFAULT_THEME;
export const themesV2: Theme[] = [DEFAULT_THEME];
```

- [ ] **Step 3: Write a test pinning the single built-in**

```ts
// apps/docs/tests/unit/sivir/builtin-presets.test.ts  (create)
import { describe, expect, it } from 'vitest';
import { themesV2 } from '@sivir-ui/svelte/themes/builtin-presets';

describe('themesV2', () => {
	it('ships exactly one default theme', () => {
		expect(themesV2).toHaveLength(1);
		expect(themesV2[0].slug).toBe('default');
	});
});
```

- [ ] **Step 4: Run it**

Run: `cd /home/aidan/silk/apps/docs && bunx vitest run --project unit sivir/builtin-presets.test.ts`
Expected: PASS.

- [ ] **Step 5: Point the live CSS route at v2 when given a v2 theme**

In `apps/docs/src/routes/themes/[name].css/+server.ts`, import the v2 `themeToCss` and use it for the default slug. Minimal change — add at the top:

```ts
import { themeToCss as themeToCssV2 } from '@sivir-ui/svelte/themes/theme';
import { defaultTheme } from '@sivir-ui/svelte/themes/builtin-presets';
```

and in the handler, before the existing lookup:

```ts
if (params.name === 'default') {
	return new Response(themeToCssV2(defaultTheme), {
		headers: { 'content-type': 'text/css' }
	});
}
```

(Leave the existing fallback path for old presets untouched — Plan 3 removes it.)

- [ ] **Step 6: Type-check the whole repo**

Run: `cd /home/aidan/silk && bun run check 2>&1 | tail -25`
Expected: green (no TS errors). If the route file’s `@sivir-ui/svelte/themes/theme` import isn’t resolved, confirm the package `exports` map includes `./themes/*`; add it if missing (check `packages/sivir/package.json` — note it currently has no `exports` field, so subpaths resolve via the workspace `src` paths used elsewhere; mirror however `@sivir-ui/svelte/themes/presets` is already imported).

- [ ] **Step 7: Commit**

```bash
cd /home/aidan/silk
git add packages/sivir/src/themes/builtin-presets.ts apps/docs/tests/unit/sivir/builtin-presets.test.ts "apps/docs/src/routes/themes/[name].css/+server.ts"
git commit -m "feat(themes): reseed single default; serve default via v2 engine"
```

---

## Task 7: Reconcile existing engine tests with the new default

> **RESOLUTION (2026-06-20): No code change required.** This task assumed changing the default would break `themes.presets.test.ts`. It does not — Plan 1 left the v1 engine (`presets.ts`) and its default preset **untouched** (additive approach), so all v1 engine tests still pass. Verified: full unit suite = **527 passed, 1 failed**, and the single failure (`input.test.ts > defaults to variant="primary"`) is the user's _uncommitted_ WIP removing the `primary` input variant — confirmed by stashing that WIP (suite then 100% green). That failure is Plan 2 / user territory, not Plan 1's to fix. Task closed as verified.

The old default theme values changed (Linear indigo → soft blue, 16px → 14px, fancy → flat). Tests that assert the _old_ default values must be loosened to assert _structure_, not retired values. Do **not** delete the styles/transitions tests (their code still exists in Plan 1).

**Files:**

- Modify: `apps/docs/tests/unit/sivir/themes.presets.test.ts`

- [ ] **Step 1: Run the full suite to see what breaks**

Run: `cd /home/aidan/silk/apps/docs && bunx vitest run --project unit 2>&1 | tail -40`
Expected: failures only in tests asserting retired default values (e.g. `#5e6ad2`, `16px`, fancy shadow presence). Note each failing assertion.

- [ ] **Step 2: Update each failing assertion**

For every failing case, replace value-specific expectations with structural ones. Example pattern:

```ts
// BEFORE: expect(css).toContain('--color-primary: #5e6ad2');
// AFTER:
expect(css).toMatch(/--color-primary:/);
```

Apply the same transform to body-size and shadow assertions. Where a test exists _only_ to pin a retired value with no structural meaning, mark it skipped with a reason:

```ts
it.skip('pins legacy fancy-button shadow (retired in re-standardization Plan 1)', () => {});
```

- [ ] **Step 3: Re-run the unit project**

Run: `cd /home/aidan/silk/apps/docs && bunx vitest run --project unit 2>&1 | tail -20`
Expected: PASS (0 failures).

- [ ] **Step 4: Commit**

```bash
cd /home/aidan/silk
git add apps/docs/tests/unit/sivir/themes.presets.test.ts
git commit -m "test(themes): reconcile engine tests with new neutral default"
```

---

## Task 8: Visual verification against the references

Confirm the default renders the Notion-like aesthetic in both modes.

**Files:** none (verification only).

- [ ] **Step 1: Run the docs app**

Run: `cd /home/aidan/silk && bun run dev --filter=@sivir/docs` (background) and open the components showcase route.

- [ ] **Step 2: Screenshot light + dark via Playwright MCP**

Use `browser_navigate` to the components gallery, `browser_take_screenshot` in light mode, toggle `.dark`, screenshot again.

- [ ] **Step 3: Compare against the spec's reference description (§3)**

Check, concretely:

- App background is off-white (`#fbfbfa`), cards pure white, hairline borders visible.
- Buttons are flat (no glossy inner highlight, no drop shadow); primary is the soft blue.
- Dark mode: near-black bg, cards have **no shadow**, separation is via borders only.
- Blue appears only on primary button / focus ring / selected states — not on surfaces.
- Body text is 14px Inter.

- [ ] **Step 4: Record findings**

If anything diverges (e.g. a component still shows a fancy shadow because it reads a now-undefined token without a flat fallback), note it as a **Plan 2 component task** — do not patch components here. Append the list to the bottom of this plan under "Plan 2 carry-over".

- [ ] **Step 5: Final green check + commit (docs only if notes added)**

Run: `cd /home/aidan/silk && bun run check && cd apps/docs && bunx vitest run --project unit 2>&1 | tail -5`
Expected: both green.

```bash
cd /home/aidan/silk
git add docs/superpowers/plans/2026-06-19-design-system-restandardization-plan1-tokens.md
git commit -m "docs(plan): record Plan 2 carry-over from visual verification"
```

---

## Self-review (against the spec)

**Spec coverage (Plan 1's slice):**

- §4.1 Tier 1 primitives → Task 2 ✅
- §4.2 Tier 2 semantic (incl. retired-name aliases) → Task 3 ✅
- §4.3 Tier 3 derived component tokens → Task 4 ✅
- §3 borders-first / flat aesthetic as default → Tasks 2–4 (dark elevation override, no fancy tokens) + verified in Task 8 ✅
- §6 constrained ~10-field engine + ~6 controls → Task 5 (`Theme`, `themeToCss` v2) ✅
- Single default theme (decision #5, §11.3) → Task 6 ✅
- Inter / 14px (decisions #7/#8) → Tasks 2 & 5 ✅
- Token-lint harness for Plan 2 enforcement → Task 1 ✅

**Deferred to later plans (intentionally, for build-safety):**

- Aggressive TS cull — delete `themes/styles/`, reduce `themes/transitions/`, remove old `ThemeDraft`/`presets.ts` surface (spec §8) → **Plan 3** (after the Studio stops importing them).
- Component migration to Tier-2/3 + unified variants + literal removal (spec §5, §7) → **Plan 2**.
- Constrained Studio UI + docs pages (spec §6 UI, §9 step 7) → **Plan 3**.

**Placeholder scan:** none — every step has concrete code/commands.

**Type consistency:** `Theme`, `themeToCss`, `DEFAULT_THEME`, `defaultTheme`, `themesV2` are used consistently across Tasks 5–6; CSS token names in Task 4 match the semantic names defined in Task 3.

---

## Plan 2 carry-over

Recorded during Task 8 visual verification (2026-06-20). The Notion-like default renders correctly in light + dark with **no broken components** (flat fallbacks resolve cleanly). Items for Plan 2 (component standardization):

1. **Button still ships the old 10-variant taxonomy** — the showcase shows Primary, Secondary, Outlined, Flat, Ghost, Alternate, Success, Warning, Error, Destructive, and size `default`. Plan 1 deliberately did not touch components. Plan 2 unifies to `primary | secondary | ghost | outline | destructive` (+ status only where semantic), renames `Outlined`→`outline`, size `default`→`md`, and removes `flat`/`alternate` (spec §5).
2. **token-lint baseline: 120 violations** across `packages/sivir/src/components` (captured at `/tmp/token-lint-baseline.txt` during Task 1; regenerate with `bun tools/token-lint/index.ts packages/sivir/src/components`). These hardcoded color/length literals + any Tier-1 leaks are the Plan 2 worklist; enable lint enforcement once cleared.
3. **Verified resolved default tokens** (light): `--color-background #fbfbfa`, `--color-card #ffffff`, `--color-foreground #1c1c19`, `--color-primary #4a8cff`, `--color-border #e2e2df`, `--font-sans Inter`, `--font-size-body 14px`, `--radius-lg 8px`, `--button-primary-shadow` = (unset/flat). Matches spec §3/§4.
4. **Dark mode is borders-first** as intended: cards/panels render flat with 1px borders, no drop shadow; only floating layers carry `--elevation-float`.

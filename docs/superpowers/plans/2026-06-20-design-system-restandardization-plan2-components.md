# Component Standardization — Implementation Plan (Plan 2 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) tracking.

**Goal:** Migrate all 42 components onto the Plan-1 3-tier token system + a single unified variant/size taxonomy, remove hardcoded literals, and turn token-lint into an enforced gate.

**Architecture:** Plan 1 left the token layer (`ui.css` Tier 1/2/3) and the v2 engine in place; components still use the OLD variant taxonomy and contain literals. Plan 2 (a) refines token-lint to remove false positives + add an inline-disable, (b) introduces one canonical variant/size vocabulary in a shared module, (c) migrates components in batches to consume only Tier-2/3 tokens via `tailwind-variants`, (d) enforces the lint. Still additive w.r.t. the theme engine — the Studio cull is Plan 3.

**Tech Stack:** Svelte 5, Tailwind v4, `tailwind-variants`, Vitest, Bun.

**Reference:** spec `docs/superpowers/specs/2026-06-19-design-system-restandardization-design.md` (§5 taxonomy, §7 per-component). Plan 1: `docs/superpowers/plans/2026-06-19-design-system-restandardization-plan1-tokens.md`.

---

## Carried context from Plan 1

- **Test location:** ALL `@sivir-ui/svelte` tests live under `apps/docs/tests/unit/sivir/` and run via `cd apps/docs && bunx vitest run --project unit`. Tests under `packages/sivir/src/**` are NOT collected.
- **Build-safety baseline:** `bun run check` has **3 pre-existing errors** from the user's WIP removing the input `primary` variant. Plan 2 MIGRATES input, which should RESOLVE these (input loses `primary` legitimately, and the tests referencing it get updated). Target by end of Plan 2: **0 check errors**. Intermediate tasks must not exceed 3.
- **Unit suite:** currently 527 pass / 1 fail (the input `primary` default test — user WIP). Each task must keep the suite green except known-in-progress items it is actively fixing.
- **Available Tier-2/3 tokens** (the contract — components consume these, never `--sivir-*` primitives directly): see `packages/sivir/src/ui.css`. Key ones: `--color-{background,card,panel,muted,secondary,border,border-strong,input,foreground,foreground-muted,foreground-opposite,primary,primary-hover,on-primary,accent-tint,ring,success,warning,error,overlay}`, `--radius-{sm,md,lg,xl}`, `--button-*`, `--field-*`, `--menu-*`, `--panel-*`, `--card-*`, `--tooltip-*`, `--elevation-{0,1,float}`, `--sivir-space-*` (spacing scale — allowed for sizing) , `--tabs-indicator-height`, `--progress-height`, `--toast-progress-height`, `--separator-thickness`, `--color-picker-area-height`, etc.

---

## Canonical taxonomy (the contract every component follows)

**Intent variants** (interactive — button, badge, etc.):
`primary | secondary | ghost | outline | destructive`

- Removed: `flat`, `alternate`, and `success`/`warning`/`error` as _button_ variants.

**Status variants** (semantic surfaces — alert, badge(status), toast, callout):
`info | success | warning | error`

**Sizes:** `sm | md | lg` (+ `icon` for icon-only). **`md` is the default everywhere** (replaces button's `default`).

**Attributes:** every interactive component sets `data-ui="<name>"`, `data-variant`, `data-size`, `data-state` where applicable. No `data-style`.

All styled components use `tailwind-variants` (`tv`).

> **User decisions (2026-06-20):** (1) **Full rename now** — apply the canonical names (e.g. `outlined`→`outline`) across ALL usages including the ~80 docs references, in this plan (not deferred). (2) **Editing user WIP is authorized** — subagents MAY modify and commit the user's uncommitted doc/app files as needed to keep the build green and complete the migration. (Stage only files relevant to the task; still avoid `git add -A`.)

---

## Task 0: Refine token-lint (remove false positives, add inline-disable)

The Plan-1 linter over-flags. Fix it so it can be an enforcement gate.

**Files:**

- Modify: `tools/token-lint/index.ts`
- Modify: `tools/token-lint/index.test.ts`

- [ ] **Step 1: Add failing tests for the refined rules**

```ts
// add to tools/token-lint/index.test.ts
it('does NOT flag component-scoped --sivir-<name>- vars (only primitive families)', () => {
    const v = lintSource('a.svelte', 'animation: x var(--sivir-marquee-duration) linear;');
    expect(v).toEqual([]);
});
it('DOES flag real primitive families', () => {
    for (const p of ['--sivir-neutral-200', '--sivir-blue-500', '--sivir-space-4']) {
        expect(
            lintSource('a.svelte', `x: var(${p})`).some((y) => y.rule === 'no-primitive-leak')
        ).toBe(true);
    }
});
it('honors an inline disable directive on the same line', () => {
    const v = lintSource(
        'a.svelte',
        'style="background:#000000" /* token-lint-disable-line no-literal-color */'
    );
    expect(v).toEqual([]);
});
it('honors a disable-next-line directive', () => {
    const v = lintSource(
        'a.svelte',
        '<!-- token-lint-disable-next-line -->\nstyle="background:#000"'
    );
    expect(v).toEqual([]);
});
```

- [ ] **Step 2: Run — expect the new cases to FAIL.** `cd /home/aidan/silk/apps/docs && bunx vitest run ../../tools/token-lint/index.test.ts`

- [ ] **Step 3: Implement the refinements in `index.ts`:**
    - Narrow `no-primitive-leak` regex to real primitive families only:
      `re: /var\(\s*--sivir-(?:neutral|blue|space|success|warning|error)\b/`
    - In `lintSource`, support directives:
        - If a line contains `token-lint-disable-line` optionally followed by rule name(s), skip those rules (or all) on that line.
        - If the PREVIOUS line contains `token-lint-disable-next-line` (optionally with rule names), skip those rules on the current line.
    - Keep `no-literal-color` and `no-literal-length` regexes as-is.

```ts
// reference implementation of the directive logic inside lintSource:
export function lintSource(file: string, source: string): Violation[] {
    const out: Violation[] = [];
    const lines = source.split('\n');
    const disabledFor = (line: string, prev: string, rule: string) => {
        const onLine = line.includes('token-lint-disable-line');
        const onPrev = prev.includes('token-lint-disable-next-line');
        const ruleNamed = (s: string) =>
            s.includes('token-lint-disable') &&
            (new RegExp(`token-lint-disable[a-z-]*\\s+[^\\n]*\\b${rule}\\b`).test(s) ||
                !/token-lint-disable[a-z-]*\s+\S/.test(s));
        return (onLine && ruleNamed(line)) || (onPrev && ruleNamed(prev));
    };
    lines.forEach((text, i) => {
        const prev = i > 0 ? lines[i - 1] : '';
        for (const { rule, re } of RULES) {
            if (re.test(text) && !disabledFor(text, prev, rule))
                out.push({ file, line: i + 1, rule, text: text.trim() });
        }
    });
    return out;
}
```

- [ ] **Step 4: Run all token-lint tests — expect PASS.** Then re-baseline: `cd /home/aidan/silk && bun tools/token-lint/index.ts packages/sivir/src/components | tail -1`. Record the new (lower) count in the commit message.

- [ ] **Step 5: Commit** — `git add tools/token-lint && git commit -m "feat(token-lint): scope primitive-leak rule + inline-disable directives"`

---

## Task 1: Shared variant foundation + migrate Button

**Files:**

- Create: `packages/sivir/src/internals/variants.ts` (shared taxonomy constants)
- Modify: `packages/sivir/src/components/button/variants.ts`, `button.svelte`, `button/manifest.ts`
- Test: `apps/docs/tests/unit/sivir/button.test.ts` (update for new taxonomy)

- [ ] **Step 1** Create the shared taxonomy module exporting const arrays + types:

```ts
// packages/sivir/src/internals/variants.ts
export const INTENTS = ['primary', 'secondary', 'ghost', 'outline', 'destructive'] as const;
export type Intent = (typeof INTENTS)[number];
export const STATUSES = ['info', 'success', 'warning', 'error'] as const;
export type Status = (typeof STATUSES)[number];
export const SIZES = ['sm', 'md', 'lg'] as const;
export type Size = (typeof SIZES)[number];
```

- [ ] **Step 2** Update the failing tests in `button.test.ts`: default variant `primary`, default size `md` (not `default`); variants are exactly the 5 intents (+ `icon` size); assert no `flat`/`alternate`/`success` button variants remain.
- [ ] **Step 3** Rewrite `button/variants.ts`: keep `tv`, base WITHOUT the fancy `before:` highlight / `--ui-button-shadow` / `--button-*-shadow` / haptic transform (all removed in Plan 1 tokens). Variants `primary|secondary|ghost|outline|destructive` consuming `--button-{intent}-*` Tier-3 tokens. Sizes `sm|md|lg|icon`, default `md` (height `var(--size-control-md)`), no `text-[13px]` literals (use `text-[length:var(--font-size-button)]` or a token). Set `data-variant`/`data-size` in `button.svelte`. Update `manifest.ts` variant/size lists.
- [ ] **Step 4** Run `bunx vitest run --project unit sivir/button.test.ts` → green. Run token-lint on the button dir → 0 (or only explicitly-disabled). Run `bun run check` → ≤3.
- [ ] **Step 5** Commit `feat(button): unified variant taxonomy on 3-tier tokens`.

---

## Task 2: Badge

- Migrate `badge/variants.ts` to its OWN derived `--badge-*` tokens (add them to ui.css Tier 3 if missing: `--badge-bg/fg/border` per intent — derive from `--color-*`), intents `primary|secondary|ghost|outline|destructive`, plus a separate `status` prop (`info|success|warning|error`) for status badges. Remove `alternate`. Sizes `sm|md`. Update manifest + `badge.test.ts` if present. Gate: lint 0 on badge dir, tests green, check ≤3. Commit `feat(badge): unified taxonomy + derived --badge-* tokens`.

---

## Task 3: Input + Textarea (resolves the check baseline)

- `input/variants.ts`: canonical field variants `outline` (default) and `ghost`; remove the stale `primary`/`secondary` mismatch. Consume `--field-*` Tier-3 tokens only. Sizes `sm|md|lg` via `--field-height`/control sizes.
- `textarea`: reuse the input field recipe; same variants; tokenize `min-height` via `--textarea-min-height` (exists). Remove the non-existent `primary` claim.
- Update `input.test.ts` and `themes.presets.test.ts:382` (the `input({variant:'primary'})` line) to the new variants — **this clears all 3 baseline check errors**.
- Gate: `bun run check` → **0 errors**; unit suite fully green; lint 0 on input/textarea dirs. Commit `feat(input,textarea): canonical field variants; clears type baseline`.

---

## Task 4: Form controls — checkbox, radio-group, switch, toggle, toggle-group, slider, label

Per component: convert to `tv` where it has variants; replace inline `sizes` Record (toggle) and hardcoded px with `--sivir-space-*` / control tokens; checkbox `variant` ternary → `tv`; switch reads `--switch-*`/`--size-switch-*`; slider already mostly tokenized (wire any literals); label reads `--font-*-label`. Gate per component: lint 0 (or disabled), tests green, check 0. One commit per 2-3 components: `feat(<components>): tokenize + tv migration`.

---

## Task 5: Overlays & menus — popover, dropdown-menu, context-menu, select, combobox, command, tooltip, hover-card

Unify on `--panel-*` (padding/shadow `--elevation-float`), `--color-panel`, `--radius-lg`, and the `--menu-item-*` recipe; wire the previously-unused `--floating-menu-item-*` tokens or drop them; remove literal paddings. These are mostly structural (no intent variants). Gate per component. Commit in 2-3 logical groups.

---

## Task 6: Dialogs — modal, alert-dialog, sheet

Unify padding tokens (`--modal-*`, `--sheet-*`), use `--elevation-float`, `--color-overlay`/`--color-overlay-bg`. Remove literals. Gate. Commit `feat(dialogs): tokenize modal/alert-dialog/sheet`.

---

## Task 7: Content & display — card, alert, avatar, separator, skeleton, progress, tabs, accordion, collapsible, breadcrumb, pagination, scroll-area, marquee, shortcut, toast

Per the audit's specific fixes:

- card → `--elevation-0/1`, `--card-padding`, `--radius-lg`.
- alert → status variants from `--color-{success,warning,error,primary}` + own `--alert-*` (add to ui.css if needed); stop borrowing `--button-*`.
- avatar → `tv` sizes from `--sivir-space-*` (remove inline Record + `size-7/9/12/16` literals).
- separator → `--separator-thickness` + `--separator-color` (wire the unused token).
- skeleton → `--skeleton-base/-highlight` (wire; remove inline gradient literal or disable-line it).
- progress → `--progress-height` (replace `h-2`).
- tabs → `--tabs-indicator-height` (replace `h-[2px]`); pill triggers per reference.
- toast → `--toast-progress-height` (replace `h-[2px]`), `--elevation-float`.
- pagination → reuse `icon` button size (replace `size-8`).
- marquee → its `--sivir-marquee-*` vars are fine post-Task-0 (no longer flagged).
- accordion/collapsible/breadcrumb/scroll-area/shortcut → wire remaining literals to tokens.
  Gate per sub-group (lint 0/disabled, tests green, check 0). Commit in 3-4 groups.

---

## Task 8: Special literal-heavy — color-picker, calendar

- color-picker: the hex/gradient literals (`#000`, `#fff`, hue gradient stops, the SB area math) are INHERENT — mark each with `// token-lint-disable-line no-literal-color` (or `-next-line`) with a brief justification; tokenize the genuinely-themeable bits (`h-[148px]` → `--color-picker-area-height`, text sizes → tokens, the focus ring shadow → `--color-ring`).
- calendar: tokenize paddings/gaps via `--calendar-*`; disable-line any unavoidable grid math.
  Gate: lint 0 NON-disabled on both dirs; tests green; check 0. Commit `feat(color-picker,calendar): tokenize themeable parts; annotate inherent literals`.

---

## Task 9: Enforce token-lint + final verification

- [ ] Add an enforcement entry: a `test` that fails on any non-disabled violation, placed at `apps/docs/tests/unit/sivir/token-lint.enforce.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { resolve } from 'node:path';
import { lintTree } from '../../../../../tools/token-lint/index';
describe('token-lint enforcement', () => {
    it('components contain no un-disabled literal/primitive violations', () => {
        const v = lintTree(resolve(process.cwd(), '../../packages/sivir/src/components'));
        expect(v, JSON.stringify(v, null, 2)).toHaveLength(0);
    });
});
```

- [ ] Run full unit suite → green. `bun run check` → 0 errors. `bun run build --filter=@sivir/docs` → succeeds.
- [ ] Visual re-verification (Playwright, as in Plan 1 Task 8): screenshot button/card/input/select/modal/tabs in light+dark; confirm unified flat Notion look, no regressions. Record findings.
- [ ] Commit `test(token-lint): enforce zero violations across components`.

---

## Self-review checklist (run after writing/at end)

- Every spec §7 component row has a task. ✅ (Tasks 1–8 cover all 42.)
- Taxonomy applied uniformly (intents/sizes).
- token-lint refined BEFORE enforcement (Task 0) so the gate is meaningful.
- Baseline check errors resolved by Task 3 (input migration).
- No deletion of theme-engine TS (that's Plan 3).

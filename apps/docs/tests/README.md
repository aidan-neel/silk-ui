# Docs tests

Vitest is configured with three projects in [`../vitest.config.ts`](../vitest.config.ts):

| Project   | Files                             | Environment           | Runs in CI                   |
| --------- | --------------------------------- | --------------------- | ---------------------------- |
| `unit`    | `tests/unit/**/*.test.ts`         | jsdom                 | ✅ `CI` workflow (`test:ci`) |
| `ssr`     | `tests/unit/**/*.ssr.test.ts`     | node                  | ✅ `CI` workflow (`test:ci`) |
| `browser` | `tests/unit/**/*.browser.test.ts` | Chromium (Playwright) | ✅ `Browser Tests` workflow  |

## Running locally

```bash
bun --filter='docs' run test:ci       # unit + ssr (fast, no browser)
bun --filter='docs' run test:browser  # browser project (Chromium)
bun --filter='docs' run test          # everything
```

The browser project needs Playwright's Chromium. Install it once:

```bash
bunx playwright install --with-deps chromium
```

> Note: the Chromium download can fail behind restrictive proxies/sandboxes. CI
> installs it on a clean `ubuntu-latest` runner, so the browser suite is most
> reliably exercised there.

## Browser tests in CI

The [`Browser Tests`](../../../.github/workflows/browser-tests.yml) workflow runs
the `browser` project on every pull request to `main` and on pushes to `main`
(previously it was opt-in behind a label, so it almost always reported
`skipped`). It installs Chromium and runs `bun --filter='docs' run test:browser`.

These tests cover behavior that only a real browser can validate: floating
positioning, focus trapping across portalled content, click-outside through
document-level listeners, and real keyboard/pointer event propagation.

## Screenshots

Vitest's browser mode writes a PNG into `__screenshots__/` when a test **fails**,
to aid debugging. These are failure artifacts, not assertion baselines. No test
currently compares against them.

### Adding pixel-diff visual regression

To assert that a component or page renders pixel-for-pixel as expected, use
Vitest's screenshot matcher inside a `*.browser.test.ts`:

```ts
await expect.element(page.getByTestId('hero')).toMatchScreenshot('hero');
```

Generate/refresh the reference images on the **same platform CI uses** (Chromium
on Linux) so they stay stable, then commit them:

```bash
bun --filter='docs' run test:browser -- --update
```

Because font hinting and antialiasing differ per platform, baselines captured on
one OS will drift on another. Prefer regenerating them via the `Browser Tests`
workflow (or a Linux container) and committing the result.

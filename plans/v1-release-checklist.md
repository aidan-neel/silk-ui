# Sivir UI v1 Release Checklist

Final go/no-go evidence. Detail lives in [phase plans](v1-implementation.md).

## Scope And Identity

- [x] [v1 scope](v1-scope.md) approved (38 components; Studio + registry out)
- [x] Theme Studio absent from public getting-started docs and sitemap
- [x] Public changelog page removed from v1 nav/sitemap
- [x] Canonical domain decision: `sivir.dev`
- [ ] Live DNS/TLS for `sivir.dev` verified in production
- [ ] Package/site/CLI/release notes all say `1.0.0` (at RC freeze)
- [x] Public component count is 38 everywhere (package, CLI, docs catalog)
- [ ] Maintainer `sivir-skill` verified

## Component Library

- [x] Every advertised component exported (public-api contract tests)
- [x] CLI manifests / isolated install graphs complete
- [x] Component reference pages exist for the catalog
- [x] Escape, outside-click, focus restore, submenu cone covered in browser tests
- [x] SSR checks pass
- [x] No skipped release-critical browser interactions
- [x] Command fuzzy search fixed (word-token fuzzy ranking)

## Package And CLI

- [x] Package metadata, license, exports, files correct
- [x] Package-import path: `verify:artifact`
- [x] CLI path: sandbox + `verify:cli-artifact`
- [x] Documented invocation: `bunx --package @sivir-ui/svelte sivir ...`
- [x] Built-in `sivir add theme <slug>` works offline
- [x] CI/publish run artifact + cli-artifact gates

## Documentation

- [x] Introduction + Installation document package and CLI paths
- [x] Theming documents tokens + built-in presets (no Studio/registry product)
- [ ] Styling merged into Theming (or Styling removed) if still duplicated
- [ ] Components linked from Getting Started sidebar (not only top nav)
- [x] Sitemap has no Studio; themes gallery not a public v1 entry
- [ ] Release notes / known limitations drafted for GitHub release

## Automated Gates (run on RC SHA)

- [ ] `bun install --frozen-lockfile`
- [ ] `bun audit`
- [ ] `bun run format:check`
- [ ] `bun run lint`
- [ ] `bun run check`
- [ ] `bun --filter='docs' run test:ci`
- [ ] `bun --filter='registry' run test` (in-tree service tests; not a v1 product)
- [ ] `bun --filter='@sivir-ui/svelte' run test`
- [ ] `bun --filter='docs' run test:browser`
- [ ] `bun run build`
- [ ] `DOCS_ADAPTER=node bun --filter='docs' run build`
- [ ] `bun --filter='@sivir-ui/svelte' run sandbox`
- [ ] `bun --filter='@sivir-ui/svelte' run verify:artifact`
- [ ] `bun --filter='@sivir-ui/svelte' run verify:cli-artifact`
- [ ] `bun --cwd apps/installer-lab test`

## Production Readiness

- [ ] Docs deploy without requiring `THEME_REGISTRY_URL`
- [ ] No critical/high reachable dependency advisories
- [ ] DNS, redirects, canonical metadata, 404 verified on `sivir.dev`
- [ ] Rollback owner + commands recorded

## Publish

- [ ] Version `1.0.0`, tag `v1.0.0`
- [ ] Release commit == validated candidate
- [ ] GitHub release notes (scope, install, limitations: no Studio/registry)
- [ ] Publish workflow green + npm provenance
- [ ] `npm view @sivir-ui/svelte@1.0.0` and `dist-tags.latest` == `1.0.0`
- [ ] Clean consumer installs from npm (package + CLI)
- [ ] Production docs from release commit

## Post-release

- [ ] Production smoke: package, CLI, docs
- [ ] Logs reviewed
- [ ] Regressions owned; patch via `1.0.1` never overwrite `1.0.0`
- [ ] Theme Studio + registry tracked as post-v1 milestones

## Go / no-go

Ship only with zero open P0/P1, green gates on the release commit, and rollback
ready. Exceptions need a written maintainer decision before the tag.

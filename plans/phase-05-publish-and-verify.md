# Phase 5: Publish And Verify v1

## Status

**TODO** — after Phase 4 go decision.

## Objective

Publish `@sivir-ui/svelte@1.0.0` with provenance, deploy docs from the same commit to
`sivir.dev`, smoke-test real user paths.

## Entry criteria

- Phase 4 written go for a specific SHA
- Checklist pre-publish clear
- npm (`NPM_TOKEN`), GitHub, DNS, docs deploy access ready
- Rollback owner available
- **No registry deploy required for v1**

## Work

### 1. Confirm release commit

- `packages/sivir/package.json` version `1.0.0`
- Release notes list scope + limitations (no Theme Studio, no theme registry
  product, built-in CLI themes only)
- Commit matches Phase 4 candidate

### 2. Publish

- Tag `v1.0.0`
- GitHub Release
- Let `publish.yml` verify + `npm publish` the exact `.release/*.tgz` with
  provenance
- Do not hand-publish around a red workflow

### 3. Verify npm

```sh
npm view @sivir-ui/svelte@1.0.0 version
npm view @sivir-ui/svelte dist-tags.latest
bunx --package @sivir-ui/svelte@1.0.0 sivir --help
```

Clean apps:

- Package: `bun add @sivir-ui/svelte` → import `ui.css` + components → check/build
- CLI: `bunx --package @sivir-ui/svelte sivir init -y` → `add button` → check/build

### 4. Deploy docs

- Deploy release commit to `sivir.dev`
- Confirm docs work **without** registry env
- No Studio links; sitemap clean
- DNS/TLS/404 OK

### 5. Close out

- Watch deploy/publish logs
- Production smoke after cache settle
- Patch via `1.0.1` only; never mutate `1.0.0`
- File post-v1 milestones: Theme Studio, theme registry product

## Exit criteria

- [ ] `@sivir-ui/svelte@1.0.0` on npm with provenance; `latest` points at it
- [ ] Package + CLI work from public npm
- [ ] Docs live on `sivir.dev` from release commit
- [ ] No Studio / no registry product dependency
- [ ] Checklist archived with evidence links
- [ ] Regressions owned

## Rollback

- Docs: previous deployment
- npm: deprecate bad version + publish patch (never overwrite)
- Keep failing consumer fixture + integrity hashes for diagnosis

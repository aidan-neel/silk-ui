# Phase 4: Validate The Release Candidate

## Status

**TODO** — start after Phase 3 open polish + Command search are closed or
accepted.

## Objective

One immutable commit SHA + one retained tarball pass every automated gate and
manual QA. No moving branch.

## Entry criteria

- [x] Phases 1–2 complete
- [x] Phase 3 core complete
- [ ] Phase 3 nav/docs polish done (styling merge, Components in sidebar)
- [x] Command palette search fixed (word-token fuzzy ranking)
- [ ] Package version set to `1.0.0` on the candidate commit only
- [ ] GitHub release notes drafted (limitations: no Studio, no registry product)
- [ ] Maintainer verified `sivir-skill` (docs quality gate)
- [ ] Working tree clean aside from intentional RC metadata

## Work

### 1. Freeze candidate

- Record SHA.
- No feature merges after freeze; any fix → new candidate.

### 2. Full automated gauntlet

```sh
bun install --frozen-lockfile
bun audit
bun run format:check
bun run lint
bun run check
bun --filter='docs' run test:ci
bun --filter='registry' run test   # in-tree only; not a v1 public service
bun --filter='@sivir-ui/svelte' run test
bun --filter='docs' run test:browser
bun run build
DOCS_ADAPTER=node bun --filter='docs' run build
bun --filter='@sivir-ui/svelte' run sandbox
bun --filter='@sivir-ui/svelte' run verify:artifact
bun --filter='@sivir-ui/svelte' run verify:cli-artifact
bun --cwd apps/installer-lab test
```

### 3. Artifact inspection

- Single `.release/*.tgz`; version `1.0.0`
- Allowlist contents; no secrets/Studio-only shipping requirements
- Package-import + CLI-copy both from **that** tarball

### 4. Manual QA

- Homepage, Introduction, Installation, Theming, Components index
- Representative components (overlay, menu cone, form controls)
- Keyboard, mobile width, reduced motion
- Confirm no Studio / no public registry gallery links
- Docs usable **without** `THEME_REGISTRY_URL`

### 5. `sivir-skill` gate

- Maintainer-owned; spot-check one getting-started + one component page

### 6. Go / no-go

- Fill [v1-release-checklist.md](v1-release-checklist.md) pre-publish sections
- Written approval of SHA + rollback owner

## Exit criteria

- [ ] Candidate SHA + tarball recorded
- [ ] All automated gates green
- [ ] Both install models verified on exact tarball
- [ ] Manual QA pass
- [ ] `sivir-skill` verified
- [ ] Checklist clear of P0/P1
- [ ] Written go decision

## Reset

Any shipped code/docs/config change after freeze → new candidate.

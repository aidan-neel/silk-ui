# Sivir UI v1 Implementation

Execution index for [v1-scope.md](v1-scope.md).

## Status (2026-07-19)

| Phase | Plan                                                   | Status                         |
| ----- | ------------------------------------------------------ | ------------------------------ |
| 1     | [Release contract](phase-01-release-contract.md)       | **DONE**                       |
| 2     | [Library and CLI](phase-02-library-and-cli.md)         | **DONE**                       |
| 3     | [Docs and deployment](phase-03-docs-and-deployment.md) | **DONE** (see open follow-ups) |
| 4     | [Release candidate](phase-04-release-candidate.md)     | **TODO**                       |
| 5     | [Publish and verify](phase-05-publish-and-verify.md)   | **TODO**                       |

## Phase outcomes

| Phase | Outcome                                                                          |
| ----- | -------------------------------------------------------------------------------- |
| 1     | Identity fixed; Studio/changelog out of public surface; catalog frozen at 38     |
| 2     | Public API locked; overlay/submenu blockers closed; package + CLI artifact gates |
| 3     | Getting-started docs rewritten; registry not required for v1 docs                |
| 4     | One immutable SHA + tarball passes full gates + manual QA                        |
| 5     | `@sivir-ui/svelte@1.0.0` on npm; docs live on `sivir.dev`                        |

## Open before Phase 4 freeze

Track and close (or explicitly accept) before tagging:

1. **Docs nav polish (Phase 3 follow-up)** — merge Styling into Theming if still
   separate; put Components under Getting Started sidebar; drop Components from
   top nav; more spacing between install steps.
2. **Command fuzzy search** — navbar/docs Command search still feels wrong;
   fix or accept with issue before RC.
3. **`sivir-skill`** — maintainer creates and verifies docs skill (Phase 4 gate).
4. **Version bump** — set package to `1.0.0` only on the RC commit.

## Execution rules

- No new v1 scope mid-phase; post-v1 ideas stay out of these plans.
- Registry and Theme Studio must not re-enter public v1 docs or nav.
- Phase 4 validates one clean SHA, not a moving branch.
- Both install models need fresh-consumer evidence (`verify:artifact` +
  `verify:cli-artifact`).
- Do not tag while domain, version, or release notes disagree.

## Blocker policy

- **P0** — install broken, crash, security, wrong publish artifact
- **P1** — documented behavior broken, a11y regression, deploy failure
- **P2** — workaround exists; needs owner if deferred
- **P3** — polish; does not block

## Completion

All five phases done and [v1-release-checklist.md](v1-release-checklist.md) has
no open P0/P1.

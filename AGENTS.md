# Verification

Before reporting a change complete, and before every push or release, run the
same repository-level gates CI runs for the affected change. For package or
workspace dependency changes, this means running from the repository root:

```sh
bun run check
bun run test
bun run build
```

Do not substitute package-local checks for these commands. A workspace package
can pass in isolation while dependent applications fail to resolve its built
artifact. For a published Sivir package, also run:

```sh
bun --cwd=packages/sivir run verify:artifact
bun --cwd=packages/sivir run verify:cli-artifact
```

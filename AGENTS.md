# Verification

Before reporting a change complete, run only the lightweight repository-level
gates from the repository root:

```sh
bun run format:check
bun run lint
```

Do not run formatting in write mode unless formatting files is part of the
task. Tests, type checks, builds, and package artifact verification are manual
verification only. Run them only when the user explicitly requests them,
including before a push or release:

```sh
bun run check
bun run test
bun run build
bun --cwd=packages/sivir run verify:artifact
bun --cwd=packages/sivir run verify:cli-artifact
```

When manual verification has not been requested, state that the full gates were
not run instead of running them automatically.

# Development Servers

Never stop, terminate, or send signals (including `SIGABRT`) to a development
server started by the user. If the user is already running a development server,
use that server for local verification instead of starting another one.

# Styling

Use Tailwind CSS exclusively for styling. Never write raw CSS unless it is
absolutely required for the implementation.

# Component Architecture

Before creating or changing a component's exported names, confirm the proposed
public API with the user. This includes component names, exported prop types,
variants, subcomponents, hooks, and utility exports. Do not add or change an
exported component API without that confirmation.

Components must meet a high quality bar:

- Define precise prop types that model the supported API, required and optional
  values, event-handler signatures, ref types, and mutually exclusive states.
  Do not use `any`, overly broad index signatures, or untyped rest props.
- Keep implementation details private. Export only names that form an
  intentional, minimal, composable public API.
- Do not write inline comments in component code. Add a concise docstring only
  when a non-obvious public contract or constraint cannot be expressed through
  naming and types.
- Use semantic HTML, preserve native element behavior, and forward props and
  refs only when the approved API requires them.
- Favor clear, focused components with explicit state and predictable behavior
  over clever abstractions or convenience exports.

# Changelog

After every completed task, add or update a release-note entry in
`changelog/<next-release-version>/<change-type>.md`. The version must be the
next release to ship; for example, when `0.2.0` is current and the next release
is `0.2.1`, write to `changelog/0.2.1/feature.md` for a feature. Use a
change-type filename that accurately describes the work, such as `fix.md`,
`feature.md`, `breaking.md`, or `docs.md`.

These entries are the source material for the website's
`/changelog/<package-version>` route, which compiles that release's files into
a single LLM-consumable update. Keep each entry concise, factual, and focused
on externally relevant behavior, integration requirements, and breaking
changes.

# Formatting

Formatting is part of the code quality bar, not a cleanup task to defer. All
supported source, configuration, and documentation files must be formatted with
the repository's Biome configuration before review. Run `bun run format` while
editing and `bun run format:check` before considering formatting work complete.
Do not hand-format around Biome or disable it for individual files.

Write code for people to scan, review, debug, and safely modify. Compact code
is not concise when it hides structure. The following rules are mandatory:

- Put every `import` and `export` declaration on its own logical line. Use
  multi-line import or export specifiers when Biome wraps them.
- Write object, type, interface, tuple, and function parameter definitions
  across multiple lines when they contain several properties, parameters, or
  nested values. Keep one concern per line and use a trailing comma where
  Biome adds one.
- Use one statement per line. Never combine declarations, assignments,
  conditions, loops, or side effects with semicolons on a single line.
- Give every function, method, constructor, callback with non-trivial work, and
  control-flow branch a block body with its contents on separate lines. Do not
  write one-line functions or methods, including seemingly small async methods
  and constructors.
- Put `if`, `else`, `try`, `catch`, `finally`, loops, and `switch` bodies on
  their own indented lines. Always use braces for control flow, even when the
  body has one statement.
- Break long calls into a vertical structure: one argument or meaningful
  options property per line. Extract an intermediate variable when a chained
  expression, callback, or condition remains difficult to read after
  formatting.
- Group related declarations and methods together. Separate imports, types,
  constants, constructors, public methods, private helpers, and unrelated
  logical sections with a blank line. Do not insert blank lines inside a small,
  cohesive sequence of statements.
- Indent nested blocks consistently. Align closing delimiters with the line
  that opened their block; do not manually misalign wrapped expressions.
- Prefer descriptive intermediate names over deeply nested expressions. A
  small amount of vertical space is preferable to duplicated requests, nested
  ternaries, or dense `map`/`filter`/`reduce` chains.
- Preserve intentional surrounding organization, but reformat all touched code
  to these standards. Do not leave compressed code adjacent to expanded code.

The following style is prohibited, even if a formatter could technically keep
it on one line:

```ts
async account() { const user = await this.octokit.request("GET /user"); return { login: user.data.login, type: user.data.type }; }
```

Write it with readable vertical structure instead:

```ts
async account() {
  const user = await this.octokit.request("GET /user");

  return {
    login: user.data.login,
    type: user.data.type,
  };
}
```

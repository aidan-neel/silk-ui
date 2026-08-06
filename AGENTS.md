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

# Formatting

Formatting is part of the code quality bar, not a cleanup task to defer. All
supported source, configuration, and documentation files must be formatted with
the repository's Biome configuration before review. Run `bun run format`
while editing and `bun run format:check` before considering formatting work
complete. Do not hand-format around Biome or disable it for individual
files.

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

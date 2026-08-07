- Preserve user-run development servers and use them for local verification.
- Remove decorative border rails and dividers from the home page.
- Simplify the full-width docs app into inset surfaces with GitHub stars and theme controls.
- Replace docs navigation with an in-frame breadcrumb bar and GitHub and theme controls.
- Place the component navigation sidebar outside the inset docs surface.
- Use the same background color for the canvas and inset home and docs surfaces.
- Keep the docs frame fixed while documentation content scrolls inside it.
- Keep the Sivir UI logo in the scrolling docs sidebar.
- Widen the documentation reading column by 2rem.
- Show only the GitHub mark and star count in the docs toolbar.
- Increase the docs breadcrumb label weight for clearer hierarchy.
- Require Tailwind CSS for styling unless raw CSS is absolutely necessary.
- Require confirmation of component public APIs and enforce strict component
  typing and documentation standards.
- Limit automatic verification to formatting and linting; reserve type checks,
  tests, builds, and package artifact verification for explicit requests.
- Change the default Sivir and generated-app font from DM Sans to Inter.
- Migrate repository linting, formatting, editor tooling, and Git hooks from
  Prettier and ESLint to Biome.
- Add an interactive Spinner completion-state example to the component docs.
- Add bottom padding to every documentation page for more comfortable reading.
- Hide the scrollbar on the documentation sidebar without disabling scrolling.
- Replace mobile documentation breadcrumbs with a Fullscreen Nav menu.
- Keep repository source, scripts, styles, and tests clean under Biome's recommended rules.
- Update the default ScrollArea example to demonstrate its standalone clipping behavior.
- Add interactive native validation examples to the Input documentation.
- Match the Input validation example's error ring and motion to PromptComposer.
- Place Input validation errors immediately below their fields.
- Refine Input validation error emphasis and motion.
- Preserve the documentation redesign while adopting the latest component microinteraction refinements.

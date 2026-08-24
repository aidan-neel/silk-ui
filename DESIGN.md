# Sivir Design Guidelines

Use these principles when creating or substantially changing Sivir interfaces,
documentation, examples, and brand surfaces. The goal is clear, intentional
design that feels calm without becoming generic or sterile.

Preserve the product requirements, host framework, existing component APIs,
semantic tokens, and established Sivir patterns. Use Sivir components where
they fit and Tailwind CSS for styling. Do not introduce a parallel visual
system to solve a local design problem.

## Start With the User's Job

Before designing, establish:

- Who is using the interface and what are they trying to do?
- What must they understand, compare, enter, or decide?
- What content or state is most important to that task?
- What constraint, caveat, or error could change the outcome?

Order the experience by user need rather than source order. Give each section
one purpose, combine repeated ideas, and omit unsupported or decorative
content. The primary path should be understandable from the title, headings,
key values, controls, and captions alone.

## Choose the Composition

Choose geometry before components. For substantial work, consider at least two
materially different layouts and select the one that makes the user's task
clearest with the least mediation.

- Reject the obvious category template unless the content earns it. A settings
  page does not automatically need a sidebar, and a landing page does not
  automatically need a centered hero followed by cards.
- Make the first viewport communicate the purpose and the dominant action,
  relationship, or evidence. It should not be only atmosphere or setup.
- Establish one dominant object in each major section. Supporting content
  should be quieter and visibly connected to it.
- Compose the page as a field, not a stack of interchangeable components.
  Vary density and scale while preserving a shared grid and alignment logic.
- Map information to suitable geometry: magnitude to length or position,
  change to sequence, composition to proportion, process to connection, and
  alternatives to aligned rows or columns.
- Use prose for one conclusion, tables for exact lookup, and charts only when a
  relationship becomes faster to understand visually.
- Give true peers equal structure. Do not force unequal content into equal
  cards or give equivalent values different visual weight.
- Use open space to amplify the focal object. Reflow underfilled splits,
  orphaned items, and accidental empty rectangles.

If the layout still feels safe or vague, strengthen one relationship through
proportion, hierarchy, density, alignment, or placement before adding effects.

## Typography and Rhythm

Use the project's configured sans typeface for interface text and headings.
Reserve the mono typeface for code, commands, paths, timestamps, and short
technical identifiers. Use existing type and weight tokens rather than
inventing isolated values.

- Create hierarchy with type before adding surfaces, borders, or color.
- Use one page title, clear section headings, readable body text, compact
  labels, and subdued metadata. Equivalent elements share the same role,
  size, weight, line height, and numeric treatment.
- Write direct, sentence-case headings that describe the content or action.
  Avoid generic praise, ceremonial labels, and decorative section numbers.
- Keep long-form text near 60 to 68 characters per line. Rewrite or reflow
  before shrinking text.
- Align related text to shared edges and baselines. Adjacent columns need
  unmistakable gutters so wrapped lines cannot be read across columns.
- Use tabular numerals for values that readers compare vertically.

Build spacing from relationships rather than applying one universal gap:

- Keep a heading close to its first paragraph.
- Keep a label, value, and supporting detail together.
- Use a body rhythm between related paragraphs, controls, or list items.
- Use a clearly larger interval between distinct sections or tasks.
- Keep captions, validation, and sources close to what they qualify.

Every visible gap should have one owner. Prefer a parent stack or grid over
competing child margins. Fix awkward grouping or layout before adding a
one-off spacing value.

## Practice Restraint

Use existing semantic color tokens and preserve their meaning in every theme.
Color should communicate state, action, or data, not compensate for weak
hierarchy. Pair color-coded states with text, shape, or another non-color cue.

The interface should normally feel like one continuous canvas. Add a surface,
border, radius, or shadow only when it communicates grouping, interaction,
selection, or state more clearly than spacing can. Default to stillness; add
motion only to explain a state change, preserve continuity, or confirm an
action.

## Reject Generated-Design Reflexes

Do not ship:

- All-caps or widely tracked eyebrows, kickers, and overlines.
- Decorative gradients, glows, blobs, textures, glass effects, or ornamental
  shadows.
- A generic centered hero followed by a grid of cards.
- A card, border, or rounded container around every section or metric.
- Pills for ordinary metadata, labels, or status that does not need a badge.
- Decorative icon tiles, oversized icons, or mixed icon styles.
- Tiny muted copy, arbitrary type sizes, inconsistent peer values, or weak
  contrast used to force content into a layout.
- Decorative charts, redundant visualizations, misleading scales, or color
  without meaning.
- Repeated section silhouettes when each section answers a different question.
- Stock imagery, fake screenshots, or abstract decoration added to fill space.
- Scroll reveals, parallax, pulsing indicators, bounce, or other motion that
  delays or distracts from the task.

Avoiding these defaults is not permission to produce a blank template.
Distinctiveness should come from a committed composition, precise typography,
strong alignment, and a relationship specific to the content.

## Responsive and Accessible by Default

Use semantic HTML, logical heading order, native controls, visible focus,
accessible names, sufficient contrast, and reading order that matches source
order. Never rely on color alone.

Design responsive behavior as recomposition, not uniform shrinking. Reflow
grids, stack comparisons, preserve readable type and control sizes, and allow
dense tables to scroll locally only when simplification or reordering cannot
preserve lookup. Do not hide page overflow to conceal layout defects.

## Review the Result

Inspect the rendered interface at desktop and narrow widths, in every supported
theme. Revise in this order:

1. Is the user's task and the dominant object clear in the first viewport?
2. Does each section advance the task without repeating another section?
3. Does typography communicate hierarchy before decoration does?
4. Are peers aligned and are spacing relationships deliberate?
5. Can any surface, border, icon, label, color, or motion be removed without
   losing meaning or affordance?
6. Does the interface reflow without overflow, broken reading order, or
   character-level wrapping?
7. Are semantics, focus, labels, contrast, and interaction states sound?

Fix the highest-impact structural problem first, then inspect again.

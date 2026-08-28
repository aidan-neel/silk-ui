# Sivir Design Language

Create a calm, intentional interface whose distinctiveness comes from composition, typography, alignment, and relationships specific to the user's work.

## Start With the Job

Establish who uses the interface, what they must understand or do, the most important content or state, and which constraint or error could change the outcome.

Order the experience by user need rather than data or source order. Give each section one purpose. Make the primary path understandable from the title, headings, key values, controls, and captions alone.

Write direct, sentence-case interface copy. Name actions with the result they produce and keep that vocabulary stable through confirmation and error states.

## Compose Before Decorating

Choose geometry before components. For substantial work, consider at least two materially different layouts and select the one that makes the user's task clearest with the least mediation.

- Make the first viewport communicate the purpose and dominant action, relationship, or evidence.
- Establish one dominant object in each major section and quiet its supporting content.
- Compose the page as a field with a shared grid, not a stack of interchangeable cards.
- Map magnitude to length or position, change to sequence, composition to proportion, process to connection, and alternatives to aligned rows or columns.
- Use prose for one conclusion, tables for exact lookup, and charts only when a relationship becomes faster to understand visually.
- Give true peers equal structure and visual weight.
- Reflow underfilled splits, orphaned items, and accidental empty rectangles.

If the layout feels safe or vague, strengthen one relationship through proportion, hierarchy, density, alignment, or placement before adding effects.

## Use Type and Space as Structure

Use the application's configured sans typeface for interface text and headings. Reserve mono for code, commands, paths, timestamps, and compact technical identifiers.

- Create hierarchy with type before adding surfaces, borders, or color.
- Use one page title, clear section headings, readable body text, compact labels, and subdued metadata.
- Keep long-form text near 60 to 68 characters per line; reflow before shrinking it.
- Align related text to shared edges and baselines.
- Use unmistakable gutters between adjacent text columns.
- Use tabular numerals for vertically compared values.

Build spacing from relationships:

- Keep a heading close to its first paragraph.
- Keep a label, value, and supporting detail together.
- Use a steady body rhythm among related controls and content.
- Use a clearly larger interval between distinct sections or tasks.
- Keep captions, validation, and sources close to what they qualify.

Give each visible gap one owner. Prefer a parent stack or grid over competing child margins.

## Apply Sivir Restraint

Use Sivir semantic color tokens and preserve their meaning in every theme. Pair color-coded state with text, shape, or another non-color cue.

Treat the interface as one continuous canvas. Add a surface, border, radius, or shadow only when it clarifies grouping, interaction, selection, or state better than spacing can. Default to stillness; add motion only to explain state change, preserve continuity, or confirm an action.

Do not ship:

- All-caps or widely tracked eyebrows, kickers, and overlines.
- Decorative gradients, glows, blobs, textures, glass, or ornamental shadows.
- A generic centered hero followed by a uniform card grid.
- A rounded container around every section or metric.
- Pills for ordinary metadata, labels, or status that does not need badge semantics.
- Decorative icon tiles, oversized icons, or mixed icon styles.
- Tiny muted copy, arbitrary type sizes, inconsistent peer values, or weak contrast.
- Decorative charts, misleading scales, or color without meaning.
- Stock imagery, fake screenshots, or decoration added to fill space.
- Scroll reveals, parallax, pulsing indicators, bounce, or motion that delays the task.

Avoiding these defaults is not permission to make a blank template. Commit to a composition and make its hierarchy, alignment, and information density precise.

## Recompose Responsively

Use semantic HTML, logical heading order, native control behavior, visible focus, accessible names, sufficient contrast, and source order that matches reading order.

Treat responsive design as recomposition, not uniform shrinking. Reflow grids, stack comparisons, preserve readable type and target sizes, and let dense tables scroll locally only when simplification or reordering would hurt lookup. Never hide page overflow to conceal a layout defect.

## Review in Order

1. Is the user's task and dominant object clear in the first viewport?
2. Does each section advance the task without repeating another section?
3. Does typography communicate hierarchy before decoration does?
4. Are peers aligned and spacing relationships deliberate?
5. Can any surface, border, icon, label, color, or motion be removed without losing meaning?
6. Does the interface reflow without overflow, broken reading order, or character-level wrapping?
7. Are semantics, focus, labels, contrast, and interaction states sound?

Fix the highest-impact structural problem first, then inspect again.

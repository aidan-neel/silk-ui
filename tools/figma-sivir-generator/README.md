# Sivir UI Library Generator

This development plugin completes the light-first Sivir UI Figma library in a
single run. It creates the remaining variables and styles, all 50 public Sivir
components, and three editable AI-agent orchestration screens on an `Examples`
page.

## Run it in the target file

1. Open `Sivir UI — Component Library` in the Figma desktop app.
2. Choose **Plugins → Development → Import plugin from manifest…**.
3. Select this folder's `manifest.json`.
4. Run **Sivir UI Library Generator** once.

The generator is idempotent for its own canvas content: on a rerun it replaces
only nodes marked as generator-owned and preserves unrelated work.

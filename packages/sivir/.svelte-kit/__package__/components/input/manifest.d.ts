import type { Manifest } from '@sivir-ui/svelte/_manifest/types';
/**
 * Input.
 *
 * 1.0.0 -- initial.
 * 2.0.0: removed `bind:value` from the type="checkbox" branch (Svelte 5
 *        throws when both bind:value and bind:checked are present).
 *        Consumers using type="checkbox" must read state via
 *        bind:checked only.
 * 3.0.0: removed the `primary` variant (it duplicated the base field look).
 *        Default variant is now `outlined`.
 * 4.0.0: renamed variant `outlined` → `outline` to align with field taxonomy.
 *        Both variants now use the public semantic field and motion tokens.
 *        Default remains `outline`.
 * 5.0.0: added optional `leading` and `trailing` adornment snippets.
 */
export declare const manifest: Manifest;

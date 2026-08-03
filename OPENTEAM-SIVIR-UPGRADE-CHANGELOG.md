# OpenTeam Changelog for the Next Sivir Upgrade

Status: Draft for the next `@sivir-ui/svelte` release  
Current OpenTeam resolution: `0.1.9`  
Required target: `__SIVIR_VERSION__` (replace with the exact npm version before this document is marked ready)  
Implementation source: `SIVIR-OPENTEAM-IMPLEMENTATION-PLAN.md`

## Purpose

This is the consumer-facing changelog and migration checklist for `/home/aidan/openteam`. It records what Sivir will add, how OpenTeam should adopt each capability, and which workarounds can be removed after the package update.

Do not apply these migrations against npm `0.1.9`. The current local Silk tree contains fixes and unreleased work that are not present in the public `0.1.9` artifact.

## Package Update

OpenTeam currently declares Sivir in two places:

- `package.json`: `^0.1.9`
- `apps/web/package.json`: `^0.1.6`

When the release is published:

1. Set `apps/web/package.json` to the exact minimum released version containing this changelog.
2. Remove the redundant root dependency if only `apps/web` imports Sivir; otherwise align both declarations exactly.
3. Regenerate `bun.lock` with the repository's pinned Bun version.
4. Confirm `node_modules/@sivir-ui/svelte/dist/svelte/ui.css` scans `*.js`.
5. Complete all migrations below before removing fallback code.
6. Verify `npm view @sivir-ui/svelte@__SIVIR_VERSION__ version` returns the exact target before migration begins.

## Added: Cumulative ResponseStream Snapshots

### Sivir capability

`ResponseStream` accepts `streaming` for a string that represents the latest cumulative snapshot of one live response.

```svelte
<ResponseStream textStream={responseText} streaming={responseActive} mode="fade" />
```

Existing words retain DOM identity as the snapshot grows. Setting `streaming={false}` finalizes the current snapshot without replaying it.

Async iterable values remain delta chunks and are not treated as snapshots.

### OpenTeam migration

1. Import `ResponseStream` from `@sivir-ui/svelte/components/response-stream` in `apps/web/src/routes/conversations/[id]/+page.svelte`.
2. Replace every `StableResponseStream` usage with `ResponseStream`.
3. Pass `textStream={partText(...)}` or `textStream={displayRepoPaths(message.content)}`.
4. Pass `streaming={true}` while the part or message is active.
5. Select `mode="fade"` to preserve the current word-fade presentation.
6. Remove `apps/web/src/lib/components/stable-response-stream.svelte` after all imports are gone.

### Remove

- `apps/web/src/lib/components/stable-response-stream.svelte`
- The `StableResponseStream` import in `apps/web/src/routes/conversations/[id]/+page.svelte`
- Any stale `.stable-response-stream-segment` styling that is no longer referenced

### Verify

- Existing response text does not replay after an SSE refresh.
- Appended words animate once.
- A growing partial word does not flash.
- Completing a message does not restart its text.
- Reduced motion renders new text without animation.

## Added: Custom Reasoning Trigger Content

### Sivir capability

`Reasoning.Trigger` accepts a typed child snippet rendered inside the real disclosure button.

```svelte
<Reasoning.Trigger aria-label={`${active ? 'Thinking' : 'Thought'} for ${duration}`}>
    {#snippet children({ open, streaming })}
        <span>{streaming ? 'Thinking' : 'Thought'} for {duration}</span>
        <ChevronDown class:rotate-180={open} aria-hidden="true" />
    {/snippet}
</Reasoning.Trigger>
```

The trigger retains button semantics, focus, `aria-expanded`, `aria-controls`, and keyboard behavior.

### OpenTeam migration

1. Replace the wrapper at `apps/web/src/routes/conversations/[id]/+page.svelte` that currently combines an invisible `Reasoning.Trigger` with a separate visual sibling.
2. Move the visible label, duration, and chevron into the trigger snippet.
3. Keep the elapsed timer in OpenTeam; pass or capture the formatted value in the snippet.
4. Keep an explicit `aria-label` that does not announce every timer tick through a live region.

### Remove

- `title=""` used solely to suppress default content
- Absolute inset classes on `Reasoning.Trigger`
- `[&>span]:!hidden`
- `peer` and `peer-aria-expanded` synchronization
- The separate `aria-hidden` visual trigger sibling

### Verify

- Exactly one trigger button exists.
- Space and Enter toggle reasoning.
- The button announces its name and expanded state.
- Live duration remains visual without repeated live-region announcements.

## Added: Dropdown Menu Radio and Checkbox Items

### Sivir capability

Sivir exports semantic selection parts:

```svelte
<DropdownMenu.RadioGroup bind:value={mode}>
    <DropdownMenu.RadioItem value="plan">Plan</DropdownMenu.RadioItem>
    <DropdownMenu.RadioItem value="build">Build</DropdownMenu.RadioItem>
</DropdownMenu.RadioGroup>
```

```svelte
<DropdownMenu.CheckboxItem bind:checked={includeTests}>Include tests</DropdownMenu.CheckboxItem>
```

Radio items expose `role="menuitemradio"`; checkbox items expose `role="menuitemcheckbox"`; both expose `aria-checked` and own their visual indicator.

### OpenTeam migration

Convert these selection groups:

- Repository selection in `apps/web/src/routes/+page.svelte`
- Branch selection in `apps/web/src/routes/+page.svelte`
- Mode selection in `apps/web/src/lib/components/chat-composer.svelte`
- Permission mode selection in `apps/web/src/lib/components/chat-composer.svelte`
- Model selection in `apps/web/src/lib/components/chat-composer.svelte`
- Effort selection in `apps/web/src/lib/components/chat-composer.svelte`
- Next-message branch selection in `apps/web/src/routes/conversations/[id]/+page.svelte`

Use one `RadioGroup` per independent choice set. Bind to caller-owned state because menu content may unmount when closed.

### Remove

- Imported `Check` icons used only as selected-item indicators
- Conditional `{#if selected ...}<Check />{/if}` blocks
- Manual visual-only selected-state logic

### Verify

- Screen readers announce selected state.
- Exactly one radio item is selected per group.
- Enter and Space select and close the menu once.
- Disabled items cannot mutate state.
- Selection survives closing and reopening portalled content.

## Added: Prompt Composer Generation and Queue State

### Sivir capability

`PromptComposer.Root` separates the composer's own submit transaction from response generation.

```svelte
<PromptComposer.Root
    bind:value={prompt}
    status={sending ? 'submitting' : 'idle'}
    generating={busy}
    onSubmit={submit}
    onStop={stop}
>
    <PromptComposer.Input />
    <PromptComposer.Submit queueLabel="Queue message">
        {#snippet children({ action })}
            {#if action === 'stop'}
                <Square aria-hidden="true" />
            {:else}
                <ArrowUp aria-hidden="true" />
            {/if}
        {/snippet}
    </PromptComposer.Submit>
</PromptComposer.Root>
```

Effective behavior:

| Generation | Draft     | Action        |
| ---------- | --------- | ------------- |
| Idle       | Empty     | Disabled Send |
| Idle       | Non-empty | Send          |
| Active     | Empty     | Stop          |
| Active     | Non-empty | Queue         |

### OpenTeam migration

1. Pass `generating={busy}` to Prompt Composer.
2. Keep `status` tied only to the `sending` promise.
3. Replace the hand-built Button at the end of `chat-composer.svelte` with `PromptComposer.Submit`.
4. Move the current Square and ArrowUp visuals into the typed Submit snippet if the Sivir defaults are not sufficient.
5. Keep queue policy in OpenTeam's `onSubmit`; Sivir only exposes the correct action.
6. Keep abort behavior in OpenTeam's `onStop`.

### Remove

- The local `stopping` derived adapter
- Manual `type={stopping ? 'button' : 'submit'}`
- Manual Send, Queue, and Interrupt labels
- Manual stop click branching
- Forced Submit button state that duplicates Sivir logic

### Verify

- A non-empty draft remains editable during generation.
- Enter queues that draft.
- Empty input changes the action to Interrupt.
- Queue pending blocks duplicate sends.
- Shift+Enter inserts a newline.
- IME composition does not submit.
- The icon-only control has the correct accessible label in every state.

## Fixed: One-Line CodeBlock Overlay Alignment

### Sivir capability

`CodeBlock.Content` now exposes `data-layout="single-line"` or `data-layout="multi-line"`. Overlay copy controls are centered automatically for one-line code and remain top-aligned for multiple lines.

Markdown fenced code inherits this behavior automatically.

### OpenTeam migration

1. Remove `markSingleLineCodeBlocks` from `apps/web/src/routes/conversations/[id]/+page.svelte`.
2. Remove `use:markSingleLineCodeBlocks` from the page wrapper.
3. Remove the one-line deep selector from `apps/web/src/app.css`.

### Remove

- The code-block `MutationObserver`
- DOM text inspection and `data-single-line` mutation
- `[data-ui='code-block'][data-single-line='true'] ...` CSS

### Verify

- One-line fenced code centers its copy control.
- Multi-line fenced code keeps the copy control at the top right.
- Updating streamed Markdown between one and multiple lines updates layout correctly.

## Added: Complete Quiet Tool Presentation and Trigger Customization

### Sivir capability

`Tool.Root variant="quiet"` is a complete intrinsic-width transcript presentation rather than a partial color variant. `trigger` optionally customizes visible trigger content inside the real button.

```svelte
<Tool.Root variant="quiet" name={`${parts.length} tool calls`} state={toolState}>
    {#snippet trigger({ open, name })}
        <ChevronDown class:rotate-90={!open} aria-hidden="true" />
        <span>{name}</span>
    {/snippet}

    <!-- Tool details -->
</Tool.Root>
```

### OpenTeam migration

1. Add `variant="quiet"` to grouped Tool roots.
2. Use the trigger snippet only if OpenTeam still needs to omit the default spinner or labels.
3. Keep Tool details and ScrollArea content unchanged.

### Remove

- `[&_[data-ui=spinner]]:hidden`
- `[&>button]:!min-h-0`
- `[&>button]:!w-auto`
- `[&>button]:!rounded-none`
- `[&>button]:!px-0`
- `[&>button]:!py-0`
- `[&>button:hover]:!bg-transparent`

### Verify

- Quiet Tool remains keyboard focusable and visibly focused.
- The hit target remains at least 24 by 24 CSS pixels.
- Expanded content has the same desired alignment without private selectors.
- The trigger announces its expanded state.

## Added: Reasoning and Tool Open Lifecycle Callbacks

### Sivir capability

Both roots expose:

```svelte
onOpenChange={(open) => {}}
onOpenChangeComplete={(open) => {}}
```

`onOpenChange` reports immediate bound state. `onOpenChangeComplete` reports actual post-transition state and works with reduced motion and interrupted transitions.

### OpenTeam migration

1. Move OpenTeam's panel-centering policy into a handler called from `onOpenChangeComplete`.
2. Bind or capture the specific panel element through an app-owned wrapper rather than searching from delegated click targets.
3. Call `scrollIntoView` only when the callback receives `true`.
4. Keep reduced-motion behavior in the app-owned scroll policy.

### Remove

- `centerOpenedPanels`
- Delegated click handling on the page root
- Private `[data-ui="reasoning-trigger"]` and `[data-ui="tool"] > button` queries
- The hard-coded `240ms` timeout
- Manual `aria-expanded` polling

### Verify

- Scrolling occurs after the panel reaches its final layout.
- Closing a panel does not trigger centering.
- Rapidly reversing a disclosure does not center stale content.
- Reduced motion completes without waiting 240ms.

## Added: Conversation Transcript Class Seam

### Sivir capability

`Conversation.Content` distinguishes viewport styling from transcript-stack styling.

```svelte
<Conversation.Content
    class="openteam-conversation w-full"
    transcriptClass="max-w-[43rem] gap-7 pt-8 pb-10"
>
    <!-- Messages -->
</Conversation.Content>
```

### OpenTeam migration

1. Move the transcript maximum width, gap, and block padding from global CSS into `transcriptClass`.
2. Keep `class="openteam-conversation w-full"` for viewport-level behavior such as hidden scrollbars.

### Remove

- `.openteam-conversation [data-ui='conversation-transcript']` from `apps/web/src/app.css`
- Any Tailwind descendant selector targeting the private transcript stack

### Verify

- Transcript width remains 43rem.
- Message spacing and top/bottom padding match the current UI.
- Follow-to-bottom behavior remains unchanged.
- Keyboard scrolling still targets the viewport.

## Changed: ApprovalRequest Awaits Async Actions

### Sivir capability

Approval Confirm and Cancel handlers may return promises. The request remains open while pending, closes after fulfillment, and remains open with an announced error after rejection.

```svelte
<ApprovalRequest.Root bind:open bind:pending bind:error>
    <ApprovalRequest.Content>
        <!-- Header and details -->
        <ApprovalRequest.Error />
        <ApprovalRequest.Footer>
            <ApprovalRequest.Cancel onclick={rejectRequest}>Reject</ApprovalRequest.Cancel>
            <ApprovalRequest.Confirm onclick={approveRequest}>Approve</ApprovalRequest.Confirm>
        </ApprovalRequest.Footer>
    </ApprovalRequest.Content>
</ApprovalRequest.Root>
```

### OpenTeam migration

1. Return every `fetch` promise chain from the action handler.
2. Refactor the modal `reply` and question handlers so failed requests reject after setting any OpenTeam-specific error copy.
3. Remove manual `requestOpen = false` on success.
4. Remove manual `requestOpen = true` on failure.
5. Render `ApprovalRequest.Error` or keep a custom `role="alert"` bound to the root error.
6. Use `pending` to coordinate any OpenTeam-specific busy state.

Correct:

```ts
async function approve() {
    const response = await fetch(url, options);
    if (!response.ok) {
        requestError = 'Could not approve the request.';
        throw new Error('Could not approve the request.');
    }
    await refresh();
}
```

Incorrect:

```ts
onclick={() => {
    approve();
}}
```

The incorrect form returns `void`, so Sivir cannot await it. Use `onclick={approve}` or `onclick={() => approve()}`.

`answerQuestion` is also called by ordinary inline Buttons for pull-request confirmation. Do not make those fire-and-forget handlers reject without a catch. Extract a throwing `submitQuestionAnswer` operation, return it directly from Approval Request actions, and wrap inline calls with `void submitQuestionAnswer(...).catch(handleInlineQuestionError)`.

Sivir preserves caller-written bound error copy, then falls back to `failureMessage`, then to `Request could not be completed.`. It never displays a caught exception message automatically.

### Remove

- Close-before-request behavior
- Reopening the dialog after failure
- Duplicate pending guards owned solely because the dialog closes immediately

### Verify

- Confirm and Cancel remain open while the network request is pending.
- Both actions reject duplicate activation while pending.
- Escape does not close a pending request.
- Success closes and restores focus.
- Failure stays open, announces the error once, and permits retry.

### Compatibility note

Approval Request async close timing changes. Audit every Approval Request action in OpenTeam to ensure it returns its promise. Direct Alert Dialog actions retain their existing close-on-click default.

## Fixed: Published Tailwind Runtime Variant Scanning

### Sivir capability

The published stylesheet scans compiled JavaScript where runtime Button variants live. Consumers no longer need package-specific source directives or duplicated interaction fills.

### OpenTeam migration

Only after confirming the installed package contains the fix:

1. Remove the package-specific `@source` from `apps/web/src/app.css`.
2. Remove the fallback ghost Button fill.
3. Remove the fallback secondary Button fill.
4. Remove the fallback outline Button fill.
5. Keep OpenTeam's app-owned source directive.

### Remove

```css
@source '../../../node_modules/@sivir-ui/svelte/dist/svelte/**/*.js';
```

Remove the three fallback rules beginning with:

```css
[data-ui='button'][data-variant='ghost']
[data-ui='button'][data-variant='secondary']
[data-ui='button'][data-variant='outline']
```

### Verify

- Ghost Button hover and open states retain their fill.
- Secondary Button hover and open states retain their fill.
- Outline Button hover and open states retain their fill.
- Focus rings, all released variants, and all sizes are present in emitted CSS.
- A production build succeeds without any Sivir package `@source` directive.

## OpenTeam Files Expected to Change

| File                                                        | Expected migration                                                                                                                                   |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                                              | Remove or align the root Sivir dependency                                                                                                            |
| `apps/web/package.json`                                     | Upgrade Sivir to the released version                                                                                                                |
| `bun.lock`                                                  | Resolve the new immutable package artifact                                                                                                           |
| `apps/web/src/app.css`                                      | Remove package scan, Button fallbacks, transcript selector, and one-line code selector                                                               |
| `apps/web/src/lib/components/stable-response-stream.svelte` | Delete after ResponseStream migration                                                                                                                |
| `apps/web/src/lib/components/chat-composer.svelte`          | Adopt generating state, semantic menu selection, and `PromptComposer.Submit`                                                                         |
| `apps/web/src/routes/+page.svelte`                          | Adopt semantic repository and branch radio items                                                                                                     |
| `apps/web/src/routes/conversations/[id]/+page.svelte`       | Adopt ResponseStream, custom Reasoning trigger, quiet Tool, lifecycle callbacks, transcriptClass, semantic branch items, and promise-aware approvals |
| `apps/web/vitest.config.ts` and browser test setup          | Add the consumer interaction harness before deleting workarounds                                                                                     |
| `apps/web/tests/`                                           | Add regression coverage for every migrated interaction                                                                                               |

## Recommended OpenTeam Migration Order

1. Upgrade the dependency and inspect the installed package artifact.
2. Remove Tailwind fallbacks only after a successful production CSS smoke test.
3. Migrate semantic Dropdown Menu selection items.
4. Migrate Prompt Composer generation, queue, and stop behavior.
5. Replace StableResponseStream.
6. Remove the code-block observer and CSS.
7. Move transcript classes onto `Conversation.Content`.
8. Replace Reasoning and Tool private trigger styling.
9. Replace the panel-centering timeout with lifecycle callbacks.
10. Refactor Approval Request handlers to return promises.
11. Delete all now-unused imports, helpers, styles, and the local stream module.
12. Run automated verification and the manual acceptance matrix.

## Consumer Test Harness Prerequisite

OpenTeam currently has no browser-test script or browser-test configuration. Add a focused Vitest Browser harness before removing the workarounds so the migration is not protected only by manual checks.

Recommended additions:

- Add `vitest`, `@vitest/browser`, `@vitest/browser-playwright`, `vitest-browser-svelte`, and `playwright` as `apps/web` development dependencies.
- Add `apps/web/vitest.config.ts` with a Chromium browser project and a reduced-motion Chromium project.
- Add `apps/web/tests/browser.setup.ts` that imports `app.css` and resets document state between tests.
- Add `test` and `test:browser` scripts to `apps/web/package.json` and include them in the existing Turborepo test pipeline.
- Add focused fixtures or route-level tests for cumulative streaming, menu selection semantics, composer Send/Queue/Stop, custom disclosures, lifecycle completion, and pending approval failure/retry.
- Keep the manual matrix for visual geometry, production emitted CSS, keyboard walkthrough, and assistive-technology checks.

## OpenTeam Verification

Run from `/home/aidan/openteam`:

```sh
bun run format
bun run format:check
bun run lint
bun run check
bun run test
bun run build
```

## Manual Acceptance Matrix

| Area               | Normal motion                           | Reduced motion                       | Keyboard                                                | Screen reader state                     |
| ------------------ | --------------------------------------- | ------------------------------------ | ------------------------------------------------------- | --------------------------------------- |
| Response streaming | Appends once without replay             | No entrance animation                | Not applicable                                          | Live status remains polite              |
| Reasoning          | Custom label and duration render        | Disclosure completes immediately     | Enter and Space toggle                                  | Name and expanded state announced       |
| Dropdown selection | Check indicator tracks value            | Not applicable                       | Arrow/focus behavior remains usable; Enter/Space select | Selected radio/checkbox state announced |
| Prompt Composer    | Send, Queue, Stop, Pending are distinct | Icon changes do not depend on motion | Enter queues; Shift+Enter adds newline                  | Effective action label announced        |
| CodeBlock          | One-line copy is centered               | Same layout                          | Copy remains focusable                                  | Copy keeps its accessible name          |
| Tool               | Quiet trigger has no private styling    | Disclosure completes immediately     | Trigger toggles and retains focus                       | Busy and expanded state announced       |
| Panel centering    | Scroll follows actual completion        | No hard-coded wait                   | Toggling by keyboard also centers                       | No extra announcements                  |
| Conversation       | Width and spacing unchanged             | Not applicable                       | Viewport remains scrollable                             | Log semantics unchanged                 |
| Approval Request   | Pending stays open; failure retries     | No motion dependency                 | Focus remains trapped; Escape blocked while pending     | Busy and failure announced              |
| Button variants    | Hover/open fills present                | Transitions reduced by Sivir         | Focus ring visible                                      | Names and states unchanged              |

## Rollback Guidance

- Keep the OpenTeam CSS fallbacks until the installed package and emitted production CSS have been inspected.
- Migrate one capability at a time so a failed package upgrade can be isolated.
- Do not restore the local StableResponseStream after cumulative snapshots are verified; report any stream regression against the new Sivir contract.
- If an async Approval handler cannot return its promise, keep that one action on explicit controlled-open behavior until it is refactored.
- If lifecycle completion is incorrect under rapid reversal, keep OpenTeam's centering policy disabled rather than restoring a fixed timeout.

## Completion Checklist

- [ ] OpenTeam resolves one consistent Sivir version.
- [ ] `__SIVIR_VERSION__` is replaced with the exact published version everywhere in this document.
- [ ] `npm view` confirms that exact version before migration starts.
- [ ] OpenTeam has a browser test harness covering the migrated interactions.
- [ ] The installed stylesheet scans compiled JavaScript.
- [ ] StableResponseStream is deleted.
- [ ] Manual menu check icons are removed.
- [ ] The custom composer Button is removed.
- [ ] The code-block MutationObserver is removed.
- [ ] Tool and Reasoning no longer use private trigger selectors.
- [ ] The `240ms` panel timeout is removed.
- [ ] Transcript layout uses `transcriptClass`.
- [ ] Approval actions return promises and no longer close then reopen.
- [ ] Package-specific Tailwind source and Button fallback CSS are removed.
- [ ] OpenTeam format, lint, check, test, and build gates pass.
- [ ] The manual acceptance matrix passes in normal and reduced motion.

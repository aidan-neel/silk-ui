# Sivir Support for OpenTeam: Implementation Plan

Status: Proposed
Scope: OpenTeam consumer workarounds 1-10
Repositories: `/home/aidan/silk` and `/home/aidan/openteam`
Package: `@sivir-ui/svelte`
Release: Unreleased; assign the package version only after the final diff is known

## Goal

Move reusable UI behavior out of OpenTeam and behind stable Sivir interfaces. After the corresponding Sivir release, OpenTeam should be able to remove its copied streaming component, private DOM selectors, timing assumptions, semantic menu patches, custom composer state adapter, and package-scanning fallbacks.

The implementation should make each Sivir module deeper: callers provide intent and state, while Sivir owns DOM semantics, motion completion, accessibility, and internal layout.

## Source Findings

| #   | OpenTeam workaround                                             | Evidence                                                                               | Sivir gap                                                                     |
| --- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1   | Local `StableResponseStream` for growing response snapshots     | `apps/web/src/lib/components/stable-response-stream.svelte`                            | `ResponseStream` restarts when a string prop changes                          |
| 2   | Invisible `Reasoning.Trigger` over separately rendered content  | `apps/web/src/routes/conversations/[id]/+page.svelte`                                  | Trigger content and live duration cannot be customized                        |
| 3   | Manual selected-item checks in menus                            | `apps/web/src/routes/+page.svelte`, `apps/web/src/lib/components/chat-composer.svelte` | No radio or checkbox menu parts                                               |
| 4   | Custom composer submit/queue/interrupt button                   | `apps/web/src/lib/components/chat-composer.svelte`                                     | Sending and response generation are represented as one state                  |
| 5   | `MutationObserver` and deep CSS for one-line code blocks        | `apps/web/src/routes/conversations/[id]/+page.svelte`, `apps/web/src/app.css`          | `CodeBlock` knows line count but does not expose or use it for overlay layout |
| 6   | Deep selectors to strip Tool trigger layout and spinner         | `apps/web/src/routes/conversations/[id]/+page.svelte`                                  | Current `quiet` variant is not fully compact and trigger rendering is fixed   |
| 7   | Private trigger selectors plus a `240ms` timeout                | `apps/web/src/routes/conversations/[id]/+page.svelte`                                  | Reasoning and Tool do not expose open lifecycle completion                    |
| 8   | Private transcript selector for width, gap, and padding         | `apps/web/src/app.css`                                                                 | `Conversation.Content.class` targets the viewport, not the transcript stack   |
| 9   | Close-then-reopen approval behavior after failed requests       | `apps/web/src/routes/conversations/[id]/+page.svelte`                                  | Approval actions close before async work completes                            |
| 10  | Package-specific Tailwind `@source` and duplicated Button fills | `apps/web/src/app.css`                                                                 | Published `0.1.9` does not scan compiled JavaScript                           |

## Scope Boundaries

This plan includes only the ten confirmed consumer gaps.

This plan does not add a generic question-request module, a generic empty state, a navigation item, additional modal sizes, a form-field module, hidden-scrollbar props, or a global density system.

This plan does not absorb OpenTeam domain behavior such as tool-name classification, repository path rewriting, GitHub request parsing, queue policy, or panel-centering policy. Sivir exposes the seams needed for those policies; OpenTeam retains the policies themselves.

This plan does not hand-edit files under `packages/sivir/.svelte-kit/__package__`. The package build regenerates those files from canonical source.

## Public Interface Summary

| Module                       | Interface addition or change                                                       |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| ResponseStream               | `streaming?: boolean` treats string values as cumulative snapshots                 |
| Reasoning.Trigger            | Typed `children` snippet receives `{ open, streaming }`                            |
| DropdownMenu                 | `RadioGroup`, `RadioItem`, and `CheckboxItem` compound parts                       |
| PromptComposer.Root          | `generating?: boolean` is independent from submit transaction status               |
| PromptComposer.Submit        | Typed content snippet receives the effective action: send, queue, stop, or pending |
| CodeBlock.Content            | Public `data-layout` values for single-line and multi-line content                 |
| Tool.Root                    | Completed `variant="quiet"` plus optional typed `trigger` snippet                  |
| Reasoning.Root and Tool.Root | `onOpenChange` and `onOpenChangeComplete` callbacks                                |
| Conversation.Content         | `transcriptClass?: string`                                                         |
| ApprovalRequest              | Promise-aware actions, pending state, and an error part                            |
| Package stylesheet           | Published `ui.css` scans compiled `*.js`; artifact tests prove emitted variants    |

## Cross-Cutting Invariants

- Existing public behavior remains the default unless this plan explicitly identifies a breaking behavior.
- Bindings update before corresponding change callbacks run.
- No callback fires merely because a module initially renders.
- Reduced motion never relies on a hard-coded timeout.
- Custom trigger content stays inside the real native button; no overlay or duplicate control is introduced.
- Menu selection state is available to assistive technology through native menu roles and `aria-checked`.
- Async approval failures remain visible and focus stays inside the alert dialog.
- No new Sivir runtime dependencies are required. OpenTeam adds browser-test development dependencies as part of its migration verification harness.
- Every new source file is listed in its component manifest and exercised by packed-artifact verification.

## Workstream 1: Cumulative ResponseStream Snapshots

### Public contract

Add `streaming?: boolean` to `ResponseStreamProps`.

| Input          | `streaming`                       | Required behavior                                                                  |
| -------------- | --------------------------------- | ---------------------------------------------------------------------------------- |
| String         | omitted or `false` from the start | Preserve the current paced complete-string reveal                                  |
| String         | `true`                            | Treat values as cumulative snapshots and append only the new suffix                |
| String         | `true` then `false`               | Apply the final snapshot without replay, mark complete, and call `onComplete` once |
| Async iterable | any value                         | Preserve current delta-chunk semantics and complete when iteration ends            |

### Implementation

1. Split source handling into explicit static-string, snapshot-string, and async-iterable paths.
2. Preserve `speed`, `characterChunkSize`, request-animation-frame pacing, and completion behavior for static strings.
3. Preserve async iterable chunks as deltas. Never infer cumulative semantics for iterables.
4. Keep snapshot output stable when `next.startsWith(previous)`.
5. Treat equal snapshots as no-ops.
6. Start a new visual session when a snapshot shrinks or diverges.
7. Keep `aria-busy="true"` while `streaming` is true and set it to false only after finalization.
8. Ensure stale iterables cannot append after their source is replaced.
9. In fade mode, key snapshot segments by snapshot-session generation and segment index so existing words and a growing trailing word do not remount.
10. Preserve the current text-inclusive segment keys outside snapshot mode.

### Files

- `packages/sivir/src/components/response-stream/index.ts`
- `packages/sivir/src/components/response-stream/response-stream.svelte`
- `packages/sivir/src/components/response-stream/manifest.ts`
- `apps/docs/tests/unit/sivir/response-stream.test.ts`
- `apps/docs/src/routes/docs/components/response-stream/+page.svelte`
- Add a cumulative-snapshot example under `apps/docs/src/routes/docs/components/response-stream/examples/`

### Tests

- Appending a snapshot does not duplicate text.
- Existing fade segment nodes retain identity after appending a word.
- A partial trailing word updates without remounting its segment.
- Equal snapshots do not trigger completion or replace nodes.
- Shrinking and divergent snapshots start fresh sessions.
- Finalization preserves nodes, clears `aria-busy`, and calls `onComplete` once.
- Static strings continue to reset and reveal at the configured pace.
- Async iterable values continue to concatenate as deltas.
- Replacing an iterable prevents stale chunks from writing.

### Done criteria

OpenTeam can replace `StableResponseStream` with `ResponseStream textStream={text} streaming` and existing text remains visually stable across cumulative refreshes.

## Workstream 2: Custom Reasoning Trigger Content

### Public contract

Add a typed trigger state and a `children` snippet to `ReasoningTriggerProps`.

```ts
export type ReasoningTriggerState = Readonly<{
    open: boolean;
    streaming: boolean;
}>;

export type ReasoningTriggerProps = {
    title?: string;
    duration?: string;
    children?: Snippet<[ReasoningTriggerState]>;
    // Existing button attributes remain available except onclick/title/children.
};
```

### Implementation

1. Preserve the current default trigger renderer when `children` is absent.
2. Render custom content inside the actual `Button` when `children` is present.
3. Pass current `open` and `streaming` values to the snippet.
4. Keep `aria-expanded`, `aria-controls`, focus treatment, keyboard activation, and disclosure toggling on the actual button.
5. Allow consumers to capture their own reactive elapsed duration in the snippet rather than adding timer policy to Sivir.
6. Document that custom snippets must not contain nested interactive controls.
7. Document that ticking duration text should not be an `aria-live` region.

### Files

- `packages/sivir/src/components/reasoning/index.ts`
- `packages/sivir/src/components/reasoning/reasoning-trigger.svelte`
- `packages/sivir/src/components/reasoning/manifest.ts`
- Add `apps/docs/tests/fixtures/ReasoningFixture.svelte`
- Add `apps/docs/tests/unit/sivir/reasoning.test.ts`
- `apps/docs/tests/unit/sivir/agent-components.ssr.test.ts`
- `apps/docs/tests/unit/sivir/a11y-axe.browser.test.ts`
- `apps/docs/src/routes/docs/components/reasoning/+page.svelte`
- Add `apps/docs/src/routes/docs/components/reasoning/examples/custom-trigger.svelte`

### Tests

- Default trigger output is unchanged.
- Custom content replaces default visual content without creating a second button.
- Custom content reacts to open, streaming, and caller-owned elapsed duration.
- The actual button retains its accessible name, `aria-expanded`, and `aria-controls`.
- Space and Enter toggle the disclosure and leave focus on the trigger.
- Default and custom forms render safely during SSR.

### Done criteria

OpenTeam can delete its absolutely positioned invisible trigger and render `Thinking for 3.2s` directly inside `Reasoning.Trigger`.

## Workstream 3: Semantic Dropdown Selection Parts

### Public contract

Export three new compound parts:

```ts
DropdownMenu.RadioGroup;
DropdownMenu.RadioItem;
DropdownMenu.CheckboxItem;
```

Recommended props:

```ts
type DropdownMenuRadioGroupProps = {
    value?: string;
    onValueChange?: (value: string) => void;
    children?: Snippet;
};

type DropdownMenuRadioItemProps = {
    value: string;
    children?: Snippet;
} & Omit<ButtonProps, 'children' | 'role' | 'aria-checked'>;

type DropdownMenuCheckboxItemProps = {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    children?: Snippet;
} & Omit<ButtonProps, 'children' | 'role' | 'aria-checked'>;
```

### Implementation

1. Make `RadioGroup` context-only with no wrapper DOM.
2. Make `value` and `checked` bindable.
3. Render `RadioItem` with `role="menuitemradio"` and literal `aria-checked`.
4. Render `CheckboxItem` with `role="menuitemcheckbox"` and literal `aria-checked`.
5. Include an `aria-hidden` check indicator with reserved layout space.
6. Reuse existing item focus, traveling-highlight, disabled, and close-menu behavior.
7. Update bound state before invoking change callbacks and before portalled content unmounts.
8. Ensure Enter and Space activate once through native button click behavior.
9. Set Dropdown Menu triggers to `aria-haspopup="menu"` rather than inheriting a dialog value.
10. Do not claim complete APG menu conformance unless the broader arrow, typeahead, Home/End, and submenu keyboard behavior is separately verified.

### Files

- Add `packages/sivir/src/components/dropdown-menu/dropdown-menu-radio-group.svelte`
- Add `packages/sivir/src/components/dropdown-menu/dropdown-menu-radio-item.svelte`
- Add `packages/sivir/src/components/dropdown-menu/dropdown-menu-checkbox-item.svelte`
- Add `packages/sivir/src/components/dropdown-menu/radio-group-context.svelte.ts`
- `packages/sivir/src/components/dropdown-menu/index.ts`
- `packages/sivir/src/components/dropdown-menu/dropdown-menu-trigger.svelte`
- `packages/sivir/src/components/dropdown-menu/manifest.ts`
- `packages/sivir/public-api.test.ts`
- `packages/sivir/scripts/verify-packed-consumer.ts`
- `packages/sivir/scripts/verify-cli-artifact.ts`
- Add `apps/docs/tests/fixtures/DropdownMenuSelectionFixture.svelte`
- `apps/docs/tests/unit/sivir/dropdown-menu.browser.test.ts`
- `apps/docs/tests/unit/sivir/a11y-axe.browser.test.ts`
- `apps/docs/tests/unit/sivir/state-isolation.test.ts`
- `apps/docs/src/routes/docs/components/dropdown-menu/+page.svelte`
- Update selection examples that currently render manual check icons

### Tests

- Correct roles and checked states are rendered.
- Selecting a radio item updates exactly one value.
- Selecting the current radio item does not emit a spurious value change.
- Checkbox items toggle in both directions across close and reopen.
- Disabled items do not update state or close the menu.
- Callbacks fire once and receive the new value.
- Selection in a submenu closes the correct ancestor menu layers.
- The trigger exposes `aria-haspopup="menu"`.
- Axe reports no violations for open radio and checkbox menus.
- Packed and CLI-installed consumers compile and render every new selection part.

### Done criteria

OpenTeam no longer manually appends hidden check icons, and screen readers can determine the selected repository, branch, mode, permission mode, model, and effort.

## Workstream 4: Prompt Composer Generation, Queue, and Stop

### Public contract

Keep the composer submit transaction and response generation as independent dimensions.

```ts
export type PromptComposerProps = {
    status?: 'idle' | 'submitting' | 'error';
    generating?: boolean;
    // Existing props remain.
};

export type PromptComposerSubmitAction = 'send' | 'queue' | 'stop' | 'pending';

export type PromptComposerSubmitState = Readonly<{
    action: PromptComposerSubmitAction;
    generating: boolean;
    empty: boolean;
}>;
```

Add `queueLabel?: string` and `children?: Snippet<[PromptComposerSubmitState]>` to `PromptComposerSubmitProps`.

### State model

Action precedence is explicit:

1. A disabled root disables the control.
2. An unresolved promise started by the root's `onSubmit` is internal pending and always produces the Pending action.
3. When the `generating` prop is omitted, an externally supplied `status="submitting"` preserves the legacy Stop action.
4. When `generating` is supplied, an externally supplied `status="submitting"` represents a submit transaction and produces the Pending action.
5. When no prior rule applies, derive Send, Queue, or Stop from generation state, draft content, and `allowEmpty`.

| Submit pending | Generating | Draft empty | `allowEmpty` | Effective action                         |
| -------------- | ---------- | ----------- | ------------ | ---------------------------------------- |
| No             | No         | No          | Any          | Send                                     |
| No             | No         | Yes         | False        | Disabled send                            |
| No             | No         | Yes         | True         | Send empty value                         |
| No             | Yes        | No          | Any          | Queue                                    |
| No             | Yes        | Yes         | Any          | Stop                                     |
| Yes            | Any        | Any         | Any          | Pending and duplicate submission blocked |
| Any            | Any        | Any         | Any          | Disabled when the root is disabled       |

### Implementation

1. Add `generating` to root context without folding it into `status`.
2. Keep the textarea editable while `generating` is true.
3. Track internal promise pending separately from the externally supplied status so pending and legacy stop behavior cannot be conflated.
4. Derive the Submit action from root status, generation state, and trimmed input.
5. Submit a non-empty draft while generating so the consumer may enqueue it.
6. Invoke `onStop` when generating and the draft is empty.
7. Preserve `allowEmpty` for idle sends. During generation, an empty draft always means Stop; generation control takes precedence over empty-message submission.
8. Keep the control a native submit button for send and queue actions and a native button for stop.
9. Preserve an accessible label through `label`, `queueLabel`, and `stopLabel`, including when visual children are custom.
10. Provide default send, queue, stop, and pending icon states.
11. Preserve the legacy externally controlled `status="submitting"` submit-as-stop behavior only when `generating` is omitted; document it as compatibility behavior. Internal `onSubmit` promise pending always uses the non-interactive Pending action.
12. Add `data-generating` separately from `data-state`.
13. Keep `aria-busy` scoped to the composer's own submit transaction, not the entire response generation period.

### Files

- `packages/sivir/src/components/prompt-composer/index.ts`
- `packages/sivir/src/components/prompt-composer/context.svelte.ts`
- `packages/sivir/src/components/prompt-composer/prompt-composer.svelte`
- `packages/sivir/src/components/prompt-composer/prompt-composer-input.svelte`
- `packages/sivir/src/components/prompt-composer/prompt-composer-submit.svelte`
- `packages/sivir/src/components/prompt-composer/manifest.ts`
- `apps/docs/tests/fixtures/PromptComposerFixture.svelte`
- `apps/docs/tests/unit/sivir/prompt-composer.test.ts`
- `apps/docs/src/routes/docs/components/prompt-composer/+page.svelte`
- Add a generating-and-queueing example

### Tests

- Generating does not make the textarea readonly.
- Enter submits or queues while generating.
- Empty input changes Submit to stop and invokes only `onStop`.
- Non-empty input changes Submit to queue and invokes only `onSubmit`.
- Idle empty input follows `allowEmpty`; generating empty input remains Stop regardless of `allowEmpty`.
- Pending queue submission blocks duplicates without removing stop capability after it settles.
- Internal `onSubmit` promise pending uses Pending in both legacy and generating modes.
- External `status="submitting"` uses legacy Stop when `generating` is omitted and Pending when `generating` is supplied.
- Shift+Enter and IME composition behavior are unchanged.
- Custom Submit content receives the correct action and retains an accessible name.
- Root disabled state disables every action.
- Legacy submit-as-stop behavior remains covered.

### Done criteria

OpenTeam can remove its custom Button and pass `generating={busy}` to Prompt Composer while preserving one-button Send, Queue, and Interrupt behavior.

## Workstream 5: Automatic Single-Line CodeBlock Layout

### Public contract

Expose a stable DOM contract rather than requiring a new caller-calculated prop.

```html
<div data-ui="code-block-content" data-layout="single-line"></div>
```

Valid values are `single-line` and `multi-line`.

### Implementation

1. Reuse the existing normalized line-count calculation in `CodeBlock.Content`.
2. Treat one trailing newline as formatting noise, matching current line-number behavior.
3. Add `data-layout` to the public content panel.
4. Center `copyPlacement="overlay"` vertically for one-line content.
5. Preserve the current top-right placement for multi-line content.
6. Leave inline and action-bar copy layouts unchanged.
7. Let Markdown inherit the behavior through its existing `CodeBlock copy="overlay"` rendering.

### Files

- `packages/sivir/src/components/code-block/code-block-content.svelte`
- `packages/sivir/src/components/code-block/index.ts`
- `packages/sivir/src/components/code-block/manifest.ts`
- `packages/sivir/src/components/markdown/manifest.ts`
- `apps/docs/tests/unit/sivir/code-block.test.ts`
- Add `apps/docs/tests/unit/sivir/code-block.browser.test.ts`
- `apps/docs/tests/unit/sivir/markdown.test.ts`
- `apps/docs/src/routes/docs/components/code-block/+page.svelte`
- `apps/docs/src/routes/docs/components/markdown/+page.svelte`

### Tests

- One line and one line with a terminal newline are classified as single-line.
- Multiple lines are classified as multi-line.
- Overlay copy is centered for one line and remains top-aligned for multiple lines.
- Rerendering between layouts updates the marker and position.
- A browser geometry test compares the one-line copy control center with the panel center.
- Markdown fenced code inherits both classifications.

### Done criteria

OpenTeam can remove `markSingleLineCodeBlocks`, its `MutationObserver`, and the deep overlay selector from `app.css`.

## Workstream 6: Complete Tool Quiet Presentation and Custom Trigger

### Public contract

Finish the existing unreleased `variant="quiet"` contract and add one deep customization seam.

```ts
export type ToolTriggerState = Readonly<{
    open: boolean;
    state: ToolState;
    name: string;
    duration?: string;
}>;

export type ToolProps = {
    variant?: 'default' | 'quiet';
    trigger?: Snippet<[ToolTriggerState]>;
    // Existing props remain.
};
```

### Implementation

1. Keep the default variant unchanged.
2. Make the quiet root and trigger intrinsic-width with `max-w-full`.
3. Remove quiet visual padding, radius, full-row hover surface, duration inset, and expanded-content horizontal inset.
4. Keep an effective target of at least 24 by 24 CSS pixels through minimum size or a non-overlapping pseudo-element.
5. Preserve focus-visible treatment, native button behavior, `aria-expanded`, `aria-controls`, `aria-busy`, and disclosure motion.
6. Preserve the current default trigger renderer when `trigger` is absent.
7. Render a custom `trigger` snippet inside the real button when provided.
8. Let custom trigger content omit the default spinner or status label without exposing private selectors.
9. Document that custom trigger snippets cannot contain nested interactive controls.
10. Add the currently omitted `components/tool/tool-item.svelte` to the Tool manifest.

### Files

- `packages/sivir/src/components/tool/index.ts`
- `packages/sivir/src/components/tool/tool.svelte`
- `packages/sivir/src/components/tool/manifest.ts`
- `apps/docs/tests/fixtures/ToolFixture.svelte`
- `apps/docs/tests/unit/sivir/tool.test.ts`
- `apps/docs/tests/unit/sivir/a11y-axe.browser.test.ts`
- `apps/docs/tests/unit/sivir/agent-components.ssr.test.ts`
- `apps/docs/src/routes/docs/components/tool/+page.svelte`
- Update `apps/docs/src/routes/docs/components/tool/examples/quiet.svelte`

### Tests

- Default Tool layout remains full-width.
- Quiet Tool is intrinsic-width, compact, selector-free, and retains focus indication.
- A browser geometry assertion proves the quiet trigger has an effective target of at least 24 by 24 CSS pixels.
- Quiet expanded content has no default horizontal inset.
- Custom trigger content replaces default visual content inside one real button.
- Default running state still renders its spinner and busy semantics.
- Custom trigger may omit the spinner without affecting semantics.
- The registry includes and installs `Tool.Item`.

### Done criteria

OpenTeam can replace its private button and spinner selectors with `variant="quiet"` and an optional trigger snippet.

## Workstream 7: Reasoning and Tool Open Lifecycle

### Public contract

Add the same callbacks directly to `ReasoningRootProps` and `ToolProps`.

```ts
onOpenChange?: (open: boolean) => void;
onOpenChangeComplete?: (open: boolean) => void;
```

### Semantics

- `open` remains bindable and is the immediate state.
- `onOpenChange` runs once after the binding has the new value.
- `onOpenChangeComplete` runs after the matching intro or outro actually finishes.
- Neither callback runs for initial render.
- Parent-controlled and trigger-controlled changes follow the same contract.
- Rapid reversal suppresses stale completion callbacks.
- Reduced-motion and zero-duration transitions still complete without a timer.
- Callbacks are informational and cannot cancel the state change.
- Reasoning supports exactly one `Reasoning.Content` per root. A second registration throws a clear composition error.
- If no Reasoning Content is registered, completion runs in the next microtask because no transition surface exists.

### Implementation

1. Track the previous open value and a monotonically increasing transition revision in each root.
2. Store the pending `{ target, revision }` in root context whenever open changes.
3. Capture that revision on `introstart` or `outrostart`; report the captured revision from the matching end event.
4. Complete only when the reported direction and captured revision still match the root's pending transition.
5. Queue close completion to a microtask so callers observe the final removed DOM.
6. Register Reasoning Content with its root, reject a second registration, and use a next-microtask fallback when no content is registered.
7. Compose any consumer-supplied Reasoning Content transition handlers rather than replacing them.
8. Avoid a shared exported lifecycle base type; duplicate the two callback fields to keep each interface local.

### Files

- `packages/sivir/src/components/reasoning/index.ts`
- `packages/sivir/src/components/reasoning/reasoning.svelte`
- `packages/sivir/src/components/reasoning/reasoning-content.svelte`
- `packages/sivir/src/components/reasoning/context.svelte.ts`
- `packages/sivir/src/components/tool/index.ts`
- `packages/sivir/src/components/tool/tool.svelte`
- Add `apps/docs/tests/unit/sivir/reasoning-tool-lifecycle.browser.test.ts`
- Add `apps/docs/tests/unit/sivir/reasoning-tool-lifecycle.reduced.browser.test.ts`
- Add lifecycle examples to Reasoning and Tool docs

### Tests

- No callbacks run on mount.
- Immediate callback precedes completion callback.
- Completion waits for actual transition completion.
- Closing completion observes content removed.
- Parent-controlled state changes behave like trigger changes.
- Rapid open-close-open sequences emit no stale completions.
- Reduced motion completes without arbitrary delays.
- Multiple instances do not share lifecycle state.
- Reasoning with no Content completes in the next microtask; a second Content reports a composition error.

### Done criteria

OpenTeam can delete `centerOpenedPanels`, listen to `onOpenChangeComplete(true)`, and apply its own `scrollIntoView` policy without querying private DOM or knowing Sivir's duration.

## Workstream 8: Conversation Transcript Styling Seam

### Public contract

Add `transcriptClass?: string` to `ConversationContentProps`.

`class` continues to style the scroll viewport. `transcriptClass` styles the inner message stack, including maximum width, gap, and padding.

### Implementation

1. Destructure `transcriptClass` in `conversation-content.svelte`.
2. Merge it into the existing transcript classes with consumer overrides winning according to the repository's `cn` behavior.
3. Keep `data-ui="conversation-transcript"` because Sivir's ResizeObserver uses it internally.
4. Keep viewport role, live-region attributes, focus behavior, scroll following, and observer behavior unchanged.
5. Do not expose arbitrary transcript attributes until a concrete second need appears.

### Files

- `packages/sivir/src/components/conversation/index.ts`
- `packages/sivir/src/components/conversation/conversation-content.svelte`
- `packages/sivir/src/components/conversation/manifest.ts`
- `apps/docs/tests/fixtures/ConversationFixture.svelte`
- `apps/docs/tests/unit/sivir/conversation.test.ts`
- `apps/docs/src/routes/docs/components/conversation/+page.svelte`

### Tests

- `class` remains on the viewport only.
- `transcriptClass` lands on the transcript only.
- Conflicting width, gap, and padding utilities replace defaults.
- Scroll-following and labelled-log tests remain green.

### Done criteria

OpenTeam can move `max-w-[43rem]`, gap, and padding classes onto `Conversation.Content` and remove its private transcript selector.

## Workstream 9: Promise-Aware ApprovalRequest Actions

### Public contract

Approval actions should stay open until their returned promise resolves.

```ts
export type ApprovalRequestActionName = 'cancel' | 'confirm';

export type ApprovalRequestRootProps = {
    open?: boolean;
    risk?: ApprovalRisk;
    pending?: ApprovalRequestActionName | null;
    error?: string | null;
    children?: Snippet;
};

export type ApprovalRequestActionProps = {
    onclick?: (event: MouseEvent) => void | Promise<void>;
    pendingLabel?: string;
    failureMessage?: string;
    children?: Snippet;
} & Omit<ButtonProps, 'children' | 'onclick' | 'status' | 'loading' | 'loadingLabel'>;
```

Export `ApprovalRequest.Error`, which renders the bound root error as a stable `role="alert"` region unless custom children are supplied.

`open`, `pending`, and `error` are bindable. `pending` and `error` are observability seams for custom layouts; Approval Request still owns their normal state transitions.

`failureMessage` is safe interface copy for a rejected action. Its default is `Request could not be completed.`. Sivir never renders the caught exception message automatically. Error precedence is:

1. Preserve a non-empty caller-written bound `error` value set during the action.
2. Otherwise use the action's `failureMessage`.
3. Otherwise use the default safe message.

### State model

| State     | Open | Pending           | Error                |
| --------- | ---- | ----------------- | -------------------- |
| Idle      | Yes  | None              | Optional prior error |
| Running   | Yes  | Confirm or cancel | Cleared              |
| Failed    | Yes  | None              | Safe failure message |
| Succeeded | No   | None              | Cleared              |

### Implementation

1. Extend Approval Request context with open, pending, error, and an action runner.
2. Keep the dialog open while a returned promise is unresolved.
3. Close after synchronous success or promise fulfillment.
4. Catch thrown or rejected actions, clear pending, keep open, and expose a safe failure message.
5. Disable repeat activation and the other action while pending.
6. Keep the active action focusable and show its pending label through Button status.
7. Set `aria-busy` on the approval content while pending.
8. Add `allowEscape?: boolean` to `ModalContentProps` and Alert Dialog Content, defaulting to true, and forward a reactive getter to the internal overlay.
9. Pass `allowEscape={pending === null}` from Approval Request Content so Escape is blocked only while pending.
10. Keep backdrop dismissal disabled as it is today.
11. Preserve programmatic `open=false` as authoritative. Closing invalidates the action revision, clears pending and error, and causes any later settlement from that action to be ignored.
12. Opening after a programmatic close starts a fresh request session that stale actions cannot close or annotate.
13. Add `closeOnClick?: boolean` to Alert Dialog Confirm and Exit, defaulting to true.
14. Have Approval Request pass `closeOnClick={false}` and close through its own runner.
15. Document that async handlers must return their promise and must rethrow after setting a custom bound error if the dialog should remain open.

### Files

- `packages/sivir/src/components/approval-request/index.ts`
- `packages/sivir/src/components/approval-request/context.svelte.ts`
- `packages/sivir/src/components/approval-request/approval-request.svelte`
- `packages/sivir/src/components/approval-request/approval-request-content.svelte`
- `packages/sivir/src/components/approval-request/approval-request-confirm.svelte`
- `packages/sivir/src/components/approval-request/approval-request-cancel.svelte`
- Add `packages/sivir/src/components/approval-request/approval-request-error.svelte`
- `packages/sivir/src/components/approval-request/manifest.ts`
- `packages/sivir/src/components/alert-dialog/index.ts`
- `packages/sivir/src/components/alert-dialog/alert-dialog-content.svelte`
- `packages/sivir/src/components/alert-dialog/alert-dialog-confirm.svelte`
- `packages/sivir/src/components/alert-dialog/alert-dialog-exit.svelte`
- `packages/sivir/src/components/alert-dialog/manifest.ts`
- `packages/sivir/src/components/modal/index.ts`
- `packages/sivir/src/components/modal/modal-content.svelte`
- `packages/sivir/src/components/modal/manifest.ts`
- `packages/sivir/src/components/_internal/overlay/overlay.svelte.ts`
- `packages/sivir/src/components/_internal/overlay/manifest.ts`
- `packages/sivir/public-api.test.ts`
- `packages/sivir/scripts/verify-packed-consumer.ts`
- `packages/sivir/scripts/verify-cli-artifact.ts`
- Add async Approval Request fixture, browser tests, docs, and example

### Tests

- Existing synchronous Confirm and Cancel actions still close.
- Unresolved actions keep the alert dialog mounted.
- Exactly one action runs at a time.
- Pending labels, disabled peer action, and `aria-busy` are correct.
- Fulfillment closes and restores focus.
- Rejection stays open, announces one error, and permits retry.
- Synchronous throws follow the same failure path as promise rejection.
- Caller-set error copy wins over `failureMessage`; caught exception text is never exposed automatically.
- Escape does not close while pending and works again after pending clears.
- Backdrop remains non-dismissible.
- Programmatic close clears pending and invalidates stale settlement, including after close and reopen.
- Packed and CLI-installed consumers compile the Error part and promise-returning actions.

### Compatibility

Async close timing changes from close-before-callback to close-after-success. Treat the Approval Request component manifest as a major revision. Direct Alert Dialog behavior remains unchanged by default because `closeOnClick` defaults to true.

### Done criteria

OpenTeam no longer closes and reopens the request around a failed network action, and request errors remain visible in the same focused dialog.

## Workstream 10: Published Tailwind Variant Scanning

### Current state

The canonical Silk stylesheet already has the correct source directive:

```css
@source "./**/*.{svelte,ts,js}";
```

The published `0.1.9` package installed by OpenTeam still scans only `svelte` and `ts`. The source fix is therefore implemented but not complete until artifact tests and a new immutable package release exist.

### Implementation

1. Keep the current `*.js` source directive in `packages/sivir/src/ui.css`.
2. Strengthen `packages/sivir/scripts/verify-packed-consumer.ts` to inspect the installed tarball stylesheet.
3. Build a fresh consumer containing all Button variants.
4. Inspect emitted client CSS and assert representative base, size, hover, focus, and open-state utilities exist.
5. Cover at minimum ghost, secondary, and outline hover/open fills because those are OpenTeam's current fallbacks.
6. Remove installer-lab package-mode source directives that point at unpublished `src` paths or monorepo source.
7. Update installer-lab generator tests to assert package mode needs only the `ui.css` import.
8. Add a release note that package consumers must remove package-specific `node_modules` scans and fallback Button CSS.
9. Publish under a version newer than `0.1.9`; never reuse the local post-release `0.1.9` tarball.

### Files

- `packages/sivir/src/ui.css`
- `packages/sivir/release.test.ts`
- `packages/sivir/scripts/verify-packed-consumer.ts`
- `apps/installer-lab/src/lib/server/generator.ts`
- `apps/installer-lab/src/lib/server/generator.test.ts`
- `apps/installer-lab/src/app.css`
- `apps/docs/src/routes/docs/installation/+page.svelte`
- Package version and lockfile only in the dedicated release commit

### Tests

- Packed `dist/svelte/ui.css` contains the JavaScript scan pattern.
- A fresh consumer emits CSS for every released Button variant and size.
- Ghost, secondary, and outline hover/open states are present without consumer `@source` workarounds.
- Installer-lab package mode generates no source path into Sivir's package or monorepo.
- Packed consumer and CLI artifact verifiers both pass.

### Done criteria

OpenTeam can remove its Sivir `node_modules/**/*.js` source directive and duplicated Button interaction fills after upgrading from npm.

## Public and Packed Artifact Coverage

Update `packages/sivir/public-api.test.ts` for every new exported compound part, specifically Dropdown Menu RadioGroup, RadioItem, CheckboxItem, and Approval Request Error.

Extend `packages/sivir/scripts/verify-packed-consumer.ts` with one compiled usage of every new public contract:

- Response Stream cumulative string snapshots.
- Custom Reasoning trigger content and both lifecycle callbacks.
- Dropdown Menu radio and checkbox parts.
- Prompt Composer generating state and typed Submit content.
- CodeBlock's automatic one-line layout through normal rendering.
- Quiet Tool with custom trigger and lifecycle callbacks.
- Conversation Content `transcriptClass`.
- Promise-returning Approval Request actions and Approval Request Error.

Extend `packages/sivir/scripts/verify-cli-artifact.ts` to install every affected component and verify all newly added source files are copied. The CLI verifier does not need to repeat every runtime assertion, but it must prove registry completeness.

## Release Finalization Gate

The package version stays undecided until implementation and compatibility review are complete. Before OpenTeam migration begins:

1. Select the exact package version from the final release scope and compatibility impact.
2. Update `packages/sivir/package.json` and `bun.lock` in the dedicated release commit.
3. Replace every `__SIVIR_VERSION__` placeholder in `OPENTEAM-SIVIR-UPGRADE-CHANGELOG.md` with that exact version.
4. Change the changelog status from Draft to Ready only after the retained tarball passes every release gate.
5. Publish the immutable package through `.github/workflows/publish.yml`.
6. Verify `npm view @sivir-ui/svelte@<exact-version> version` returns the exact version.
7. Install from public npm in a clean consumer and verify the emitted Button variant CSS.
8. Begin the OpenTeam migration only after all prior steps succeed.

## Component Manifest Versions

| Module            | Planned component-manifest version | Notes                                                       |
| ----------------- | ---------------------------------- | ----------------------------------------------------------- |
| response-stream   | `1.1.0`                            | Additive snapshot mode                                      |
| reasoning         | Next minor                         | Fold into current unreleased `1.1.0`; otherwise use `1.2.0` |
| dropdown-menu     | `2.2.0`                            | Additive selection parts                                    |
| prompt-composer   | `1.1.0`                            | Additive generating/action model with legacy compatibility  |
| code-block        | `1.1.0`                            | Additive DOM contract and automatic layout                  |
| markdown          | `1.1.0`                            | Observable inherited fenced-code behavior                   |
| tool              | Next minor                         | Fold into current unreleased `1.1.0`; otherwise use `1.2.0` |
| conversation      | `1.1.0`                            | Additive transcript class seam                              |
| approval-request  | `2.0.0`                            | Async action close timing changes                           |
| alert-dialog      | `1.1.0`                            | Additive `closeOnClick` support                             |
| modal and overlay | `1.1.0`                            | Additive reactive Escape permission                         |

## Recommended Execution Order

1. Coordinate ownership of the current dirty worktree and preserve all overlapping Button, Reasoning, Tool, Prompt Composer, and Response Stream changes.
2. Add characterization tests for current behavior before changing interfaces.
3. Complete Workstream 10 artifact coverage early so every later package build proves consumer CSS.
4. Implement Dropdown Menu selection parts.
5. Implement Prompt Composer generation and action state, then migrate its docs examples to semantic menu parts.
6. Implement Response Stream snapshot mode.
7. Implement CodeBlock layout and Markdown integration coverage.
8. Implement Conversation transcript styling.
9. Implement the shared Reasoning and Tool lifecycle contract.
10. Implement custom Reasoning trigger content.
11. Complete Tool quiet layout and custom trigger content.
12. Implement promise-aware Approval Request actions and Escape control.
13. Update every component manifest, documentation page, example, anatomy entry, and generated-reference assertion in the same workstream as its interface.
14. Format canonical source and documentation.
15. Build once to regenerate package and registry artifacts.
16. Review generated files against canonical source and avoid staging unrelated generated changes.
17. Run all repository and release verification gates.
18. Publish a new immutable package release.
19. Apply `OPENTEAM-SIVIR-UPGRADE-CHANGELOG.md` in OpenTeam and run its full verification suite.

## Suggested Commit Boundaries

1. `test: cover published Tailwind variant CSS`
2. `feat(dropdown-menu): add semantic selection items`
3. `feat(prompt-composer): separate generation from submission`
4. `feat(response-stream): preserve cumulative snapshots`
5. `fix(code-block): align one-line overlay actions`
6. `feat(conversation): expose transcript layout class`
7. `feat(reasoning): customize trigger content`
8. `feat(agent-disclosures): expose open lifecycle`
9. `feat(tool): complete quiet transcript presentation`
10. `feat(approval-request): await action completion`
11. `docs: publish OpenTeam migration guidance`
12. `release: publish the OpenTeam support package`

Each commit must include its focused tests and manifest changes. Do not defer all tests or docs to the final commit.

## Repository Verification

Run from `/home/aidan/silk` after implementation:

```sh
bun run format
bun run format:check
bun run lint
bun run check
bun run test
bun --filter=docs run test:browser
bun run build
bun --cwd=packages/sivir run verify:artifact
bun --cwd=packages/sivir run verify:cli-artifact
```

Before publishing, also run every release gate in `.github/workflows/publish.yml` and test one clean consumer installed from the retained tarball.

## OpenTeam Acceptance

After the release is installed, OpenTeam must pass:

```sh
bun run format:check
bun run lint
bun run check
bun run test
bun run build
```

Manual acceptance must cover:

- Growing response text does not replay or flicker.
- Reasoning and Tool triggers remain keyboard accessible and expose their expanded state.
- Menu selections announce their selected state.
- A non-empty draft queues while generation continues.
- An empty draft exposes Interrupt and stops generation.
- One-line code copy controls are vertically centered.
- Opened panels scroll only after their real transition completes.
- Conversation transcript width and spacing are unchanged after moving to `transcriptClass`.
- Approval actions remain open while pending and after failure.
- Every Button variant retains hover, focus, and open-state styling without fallback CSS.

## Stop Conditions

- Stop if current in-progress changes conflict semantically with an interface in this plan; reconcile with the owner rather than resetting or overwriting them.
- Stop if cumulative response inputs are not guaranteed to be snapshots; define a separate explicit source mode rather than guessing.
- Stop if full APG menu keyboard behavior becomes release acceptance; scope and plan that broader work separately.
- Stop if Approval Request must support cancellation of an in-flight promise; define an abort contract before implementation.
- Stop if a release would include unrelated unfinished work; isolate the package-scanning patch or delay publication until the branch is coherent.

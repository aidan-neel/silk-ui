/**
 * A single shared tooltip surface.
 *
 * Every Tooltip.Trigger drives this one element, so moving from one trigger to
 * another *morphs* the same bubble -- the background stays put while it slides
 * and reshapes around the new label.
 *
 * Centering trick: the bubble is anchored by its *center* (left = trigger
 * centre + `translateX(-50%)`), so its width can change freely without ever
 * drifting off the trigger.
 *
 * Presentation lives in `ui.css` under `.sivir-tooltip`.
 */
import { computePosition, offset, flip, shift } from '@floating-ui/dom';
let bubble = null;
let measurer = null;
let label = null;
let visible = false;
let currentText = '';
let activeRef = null;
let lastCenter = 'translateX(-50%)';
let openTimer;
let closeTimer;
const SHOW = 'scale(1)';
const HIDE = 'scale(0.94)';
/**
 * Lazily builds the bubble, its label span, and the off-screen measuring twin.
 *
 * The twin exists so `applyWidth` can read a target width before the label
 * swaps, letting the bubble transition its shape instead of snapping when the
 * new label is a different length.
 */
function ensure() {
    if (bubble || typeof document === 'undefined')
        return;
    const el = document.createElement('div');
    el.setAttribute('data-sivir-tooltip', '');
    el.setAttribute('role', 'tooltip');
    el.className = 'sivir-tooltip';
    el.style.transform = `translateX(-50%) ${HIDE}`;
    const span = document.createElement('span');
    span.className = 'sivir-tooltip-label';
    el.appendChild(span);
    document.body.appendChild(el);
    const m = document.createElement('span');
    m.setAttribute('aria-hidden', 'true');
    m.className = 'sivir-tooltip-measure';
    document.body.appendChild(m);
    bubble = el;
    measurer = m;
    label = span;
}
/** Sizes the bubble to the measured width of `text` so the change can transition. */
function applyWidth(text) {
    if (!bubble || !measurer)
        return;
    measurer.textContent = text;
    bubble.style.width = `${measurer.offsetWidth}px`;
}
/**
 * Places the bubble against `ref`.
 *
 * The `fixed` strategy is required because the bubble is `position: fixed` --
 * with absolute coordinates it drifts by the page scroll once you scroll down to
 * a component. The result is anchored by the bubble's centre so width and height
 * changes never decentre it. Rejections are swallowed: the active trigger can
 * disappear while Floating UI is measuring it, and a removed trigger needs no
 * recovery and must not leak an unhandled rejection.
 */
function reposition(ref, placement, animated) {
    if (!bubble)
        return;
    void computePosition(ref, bubble, {
        strategy: 'fixed',
        placement,
        middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })]
    })
        .then(({ x, y }) => {
        if (!bubble || activeRef !== ref)
            return;
        const horizontal = placement === 'top' || placement === 'bottom';
        const center = horizontal ? 'translateX(-50%)' : 'translateY(-50%)';
        lastCenter = center;
        const left = horizontal ? x + bubble.offsetWidth / 2 : x;
        const top = horizontal ? y : y + bubble.offsetHeight / 2;
        if (animated) {
            bubble.style.left = `${left}px`;
            bubble.style.top = `${top}px`;
        }
        else {
            const prev = bubble.style.transition;
            bubble.style.transition = 'none';
            bubble.style.transform = `${center} ${HIDE}`;
            bubble.style.left = `${left}px`;
            bubble.style.top = `${top}px`;
            void bubble.offsetHeight;
            bubble.style.transition = prev;
        }
        requestAnimationFrame(() => {
            if (!bubble || activeRef !== ref)
                return;
            bubble.style.opacity = '1';
            bubble.style.transform = `${center} ${SHOW}`;
        });
    })
        .catch(() => { });
}
/** Shows the bubble for `ref`; when one is already up it morphs to this label. */
function present(ref, text, placement) {
    if (!bubble || !label)
        return;
    clearTimeout(closeTimer);
    const morph = visible;
    activeRef = ref;
    label.textContent = text;
    currentText = text;
    applyWidth(text);
    reposition(ref, placement, morph);
    visible = true;
}
/** Hover/focus a trigger: show after `delay`, or morph instantly if one is already up. */
export function showTooltip(ref, text, placement = 'top', delay = 125) {
    if (typeof document === 'undefined' || !text)
        return;
    ensure();
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    if (visible || delay <= 0) {
        present(ref, text, placement);
    }
    else {
        openTimer = setTimeout(() => present(ref, text, placement), delay);
    }
}
/** Re-label the active bubble in place (for example, a Copy→Copied flip). */
export function updateTooltipText(ref, text) {
    if (!visible || activeRef !== ref || !label || !text || text === currentText)
        return;
    label.textContent = text;
    currentText = text;
    applyWidth(text);
}
/** Force the bubble up now and, unless the pointer is over the trigger, auto-hide after `holdMs`. */
export function flashTooltip(ref, text, placement = 'top', holdMs = 1500) {
    if (typeof document === 'undefined' || !text)
        return;
    ensure();
    clearTimeout(openTimer);
    present(ref, text, placement);
    const hovered = typeof ref.matches === 'function' && ref.matches(':hover');
    if (!hovered) {
        clearTimeout(closeTimer);
        closeTimer = setTimeout(dismiss, holdMs);
    }
}
function dismiss() {
    if (!bubble)
        return;
    visible = false;
    activeRef = null;
    bubble.style.opacity = '0';
    bubble.style.transform = `${lastCenter} ${HIDE}`;
}
/** Leave/blur a trigger: schedule a hide, ignored if a different trigger took over. */
export function hideTooltip(ref, closeDelay = 100) {
    clearTimeout(openTimer);
    if (ref && activeRef && ref !== activeRef)
        return;
    clearTimeout(closeTimer);
    closeTimer = setTimeout(dismiss, closeDelay);
}
/**
 * Test-only: tear down the shared bubble and clear its timers/state so browser
 * suites don't leak an open tooltip (or a pending open timer) from one case
 * into the next.
 */
export function resetSharedTooltipForTests() {
    clearTimeout(openTimer);
    clearTimeout(closeTimer);
    openTimer = undefined;
    closeTimer = undefined;
    visible = false;
    activeRef = null;
    currentText = '';
    lastCenter = 'translateX(-50%)';
    bubble?.remove();
    measurer?.remove();
    bubble = null;
    measurer = null;
    label = null;
}
export function isActiveTooltip(ref) {
    return visible && activeRef === ref;
}

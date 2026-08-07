import { cubicIn, cubicOut, quintOut } from 'svelte/easing';
import { fade } from 'svelte/transition';
/**
 * Reads a CSS duration variable and normalizes it to milliseconds.
 *
 * Each branch tests `Number.isFinite` rather than falling back with `||` so a
 * legitimate `0ms` -- the "None" motion preset -- survives instead of being
 * replaced by the fallback.
 */
export function getCssDuration(node, variableName, fallback) {
    const raw = getComputedStyle(node).getPropertyValue(variableName).trim();
    if (!raw) {
        return fallback;
    }
    if (raw.endsWith('ms')) {
        const parsed = Number.parseFloat(raw);
        return Number.isFinite(parsed) ? parsed : fallback;
    }
    if (raw.endsWith('s')) {
        const parsed = Number.parseFloat(raw);
        return Number.isFinite(parsed) ? parsed * 1000 : fallback;
    }
    const parsed = Number.parseFloat(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
}
/**
 * Unit-interval cubic-bezier easing with CSS-compatible control points.
 * Used for the iOS drawer curve, which Svelte's built-in easings cannot express.
 */
export function cubicBezier(x1, y1, x2, y2) {
    return (t) => {
        if (t <= 0) {
            return 0;
        }
        if (t >= 1) {
            return 1;
        }
        let lo = 0;
        let hi = 1;
        let mid = t;
        for (let i = 0; i < 12; i++) {
            const x = sampleBezier(mid, x1, x2);
            if (Math.abs(x - t) < 1e-4) {
                break;
            }
            if (x < t) {
                lo = mid;
            }
            else {
                hi = mid;
            }
            mid = (lo + hi) / 2;
        }
        return sampleBezier(mid, y1, y2);
    };
}
/** Cubic bezier basis with p0=0 and p3=1: `B(t) = 3(1-t)²t·p1 + 3(1-t)t²·p2 + t³`. */
function sampleBezier(t, p1, p2) {
    const u = 1 - t;
    return 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t;
}
/** iOS-like drawer curve: cubic-bezier(0.32, 0.72, 0, 1) */
const drawerEase = cubicBezier(0.32, 0.72, 0, 1);
function getCssNumber(node, variableName, fallback) {
    const parsed = Number.parseFloat(getComputedStyle(node).getPropertyValue(variableName));
    return Number.isFinite(parsed) ? parsed : fallback;
}
function panelTransition(node, durationVariable, fallbackDuration, options) {
    const style = getComputedStyle(node);
    const opacity = Number(style.opacity);
    const baseTransform = style.transform === 'none' ? '' : style.transform;
    const baseFilter = style.filter === 'none' ? '' : style.filter;
    const offsetY = options?.offsetY ?? getCssNumber(node, '--motion-panel-y', 2);
    const startScale = options?.startScale ?? getCssNumber(node, '--motion-panel-scale-start', 0.97);
    return {
        duration: getCssDuration(node, durationVariable, fallbackDuration),
        easing: options?.easing ?? cubicOut,
        css: (t) => {
            return `opacity:${t * opacity};transform:${baseTransform} translateY(${(1 - t) * offsetY}px) scale(${startScale + (1 - startScale) * t});filter:${baseFilter} blur(${(1 - t) * 2}px)`;
        }
    };
}
export function panelIn(node) {
    return panelTransition(node, '--motion-duration-panel-in', 110);
}
export function panelOut(node) {
    return panelTransition(node, '--motion-duration-panel-out', 150);
}
/** Dialog enter: a soft centered scale that rises into place. */
export function dialogIn(node) {
    return panelTransition(node, '--motion-duration-modal-in', 180, {
        offsetY: 4,
        startScale: 0.93,
        easing: quintOut
    });
}
/** Dialog exit: move slightly upward instead of retracing the enter path. */
export function dialogOut(node) {
    return panelTransition(node, '--motion-duration-modal-out', 110, {
        offsetY: -3,
        startScale: 0.98,
        easing: cubicIn
    });
}
export function overlayIn(node) {
    return fade(node, {
        duration: getCssDuration(node, '--motion-duration-overlay', 120)
    });
}
export const overlayOut = overlayIn;
function sheetSlide(node, side, durationVariable, fallbackDuration) {
    const dir = side === 'left' ? -1 : 1;
    const style = getComputedStyle(node);
    const baseTransform = style.transform === 'none' ? '' : style.transform;
    return {
        duration: getCssDuration(node, durationVariable, fallbackDuration),
        easing: drawerEase,
        css: (t) => {
            return `transform:${baseTransform} translate3d(${(1 - t) * 100 * dir}%, 0, 0)`;
        }
    };
}
/** Sheet enter: slides in from the anchored edge with the drawer curve. */
export function sheetIn(node, params = {}) {
    return sheetSlide(node, params.side ?? 'right', '--motion-duration-sheet', 280);
}
/** Sheet exit: same path, slightly faster so dismiss feels snappy. */
export function sheetOut(node, params = {}) {
    return sheetSlide(node, params.side ?? 'right', '--motion-duration-sheet-out', 200);
}
/** Vertical slide that reads its duration from a CSS motion variable. */
export const themedSlide = (node, params = {}) => {
    const duration = getCssDuration(node, params.durationVar ?? '--motion-duration-panel', params.fallback ?? 220);
    const style = getComputedStyle(node);
    const opacity = +style.opacity;
    const height = parseFloat(style.height);
    const paddingTop = parseFloat(style.paddingTop);
    const paddingBottom = parseFloat(style.paddingBottom);
    const marginTop = parseFloat(style.marginTop);
    const marginBottom = parseFloat(style.marginBottom);
    const borderTopWidth = parseFloat(style.borderTopWidth);
    const borderBottomWidth = parseFloat(style.borderBottomWidth);
    return {
        duration,
        delay: 0,
        easing: cubicOut,
        css: (t) => {
            return (`overflow: hidden;` +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * paddingTop}px;` +
                `padding-bottom: ${t * paddingBottom}px;` +
                `margin-top: ${t * marginTop}px;` +
                `margin-bottom: ${t * marginBottom}px;` +
                `border-top-width: ${t * borderTopWidth}px;` +
                `border-bottom-width: ${t * borderBottomWidth}px;`);
        }
    };
};

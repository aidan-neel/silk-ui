import '@sivir-ui/svelte/ui.css';
import { afterEach, beforeEach } from 'vitest';
import { userEvent } from 'vitest/browser';
import { resetSharedTooltipForTests } from '@sivir-ui/svelte/components/tooltip/shared-tooltip';
import { resetBodyLocksForTests, resetEscapeStackForTests } from '@sivir-ui/svelte/utils';

function pointerParkingTarget() {
    let target = document.querySelector<HTMLElement>('[data-pointer-parking-target]');
    if (target) return target;

    target = document.createElement('div');
    target.dataset.pointerParkingTarget = '';
    target.setAttribute('aria-hidden', 'true');
    target.style.cssText =
        'position:fixed;right:0;bottom:0;width:2px;height:2px;z-index:2147483647;pointer-events:auto';
    document.body.appendChild(target);
    return target;
}

async function resetBrowserState() {
    await userEvent.hover(pointerParkingTarget());
    document.documentElement.classList.remove('dark');
    resetSharedTooltipForTests();
    resetBodyLocksForTests();
    resetEscapeStackForTests();
}

beforeEach(resetBrowserState);
afterEach(resetBrowserState);

import { createContext } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import type { ModalState } from '.';

export type ModalFooterSlot = {
    children?: Snippet;
    className?: string;
    rest: Record<string, unknown>;
};

export type ModalContext = {
    id: string;
    contentId: string;
    returnFocusEl: HTMLElement | undefined;
    state: ModalState;
    footerSlot: ModalFooterSlot | undefined;
};

const { set: setModalContext, get: getModalContext } = createContext<ModalContext>('modal');

export { getModalContext, setModalContext };

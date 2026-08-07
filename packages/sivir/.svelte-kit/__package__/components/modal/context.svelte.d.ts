import type { ModalState } from '.';
export type ModalContext = {
    id: string;
    contentId: string;
    returnFocusEl: HTMLElement | undefined;
    state: ModalState;
};
declare const setModalContext: (value: ModalContext) => ModalContext, getModalContext: () => ModalContext;
export { setModalContext, getModalContext };

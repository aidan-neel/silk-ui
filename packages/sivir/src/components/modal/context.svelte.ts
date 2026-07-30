import { createContext } from '@sivir/ui/utils';
import type { ModalState } from '.';

export type ModalContext = {
	id: string;
	contentId: string;
	returnFocusEl: HTMLElement | undefined;
	state: ModalState;
};

const { set: setModalContext, get: getModalContext } = createContext<ModalContext>('modal');

export { setModalContext, getModalContext };

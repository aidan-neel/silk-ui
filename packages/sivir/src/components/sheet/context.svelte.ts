import { createContext } from '@sivir-ui/svelte/utils';
import type { SheetState } from '.';

export type SheetContext = {
	id: string;
	state: SheetState;
};

const { set: setSheetContext, get: getSheetContext } = createContext<SheetContext>('sheet');

export { setSheetContext, getSheetContext };

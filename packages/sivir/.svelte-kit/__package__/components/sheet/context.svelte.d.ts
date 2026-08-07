import type { SheetState } from '.';
export type SheetContext = {
    id: string;
    state: SheetState;
};
declare const setSheetContext: (value: SheetContext) => SheetContext,
    getSheetContext: () => SheetContext;
export { setSheetContext, getSheetContext };

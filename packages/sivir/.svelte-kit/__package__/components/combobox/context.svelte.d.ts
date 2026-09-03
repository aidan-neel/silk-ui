import type { ComboboxItem, ComboboxState } from '.';
export type ComboboxContext = {
    id: string;
    state: ComboboxState;
    selectItem: (item: ComboboxItem) => void;
    clearSelection: () => void;
};
declare const setComboboxContext: (value: ComboboxContext) => ComboboxContext, getComboboxContext: () => ComboboxContext;
export { getComboboxContext, setComboboxContext };

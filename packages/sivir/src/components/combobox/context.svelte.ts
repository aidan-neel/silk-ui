import { createContext } from '@sivir-ui/svelte/utils';
import type { ComboboxItem, ComboboxState } from '.';

export type ComboboxContext = {
    id: string;
    state: ComboboxState;
    selectItem: (item: ComboboxItem) => void;
    clearSelection: () => void;
};

const { set: setComboboxContext, get: getComboboxContext } =
    createContext<ComboboxContext>('combobox');

export { getComboboxContext, setComboboxContext };

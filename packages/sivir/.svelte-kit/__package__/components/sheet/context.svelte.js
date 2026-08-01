import { createContext } from '@sivir-ui/svelte/utils';
const { set: setSheetContext, get: getSheetContext } = createContext('sheet');
export { setSheetContext, getSheetContext };

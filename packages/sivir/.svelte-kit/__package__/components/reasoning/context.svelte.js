import { createContext } from '@sivir-ui/svelte/utils';
const { set: setReasoningContext, get: getReasoningContext } = createContext('reasoning');
export { getReasoningContext, setReasoningContext };

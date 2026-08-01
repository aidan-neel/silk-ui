import { createContext } from '@sivir-ui/svelte/utils';
const { set: setCommandContext, get: getCommandContext } = createContext('command');
export { setCommandContext, getCommandContext };
/** Items eligible for keyboard navigation: the active result set minus disabled rows. */
export function getCommandResults(state) {
    const source = state.searchContent.trim() === '' ? state.items : state.results;
    return source.filter((item) => !item.disabled);
}
export function resetCommand(state) {
    state.searchContent = '';
    state.results = [...state.items];
    state.activeId = getCommandResults(state)[0]?.id;
}

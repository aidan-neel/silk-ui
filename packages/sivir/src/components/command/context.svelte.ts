import { createContext } from '@sivir-ui/svelte/utils';
import type { CommandState } from '.';

const { set: setCommandContext, get: getCommandContext } = createContext<CommandState>('command');

export { setCommandContext, getCommandContext };

/** Items eligible for keyboard navigation: the active result set minus disabled rows. */
export function getCommandResults(state: CommandState) {
    const source = state.searchContent.trim() === '' ? state.items : state.results;
    return source.filter((item) => !item.disabled);
}

export function resetCommand(state: CommandState) {
    state.searchContent = '';
    state.results = [...state.items];
    state.activeId = getCommandResults(state)[0]?.id;
}

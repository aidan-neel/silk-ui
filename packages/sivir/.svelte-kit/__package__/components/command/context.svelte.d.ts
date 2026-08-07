import type { CommandState } from '.';
declare const setCommandContext: (value: CommandState) => CommandState, getCommandContext: () => CommandState;
export { setCommandContext, getCommandContext };
/** Items eligible for keyboard navigation: the active result set minus disabled rows. */
export declare function getCommandResults(state: CommandState): import(".").CommandItem[];
export declare function resetCommand(state: CommandState): void;

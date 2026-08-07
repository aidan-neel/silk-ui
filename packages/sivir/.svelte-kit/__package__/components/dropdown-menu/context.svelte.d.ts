import type { PopoverState } from '@sivir-ui/svelte/components/popover';
export type DropdownMenuContext = {
    inverted: boolean;
    /** Open menu layers from root → immediate parent (submenu cone ancestors). */
    ancestors: PopoverState[];
    /** Submenus owned by this menu layer. Only one may be open at a time. */
    submenus: PopoverState[];
    /** The parent layer's submenu registry, used by this submenu trigger. */
    parentSubmenus?: PopoverState[];
};
declare const setDropdownMenuContext: (value: DropdownMenuContext) => DropdownMenuContext,
    getDropdownMenuContext: () => DropdownMenuContext;
export { setDropdownMenuContext, getDropdownMenuContext };

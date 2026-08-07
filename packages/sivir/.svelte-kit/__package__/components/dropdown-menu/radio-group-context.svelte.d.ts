export type DropdownMenuRadioGroupContext = {
    get value(): string | undefined;
    set value(value: string | undefined);
    onValueChange?: (value: string) => void;
};
declare const setDropdownMenuRadioGroupContext: (
        value: DropdownMenuRadioGroupContext
    ) => DropdownMenuRadioGroupContext,
    getDropdownMenuRadioGroupContext: () => DropdownMenuRadioGroupContext;
export { getDropdownMenuRadioGroupContext, setDropdownMenuRadioGroupContext };

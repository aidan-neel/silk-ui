<script lang="ts">
import type { DropdownMenuRadioGroupProps } from '.';
import { setDropdownMenuRadioGroupContext } from './radio-group-context.svelte';

let { value = $bindable(), onValueChange, children }: DropdownMenuRadioGroupProps = $props();

setDropdownMenuRadioGroupContext({
    get value() {
        return value;
    },
    set value(next) {
        value = next;
    },
    get onValueChange() {
        return onValueChange;
    }
});
</script>

{@render children?.()}

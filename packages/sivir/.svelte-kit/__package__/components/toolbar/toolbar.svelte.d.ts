import { type DefaultProps } from '@sivir-ui/svelte/utils';
import type { HTMLAttributes } from 'svelte/elements';
type $$ComponentProps = DefaultProps & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'>;
declare const Toolbar: import("svelte").Component<$$ComponentProps, {}, "">;
type Toolbar = ReturnType<typeof Toolbar>;
export default Toolbar;

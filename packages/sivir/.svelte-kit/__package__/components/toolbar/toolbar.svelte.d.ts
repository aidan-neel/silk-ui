import type { HTMLAttributes } from 'svelte/elements';
import { type DefaultProps } from '@sivir-ui/svelte/utils';
type $$ComponentProps = DefaultProps & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'>;
declare const Toolbar: import("svelte").Component<$$ComponentProps, {}, "">;
type Toolbar = ReturnType<typeof Toolbar>;
export default Toolbar;

import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { HTMLAttributes } from 'svelte/elements';
import Toolbar from './toolbar.svelte';

export type ToolbarProps = DefaultProps & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'>;

export { Toolbar };

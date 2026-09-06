import type { DefaultProps } from '@sivir-ui/svelte/utils';
import type { Snippet } from 'svelte';
import type {
    HTMLAttributes,
    HTMLButtonAttributes,
    HTMLFormAttributes,
    HTMLTextareaAttributes
} from 'svelte/elements';
import Root from './composer.svelte';
import Actions from './composer-actions.svelte';
import Input from './composer-input.svelte';
import Submit from './composer-submit.svelte';
import Toolbar from './composer-toolbar.svelte';

export type ComposerStatus = 'idle' | 'submitting' | 'error';

export type ComposerProps = {
    value?: string;
    status?: ComposerStatus;
    /** Whether a response is being generated independently of submission state. */
    generating?: boolean;
    disabled?: boolean;
    allowEmpty?: boolean;
    onSubmit: (value: string, event: SubmitEvent) => void | Promise<void>;
    onStop?: () => void;
    class?: string;
    children?: Snippet;
} & Omit<
    HTMLFormAttributes,
    'children' | 'class' | 'onsubmit' | 'action' | 'method' | 'target' | 'enctype'
>;

export type ComposerInputProps = {
    submitOnEnter?: boolean;
    element?: HTMLTextAreaElement;
    class?: string;
} & Omit<HTMLTextareaAttributes, 'children' | 'class' | 'value'>;

export type ComposerToolbarProps = {
    class?: string;
    children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'role'>;

export type ComposerActionsProps = {
    class?: string;
    children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'>;

export type ComposerSubmitProps = {
    label?: string;
    queueLabel?: string;
    stopLabel?: string;
    children?: Snippet<[ComposerSubmitState]>;
    element?: HTMLButtonElement | HTMLAnchorElement;
    onclick?: (event: MouseEvent) => void;
    class?: string;
} & Omit<DefaultProps, 'children'> &
    Omit<HTMLButtonAttributes, 'children' | 'class' | 'type' | 'onclick'>;

export type ComposerSubmitAction = 'send' | 'queue' | 'stop' | 'pending';

export type ComposerSubmitState = Readonly<{
    action: ComposerSubmitAction;
    generating: boolean;
    empty: boolean;
}>;

export { Actions, Input, Root, Submit, Toolbar };

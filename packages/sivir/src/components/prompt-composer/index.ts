import type { Snippet } from 'svelte';
import type {
    HTMLAttributes,
    HTMLButtonAttributes,
    HTMLFormAttributes,
    HTMLTextareaAttributes
} from 'svelte/elements';
import Root from './prompt-composer.svelte';
import Input from './prompt-composer-input.svelte';
import Toolbar from './prompt-composer-toolbar.svelte';
import Actions from './prompt-composer-actions.svelte';
import Submit from './prompt-composer-submit.svelte';

export type PromptComposerStatus = 'idle' | 'submitting' | 'error';

export type PromptComposerProps = {
    value?: string;
    status?: PromptComposerStatus;
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

export type PromptComposerInputProps = {
    submitOnEnter?: boolean;
    element?: HTMLTextAreaElement;
    class?: string;
} & Omit<HTMLTextareaAttributes, 'children' | 'class' | 'value'>;

export type PromptComposerToolbarProps = {
    class?: string;
    children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'role'>;

export type PromptComposerActionsProps = {
    class?: string;
    children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'>;

export type PromptComposerSubmitProps = {
    label?: string;
    stopLabel?: string;
    element?: HTMLButtonElement | HTMLAnchorElement;
    onclick?: (event: MouseEvent) => void;
    class?: string;
} & Omit<HTMLButtonAttributes, 'children' | 'class' | 'type' | 'onclick'>;

export { Root, Input, Toolbar, Actions, Submit };

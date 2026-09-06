import type { Snippet } from 'svelte';
import type { HTMLAttributes, HTMLButtonAttributes, HTMLInputAttributes } from 'svelte/elements';
import Root from './tag-input.svelte';
import Input from './tag-input-input.svelte';
import List from './tag-input-list.svelte';
import Tag from './tag-input-tag.svelte';

export type TagInputRejectionCode = 'duplicate' | 'invalid' | 'max-tags';

export type TagInputRejection = {
    value: string;
    code: TagInputRejectionCode;
    reason: string;
};

export type TagInputVariant = 'outline' | 'secondary';

export type TagInputProps = {
    tags?: string[];
    query?: string;
    max?: number;
    allowDuplicates?: boolean;
    disabled?: boolean;
    label?: string;
    description?: string;
    error?: string;
    name?: string;
    required?: boolean;
    variant?: TagInputVariant;
    validate?: (tag: string) => boolean | string;
    normalize?: (tag: string) => string;
    delimiters?: string[];
    addOnBlur?: boolean;
    addOnPaste?: boolean;
    onTagsChange?: (tags: string[]) => void;
    onAdd?: (tag: string) => void;
    onRemove?: (tag: string) => void;
    onReject?: (rejection: TagInputRejection) => void;
    id?: string;
    class?: string;
    children?: Snippet;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class' | 'id'>;

export type TagInputListProps = {
    label?: string;
    class?: string;
    children?: Snippet;
} & Omit<HTMLAttributes<HTMLUListElement>, 'children' | 'class'>;

export type TagInputTagProps = {
    value: string;
    index?: number;
    removable?: boolean;
    onRemove?: (tag: string) => void;
    class?: string;
    children?: Snippet;
} & Omit<HTMLButtonAttributes, 'children' | 'class' | 'type' | 'value' | 'onclick'>;

export type TagInputInputProps = {
    placeholder?: string;
    element?: HTMLInputElement | undefined;
    class?: string;
} & Omit<HTMLInputAttributes, 'children' | 'class' | 'value'>;

export { Input, List, Root, Tag };

import { tv } from 'tailwind-variants';
/** Icon-chip color treatment per toast type. */
export const toastIcon = tv({
    variants: {
        type: {
            success:
                'text-[var(--color-success)] bg-[color-mix(in_srgb,var(--color-success)_12%,transparent)]',
            error: 'text-[var(--color-error)] bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)]',
            warning:
                'text-[var(--color-warning)] bg-[color-mix(in_srgb,var(--color-warning)_12%,transparent)]',
            info: 'text-[var(--color-info)] bg-[color-mix(in_srgb,var(--color-info)_12%,transparent)]',
            loading: 'text-foreground-muted bg-secondary/40',
            default: ''
        }
    }
});
/** Progress-bar color per toast type (falls back to the muted base). */
export const toastProgress = tv({
    base: 'bg-foreground-muted',
    variants: {
        type: {
            success: 'bg-[var(--color-success)]',
            error: 'bg-[var(--color-error)]',
            warning: 'bg-[var(--color-warning)]',
            info: 'bg-[var(--color-info)]',
            loading: '',
            default: ''
        }
    }
});

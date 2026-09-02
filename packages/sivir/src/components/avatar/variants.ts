import { tv } from 'tailwind-variants';

export const avatar = tv({
    base: 'relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden bg-secondary text-foreground-muted [font-size:var(--font-size-body)] [font-weight:var(--font-weight-body)] [letter-spacing:var(--tracking-body)]',
    variants: {
        size: {
            sm: 'size-7 text-[length:var(--font-size-meta)]',
            md: 'size-9 text-[length:var(--font-size-badge)]',
            lg: 'size-12 text-[length:var(--font-size-header)]',
            xl: 'size-16 text-[length:var(--font-size-title)]'
        },
        shape: {
            circle: 'rounded-full',
            square: 'rounded-[var(--radius-md)]'
        }
    },
    defaultVariants: {
        size: 'md',
        shape: 'circle'
    }
});

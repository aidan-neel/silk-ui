import { tv } from 'tailwind-variants';
export const avatar = tv({
    base: 'relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden bg-secondary text-foreground-muted [font-size:var(--font-size-body,16px)] [font-weight:var(--font-weight-body,400)] [letter-spacing:var(--tracking-body,0em)]', // token-lint-disable-line no-literal-length
    variants: {
        size: {
            sm: 'size-7 text-[0.7rem]', // token-lint-disable-line no-literal-length
            md: 'size-9 text-[0.78rem]', // token-lint-disable-line no-literal-length
            lg: 'size-12 text-[0.95rem]', // token-lint-disable-line no-literal-length
            xl: 'size-16 text-[1.1rem]' // token-lint-disable-line no-literal-length
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

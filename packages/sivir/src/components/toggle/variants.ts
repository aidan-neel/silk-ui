import { tv } from 'tailwind-variants';

export const toggle = tv({
    base: 'sivir-press inline-flex select-none items-center justify-center gap-1.5 rounded-[var(--radius-md)] [font-weight:var(--font-weight-button,500)] [letter-spacing:var(--tracking-button,0em)] transition-[background-color,color,box-shadow,transform,scale] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none focus-visible:outline-none focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-50',
    variants: {
        variant: {
            default: '',
            outlined: 'border border-border'
        },
        pressed: {
            true: 'bg-secondary text-foreground hover:bg-secondary',
            false: 'bg-transparent text-foreground-muted hover:bg-secondary/60 hover:text-foreground'
        },
        size: {
            sm: 'h-7 px-[var(--sivir-space-2)] [font-size:var(--font-size-badge)]', // token-lint-disable-line no-primitive-leak
            md: 'h-8 px-[var(--sivir-space-3)] [font-size:var(--font-size-label)]', // token-lint-disable-line no-primitive-leak
            lg: 'h-10 px-[var(--sivir-space-4)] [font-size:var(--font-size-button)]' // token-lint-disable-line no-primitive-leak
        }
    },
    defaultVariants: {
        variant: 'default',
        pressed: false,
        size: 'md'
    }
});

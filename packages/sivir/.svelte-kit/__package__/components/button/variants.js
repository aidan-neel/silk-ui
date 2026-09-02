import { tv } from 'tailwind-variants';
export const button = tv({
    base: 'sivir-press inline-flex h-[calc(var(--size-control-md)-2px)] hover:cursor-[var(--ui-cursor-interactive)] items-center justify-center gap-[var(--sivir-space-2)] whitespace-nowrap select-none rounded-[var(--radius-lg)] px-[calc(var(--sivir-space-3)+2px)] [font-size:var(--font-size-button)] [font-weight:var(--font-weight-button)] [letter-spacing:var(--tracking-button)] leading-none antialiased transition-[background-color,border-color,color,box-shadow,transform,scale] [transition-duration:var(--motion-duration-press)] ease-[var(--ease-press)] motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-[var(--focus-ring)] disabled:pointer-events-none disabled:opacity-40 aria-disabled:cursor-default [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 [&_svg]:shrink-0', // token-lint-disable-line no-primitive-leak,no-literal-length
    variants: {
        variant: {
            /**
             * `data-[state=open]` mirrors the hover fill on every variant so a
             * popover or menu trigger reads as hovered for as long as its surface
             * is open.
             */
            primary: 'bg-primary text-[var(--color-on-primary)] hover:bg-[var(--color-primary-hover)] data-[state=open]:bg-[var(--color-primary-hover)]',
            secondary: 'bg-secondary text-foreground hover:bg-[color-mix(in_srgb,var(--color-secondary)_82%,black)] data-[state=open]:bg-[color-mix(in_srgb,var(--color-secondary)_82%,black)]',
            ghost: 'bg-transparent text-foreground hover:bg-foreground/[0.08] data-[state=open]:bg-foreground/[0.08]',
            quiet: 'bg-transparent text-foreground',
            /**
             * Outline keeps the soft raised shadow. Focus composes the ring on top
             * of the lift so the raised look survives focus.
             */
            outline: 'bg-card text-foreground shadow-[var(--elevation-button-outline)] hover:bg-secondary data-[state=open]:bg-secondary focus-visible:shadow-[var(--focus-ring),var(--elevation-button-outline)]',
            destructive: 'bg-[color-mix(in_srgb,var(--color-error)_12%,transparent)] text-[var(--color-error)] hover:bg-[color-mix(in_srgb,var(--color-error)_20%,transparent)] data-[state=open]:bg-[color-mix(in_srgb,var(--color-error)_20%,transparent)]',
            /**
             * A clickable Panel: the same interaction as `outline` wearing Panel's
             * concentric frame -- the semantic border outside and the inset surface
             * ring inside read as Panel's double edge.
             */
            panel: 'border border-border bg-card text-foreground shadow-[var(--elevation-1)] ring-1 ring-inset ring-[color-mix(in_oklab,var(--color-border)_50%,transparent)] hover:bg-muted data-[state=open]:bg-muted focus-visible:shadow-[var(--focus-ring),var(--elevation-1)]' // token-lint-disable-line no-literal-length
        },
        size: {
            sm: 'h-[calc(var(--size-control-sm)-2px)] px-[calc(var(--sivir-space-3)+0.5px)]', // token-lint-disable-line no-literal-length,no-primitive-leak
            md: 'h-[calc(var(--size-control-md)-2px)]', // token-lint-disable-line no-literal-length
            lg: 'h-[calc(var(--size-control-lg)-2px)] px-[calc(var(--sivir-space-3)+0.25rem)]', // token-lint-disable-line no-literal-length,no-primitive-leak
            icon: 'h-[var(--size-icon-md)] w-[var(--size-icon-md)] min-w-[var(--size-icon-md)] justify-center px-0'
        }
    },
    defaultVariants: {
        variant: 'primary',
        size: 'md'
    }
});

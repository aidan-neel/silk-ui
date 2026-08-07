/**
 * Neutral callout styled like an outline button: a calm card surface with the
 * outline button's hairline edge + subtle inset lift (no status tint on the
 * surface). Status reads purely from the colored icon.
 */
export declare const alert: import('tailwind-variants').TVReturnType<
    {} | {} | {},
    undefined,
    'flex flex-row gap-3 rounded-[var(--radius-lg)] bg-card px-4 py-3 text-foreground shadow-[var(--elevation-control)]',
    {} | {},
    undefined,
    import('tailwind-variants').TVReturnType<
        unknown,
        undefined,
        'flex flex-row gap-3 rounded-[var(--radius-lg)] bg-card px-4 py-3 text-foreground shadow-[var(--elevation-control)]',
        unknown,
        unknown,
        undefined
    >
>;
export declare const alertIcon: import('tailwind-variants').TVReturnType<
    {
        variant: {
            info: string;
            error: string;
            warning: string;
            success: string;
        };
    },
    undefined,
    'mt-px shrink-0',
    {
        variant: {
            info: string;
            error: string;
            warning: string;
            success: string;
        };
    },
    undefined,
    import('tailwind-variants').TVReturnType<
        {
            variant: {
                info: string;
                error: string;
                warning: string;
                success: string;
            };
        },
        undefined,
        'mt-px shrink-0',
        unknown,
        unknown,
        undefined
    >
>;

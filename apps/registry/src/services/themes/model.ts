import { type Static, t } from 'elysia';

export const themeSchema = t.Object({
    version: t.Union([t.Literal(2), t.Literal(3)]),
    slug: t.String({
        minLength: 1,
        maxLength: 80,
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    }),
    name: t.String({ minLength: 1, maxLength: 80 }),
    description: t.String({ maxLength: 500 }),
    publisher: t.Optional(t.String({ maxLength: 80 })),
    brand: t.String({ minLength: 7, maxLength: 7, pattern: '^#[0-9a-fA-F]{6}$' }),
    neutral: t.Union([t.Literal('cool'), t.Literal('true'), t.Literal('warm')]),
    radius: t.Union([t.Literal('sharp'), t.Literal('default'), t.Literal('rounded')]),
    density: t.Union([t.Literal('compact'), t.Literal('default'), t.Literal('comfortable')]),
    motion: t.Union([
        t.Literal('none'),
        t.Literal('subtle'),
        t.Literal('default'),
        t.Literal('expressive')
    ]),
    fontSans: t.String({ minLength: 1, maxLength: 200 }),
    fontMono: t.String({ minLength: 1, maxLength: 200 }),
    fontHeader: t.String({ minLength: 1, maxLength: 200 })
});

export const themeRecordSchema = t.Intersect([
    themeSchema,
    t.Object({
        id: t.String(),
        createdAt: t.String(),
        updatedAt: t.String()
    })
]);

export const themeListSchema = t.Array(themeRecordSchema);

export const slugParamsSchema = t.Object({
    slug: t.String({
        minLength: 1,
        maxLength: 80,
        pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$'
    })
});

export const publishResponseSchema = t.Object({
    success: t.Literal(true),
    message: t.Literal('Successfully published theme!')
});

export const slugConflictSchema = t.Union([
    t.Literal('A theme with this slug already exists, try another one.'),
    t.Literal('This slug is reserved for a built-in theme.')
]);
export const publishRateLimitSchema = t.Literal('Too many publishes, try again later.');
export const themeNotFoundSchema = t.Literal('A theme with this slug does not exist.');

export type Theme = Static<typeof themeSchema>;
export type ThemeRecord = Static<typeof themeRecordSchema>;

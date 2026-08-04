import { Elysia } from 'elysia';
import { slugParamsSchema, themeListSchema, themeNotFoundSchema, themeRecordSchema } from './model';
import { getThemeBySlug, listThemes } from './service';

export const themesController = new Elysia({
    prefix: '/themes',
    tags: ['themes']
})
    .get('/', () => listThemes(), {
        detail: { summary: 'List every built-in and published theme.' },
        response: { 200: themeListSchema }
    })
    .get('/:slug', ({ params }) => getThemeBySlug(params.slug), {
        params: slugParamsSchema,
        detail: { summary: 'Fetch a theme by its slug.' },
        response: {
            200: themeRecordSchema,
            404: themeNotFoundSchema
        }
    })
    .post(
        '/',
        ({ set }) => {
            set.status = 405;
            set.headers.allow = 'GET';
            return 'Theme publishing is disabled in v1.';
        },
        {
            detail: { summary: 'Publishing is disabled for the v1 read-only registry.' }
        }
    );

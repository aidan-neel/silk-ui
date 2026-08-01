import { Elysia } from 'elysia';
import { openapi } from '@elysiajs/openapi';

import { themesController } from './services/themes';

const port = Number(process.env.PORT ?? 4100);

export const app = new Elysia({ serve: { maxRequestBodySize: 128 * 1024 } })
    .onError(({ code, error, set }) => {
        if (
            code === 'VALIDATION' ||
            code === 'NOT_FOUND' ||
            code === 'PARSE' ||
            code === 'INVALID_COOKIE_SIGNATURE'
        ) {
            return;
        }
        if (
            typeof code === 'number' &&
            typeof error === 'object' &&
            error !== null &&
            'response' in error
        ) {
            set.status = code;
            return error.response;
        }

        console.error('Unhandled registry request error:', error);
        set.status = 500;
        return 'Internal error.';
    })
    .use(
        openapi({
            path: '/openapi'
        })
    )
    .use(themesController)
    .get('/', () => 'Sivir theme registry');

export default app;

if (import.meta.main) {
    app.listen(port);
    console.log(`Sivir registry listening at ${app.server?.hostname}:${app.server?.port}`);
}

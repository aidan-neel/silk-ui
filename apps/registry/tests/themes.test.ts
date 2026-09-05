import { afterEach, beforeEach, describe, expect, it, mock, spyOn } from 'bun:test';

import { defaultThemes } from '@src/services/themes/defaults';
import type { Theme } from '@src/services/themes/model';

// The registry talks to Postgres through a Prisma client that is generated at
// build time (`prisma generate`) and instantiates a real pg pool on import.
// Tests must never touch a database, so we replace `@lib/prisma` with an
// in-memory fake before the controller (and its `service` module) load it.
type FindManyArgs = { orderBy?: unknown; select?: unknown } | undefined;
type WhereArgs = { where: { slug: string }; select?: unknown };
type CreateArgs = { data: Record<string, unknown> };

const db = {
    theme: {
        findMany: async (_args?: FindManyArgs): Promise<Record<string, unknown>[]> => [],
        findUnique: async (_args: WhereArgs): Promise<Record<string, unknown> | null> => null,
        create: async (args: CreateArgs): Promise<Record<string, unknown>> => args.data
    },
    hiddenDefault: {
        findMany: async (_args?: FindManyArgs): Promise<{ slug: string }[]> => []
    }
};

mock.module('@lib/prisma', () => ({ prisma: db }));

// Import the production app only after the database mock is registered.
const { app, default: vercelHandler } = await import('@src/index');

/** Build a persisted DB row from a draft, as Prisma would return it. */
function persisted(theme: Theme, id: string) {
    const { motion, ...rest } = theme;
    return {
        ...rest,
        motionFeel: motion,
        id,
        createdAt: new Date('2026-01-02T00:00:00.000Z'),
        updatedAt: new Date('2026-01-02T00:00:00.000Z')
    };
}

function get(path: string) {
    return app.handle(new Request(`http://localhost${path}`));
}

function post(body: unknown) {
    return app.handle(
        new Request('http://localhost/themes', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(body)
        })
    );
}

function validTheme(slug: string): Theme {
    // Reuse a built-in theme's shape so every required field is present, then
    // give it a fresh, non-reserved slug.
    return { ...defaultThemes[0], slug };
}

beforeEach(() => {
    db.theme.findMany = async () => [];
    db.theme.findUnique = async () => null;
    db.theme.create = async (args: CreateArgs) => args.data;
    db.hiddenDefault.findMany = async () => [];
});

afterEach(() => {
    mock.restore();
});

describe('GET /themes', () => {
    it('exports the app as the Vercel Function handler', () => {
        expect(vercelHandler).toBe(app);
    });

    it('returns the built-in default themes when the database is empty', async () => {
        const res = await get('/themes');
        expect(res.status).toBe(200);
        const body = (await res.json()) as { slug: string; name: string }[];
        const slugs = body.map((t) => t.slug).sort();
        expect(slugs).toEqual(['bitsy', 'default', 'magic', 'open']);
        // Sorted by display name.
        const names = body.map((t) => t.name);
        expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    });

    it('merges published themes with the built-in defaults', async () => {
        db.theme.findMany = async () => [persisted(validTheme('ocean'), 'db-1')];
        const res = await get('/themes');
        const body = (await res.json()) as { slug: string }[];
        const slugs = body.map((t) => t.slug);
        expect(slugs).toContain('ocean');
        expect(slugs).toContain('default');
        expect(body).toHaveLength(defaultThemes.length + 1);
    });

    it('omits default themes that have been hidden', async () => {
        db.hiddenDefault.findMany = async () => [{ slug: 'magic' }];
        const res = await get('/themes');
        const body = (await res.json()) as { slug: string }[];
        expect(body.map((t) => t.slug)).not.toContain('magic');
    });
});

describe('GET /themes/:slug', () => {
    it('returns a built-in theme without touching the database', async () => {
        let hit = false;
        db.theme.findUnique = async () => {
            hit = true;
            return null;
        };
        const res = await get('/themes/default');
        expect(res.status).toBe(200);
        const body = (await res.json()) as { slug: string; id: string };
        expect(body.slug).toBe('default');
        expect(body.id).toBe('default:default');
        expect(hit).toBe(false);
    });

    it('returns a published theme by slug', async () => {
        db.theme.findUnique = async ({ where }) =>
            where.slug === 'ocean' ? persisted(validTheme('ocean'), 'db-1') : null;
        const res = await get('/themes/ocean');
        expect(res.status).toBe(200);
        const body = (await res.json()) as { slug: string; id: string };
        expect(body.slug).toBe('ocean');
        expect(body.id).toBe('db-1');
    });

    it('returns 404 for an unknown slug', async () => {
        const res = await get('/themes/does-not-exist');
        expect(res.status).toBe(404);
        const body = await res.text();
        expect(body).toBe('A theme with this slug does not exist.');
    });
});

describe('POST /themes', () => {
    it('rejects publishes while the registry is read-only for v1', async () => {
        let created = false;
        db.theme.create = async (args: CreateArgs) => {
            created = true;
            return args.data;
        };
        const res = await post(validTheme('ocean'));
        expect(res.status).toBe(405);
        expect(res.headers.get('allow')).toContain('GET');
        expect(await res.text()).toContain('disabled');
        expect(created).toBe(false);
    });
});

describe('registry request guards', () => {
    it('caps request bodies at 128 KiB', () => {
        expect(app.config.serve?.maxRequestBodySize).toBe(128 * 1024);
    });

    it('does not leak unexpected service errors', async () => {
        const errorLog = spyOn(console, 'error').mockImplementation(() => {});
        db.theme.findMany = async () => {
            throw new Error('boom: secret detail');
        };

        const res = await get('/themes');
        const body = await res.text();
        expect(res.status).toBe(500);
        expect(body).toBe('Internal error.');
        expect(body).not.toContain('boom');
        expect(errorLog).toHaveBeenCalled();
    });
});

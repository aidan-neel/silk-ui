# Sivir registry

Elysia + Bun service that backs the theme registry. Persists themes in
Postgres via Prisma. The database runs on **Supabase**; there is no local pg
container.

## Setup

1. Create a free project at <https://supabase.com>.
2. Open **Project Settings → Database → Connection string** and grab two URLs:
   - **Transaction pooler** (port 6543) → `DATABASE_URL`, used at runtime.
   - **Session pooler** or **Direct connection** (port 5432) → `DIRECT_URL`, used by Prisma migrations.
3. Copy `.env.example` to `.env` and paste both URLs. Append `?sslmode=require` if not already present.
4. Apply migrations:

   ```bash
   bun --bun run prisma migrate deploy
   ```

5. Start the dev server:

   ```bash
   bun run dev
   ```

   The service listens on `PORT` (default `4100` in docker-compose).

## Why two URLs?

Supabase's transaction pooler (port 6543) gives us serverless-friendly
connection pooling, but pgbouncer transaction mode can't run DDL or prepared
statements, so migrations need a session connection on port 5432. Prisma's
schema declares both via `url` + `directUrl` so each command uses the right
one automatically.

## Migrating data off the old pg container

If you already had themes in the previous `postgres:16` docker volume:

```bash
# Dump from the old container while it's running
docker compose up -d db
docker compose exec db pg_dump -U app -d app --no-owner --no-privileges \
  --data-only --inserts > /tmp/themes-dump.sql

# Restore against Supabase (use the DIRECT_URL in session mode)
psql "$DIRECT_URL" -f /tmp/themes-dump.sql
```

Then `docker compose down -v` to delete the local volume.

## Vercel deployment

The registry is an Elysia Bun Function. Create a Vercel project with
`apps/registry` as its Root Directory; `vercel.json` runs migrations and
generates Prisma's client for every deployment.

Set these environment variables in both Vercel environments:

| Vercel environment | `DATABASE_URL` / `DIRECT_URL` target |
| ------------------ | ------------------------------------ |
| Production         | Production Supabase project          |
| Preview            | Separate preview Supabase project    |

Assign `registry.sivir.dev` to the production deployment and
`registry-preview.sivir.dev` to the preview branch deployment. Do not share a
database between those deployments: preview migrations must not affect
production data.

## Docker deployment

Run the registry image (`./Dockerfile`) with these set:

| Variable                | Required | Notes                                             |
| ----------------------- | -------- | ------------------------------------------------- |
| `DATABASE_URL`          | yes      | Supabase transaction pooler (port 6543).          |
| `DIRECT_URL`            | yes      | Supabase direct/session (port 5432); migrations.  |
| `DATABASE_CA_CERT_PATH` | no       | Enables strict TLS verification with a CA bundle. |
| `PORT`                  | no       | Defaults to 4100 via docker-compose.              |

v1 exposes a read-only theme API. `POST /themes` returns `405 Method Not
Allowed`. Existing rows can still be listed and fetched by slug.

The container runs `prisma migrate deploy` before starting the API, so Prisma
is intentionally retained as a production dependency.

## Tests

Route behavior is covered by `tests/themes.test.ts`, run with Bun's built-in
test runner:

```bash
bun --filter='registry' run test   # from the repo root
bun test                           # from apps/registry
```

The tests **do not need a database or `prisma generate`**. They replace
`@lib/prisma` with an in-memory fake via `mock.module(...)` before the routes
load, then drive the Elysia app with `app.handle(new Request(...))`. This keeps
them hermetic and avoids the Prisma engine download (which fails behind
restrictive proxies). They cover the happy paths plus validation and error
cases for `GET /themes`, `GET /themes/:slug`, and the disabled `POST /themes`.

`turbo run test` picks the registry suite up automatically alongside the other
workspaces.

## Managing themes

There's no built-in admin UI. The v1 registry only exposes public read
endpoints (`GET /themes`, `GET /themes/:slug`). To edit or delete a published
theme, open the **Supabase dashboard → Table editor → Theme**.

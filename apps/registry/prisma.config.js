// Keep this in sync with prisma.config.ts. `npx prisma` reads this `.js`;
// `bunx --bun run prisma` reads the `.ts`. Both point CLI / migrations at
// DIRECT_URL (Supabase port 5432, session mode) -- the transaction pooler
// (port 6543, DATABASE_URL) can't run DDL.
import { defineConfig, env } from 'prisma/config';
export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations'
    },
    datasource: {
        url: env('DIRECT_URL')
    }
});

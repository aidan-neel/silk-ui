import 'dotenv/config';
import { readFileSync } from 'node:fs';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@root/prisma/generated/prisma/client';

// Supabase's pooler can present a chain node-postgres will not validate. The
// compatibility default keeps TLS encryption but skips chain validation,
// equivalent to libpq sslmode=require. Production should set the downloaded
// Supabase CA path; once every deployment does, remove the fallback branch.
const caPath = process.env.DATABASE_CA_CERT_PATH;
const ssl = caPath
    ? { ca: readFileSync(caPath, 'utf8'), rejectUnauthorized: true }
    : { rejectUnauthorized: false };

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export { prisma };

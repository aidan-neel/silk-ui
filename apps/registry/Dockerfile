FROM oven/bun:1.3.11 AS build
WORKDIR /repo

COPY package.json bun.lock ./
COPY apps/docs/package.json ./apps/docs/
COPY apps/installer-lab/package.json ./apps/installer-lab/
COPY apps/registry/package.json ./apps/registry/
COPY packages/sivir/package.json ./packages/sivir/

ENV LEFTHOOK=0
RUN bun install --frozen-lockfile --ignore-scripts

COPY apps/registry ./apps/registry
COPY packages/sivir ./packages/sivir

WORKDIR /repo/apps/registry
RUN DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
	DIRECT_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" \
	bun --bun run prisma generate

FROM oven/bun:1.3.11 AS runtime
WORKDIR /repo

COPY package.json bun.lock ./
COPY apps/docs/package.json ./apps/docs/
COPY apps/installer-lab/package.json ./apps/installer-lab/
COPY apps/registry/package.json ./apps/registry/
COPY packages/sivir/package.json ./packages/sivir/

ENV LEFTHOOK=0
RUN bun install --frozen-lockfile --production --ignore-scripts \
	--filter='registry' --filter='@sivir-ui/svelte'

COPY apps/registry ./apps/registry
COPY packages/sivir ./packages/sivir
COPY --from=build /repo/apps/registry/prisma/generated ./apps/registry/prisma/generated

WORKDIR /repo/apps/registry
ENV PORT=4100
EXPOSE 4100

CMD ["sh", "-c", "bun --bun run prisma migrate deploy && bun run src/index.ts"]

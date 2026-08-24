FROM oven/bun:1.3.11 AS build
WORKDIR /repo

COPY package.json bun.lock ./
COPY apps/docs/package.json ./apps/docs/
COPY apps/installer-lab/package.json ./apps/installer-lab/
COPY apps/registry/package.json ./apps/registry/
COPY packages/sivir/package.json ./packages/sivir/

ENV LEFTHOOK=0
RUN bun install --frozen-lockfile --ignore-scripts

COPY apps/docs ./apps/docs
COPY changelog ./changelog
COPY packages/sivir ./packages/sivir

WORKDIR /repo/apps/docs
ENV DOCS_ADAPTER=node
RUN bun run build

FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=build /repo/apps/docs/build ./build
COPY --from=build /repo/package.json ./package.json
ENV PORT=3000
ENV HOST=0.0.0.0
EXPOSE 3000
CMD ["node", "build"]

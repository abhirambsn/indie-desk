FROM node:23-slim AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./

RUN corepack enable && corepack install -g pnpm@10.8.1 && corepack use pnpm@10.8.1

COPY modules/common ./modules/common
COPY modules/client-service ./modules/client-service

RUN pnpm install --filter ./modules/client-service && pnpm install --filter ./modules/common

RUN pnpm --filter ./modules/common run build && pnpm --filter ./modules/client-service run build

FROM node:23-slim

WORKDIR /app

COPY --from=builder /app/modules/client-service/dist ./dist
COPY --from=builder /app/modules/client-service/package.json ./
COPY --from=builder /app/modules/client-service/node_modules ./node_modules
COPY --from=builder /app/modules/common ./modules/common

CMD ["node", "dist/index.js"]
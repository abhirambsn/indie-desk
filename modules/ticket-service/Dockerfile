FROM node:23-slim AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./

RUN corepack enable && corepack install -g pnpm@10.8.1 && corepack use pnpm@10.8.1

COPY modules/common ./modules/common
COPY modules/ticket-service ./modules/ticket-service

RUN pnpm install --filter ./modules/ticket-service && pnpm install --filter ./modules/common

RUN pnpm --filter ./modules/common run build && pnpm --filter ./modules/ticket-service run build

FROM node:23-slim

WORKDIR /app

COPY --from=builder /app/modules/ticket-service/dist ./dist
COPY --from=builder /app/modules/ticket-service/package.json ./
COPY --from=builder /app/modules/ticket-service/node_modules ./node_modules
COPY --from=builder /app/modules/common ./modules/common

CMD ["node", "dist/index.js"]
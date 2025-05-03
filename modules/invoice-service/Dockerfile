FROM node:23-slim AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./

RUN corepack enable && corepack install -g pnpm@10.8.1 && corepack use pnpm@10.8.1

COPY modules/common ./modules/common
COPY modules/invoice-service ./modules/invoice-service

RUN pnpm install --filter ./modules/invoice-service && pnpm install --filter ./modules/common

RUN pnpm --filter ./modules/common run build && pnpm --filter ./modules/invoice-service run build && cd modules/invoice-service


WORKDIR /app/modules/invoice-service
CMD ["node", "dist/index.js"]
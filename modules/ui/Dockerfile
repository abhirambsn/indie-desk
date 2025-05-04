FROM node:23-slim AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json ./

RUN corepack enable && corepack install -g pnpm@10.8.1 && corepack use pnpm@10.8.1

COPY modules/common ./modules/common
COPY modules/ui ./modules/ui
COPY modules/ui/syncfusion-license.txt ./modules/ui/

RUN pnpm install --filter ./modules/ui && pnpm install --filter ./modules/common

RUN cd modules/ui && npx syncfusion-license activate && cd ../..

RUN pnpm --filter ./modules/common run build && cd modules/ui && pnpm --filter ./modules/ui run build

FROM nginx:alpine

COPY --from=builder /app/modules/ui/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]


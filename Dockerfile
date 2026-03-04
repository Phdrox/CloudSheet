FROM node:20-slim
ENV .env .env
RUN corepack enable
COPY . /app
WORKDIR /app
RUN pnpm install
RUN pnpm run build
EXPOSE 3000
CMD ["pnpm", "start:prod"]
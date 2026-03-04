FROM node:alphine
WORKDIR /app
COPY package*.json ./
RUN npm install pnpm && pnpm install
ENV ./.env ./.env
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start:prod"]
FROM node:latest

RUN npm install -g pnpm

USER node

WORKDIR /home/node/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install 

COPY . .

CMD [ "pnpm", "start:dev" ]



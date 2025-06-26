FROM node:23.11.0-slim AS javascript-base

WORKDIR /usr/app

COPY ./package.json package.json

RUN npm install

FROM javascript-base AS client-app

COPY ./public public
COPY ./src src
COPY ./tsconfig.json tsconfig.json

CMD ["npm", "start"]

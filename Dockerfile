ARG NODE_VERSION=22.9.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY . .

RUN npx prisma generate

EXPOSE ${PORT}

CMD ["npm", "run", "start:dev"]

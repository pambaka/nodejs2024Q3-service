ARG NODE_VERSION=18

FROM node:${NODE_VERSION}-alpine AS build

WORKDIR /usr/src/app

COPY package*.json .

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --only=prod && npm cache clean --force
    
COPY . .

RUN npm run build

RUN npx prisma generate


FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app /usr/src/app

CMD ["npm", "run", "start:prod"]
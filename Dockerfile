# Instal package dependencies
FROM node:16-alpine AS dependency

WORKDIR /user-service

COPY package*.json ./
RUN npm ci

# Build source
FROM dependency AS base
COPY . .

# Build source
FROM base AS build
RUN npm run build

# Ship compiled sources
FROM dependency

COPY --from=build /user-service/dist ./dist

RUN npm prune --production

EXPOSE 3000
ENV NO_COLOR=true
ARG COMMIT_HASH
ENV COMMIT_HASH=$COMMIT_HASH

CMD ["node", "dist/main"]
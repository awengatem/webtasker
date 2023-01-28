# Stage 1
FROM node:18.10.0-alpine3.15 AS node

WORKDIR /usr/src/client

COPY . .

RUN npm install --force

RUN npm run build

# Stage 2
FROM nginx:alpine
COPY --from=node /usr/src/client/dist/web-tasker /usr/share/nginx/html
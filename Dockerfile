FROM node:19-alpine AS builder
COPY package*.json ./
RUN yarn install --check-files --immutable
COPY . .
RUN yarn build

FROM nginxinc/nginx-unprivileged:alpine
WORKDIR /usr/share/nginx/html
COPY --from=builder /build .
USER nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]

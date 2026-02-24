# ---- Build Angular ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Serve with Nginx ----
FROM nginx:alpine

# ⚠️ PAS de /browser ici
COPY --from=build /app/dist/cesi-zen-front /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

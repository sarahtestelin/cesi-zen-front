# Étape 1 : build Angular
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# Étape 2 : serveur Nginx
FROM nginx:alpine

# Suppression de la page Nginx par défaut
RUN rm -rf /usr/share/nginx/html/*

# Copie du build Angular
COPY --from=build /app/dist/cesi-zen-front/browser /usr/share/nginx/html

# Configuration Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

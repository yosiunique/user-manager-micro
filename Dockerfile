# =========================
# Build Angular application
# =========================
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG config=staging

RUN npx ng build --configuration=${config}


# =========================
# Nginx runtime
# =========================
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

# IMPORTANT:
# Change "user-manager" if your actual Angular project
# name in angular.json is different.
COPY --from=builder /usr/src/app/dist/user-manager/browser /usr/share/nginx/html

# Render/Nginx configuration
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

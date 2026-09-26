# =========================
# Build Angular application
# =========================
FROM node:20-alpine AS builder

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

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=builder /usr/src/app/dist/user-manager/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

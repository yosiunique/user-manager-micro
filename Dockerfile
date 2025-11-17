FROM node:18-alpine as builder

RUN npm install -g @angular/cli
RUN npm install -g npm@8.5.3
WORKDIR /usr/src/app
ARG config=staging
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN ng build --configuration ${config}

# Use Nginx to serve the Angular app
FROM nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/app/dist/loan-repayments/browser /usr/share/nginx/html

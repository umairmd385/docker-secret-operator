# Stage 1: Build React Application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files strictly first
COPY package.json package-lock.json ./
RUN npm install -f

# Build Vite dist files
COPY . .
RUN npm run build

# Stage 2: Serve securely behind NGINX
FROM nginx:alpine

# Remove default nginx HTML landing page
RUN rm -rf /usr/share/nginx/html/*

# Relocate built artifacts to hosting root
COPY --from=builder /app/dist /usr/share/nginx/html

# Port our explicit NGINX config handling React Route fallbacks
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

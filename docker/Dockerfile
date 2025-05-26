# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Install curl for health checks and python for native dependencies
RUN apk add --no-cache curl python3 make g++

# Copy package files
COPY package.json ./

# Clear npm cache and install dependencies
RUN npm cache clean --force
RUN npm install --verbose

# Copy all files
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage to nginx serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

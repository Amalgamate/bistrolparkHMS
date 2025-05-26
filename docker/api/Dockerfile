FROM node:20-alpine

WORKDIR /app

# Install netcat for database connection check
RUN apk add --no-cache netcat-openbsd

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy all files
COPY . .

# Make the initialization script executable
COPY init-db.sh /init-db.sh
RUN chmod +x /init-db.sh

# Expose port
EXPOSE 3001

# Use the initialization script as entrypoint
ENTRYPOINT ["/init-db.sh"]

# Start the server
CMD ["npm", "start"]

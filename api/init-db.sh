#!/bin/sh

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to start..."
while ! nc -z db 5432; do
  sleep 1
done
echo "PostgreSQL started"

# Run database initialization
echo "Initializing database..."
node src/utils/init-db.js

# Start the application
echo "Starting application..."
exec "$@"

# Bristol Park Hospital - Docker Setup

This document provides instructions for running the Bristol Park Hospital Management System using Docker.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Project Structure

The project consists of three main components:

1. **Frontend**: React application built with Vite
2. **Backend API**: Node.js/Express API
3. **Database**: PostgreSQL database

## Running in Development Mode

For local development with hot-reloading:

```bash
# Start all services in development mode
docker-compose -f docker-compose.dev.yml up

# Start all services in development mode (detached)
docker-compose -f docker-compose.dev.yml up -d

# Stop all services
docker-compose -f docker-compose.dev.yml down
```

This will start:
- Frontend at http://localhost:5173
- Backend API at http://localhost:3001
- PostgreSQL database at localhost:5432

## Running in Production Mode

For production deployment:

```bash
# Start all services in production mode
docker-compose up

# Start all services in production mode (detached)
docker-compose up -d

# Stop all services
docker-compose down
```

This will start:
- Frontend at http://localhost:80
- Backend API (not directly exposed, accessed through the frontend)
- PostgreSQL database at localhost:5432

## Environment Variables

The Docker Compose files include default environment variables. For production use, you should modify these values in the docker-compose.yml file or use environment-specific .env files.

### Important Environment Variables:

- `DB_PASSWORD`: Database password (default: password)
- `JWT_SECRET`: Secret key for JWT token generation

## Data Persistence

PostgreSQL data is persisted using a Docker volume named `postgres_data`. This ensures your data is not lost when containers are restarted.

## Accessing the Database

You can connect to the PostgreSQL database using:

- Host: localhost
- Port: 5432
- Database: bristol_park_hmis
- Username: postgres
- Password: password (or the value you set in the environment variables)

## Troubleshooting

### Database Connection Issues

If the API service cannot connect to the database, ensure:

1. The database service is running: `docker-compose ps`
2. The database environment variables in docker-compose.yml are correct
3. Try restarting the services: `docker-compose restart`

### Frontend Cannot Connect to API

If the frontend cannot connect to the API:

1. Check that the API service is running: `docker-compose ps`
2. Verify the API URL in the frontend configuration
3. Check the nginx configuration for proper proxy settings

## Rebuilding Images

If you make changes to the Dockerfiles or need to rebuild the images:

```bash
# Development
docker-compose -f docker-compose.dev.yml build

# Production
docker-compose build
```

## Viewing Logs

```bash
# View logs for all services
docker-compose logs

# View logs for a specific service
docker-compose logs frontend
docker-compose logs api
docker-compose logs db

# Follow logs in real-time
docker-compose logs -f
```

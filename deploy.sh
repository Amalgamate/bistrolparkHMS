#!/bin/bash

# Bristol Park Hospital Docker Deployment Script

# Function to display help message
show_help() {
  echo "Bristol Park Hospital Docker Deployment Script"
  echo ""
  echo "Usage: ./deploy.sh [OPTIONS]"
  echo ""
  echo "Options:"
  echo "  -e, --env ENV       Specify environment (dev or prod) [default: dev]"
  echo "  -b, --build         Build images before starting containers"
  echo "  -d, --detach        Run containers in detached mode"
  echo "  -s, --stop          Stop and remove containers"
  echo "  -h, --help          Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./deploy.sh                   # Start development environment"
  echo "  ./deploy.sh -e prod           # Start production environment"
  echo "  ./deploy.sh -e prod -b -d     # Build and start production environment in detached mode"
  echo "  ./deploy.sh -s -e prod        # Stop production environment"
}

# Default values
ENV="dev"
BUILD=false
DETACH=false
STOP=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -e|--env)
      ENV="$2"
      shift 2
      ;;
    -b|--build)
      BUILD=true
      shift
      ;;
    -d|--detach)
      DETACH=true
      shift
      ;;
    -s|--stop)
      STOP=true
      shift
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_help
      exit 1
      ;;
  esac
done

# Validate environment
if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]; then
  echo "Error: Environment must be 'dev' or 'prod'"
  exit 1
fi

# Set docker-compose file based on environment
if [[ "$ENV" == "dev" ]]; then
  COMPOSE_FILE="docker-compose.dev.yml"
else
  COMPOSE_FILE="docker-compose.yml"
fi

# Stop and remove containers if requested
if [[ "$STOP" == true ]]; then
  echo "Stopping containers for $ENV environment..."
  docker-compose -f "$COMPOSE_FILE" down
  echo "Containers stopped."
  exit 0
fi

# Build images if requested
if [[ "$BUILD" == true ]]; then
  echo "Building images for $ENV environment..."
  docker-compose -f "$COMPOSE_FILE" build
fi

# Start containers
echo "Starting containers for $ENV environment..."
if [[ "$DETACH" == true ]]; then
  docker-compose -f "$COMPOSE_FILE" up -d
else
  docker-compose -f "$COMPOSE_FILE" up
fi

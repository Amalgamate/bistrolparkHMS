#!/bin/bash

# Bristol Park Hospital Health Check Script

echo "Bristol Park Hospital - Health Check"
echo "===================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running"
  exit 1
fi

echo "✅ Docker is running"

# Check if containers are running
echo ""
echo "Container Status:"
echo "-----------------"

# Check frontend container
if docker ps | grep -q "frontend"; then
  echo "✅ Frontend container is running"
else
  echo "❌ Frontend container is not running"
fi

# Check API container
if docker ps | grep -q "api"; then
  echo "✅ API container is running"
else
  echo "❌ API container is not running"
fi

# Check database container
if docker ps | grep -q "db"; then
  echo "✅ Database container is running"
else
  echo "❌ Database container is not running"
fi

# Check service health
echo ""
echo "Service Health:"
echo "---------------"

# Check API health endpoint
if curl -s http://localhost:3001/health > /dev/null; then
  echo "✅ API health check passed"
else
  echo "❌ API health check failed"
fi

# Check frontend accessibility
if curl -s http://localhost:80 > /dev/null || curl -s http://localhost:5173 > /dev/null; then
  echo "✅ Frontend is accessible"
else
  echo "❌ Frontend is not accessible"
fi

# Check database connectivity
if docker exec -it $(docker ps -q -f name=db) pg_isready -U postgres > /dev/null 2>&1; then
  echo "✅ Database is ready"
else
  echo "❌ Database is not ready"
fi

echo ""
echo "Health check completed."

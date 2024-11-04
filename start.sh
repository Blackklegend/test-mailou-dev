#!/bin/bash

# Install dependencies
cd ./backend/ && yarn install && cd ..

# Start the database container
docker-compose up -d db

# Wait for the database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Run migrations
echo "Running migrations..."
cd ./backend && yarn run migrate up && cd ..

# Start all services
echo "Starting all services..."
docker-compose up --build
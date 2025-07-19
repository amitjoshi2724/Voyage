#!/bin/bash

# Simple script to run the Voyage simulation with Docker

echo "🚢 Starting Voyage Graphics Simulation..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first:"
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first:"
    echo "   https://docs.docker.com/compose/install/"
    exit 1
fi

# Build and run the simulation
echo "🔨 Building Docker image..."
docker-compose up --build

echo "✅ Simulation finished!" 